import { db } from '../config/db.js';

export const obtenerProductos = async () => {
    const [resultado] = await db.query(
        'SELECT * FROM productos WHERE activo = TRUE ORDER BY fecha_creacion DESC'
    );
    return resultado;
};

export const obtenerProductoPorId = async (id) => {
    const [resultado] = await db.query(
        'SELECT * FROM productos WHERE id = ? AND activo = TRUE',
        [id]
    );
    return resultado[0];
};

export const crearProducto = async (producto) => {
    const { nombre, descripcion, precio, categoria, plataforma, imagen, stock } = producto;
    const [resultado] = await db.query(
        'INSERT INTO productos (nombre, descripcion, precio, categoria, plataforma, imagen, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, categoria, plataforma, imagen, stock]
    );
    return { id: resultado.insertId, ...producto };
};

export const actualizarProducto = async (id, producto) => {
    const { nombre, descripcion, precio, categoria, plataforma, imagen, stock } = producto;
    await db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, plataforma = ?, imagen = ?, stock = ? WHERE id = ?',
        [nombre, descripcion, precio, categoria, plataforma, imagen, stock, id]
    );
    return { id, ...producto };
};

// Eliminación lógica
export const eliminarProductoLogicamente = async (id, usuarioId, motivo) => {
    // Primero obtenemos el producto
    const [producto] = await db.query(
        'SELECT * FROM productos WHERE id = ?',
        [id]
    );
    
    if (producto.length > 0) {
        // Guardamos en la tabla de eliminados
        await db.query(
            'INSERT INTO productos_eliminados (producto_id, nombre, motivo_eliminacion, eliminado_por) VALUES (?, ?, ?, ?)',
            [id, producto[0].nombre, motivo, usuarioId]
        );
        
        // Marcamos como inactivo
        await db.query(
            'UPDATE productos SET activo = FALSE WHERE id = ?',
            [id]
        );
    }
    
    return id;
};

export const buscarProductos = async (termino) => {
    const [resultado] = await db.query(
        `SELECT * FROM productos WHERE activo = TRUE AND 
        (nombre LIKE ? OR descripcion LIKE ? OR categoria LIKE ?)`,
        [`%${termino}%`, `%${termino}%`, `%${termino}%`]
    );
    return resultado;
};