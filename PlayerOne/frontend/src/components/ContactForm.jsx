import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Contact.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'Mínimo 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido';
    } else if (formData.asunto.length < 5) {
      newErrors.asunto = 'Mínimo 5 caracteres';
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = 'Mínimo 10 caracteres';
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
    
    setIsSubmitting(true);
    
    try {
      // Simular envío del formulario
      setTimeout(() => {
        console.log('Mensaje enviado:', formData);
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Resetear formulario
        setFormData({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: ''
        });
        setCaptchaToken('');
        
        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
        
      }, 1500);
      
    } catch (error) {
      setErrors({ general: 'Error al enviar el mensaje. Intenta nuevamente.' });
      setIsSubmitting(false);
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }));
    }
  };

  return (
    <div className="contact-form-wrapper">
      {isSubmitted && (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <div>
            <h3>¡Mensaje enviado!</h3>
            <p>Gracias por contactarnos. Te responderemos pronto.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="contact-form">
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
              placeholder="Tu nombre"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="asunto">Asunto *</label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            className={errors.asunto ? 'error' : ''}
            placeholder="¿Cómo podemos ayudarte?"
            disabled={isSubmitting}
          />
          {errors.asunto && <span className="error-text">{errors.asunto}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="mensaje">Mensaje *</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            className={errors.mensaje ? 'error' : ''}
            placeholder="Escribe tu mensaje aquí..."
            rows="6"
            disabled={isSubmitting}
          />
          {errors.mensaje && <span className="error-text">{errors.mensaje}</span>}
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
          disabled={isSubmitting || !captchaToken}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;