import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Login.css';

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    
    // Longitud
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complejidad
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'débil';
    if (score <= 4) return 'intermedio';
    return 'fuerte';
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'débil': return '#e74c3c';
      case 'intermedio': return '#f39c12';
      case 'fuerte': return '#27ae60';
      default: return '#bdc3c7';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calcular fuerza de la contraseña
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'Mínimo 3 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Mínimo 8 caracteres';
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Debe tener al menos una mayúscula';
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Debe tener al menos un número';
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'Debe tener al menos un carácter especial';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      // Simulación de registro
      setTimeout(() => {
        console.log('Registro exitoso:', {
          nombre: formData.nombre,
          email: formData.email,
          passwordStrength: passwordStrength
        });
        
        if (onRegister) {
          onRegister({
            nombre: formData.nombre,
            email: formData.email
          });
        }
        
        setLoading(false);
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        
        // Resetear formulario
        setFormData({
          nombre: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setPasswordStrength('');
        setCaptchaToken('');
        
      }, 1500);
      
    } catch (error) {
      setErrors({ general: 'Error en el registro. Intenta nuevamente.' });
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
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Crear Cuenta</h2>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            placeholder="Tu nombre completo"
            disabled={loading}
          />
          {errors.nombre && <span className="error-text">{errors.nombre}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
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
          <label htmlFor="password">Contraseña *</label>
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
          
          {formData.password && (
            <div className="password-strength-indicator">
              <div className="strength-bar">
                <div 
                  className="strength-fill"
                  style={{
                    width: passwordStrength === 'débil' ? '33%' : 
                           passwordStrength === 'intermedio' ? '66%' : '100%',
                    backgroundColor: getStrengthColor(passwordStrength)
                  }}
                />
              </div>
              <div className="strength-info">
                <span className="strength-label">Seguridad:</span>
                <span className="strength-value" style={{ color: getStrengthColor(passwordStrength) }}>
                  {passwordStrength}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="••••••••"
              disabled={loading}
            />
            <button 
              type="button"
              className="show-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        
        <div className="form-group">
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={handleCaptchaChange}
          />
          {errors.captcha && <span className="error-text">{errors.captcha}</span>}
        </div>
        
        <div className="terms-agreement">
          <label className="checkbox-label">
            <input type="checkbox" required />
            <span>Acepto los <a href="/terminos">Términos y Condiciones</a> y la <a href="/privacidad">Política de Privacidad</a></span>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading || !captchaToken}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
        
        <div className="register-form-footer">
          <p>¿Ya tienes cuenta? <a href="/iniciar-sesion">Inicia sesión aquí</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;