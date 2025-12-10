import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Login.css';

const Register = () => {
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
  const navigate = useNavigate();

  const validatePassword = (password) => {
    let strength = 0;
    
    // Longitud
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complejidad
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 2) return 'débil';
    if (strength <= 4) return 'intermedio';
    return 'fuerte';
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'débil': return '#e74c3c';
      case 'intermedio': return '#f39c12';
      case 'fuerte': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validar contraseña en tiempo real
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
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
        newErrors.password = 'Debe contener al menos una mayúscula';
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Debe contener al menos un número';
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'Debe contener al menos un carácter especial';
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
        console.log('Usuario registrado:', {
          nombre: formData.nombre,
          email: formData.email,
          passwordStrength: passwordStrength
        });
        
        // Redirigir a login después del registro
        navigate('/iniciar-sesion', { 
          state: { 
            message: '¡Registro exitoso! Ahora puedes iniciar sesión.',
            email: formData.email 
          } 
        });
      }, 1500);
      
    } catch (error) {
      setErrors({ general: 'Error en el registro. Intenta nuevamente.' });
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
          <h2>Crear Cuenta</h2>
          
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'error' : ''}
                placeholder="Tu nombre"
              />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>
            
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
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: passwordStrength === 'débil' ? '33%' : 
                               passwordStrength === 'intermedio' ? '66%' : '100%',
                        backgroundColor: getPasswordStrengthColor(passwordStrength)
                      }}
                    />
                  </div>
                  <span className="strength-text">
                    Seguridad: <strong>{passwordStrength}</strong>
                  </span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
            
            <div className="form-group">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={handleCaptchaChange}
              />
              {errors.captcha && <span className="error-text">{errors.captcha}</span>}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>¿Ya tienes cuenta? <a href="/iniciar-sesion">Inicia sesión aquí</a></p>
            <p>Al registrarte aceptas nuestros <a href="/">Términos y Condiciones</a></p>
          </div>
          
          <div className="password-requirements">
            <h4>Requisitos de contraseña:</h4>
            <ul>
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos un número</li>
              <li>Al menos un carácter especial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;