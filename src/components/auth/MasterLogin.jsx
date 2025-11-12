// src/components/auth/MasterLogin.jsx (VERSIÓN CORREGIDA)
import React, { useState } from 'react';

export function MasterLogin({ onLogin, onSwitchToNormal }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Usuarios master predefinidos - VERIFICAR COMILLAS Y COMAS
  const MASTER_USERS = {
    'billy': 'billy',
    'yurkel': 'yurkel'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular carga
    setTimeout(() => {
      if (MASTER_USERS[formData.username] && MASTER_USERS[formData.username] === formData.password) {
        const userData = {
          uid: `master-${formData.username}`,
          email: `${formData.username}@factibilidadpro.com`,
          displayName: `${formData.username} Master`,
          isMaster: true,
          role: 'master'
        };
        onLogin(userData);
      } else {
        setError('Credenciales master incorrectas. Usa: billy/billy o yurkel/yurkel');
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
              placeholder="billy o yurkel"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña Master</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="mismo que el usuario"
              required
              disabled={isLoading}
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
              onClick={() => autoFillCredentials('billy')}
              disabled={isLoading}
            >
              Billy (Admin)
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
            <p><strong>Contraseña:</strong> mismo que el usuario</p>
            <p><strong>Permisos:</strong> Acceso completo al sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
}