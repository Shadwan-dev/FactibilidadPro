// src/components/auth/Verification.jsx
import React, { useState } from 'react';

export function Verification({ onVerification, currentUser, onBackToLogin }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (verificationCode.length !== 5) {
      setError('El código debe tener exactamente 5 caracteres');
      setIsLoading(false);
      return;
    }

    // Validar el código
    const isValid = await onVerification(verificationCode.toUpperCase());
    
    if (!isValid) {
      setError('Código de verificación incorrecto');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVerificationCode(value);
    if (error) setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Verificación Requerida</h2>
          <p>Hola {currentUser?.displayName}, necesitas verificar tu cuenta</p>
        </div>
        
        <div className="verification-info">
          <div className="info-card">
            <h4>📧 Código de Verificación</h4>
            <p>Se ha enviado un código de 5 caracteres a tu email registrado.</p>
            <p>Por favor ingrésalo a continuación para activar tu cuenta.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Código de Verificación (5 caracteres)</label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleChange}
              placeholder="Ej: A1B2C"
              maxLength={5}
              required
              className="verification-input"
            />
            <small>Ingresa el código alfanumérico de 5 caracteres</small>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading || verificationCode.length !== 5}
          >
            {isLoading ? '⏳ Verificando...' : '✅ Verificar Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <div className="help-links">
            <p>
              ¿No recibiste el código?{' '}
              <button type="button" className="link-button">
                Reenviar código
              </button>
            </p>
            <p>
              ¿Problemas con la verificación?{' '}
              <button type="button" className="link-button">
                Contactar soporte
              </button>
            </p>
          </div>
          
          <div className="back-to-login">
            <button 
              type="button"
              onClick={onBackToLogin}
              className="link-button"
            >
              ← Volver al login
            </button>
          </div>
        </div>

        {/* Demo - En producción esto se enviaría por email */}
        <div className="demo-verification">
          <h4>🛠️ Modo Desarrollo</h4>
          <p>Para probar, usa este código: <strong>YRKL1</strong></p>
          <button 
            type="button"
            onClick={() => setVerificationCode('YRKL1')}
            className="user-btn"
          >
            Autocompletar Código Demo
          </button>
        </div>
      </div>
    </div>
  );
}