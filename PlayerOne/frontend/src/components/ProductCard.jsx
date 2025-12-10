import React from 'react';
import '../styles/Shop.css';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imagen} alt={product.nombre} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.nombre}</h3>
        <p className="product-platform">{product.plataforma}</p>
        <p className="product-category">{product.categoria}</p>
        <p className="product-description">{product.descripcion.substring(0, 100)}...</p>
        <div className="product-footer">
          <span className="product-price">${product.precio.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart} 
            className="btn btn-primary"
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;