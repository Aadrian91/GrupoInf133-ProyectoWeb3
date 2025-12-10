import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Shop.css';

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  useEffect(() => {
    // Simular carga de productos desde API
    const mockProducts = [
      {
        id: 1,
        nombre: 'The Legend of Zelda: Tears of the Kingdom',
        descripcion: 'La esperada secuela de Breath of the Wild. Explora los cielos y las profundidades de Hyrule.',
        precio: 69.99,
        categoria: 'Aventura',
        plataforma: 'Nintendo Switch',
        imagen: 'public/The_Legend_of_Zelda.jpg',
        stock: 15
      },
      {
        id: 2,
        nombre: 'God of War: Ragnarok',
        descripcion: 'Kratos y Atreus continúan su viaje épico en la mitología nórdica.',
        precio: 59.99,
        categoria: 'Acción',
        plataforma: 'PS5',
        imagen: 'public/God_of_War.jpg',
        stock: 10
      },
      {
        id: 3,
        nombre: 'Elden Ring',
        descripcion: 'Un RPG de mundo abierto creado en colaboración con George R. R. Martin.',
        precio: 49.99,
        categoria: 'RPG',
        plataforma: 'Multiplataforma',
        imagen: 'public/Elden_Ring.jpg',
        stock: 20
      },
      {
        id: 4,
        nombre: 'Final Fantasy VII Rebirth',
        descripcion: 'La continuación del remake del clásico de PlayStation.',
        precio: 69.99,
        categoria: 'RPG',
        plataforma: 'PS5',
        imagen: 'public/Final_Fantasy.jpg',
        stock: 8
      },
      {
        id: 5,
        nombre: 'Super Mario Odyssey',
        descripcion: 'Únete a Mario en una aventura épica alrededor del mundo.',
        precio: 49.99,
        categoria: 'Aventura',
        plataforma: 'Nintendo Switch',
        imagen: 'public/super-mario.jpg',
        stock: 12
      },
      {
        id: 6,
        nombre: 'Call of Duty: Modern Warfare III',
        descripcion: 'La última entrega de la famosa saga de shooters.',
        precio: 59.99,
        categoria: 'Shooter',
        plataforma: 'Multiplataforma',
        imagen: 'public/Call_of_Duty.png',
        stock: 18
      },
      {
        id: 7,
        nombre: 'Cyberpunk 2077: Phantom Liberty',
        descripcion: 'Expansión del aclamado RPG futurista.',
        precio: 39.99,
        categoria: 'RPG',
        plataforma: 'Multiplataforma',
        imagen: 'public/Cyber_Punk.jpg',
        stock: 6
      },
      {
        id: 8,
        nombre: 'Spider-Man 2',
        descripcion: 'Peter Parker y Miles Morales unen fuerzas.',
        precio: 69.99,
        categoria: 'Acción',
        plataforma: 'PS5',
        imagen: 'Spider_Man2.jpg',
        stock: 14
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = products;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }
    
    // Filtrar por plataforma
    if (selectedPlatform) {
      filtered = filtered.filter(product => product.plataforma === selectedPlatform);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedPlatform, products]);

  const categories = ['Todos', 'Acción', 'Aventura', 'RPG', 'Shooter', 'Deportes', 'Estrategia'];
  const platforms = ['Todas', 'PS5', 'Xbox Series X', 'Nintendo Switch', 'PC', 'Multiplataforma'];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPlatform('');
  };

  return (
    <div className="shop-page">
      <div className="container">
        <h1 className="section-title">Tienda de Videojuegos</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="shop-content">
          <div className="filters">
            <h3>Filtros</h3>
            
            <div className="filter-group">
              <label>Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value || '')}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categories.filter(cat => cat !== 'Todos').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Plataforma</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value || '')}
                className="filter-select"
              >
                <option value="">Todas las plataformas</option>
                {platforms.filter(plat => plat !== 'Todas').map(plat => (
                  <option key={plat} value={plat}>{plat}</option>
                ))}
              </select>
            </div>

            <button onClick={clearFilters} className="btn btn-outline">
              Limpiar Filtros
            </button>

            <div className="filter-info">
              <p>Mostrando {filteredProducts.length} de {products.length} productos</p>
            </div>
          </div>

          <div className="products-section">
            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-results">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros filtros o términos de búsqueda</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;