import express from 'express';
import { registrarUsuario, loginUsuario, verificarToken } from '../controladores/authControlador.js';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/verificar', verificarToken);

export default router;