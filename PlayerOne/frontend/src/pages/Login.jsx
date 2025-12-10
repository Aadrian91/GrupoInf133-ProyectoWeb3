import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    if (!captchaToken) {
      newErrors.captcha = 'Por favor completa el CAPTCHA';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulación de login - en producción, aquí harías la llamada a tu API
      setTimeout(() => {
        // Mock response
        const mockResponse = {
          token: 'mock-jwt-token-123456',
          usuario: { rol: 'usuario' }
        };
        
        onLogin(mockResponse.token, mockResponse.usuario.rol);
        navigate('/');
      }, 1000);
      
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Verifica tus credenciales.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }));
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="tu@email.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Clave de prueba
                onChange={handleCaptchaChange}
              />
              {errors.captcha && <span className="error-text">{errors.captcha}</span>}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
            <p><a href="/">¿Olvidaste tu contraseña?</a></p>
          </div>
          
          {/* Nota para el desarrollador */}
          <div className="dev-note">
            <small>
              <strong>Nota para desarrollo:</strong> Usa cualquier email y contraseña para probar.
              El CAPTCHA es de prueba, siempre pasa.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;