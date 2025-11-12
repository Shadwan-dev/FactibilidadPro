// src/components/auth/MasterLogin.jsx (VERSIÓN CORREGIDA)
import React, { useState } from 'react';

export function MasterLogin({ onLogin, onSwitchToNormal }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // SOLUCIÓN: Agregar coma entre propiedades
  const MASTER_USERS = {    
    'yurkel': 'yurkel',  // ← COMA AGREGADA AQUÍ
    'noel': 'noel'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular carga
    setTimeout(() => {
      // SOLUCIÓN: Convertir a minúsculas para evitar errores de case
      const usernameLower = formData.username.toLowerCase();
      const passwordLower = formData.password.toLowerCase();
      
      if (MASTER_USERS[usernameLower] && MASTER_USERS[usernameLower] === passwordLower) {
        const userData = {
          uid: `master-${usernameLower}`,
          email: `${usernameLower}@gmail.com`,
          displayName: `${usernameLower} Master`,
          isMaster: true,
          role: 'master'
        };
        onLogin(userData);
      } else {
        setError('Credenciales master incorrectas. Verifique si las mayúsculas están activas');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const autoFillCredentials = (username) => {
    setFormData({
      username: username,
      password: username
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Acceso Master</h2>
          <p>Credenciales administrativas</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Usuario Master</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="yurkel"
              required
              disabled={isLoading}
              autoComplete="off" // Cambiado a "off" para mejor prevención
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña Master</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Verificando...' : '👑 Acceder como Master'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            ¿Eres usuario normal?{' '}
            <button 
              type="button"
              onClick={onSwitchToNormal}
              className="link-button"
              disabled={isLoading}
            >
              Volver a login normal
            </button>
          </p>
        </div>
        
        <div className="demo-accounts">
          <h4>👥 Usuarios Master:</h4>
          <div className="user-buttons">
            <button 
              type="button"
              className="user-btn"
              onClick={() => autoFillCredentials('noel')}
              disabled={isLoading}
            >
              Noel (Admin)
            </button>
            <button 
              type="button"
              className="user-btn"
              onClick={() => autoFillCredentials('yurkel')}
              disabled={isLoading}
            >
              Yurkel (Admin)
            </button>
          </div>
          <div className="demo-info">            
            <p><strong>Permisos:</strong> Acceso completo al sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
} 