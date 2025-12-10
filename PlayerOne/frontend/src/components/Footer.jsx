import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PlayerOne</h3>
            <p>Tu tienda de videojuegos favorita con los mejores títulos para todas las plataformas.</p>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/tienda">Tienda</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li>Email: info@playerone.com</li>
              <li>Teléfono: +1 234 567 890</li>
              <li>Dirección: Calle Videojuegos 123</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PlayerOne. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;