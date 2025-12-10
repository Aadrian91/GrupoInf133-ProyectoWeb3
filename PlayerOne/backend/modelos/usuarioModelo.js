import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const obtenerUsuarios = async () => {
    const [usuarios] = await db.query(
        'SELECT id, nombre, email, rol, activo, fecha_registro FROM usuarios WHERE activo = TRUE ORDER BY fecha_registro DESC'
    );
    return usuarios;
};

export const obtenerUsuarioPorId = async (id) => {
    const [usuarios] = await db.query(
        'SELECT id, nombre, email, rol, activo, fecha_registro FROM usuarios WHERE id = ?',
        [id]
    );
    return usuarios[0];
};

export const obtenerUsuarioPorEmail = async (email) => {
    const [usuarios] = await db.query(
        'SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = ? AND activo = TRUE',
        [email]
    );
    return usuarios[0];
};

export const crearUsuario = async (usuario) => {
    const { nombre, email, password } = usuario;
    
    // Verificar si el email ya existe
    const usuarioExistente = await obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
        throw new Error('El email ya está registrado');
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const [resultado] = await db.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, passwordHash]
    );
    
    return {
        id: resultado.insertId,
        nombre,
        email,
        rol: 'usuario'
    };
};

export const actualizarUsuario = async (id, datosActualizados) => {
    const { nombre, email, rol } = datosActualizados;
    
    // Si se actualiza el email, verificar que no exista
    if (email) {
        const [usuariosConEmail] = await db.query(
            'SELECT id FROM usuarios WHERE email = ? AND id != ?',
            [email, id]
        );
        if (usuariosConEmail.length > 0) {
            throw new Error('El email ya está en uso por otro usuario');
        }
    }
    
    const campos = [];
    const valores = [];
    
    if (nombre !== undefined) {
        campos.push('nombre = ?');
        valores.push(nombre);
    }
    
    if (email !== undefined) {
        campos.push('email = ?');
        valores.push(email);
    }
    
    if (rol !== undefined) {
        campos.push('rol = ?');
        valores.push(rol);
    }
    
    if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
    }
    
    valores.push(id);
    
    await db.query(
        `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
        valores
    );
    
    return await obtenerUsuarioPorId(id);
};

export const eliminarUsuarioLogicamente = async (id) => {
    const [resultado] = await db.query(
        'UPDATE usuarios SET activo = FALSE WHERE id = ?',
        [id]
    );
    
    return resultado.affectedRows > 0;
};

export const cambiarPassword = async (id, nuevaPassword) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(nuevaPassword, salt);
    
    await db.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [passwordHash, id]
    );
    
    return true;
};

export const verificarPassword = async (id, password) => {
    const [usuarios] = await db.query(
        'SELECT password FROM usuarios WHERE id = ?',
        [id]
    );
    
    if (usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
    }
    
    return await bcrypt.compare(password, usuarios[0].password);
};

export const buscarUsuarios = async (termino) => {
    const [usuarios] = await db.query(
        `SELECT id, nombre, email, rol, fecha_registro 
         FROM usuarios 
         WHERE (nombre LIKE ? OR email LIKE ?) 
         AND activo = TRUE 
         ORDER BY nombre`,
        [`%${termino}%`, `%${termino}%`]
    );
    return usuarios;
};

export const obtenerEstadisticasUsuarios = async () => {
    const [resultados] = await db.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN rol = 'admin' THEN 1 ELSE 0 END) as total_admins,
            SUM(CASE WHEN rol = 'usuario' THEN 1 ELSE 0 END) as total_usuarios,
            DATE(fecha_registro) as fecha,
            COUNT(*) as registros_por_dia
        FROM usuarios
        WHERE activo = TRUE
        GROUP BY DATE(fecha_registro)
        ORDER BY fecha DESC
        LIMIT 30
    `);
    return resultados;
};