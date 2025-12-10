import express from 'express';
import { 
    registrarUsuarioController, 
    loginUsuarioController, 
    verificarTokenController 
} from '../controladores/authControlador.js';

import { validarRegistro, validarLogin } from '../middleware/validacionMiddleware.js';

const router = express.Router();

// Rutas con validación
router.post('/registro', validarRegistro, registrarUsuarioController);
router.post('/login', validarLogin, loginUsuarioController);
router.get('/verificar', verificarTokenController);

export default router;
