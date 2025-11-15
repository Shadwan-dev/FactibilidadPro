// src/components/auth/Login.jsx (VERSION COMPLETA CON FIREBASE)
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config'; // Ajusta la ruta según tu estructura

export function Login({ onLogin, onSwitchToRegister, onSwitchToMaster, onNeedsVerification }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log('🔧 Debug Firebase Config:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      // Verifica si son undefined
    });
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. AUTENTICACIÓN CON FIREBASE AUTH
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      console.log('✅ Usuario autenticado:', user.uid);

      // 2. OBTENER DATOS ADICIONALES DE FIRESTORE
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('📄 Datos de usuario:', userData);

        // 3. VERIFICAR SI EL USUARIO REQUIERE VERIFICACIÓN
        if (userData.requiresVerification && !userData.verified) {
          console.log('🔐 Usuario requiere verificación');
          onNeedsVerification({
            uid: user.uid,
            email: user.email,
            displayName: userData.displayName,
            requiresVerification: true,
            verified: false
          });
          return;
        }

        // 4. LOGIN EXITOSO - PASAR DATOS AL COMPONENTE PADRE
        onLogin({
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName || user.email.split('@')[0],
          company: userData.company,
          role: userData.role || 'user',
          verified: userData.verified || false,
          isMaster: userData.role === 'master'
        });

      } else {
        // Usuario no existe en Firestore (caso raro)
        setError('Usuario no encontrado en la base de datos. Contacta al administrador.');
        await auth.signOut(); // Cerrar sesión por seguridad
      }

    } catch (error) {
      console.error('❌ Error en login:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCIÓN PARA TRAducir códigos de error de Firebase
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
    
    if (error) setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Bienvenido a FactibilidadPro</h2>
          <p>Ingresa con tu cuenta de usuario</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Iniciando Sesión...' : '🔐 Iniciar Sesión'}
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
                disabled={isLoading}
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
                disabled={isLoading}
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