import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    plataforma: '',
    imagen: '',
    stock: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    // Cargar productos al montar
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // En producción, esto sería una llamada a tu API
      const mockProducts = [
        {
          id: 1,
          nombre: 'The Legend of Zelda: Tears of the Kingdom',
          descripcion: 'La esperada secuela de Breath of the Wild',
          precio: 69.99,
          categoria: 'Aventura',
          plataforma: 'Nintendo Switch',
          imagen: 'https://via.placeholder.com/300x400/3498db/ffffff?text=Zelda',
          stock: 15,
          activo: true
        },
        // ... más productos mock
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Actualizar producto
      setProducts(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...formData } : p
      ));
    } else {
      // Crear nuevo producto
      const newProduct = {
        id: Date.now(),
        ...formData,
        activo: true
      };
      setProducts(prev => [...prev, newProduct]);
    }
    
    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      plataforma: product.plataforma,
      imagen: product.imagen,
      stock: product.stock
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? (Eliminación lógica)')) {
      // En producción, esto llamaría a tu API con eliminación lógica
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      plataforma: '',
      imagen: '',
      stock: ''
    });
    setEditingId(null);
  };

  const generateReport = async () => {
    setReportLoading(true);
    try {
      // En producción, esto descargaría el PDF de tu API
      alert('Reporte PDF generado correctamente (en producción se descargaría)');
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const categories = ['Acción', 'Aventura', 'RPG', 'Deportes', 'Estrategia', 'Simulación'];
  const platforms = ['PS5', 'Xbox Series X', 'Nintendo Switch', 'PC', 'Multiplataforma'];

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Panel de Administración</h1>
        
        <div className="admin-grid">
          <div className="admin-form">
            <h2>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Nombre del juego"
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del juego"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Plataforma</label>
                  <select
                    name="plataforma"
                    value={formData.plataforma}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {platforms.map(plat => (
                      <option key={plat} value={plat}>{plat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-outline">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            
            <div className="report-section">
              <h3>Generar Reportes</h3>
              <button 
                onClick={generateReport} 
                className="btn btn-secondary"
                disabled={reportLoading}
              >
                {reportLoading ? 'Generando...' : 'Generar Reporte PDF'}
              </button>
            </div>
          </div>
          
          <div className="admin-list">
            <h2>Productos ({products.length})</h2>
            
            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : (
              <div className="products-list">
                {products.map(product => (
                  <div key={product.id} className="admin-product-card">
                    <div className="product-header">
                      <h3>{product.nombre}</h3>
                      <div className="product-actions">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="btn-edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="btn-delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="product-details">
                      <span className="badge">{product.categoria}</span>
                      <span className="badge">{product.plataforma}</span>
                      <span className="badge">Stock: {product.stock}</span>
                    </div>
                    
                    <p className="product-price">${parseFloat(product.precio).toFixed(2)}</p>
                    
                    <p className="product-status">
                      Estado: <span className={product.activo ? 'active' : 'inactive'}>
                        {product.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;