// src/components/auth/Register.jsx (ACTUALIZADO CON useAuth)
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // ✅ NUEVO
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export function Register({ onSwitchToLogin }) {
  const { signup, error: authError, clearError, loading: authLoading } = useAuth(); // ✅ USAR useAuth
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    company: ''
  });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // ✅ MANTENER TUS VALIDACIONES
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // ✅ USAR EL SIGNUP DEL HOOK useAuth
      const result = await signup(formData.email, formData.password, formData.displayName);
      
      if (result.success) {
        console.log('✅ Registro exitoso via useAuth');
        
        // ✅ MANTENER TU LÓGICA DE FIRESTORE
        const userData = {
          uid: result.user.uid,
          email: formData.email,
          displayName: formData.displayName,
          company: formData.company,
          requiresVerification: true,
          verified: false,
          createdAt: new Date(),
          role: 'user'
        };

        await setDoc(doc(db, 'users', result.user.uid), userData);
        setSuccess(true);
        
      } else {
        setLocalError(result.error);
      }

    } catch (error) {
      console.error('Error en registro:', error);
      setLocalError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (localError || authError) {
      setLocalError('');
      clearError();
    }
  };

  // ✅ MOSTRAR ERRORES TANTO LOCALES COMO DEL HOOK
  const displayError = localError || authError;

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>✅ Registro Exitoso</h2>
            <p>Tu cuenta ha sido creada</p>
          </div>
          
          <div className="success-message">
            <p>Se ha enviado un código de verificación al administrador.</p>
            <p>Una vez verificado, podrás acceder al sistema.</p>
            <p>Recibirás una notificación cuando tu cuenta esté activa.</p>
          </div>
          
          <button 
            onClick={onSwitchToLogin}
            className="btn btn--primary btn--full"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Crear Cuenta</h2>
          <p>Regístrate en FactibilidadPro</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {displayError && (
            <div className="error-message">
              ❌ {displayError}
            </div>
          )}
          
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              disabled={authLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Empresa</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Nombre de tu empresa"
              required
              disabled={authLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@empresa.com"
              required
              disabled={authLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={authLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              disabled={authLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn--primary btn--full"
            disabled={authLoading}
          >
            {authLoading ? '⏳ Registrando...' : '📝 Crear Cuenta'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
              disabled={authLoading}
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
        
        <div className="demo-accounts">
          <h4>💡 Información</h4>
          <p>Tu cuenta requerirá verificación por parte del soporte.</p>
          <p>Recibirás un email cuando esté activa.</p>
        </div>
      </div>
    </div>
  );
}