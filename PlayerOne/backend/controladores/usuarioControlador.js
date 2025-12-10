// backend/controladores/usuarioControlador.js
import { db } from '../config/db.js';

export const obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id, nombre, email, rol, fecha_registro FROM usuarios WHERE activo = TRUE ORDER BY fecha_registro DESC'
    );
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [usuarios] = await db.query(
      'SELECT id, nombre, email, rol, fecha_registro FROM usuarios WHERE id = ? AND activo = TRUE',
      [id]
    );
    
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuarios[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    
    // Verificar que el usuario existe
    const [usuarios] = await db.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar si el nuevo email ya existe en otro usuario
    if (email) {
      const [emailExistente] = await db.query(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [email, id]
      );
      if (emailExistente.length > 0) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }
    
    // Construir query dinámica
    const campos = [];
    const valores = [];
    
    if (nombre) {
      campos.push('nombre = ?');
      valores.push(nombre);
    }
    
    if (email) {
      campos.push('email = ?');
      valores.push(email);
    }
    
    if (rol) {
      campos.push('rol = ?');
      valores.push(rol);
    }
    
    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    valores.push(id);
    
    await db.query(
      `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );
    
    res.json({ mensaje: 'Usuario actualizado correctamente' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarUsuarioLogicamente = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query(
      'UPDATE usuarios SET activo = FALSE WHERE id = ?',
      [id]
    );
    
    res.json({ mensaje: 'Usuario eliminado lógicamente' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};