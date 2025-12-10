import express from 'express';
import {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuarioLogicamente
} from '../controladores/usuarioControlador.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación y ser admin
router.use(verificarToken, esAdmin);

router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuarioLogicamente);

export default router;