import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Login.css';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      // En producción, esto sería una llamada a la API
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        usuario: { 
          id: 1, 
          nombre: 'Usuario Demo', 
          email: formData.email,
          rol: formData.email === 'admin@playerone.com' ? 'admin' : 'usuario'
        }
      };
      
      setTimeout(() => {
        if (onLogin) {
          onLogin(mockResponse.token, mockResponse.usuario.rol);
        }
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Verifica tus credenciales.' });
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
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
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
            disabled={loading}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
              disabled={loading}
            />
            <button 
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={handleCaptchaChange}
          />
          {errors.captcha && <span className="error-text">{errors.captcha}</span>}
        </div>
        
        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" /> Recordarme
          </label>
          <a href="/recuperar-contrasena" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading || !captchaToken}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        
        <div className="login-form-footer">
          <p>¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;