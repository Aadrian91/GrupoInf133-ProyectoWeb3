import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const CartPage = ({ cartItems, updateQuantity, removeFromCart }) => {
  const cartTotal = cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  const shippingCost = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08; // 8% de impuesto
  const grandTotal = cartTotal + shippingCost + tax;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Tu carrito está vacío</h2>
            <p>¡Aún no has agregado ningún juego a tu carrito!</p>
            <Link to="/tienda" className="btn btn-primary">
              Explorar Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title">Carrito de Compras</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.nombre}</h3>
                  <p className="cart-item-platform">{item.plataforma}</p>
                  <p className="cart-item-category">{item.categoria}</p>
                  <p className="cart-item-price">${item.precio.toFixed(2)}</p>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="item-total">
                    Total: <strong>${(item.precio * item.quantity).toFixed(2)}</strong>
                  </p>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Resumen del Pedido</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Envío</span>
                <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span>Impuestos (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="shipping-note">
              {cartTotal < 100 ? (
                <p>¡Faltan ${(100 - cartTotal).toFixed(2)} para envío gratis!</p>
              ) : (
                <p>✅ ¡Envío gratis aplicado!</p>
              )}
            </div>
            
            <button className="btn btn-primary checkout-btn">
              Proceder al Pago
            </button>
            
            <Link to="/tienda" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;