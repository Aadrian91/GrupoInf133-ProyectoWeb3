// frontend/src/components/Cart.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="cart-dropdown-container">
      <button 
        className="cart-button" 
        onClick={toggleDropdown}
        aria-label="Carrito de compras"
        aria-expanded={dropdownOpen}
      >
        <span className="cart-icon">🛒</span>
        {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
        )}
      </button>

      {dropdownOpen && (
        <div className="cart-dropdown">
          <div className="cart-dropdown-header">
            <h4>Carrito ({cartCount})</h4>
            <button className="close-dropdown" onClick={closeDropdown}>×</button>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
              <Link to="/tienda" onClick={closeDropdown} className="btn btn-primary btn-sm">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-dropdown">
                {cartItems.slice(0, 3).map(item => (
                  <div key={item.id} className="cart-dropdown-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.nombre.substring(0, 20)}...</span>
                      <div className="cart-item-details">
                        <span className="cart-item-qty">{item.quantity} x ${item.precio.toFixed(2)}</span>
                        <span className="cart-item-total">${(item.precio * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="cart-item-remove"
                      aria-label="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="cart-more-items">
                    +{cartItems.length - 3} más...
                  </div>
                )}
              </div>

              <div className="cart-dropdown-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <Link 
                    to="/carrito" 
                    className="btn btn-primary btn-sm"
                    onClick={closeDropdown}
                  >
                    Ver Carrito
                  </Link>
                  <button className="btn btn-secondary btn-sm">
                    Comprar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;