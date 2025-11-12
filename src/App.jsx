// src/App.jsx (VERSIÓN CORREGIDA)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Solo una importación
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { FeasibilityProvider } from './context/FeasibilityContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, auth } from './firebase/config';
import ErrorBoundary from './components/error/ErrorBoundary'; // ✅ Asegúrate de que este archivo existe
import './styles/App.css';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            // Obtener datos adicionales del usuario desde Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const fullUserData = {
                uid: user.uid,
                email: user.email,
                ...userData
              };
              
              setCurrentUser(fullUserData);
              
              // Verificar si necesita verificación
              if (userData.requiresVerification && !userData.verified) {
                setNeedsVerification(true);
                setIsAuthenticated(false);
              } else {
                setIsAuthenticated(true);
                setNeedsVerification(false);
              }
            } else {
              // Usuario no existe en Firestore - cerrar sesión
              await auth.signOut();
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Error verificando usuario:', error);
            await auth.signOut();
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No hay usuario autenticado
          setCurrentUser(null);
          setIsAuthenticated(false);
          setNeedsVerification(false);
        }
        setLoading(false);
      });
    };

    checkAuth();
  }, []);

  // Manejar cuando usuario requiere verificación
  const handleNeedsVerification = (userData) => {
    console.log('🔐 Usuario requiere verificación:', userData);
    setCurrentUser(userData);
    setNeedsVerification(true);
    setIsAuthenticated(false);
  };

  const handleLogin = async (userData) => {
    try {
      console.log('✅ Usuario logueado:', userData);
      
      // Para usuarios master (del MasterLogin)
      if (userData.isMaster) {
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setNeedsVerification(false);
        await setDoc(doc(db, 'users', userData.uid), userData, { merge: true });
        return;
      }

      // Para usuarios normales (del Login con Firebase)
      setCurrentUser(userData);
      
      if (userData.requiresVerification && !userData.verified) {
        setNeedsVerification(true);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setNeedsVerification(false);
      }
      
    } catch (error) {
      console.error('Error en handleLogin:', error);
    }
  };

  const handleVerification = async (verificationCode) => {
    try {
      console.log('📞 Verificando código:', verificationCode);
      
      // Simulación temporal
      if (verificationCode.length === 5) {
        // Actualizar usuario en Firestore
        await setDoc(doc(db, 'users', currentUser.uid), {
          verified: true,
          requiresVerification: false,
          verifiedAt: new Date()
        }, { merge: true });
        
        // Actualizar estado local
        setNeedsVerification(false);
        setIsAuthenticated(true);
        setCurrentUser(prev => ({
          ...prev,
          verified: true,
          requiresVerification: false
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en verificación:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setNeedsVerification(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando FactibilidadPro...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <FeasibilityProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" /> : 
                    <LoginPage 
                      onLogin={handleLogin} 
                      needsVerification={needsVerification}
                      onVerification={handleVerification}
                      currentUser={currentUser}
                      onNeedsVerification={handleNeedsVerification}
                    />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated ? 
                    <Dashboard user={currentUser} onLogout={handleLogout} /> : 
                    <Navigate to="/login" />
                } 
              />
            </Routes>
          </div>
        </Router>
      </FeasibilityProvider>
    </ErrorBoundary>
  );
}