// src/components/ProtectedRoute.jsx (ACTUALIZADO)
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requireMaster = false }) => {
  const { currentUser, isAdmin, isMaster, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere permisos master y no los tiene
  if (requireMaster && !isAdmin && !isMaster) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};