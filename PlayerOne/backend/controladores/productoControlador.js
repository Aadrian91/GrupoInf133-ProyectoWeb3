import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProductoLogicamente,
    buscarProductos
} from '../modelos/productoModelo.js';

export const mostrarProductos = async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const mostrarProducto = async (req, res) => {
    try {
        const producto = await obtenerProductoPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarProducto = async (req, res) => {
    try {
        // Validaciones básicas
        const { nombre, precio } = req.body;
        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Nombre y precio son requeridos' });
        }
        if (precio < 0) {
            return res.status(400).json({ error: 'El precio no puede ser negativo' });
        }

        const producto = await crearProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const modificarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await actualizarProducto(id, req.body);
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const usuarioId = req.usuario.id; // Del middleware de autenticación
        
        await eliminarProductoLogicamente(id, usuarioId, motivo);
        res.json({ mensaje: 'Producto eliminado lógicamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscarProductosController = async (req, res) => {
    try {
        const { q } = req.query;
        const productos = await buscarProductos(q);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};