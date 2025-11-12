// src/utils/errorUtils.js
export async function handleAsyncOperation(operation, errorHandler) {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en operación asíncrona:', error);
      
      if (errorHandler) {
        errorHandler(error);
      }
      
      return { 
        success: false, 
        error: error.message || 'Error desconocido',
        code: error.code 
      };
    }
  }
  
  // Tipos de errores comunes
  export const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    AUTH: 'AUTH_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    SERVER: 'SERVER_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
  };
  
  export function getErrorMessage(error) {
    if (typeof error === 'string') return error;
    
    if (error?.message) return error.message;
    
    switch (error?.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet';
      default:
        return 'Ha ocurrido un error inesperado';
    }
  }