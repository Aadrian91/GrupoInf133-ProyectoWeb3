import { 
    registrarUsuario as registrarUsuarioModelo, 
    loginUsuario as loginUsuarioModelo, 
    obtenerUsuarioPorToken as obtenerUsuarioPorTokenModelo 
} from '../modelos/authModelo.js';

import { validarFuerzaPassword, validarRequisitosPassword } from '../utils/passwordValidator.js';

// Usar nombres diferentes para evitar conflictos
export const registrarUsuarioController = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        
        // Validar fuerza de contraseña
        const erroresPassword = validarRequisitosPassword(password);
        if (erroresPassword.length > 0) {
            return res.status(400).json({ 
                error: 'Contraseña débil',
                detalles: erroresPassword,
                fuerza: validarFuerzaPassword(password)
            });
        }
        
        // Usar la función del modelo (con alias)
        const usuario = await registrarUsuarioModelo({ nombre, email, password });
        
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            },
            fuerzaPassword: validarFuerzaPassword(password)
        });
        
    } catch (error) {
        if (error.message === 'El email ya está registrado') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const loginUsuarioController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }
        
        // Usar la función del modelo (con alias)
        const resultado = await loginUsuarioModelo(email, password);
        
        res.json({
            mensaje: 'Login exitoso',
            token: resultado.token,
            usuario: resultado.usuario
        });
        
    } catch (error) {
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const verificarTokenController = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }
        
        // Usar la función del modelo (con alias)
        const usuario = await obtenerUsuarioPorTokenModelo(token);
        
        if (!usuario) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        
        res.json({ usuario });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
