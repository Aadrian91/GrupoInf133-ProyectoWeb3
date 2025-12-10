import express from 'express';
import {
    mostrarProductos,
    mostrarProducto,
    agregarProducto,
    modificarProducto,
    eliminarProducto,
    buscarProductosController
} from '../controladores/productoControlador.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', mostrarProductos);
router.get('/buscar', buscarProductosController);
router.get('/:id', mostrarProducto);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, esAdmin, agregarProducto);
router.put('/:id', verificarToken, esAdmin, modificarProducto);
router.delete('/:id', verificarToken, esAdmin, eliminarProducto);

export default router;