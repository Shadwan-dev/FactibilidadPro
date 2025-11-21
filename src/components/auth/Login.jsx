// src/components/auth/Login.jsx (ACTUALIZADO CON useAuth)
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // ✅ NUEVO
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import '../../styles/pages/auth.css';

export function Login({ onSwitchToRegister, onSwitchToMaster, onNeedsVerification }) {
  const { login, error: authError, clearError, loading: authLoading } = useAuth(); // ✅ USAR useAuth
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState(''); // ✅ ERROR LOCAL PARA COMPATIBILIDAD

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    try {
      console.log('🔧 Iniciando login con:', formData.email);
      
      // ✅ USAR EL LOGIN DEL HOOK useAuth
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login exitoso via useAuth');
        
        // Obtener datos adicionales de Firestore (mantener tu lógica existente)
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('📄 Datos de usuario:', userData);

          // ✅ MANTENER TU LÓGICA DE VERIFICACIÓN
          if (userData.requiresVerification && !userData.verified) {
            console.log('🔐 Usuario requiere verificación');
            onNeedsVerification({
              uid: result.user.uid,
              email: result.user.email,
              displayName: userData.displayName,
              requiresVerification: true,
              verified: false
            });
            return;
          }
        }
        
        // Si llegamos aquí, el login fue exitoso y no requiere verificación
        // La redirección la maneja automáticamente el Router
        
      } else {
        setLocalError(result.error);
      }

    } catch (error) {
      console.error('❌ Error en login:', error);
      setLocalError(getErrorMessage(error.code));
    }
  };

  // ✅ MANTENER TU FUNCIÓN DE TRAduCCIÓN DE ERRORES
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return '❌ Usuario no encontrado';
      case 'auth/wrong-password':
        return '❌ Contraseña incorrecta';
      case 'auth/invalid-email':
        return '❌ Email inválido';
      case 'auth/too-many-requests':
        return '❌ Demasiados intentos. Intenta más tarde';
      case 'auth/user-disabled':
        return '❌ Cuenta deshabilitada. Contacta al administrador';
      case 'auth/network-request-failed':
        return '❌ Error de conexión. Verifica tu internet';
      default:
        return '❌ Error al iniciar sesión. Intenta nuevamente';
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Bienvenido a FactibilidadPro</h2>
          <p>Ingresa con tu cuenta de usuario</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {displayError && (
            <div className="error-message">
              {displayError}
            </div>
          )}
          
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
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
              placeholder="Tu contraseña"
              required
              disabled={authLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn--primary btn--full"
            disabled={authLoading}
          >
            {authLoading ? '⏳ Iniciando Sesión...' : '🔐 Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <div className="login-links">
            <p>
              ¿Eres usuario master?{' '}
              <button 
                type="button"
                onClick={onSwitchToMaster}
                className="link-button"
                disabled={authLoading}
              >
                Acceder como Master
              </button>
            </p>
            <p>
              ¿No tienes cuenta?{' '}
              <button 
                type="button"
                onClick={onSwitchToRegister}
                className="link-button"
                disabled={authLoading}
              >
                Solicitar acceso
              </button>
            </p>
          </div>
        </div>
        
        <div className="demo-accounts">
          <h4>💡 Información para usuarios</h4>
          <p>Los usuarios normales pueden solicitar acceso contactando al administrador del sistema.</p>
          <p>Para acceso inmediato, usa el botón "Acceder como Master".</p>
        </div>
      </div>
    </div>
  );
}