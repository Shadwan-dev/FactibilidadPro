// src/pages/LoginPage.jsx (VERSIÓN FINAL FASE 1)
import React, { useState, useEffect } from 'react';
import { Login } from '../components/auth/Login';
import { MasterLogin } from '../components/auth/MasterLogin';
import { Verification } from '../components/auth/Verification';
import { Register } from '../components/auth/Register';
import { Header } from '../components/layout/Header';

export function LoginPage({ 
  onLogin, 
  needsVerification, 
  onVerification, 
  currentUser, 
  onNeedsVerification  // <- NUEVA PROP AGREGADA AQUÍ
}) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMasterLogin, setIsMasterLogin] = useState(false);

  // Si necesita verificación, mostrar directamente ese componente
  if (needsVerification && currentUser) {
    return (
      <div className="login-page">
        <Header />
        <Verification 
          onVerification={onVerification}
          currentUser={currentUser}
          onBackToLogin={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="login-page">
      <Header />
      {isRegistering ? (
        <Register onSwitchToLogin={() => setIsRegistering(false)} />
      ) : isMasterLogin ? (
        <MasterLogin 
          onLogin={onLogin}
          onSwitchToNormal={() => setIsMasterLogin(false)}
        />
      ) : (
        <Login 
          onLogin={onLogin} 
          onSwitchToRegister={() => setIsRegistering(true)}
          onSwitchToMaster={() => setIsMasterLogin(true)}
          onNeedsVerification={onNeedsVerification} // <- PROP PASADA AL LOGIN
        />
      )}
    </div>
  );
}