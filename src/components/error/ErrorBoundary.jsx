// src/components/error/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log del error (en producción enviarías a Sentry/LogRocket)
    console.error('Error capturado por Error Boundary:', error, errorInfo);
    
    // Aquí podrías enviar el error a un servicio de monitoreo
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = async (error, errorInfo) => {
    try {
      // Simulación de envío a servicio de monitoreo
      if (process.env.NODE_ENV === 'production') {
        // await sendToSentry(error, errorInfo);
        console.log('Error enviado a servicio de monitoreo');
      }
    } catch (loggingError) {
      console.warn('Error al enviar log:', loggingError);
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Opcional: recargar la aplicación
    // window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-content">
              <div className="error-icon">🚨</div>
              <h1>Algo salió mal</h1>
              <p>Ha ocurrido un error inesperado en la aplicación.</p>
              
              <div className="error-actions">
                <button 
                  onClick={this.handleReset}
                  className="btn btn-primary"
                >
                  Reintentar
                </button>
                <button 
                  onClick={this.handleGoHome}
                  className="btn btn-secondary"
                >
                  Volver al Inicio
                </button>
              </div>

              {/* Solo mostrar detalles en desarrollo */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-details">
                  <summary>Detalles del error (Desarrollo)</summary>
                  <pre>{this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;