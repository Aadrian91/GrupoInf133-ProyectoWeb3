import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import '../styles/Header.css';

const Header = ({ cartItems, isAuthenticated, userRole, onLogout, updateQuantity, removeFromCart }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Cerrar menú al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      // Cerrar menú al hacer scroll en móvil
      if (window.innerWidth < 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Cerrar menú al redimensionar a desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/" onClick={handleNavLinkClick}>
              <div className="logo-container">
                <img 
                  src="/logo.jpg"  // Ruta de tu imagen
                  alt="PlayerOne Logo" 
                  className="logo-image"
                />
              <div className="logo-text">
                <h1>PlayerOne</h1>
                <span className="logo-subtitle">Tienda de Videojuegos</span>
              </div>
            </div>
          </Link>
        </div>

        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="menu-toggle-bar"></span>
          <span className="menu-toggle-bar"></span>
          <span className="menu-toggle-bar"></span>
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" onClick={handleNavLinkClick} className="nav-link">
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Inicio</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tienda" onClick={handleNavLinkClick} className="nav-link">
                <span className="nav-icon">🛒</span>
                <span className="nav-text">Tienda</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacto" onClick={handleNavLinkClick} className="nav-link">
                <span className="nav-icon">📞</span>
                <span className="nav-text">Contacto</span>
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link to="/admin" onClick={handleNavLinkClick} className="nav-link">
                      <span className="nav-icon">👑</span>
                      <span className="nav-text">Admin</span>
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button 
                    onClick={handleLogoutClick} 
                    className="btn btn-outline nav-button"
                  >
                    <span className="nav-icon">🚪</span>
                    <span className="nav-text">Cerrar Sesión</span>
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link 
                  to="/iniciar-sesion" 
                  onClick={handleNavLinkClick} 
                  className="btn btn-outline nav-button"
                >
                  <span className="nav-icon">🔐</span>
                  <span className="nav-text">Iniciar Sesión</span>
                </Link>
              </li>
            )}
            
            <li className="nav-item cart-nav-item">
              <Cart 
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
              {cartCount > 0 && (
                <span className="cart-count-mobile">{cartCount}</span>
              )}
            </li>
          </ul>
        </nav>

        {/* Overlay para cerrar menú al hacer clic fuera */}
        {menuOpen && (
          <div className="nav-overlay" onClick={handleMenuToggle}></div>
        )}
      </div>
    </header>
  );
};

export default Header;