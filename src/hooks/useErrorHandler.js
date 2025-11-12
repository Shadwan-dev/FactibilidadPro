// src/hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    console.error('Error manejado:', error);
    setError(error);
    
    // Aquí podrías enviar el error a tu servicio de monitoreo
    if (error?.message) {
      // sendToMonitoringService(error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null
  };
}