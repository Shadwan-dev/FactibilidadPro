// src/components/auth/Register.jsx (ACTUALIZADO CON FIREBASE)
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      const userData = {
        uid: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        company: formData.company,
        requiresVerification: true,
        verified: false,
        createdAt: new Date(),
        role: 'user'
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      setSuccess(true);
      
      // La función de Firebase se ejecutará automáticamente y enviará el código a Yurkel

    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

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
            className="btn btn-primary btn-full"
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
          {error && (
            <div className="error-message">
              ❌ {error}
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
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Registrando...' : '📝 Crear Cuenta'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
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