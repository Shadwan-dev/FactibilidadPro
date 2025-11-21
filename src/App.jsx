// src/App.jsx (VERSIÓN CORREGIDA Y COMPLETA)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth'; // ✅ CORREGIDO: Cambiar la ruta
import { ProjectProvider } from './context/ProjectContext'; // ✅ NUEVO: Agregar ProjectProvider
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import ErrorBoundary from './components/error/ErrorBoundary';
import './styles/main.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando FactibilidadPro...</p>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

// Componente para rutas públicas (solo para no autenticados)
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando FactibilidadPro...</p>
      </div>
    );
  }
  
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

// Componente principal de la aplicación
function AppContent() {
  const { currentUser, logout, loading } = useAuth();

  // Obtener projectId de la URL o usar uno por defecto
  const getProjectId = () => {
    // Puedes mejorar esto obteniendo de la URL o localStorage
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('projectId') || 'proyecto-principal';
  };

  // Pantalla de carga global
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
      {/* ✅ ENVOLVER CON PROJECTPROVIDER - REEMPLAZA FeasibilityProvider */}
      <ProjectProvider initialProjectId={getProjectId()}>
        <Router>
          <div className="app">
            <Routes>
              {/* Ruta pública - Home */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                } 
              />
              
              {/* Ruta pública - Login */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              
              {/* Ruta protegida - Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard onLogout={logout} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta protegida - Dashboard con parámetros */}
              <Route 
                path="/dashboard/:projectId" 
                element={
                  <ProtectedRoute>
                    <Dashboard onLogout={logout} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </ProjectProvider>
    </ErrorBoundary>
  );
}

// Componente raíz que envuelve todo con el AuthProvider
export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;