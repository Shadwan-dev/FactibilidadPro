// src/components/error/ErrorFallback.jsx
import React from 'react';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback">
      <div className="fallback-content">
        <div className="fallback-icon">⚠️</div>
        <h3>Error al cargar el componente</h3>
        <p>No se pudo cargar esta sección de la aplicación.</p>
        <button 
          onClick={resetErrorBoundary}
          className="btn btn-primary"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}