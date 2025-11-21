// src/components/layout/Header.jsx - VERSIÓN MEJORADA
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/components/layout/header.css';

export function Header({ username, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboard = location.pathname === '/dashboard';

  // ✅ Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const user = {
    name: username || 'Usuario',
    email: username ? `${username}@factibilidadpro.com` : 'usuario@ejemplo.com',
    avatar: '👤'
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <h2>📊 RutaPro</h2>
        </div>
        
        <nav className="navigation">
          {isDashboard ? (
            // Navegación para usuarios logueados (Dashboard)
            <>
              <div className="user-welcome">
                <span>Bienvenido, {user.name}</span>
              </div>
              <div className="user-menu-container">
                <button 
                  className="user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Menú de usuario"
                >
                  {user.avatar}
                </button>
                
                {showUserMenu && (
                  <div className="user-menu">
                    <div className="user-info">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="menu-divider"></div>
                    <button 
                      className="menu-item"
                      onClick={handleLogout}
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Navegación para visitantes (Home/Login)
            <>
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/#features" className="nav-link">Características</Link>
              <Link to="/login" className="nav-link login-btn">
                Iniciar Sesión
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}