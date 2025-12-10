import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registrarUsuario = async (usuario) => {
    const { nombre, email, password } = usuario;
    
    // Verificar si el email ya existe
    const [existe] = await db.query(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
    );
    
    if (existe.length > 0) {
        throw new Error('El email ya está registrado');
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    
    const [resultado] = await db.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, passwordEncriptada]
    );
    
    return { id: resultado.insertId, nombre, email };
};

export const loginUsuario = async (email, password) => {
    const [usuarios] = await db.query(
        'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
        [email]
    );
    
    if (usuarios.length === 0) {
        throw new Error('Credenciales inválidas');
    }
    
    const usuario = usuarios[0];
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
        throw new Error('Credenciales inválidas');
    }
    
    // Generar token JWT
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET || 'secreto_playerone',
        { expiresIn: '24h' }
    );
    
    // Eliminar password del objeto usuario
    const { password: _, ...usuarioSinPassword } = usuario;
    
    return { usuario: usuarioSinPassword, token };
};

export const obtenerUsuarioPorToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_playerone');
        const [usuarios] = await db.query(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND activo = TRUE',
            [decoded.id]
        );
        
        if (usuarios.length === 0) {
            return null;
        }
        
        return usuarios[0];
    } catch (error) {
        return null;
    }
};