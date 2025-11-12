// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📊 CUM FactibilidadPro</h3>
            <p>Tu herramienta confiable para análisis de factibilidad de proyectos.</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <Link to="/" className="footer-link">Inicio</Link>
            <Link to="/login" className="footer-link">Iniciar Sesión</Link>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
          </div>
          <div className="footer-section">
            <h4>Características</h4>
            <span className="footer-link">Análisis Financiero</span>
            <span className="footer-link">Evaluación Técnica</span>
            <span className="footer-link">Estudio de Mercado</span>
            <span className="footer-link">Análisis Legal</span>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <span className="footer-link">yurkel.saname@gmail.com</span>
            <span className="footer-link">+53 55303588</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CUM FactibilidadPro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}