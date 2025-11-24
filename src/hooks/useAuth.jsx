// src/hooks/useAuth.jsx (CORREGIDO)
import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

// ✅ EXPORTAR AuthContext explícitamente
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar autenticación master al cargar
  useEffect(() => {
    const checkMasterAuth = () => {
      const isMasterAuth = localStorage.getItem('isMasterAuthenticated');
      const masterUser = localStorage.getItem('masterUser');
      
      if (isMasterAuth === 'true' && masterUser) {
        try {
          const userData = JSON.parse(masterUser);
          setCurrentUser(userData);
          setLoading(false);
          return true;
        } catch (err) {
          console.error('Error parsing master user:', err);
          localStorage.removeItem('masterUser');
          localStorage.removeItem('isMasterAuthenticated');
        }
      }
      return false;
    };

    // Si no hay usuario master, verificar Firebase auth
    if (!checkMasterAuth()) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('🔄 Estado de autenticación Firebase:', user ? 'Usuario conectado' : 'Usuario desconectado');
        
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            role: user.email?.includes('admin') || user.email?.includes('master') ? 'master' : 'user',
            isMaster: false
          });
        } else {
          setCurrentUser(null);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  // Iniciar sesión con Firebase
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        emailVerified: userCredential.user.emailVerified,
        role: 'user',
        isMaster: false
      };
      
      setCurrentUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Registrar nuevo usuario
  const signup = async (email, password, displayName = '') => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName,
        emailVerified: userCredential.user.emailVerified,
        role: 'user',
        isMaster: false
      };
      
      setCurrentUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Cerrar sesión (para ambos tipos de usuario)
  const logout = async () => {
    try {
      setError('');
      
      // Limpiar autenticación master
      localStorage.removeItem('masterUser');
      localStorage.removeItem('isMasterAuthenticated');
      
      // Cerrar sesión de Firebase si está autenticado
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // ✅ NUEVO: Función para establecer usuario master
  const setMasterUser = (userData) => {
    setCurrentUser(userData);
  };

  // Función para traducir errores de Firebase
  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'El email no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'La contraseña es incorrecta',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };
    
    return errorMessages[errorCode] || 'Error desconocido';
  };

  const value = {
    // Estado
    currentUser,
    loading,
    error,
    
    // Métodos
    login,
    signup,
    logout,
    resetPassword,
    setMasterUser, // ✅ Exportar la función
    
    // Utilidades
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'master' || currentUser?.isMaster,
    isMaster: currentUser?.isMaster,
    clearError: () => setError('')
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};