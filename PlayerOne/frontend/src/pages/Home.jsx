import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = ({ addToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo para productos destacados
    const mockProducts = [
      {
        id: 1,
        nombre: 'The Legend of Zelda: Tears of the Kingdom',
        descripcion: 'La esperada secuela de Breath of the Wild. Explora los cielos y las profundidades de Hyrule.',
        precio: 69.99,
        categoria: 'Aventura',
        plataforma: 'Nintendo Switch',
        imagen: 'The_Legend_of_Zelda.jpg',
        stock: 15
      },
      {
        id: 2,
        nombre: 'God of War: Ragnarok',
        descripcion: 'Kratos y Atreus continúan su viaje en la mitología nórdica.',
        precio: 59.99,
        categoria: 'Acción',
        plataforma: 'PS5',
        imagen: 'God_of_War.jpg',
        stock: 12
      },
      {
        id: 3,
        nombre: 'Elden Ring',
        descripcion: 'Un RPG de mundo abierto creado en colaboración con George R. R. Martin.',
        precio: 49.99,
        categoria: 'RPG',
        plataforma: 'Multiplataforma',
        imagen: 'Elden_Ring.jpg',
        stock: 8
      },
      {
        id: 4,
        nombre: 'Final Fantasy VII Rebirth',
        descripcion: 'La continuación del remake del clásico de PlayStation.',
        precio: 69.99,
        categoria: 'RPG',
        plataforma: 'PS5',
        imagen: 'Final_Fantasy.jpg',
        stock: 10
      }
    ];

    setTimeout(() => {
      setFeaturedProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2>Bienvenido a PlayerOne</h2>
            <p>Tu tienda de videojuegos favorita con los mejores títulos para todas las plataformas</p>
            <a href="/tienda" className="btn btn-primary">Explorar Tienda</a>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Juegos Destacados</h2>
          
          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2 className="section-title">Categorías Populares</h2>
          <div className="categories-grid">
            <div className="category-card" style={{ backgroundColor: 'var(--azul-principal)' }}>
              <h3>Acción</h3>
              <p>Emoción y adrenalina</p>
            </div>
            <div className="category-card" style={{ backgroundColor: 'var(--morado-principal)' }}>
              <h3>Aventura</h3>
              <p>Explora nuevos mundos</p>
            </div>
            <div className="category-card" style={{ backgroundColor: 'var(--negro)' }}>
              <h3>RPG</h3>
              <p>Historias épicas</p>
            </div>
            <div className="category-card" style={{ backgroundColor: 'var(--plomo-oscuro)' }}>
              <h3>Deportes</h3>
              <p>Competencia virtual</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;