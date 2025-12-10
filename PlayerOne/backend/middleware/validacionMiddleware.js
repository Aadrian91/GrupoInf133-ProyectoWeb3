import { body, validationResult } from 'express-validator';
import { validarRequisitosPassword } from '../utils/passwordValidator.js';

export const validarRegistro = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
        .escape(),
    
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .custom((value) => {
            const errores = validarRequisitosPassword(value);
            if (errores.length > 0) {
                throw new Error(errores.join(', '));
            }
            return true;
        }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                tipo: 'VALIDACION_REGISTRO'
            });
        }
        next();
    }
];

export const validarLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                tipo: 'VALIDACION_LOGIN'
            });
        }
        next();
    }
];

export const validarProducto = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres')
        .escape(),
    
    body('descripcion')
        .trim()
        .optional()
        .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres')
        .escape(),
    
    body('precio')
        .notEmpty().withMessage('El precio es requerido')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    
    body('categoria')
        .trim()
        .optional()
        .isLength({ max: 50 }).withMessage('La categoría no puede exceder 50 caracteres')
        .escape(),
    
    body('plataforma')
        .trim()
        .optional()
        .isLength({ max: 50 }).withMessage('La plataforma no puede exceder 50 caracteres')
        .escape(),
    
    body('stock')
        .notEmpty().withMessage('El stock es requerido')
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                tipo: 'VALIDACION_PRODUCTO'
            });
        }
        next();
    }
];

export const validarContacto = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .escape(),
    
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    
    body('asunto')
        .trim()
        .notEmpty().withMessage('El asunto es requerido')
        .isLength({ min: 5, max: 200 }).withMessage('El asunto debe tener entre 5 y 200 caracteres')
        .escape(),
    
    body('mensaje')
        .trim()
        .notEmpty().withMessage('El mensaje es requerido')
        .isLength({ min: 10, max: 2000 }).withMessage('El mensaje debe tener entre 10 y 2000 caracteres')
        .escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                tipo: 'VALIDACION_CONTACTO'
            });
        }
        next();
    }
];

export const manejarErroresValidacion = (err, req, res, next) => {
    if (err.type === 'VALIDACION') {
        return res.status(400).json({
            error: 'Error de validación',
            detalles: err.detalles
        });
    }
    next(err);
};