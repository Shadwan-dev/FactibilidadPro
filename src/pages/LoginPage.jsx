// src/pages/LoginPage.jsx (VERSIÓN MEJORADA CON useAuth)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // ✅ NUEVO
import { Login } from '../components/auth/Login';
import { MasterLogin } from '../components/auth/MasterLogin';
import { Verification } from '../components/auth/Verification';
import { Register } from '../components/auth/Register';
import { Header } from '../components/layout/Header';

export function LoginPage() {
  // ✅ USAR useAuth EN LUGAR DE PROPS
  const { 
    currentUser, 
    login, 
    signup, 
    error: authError, 
    clearError,
    loading: authLoading 
  } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isMasterLogin, setIsMasterLogin] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationUser, setVerificationUser] = useState(null);

  // ✅ LIMPIAR ERRORES AL CAMBIAR ENTRE FORMULARIOS
  useEffect(() => {
    clearError();
  }, [isRegistering, isMasterLogin, clearError]);

  // ✅ MANEJAR LOGIN NORMAL
  const handleNormalLogin = async (email, password) => {
    const result = await login(email, password);
    
    if (result.success) {
      console.log('✅ Login exitoso');
      // La redirección la maneja el Router automáticamente
    } else {
      console.error('❌ Error en login:', result.error);
    }
  };

  // ✅ MANEJAR REGISTRO
  const handleRegister = async (email, password, userData) => {
    const result = await signup(email, password, userData?.displayName);
    
    if (result.success) {
      console.log('✅ Registro exitoso');
      // Opcional: puedes manejar verificación aquí si es necesario
    } else {
      console.error('❌ Error en registro:', result.error);
    }
  };

  // ✅ MANEJAR LOGIN MASTER (si mantienes esta funcionalidad separada)
  const handleMasterLogin = async (masterData) => {
    // Si mantienes el MasterLogin separado, puedes manejarlo aquí
    console.log('Master login:', masterData);
    
    // Simular login exitoso de master
    // En una implementación real, esto se integraría con useAuth
    if (masterData.email && masterData.password) {
      const result = await login(masterData.email, masterData.password);
      return result.success;
    }
    
    return false;
  };

  // ✅ MANEJAR VERIFICACIÓN (si la necesitas)
  const handleVerification = async (code) => {
    console.log('Código de verificación:', code);
    // Lógica de verificación personalizada si la necesitas
    setNeedsVerification(false);
    return true;
  };

  // ✅ MANEJAR NECESIDAD DE VERIFICACIÓN
  const handleNeedsVerification = (userData) => {
    console.log('🔐 Usuario requiere verificación:', userData);
    setVerificationUser(userData);
    setNeedsVerification(true);
  };

  // ✅ SI YA ESTÁ AUTENTICADO, NO MOSTRAR LOGIN (aunque el Router ya redirige)
  if (currentUser && !needsVerification) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Redirigiendo al dashboard...</p>
      </div>
    );
  }

  // ✅ SI NECESITA VERIFICACIÓN, MOSTRAR COMPONENTE DE VERIFICACIÓN
  if (needsVerification) {
    return (
      <div className="login-page">
        <Header />
        <Verification 
          onVerification={handleVerification}
          currentUser={verificationUser || currentUser}
          onBackToLogin={() => {
            setNeedsVerification(false);
            setVerificationUser(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="login-page">
      <Header />
      
      {/* ✅ MOSTRAR FORMULARIOS SEGÚN EL ESTADO */}
      {isRegistering ? (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setIsRegistering(false);
            clearError();
          }}
          loading={authLoading}
          error={authError}
        />
      ) : isMasterLogin ? (
        <MasterLogin 
          onLogin={handleMasterLogin}
          onSwitchToNormal={() => {
            setIsMasterLogin(false);
            clearError();
          }}
          loading={authLoading}
          error={authError}
        />
      ) : (
        <Login 
          onLogin={handleNormalLogin}
          onSwitchToRegister={() => {
            setIsRegistering(true);
            clearError();
          }}
          onSwitchToMaster={() => {
            setIsMasterLogin(true);
            clearError();
          }}
          onNeedsVerification={handleNeedsVerification}
          loading={authLoading}
          error={authError}
        />
      )}
    </div>
  );
}