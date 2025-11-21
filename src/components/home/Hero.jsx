// src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/sections/hero.css'; // Import del CSS específico

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Un Balance Perfecto entre lo 
          <span className="highlight">Profesional y la Mejor Guía</span>
        </h1>
        <p className="hero-description">
          Solo una Idea es suficiente para iniciar tu empresa, acércate a tu mejor mentor para tu negocio.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn btn--primary btn--lg">
            Comenzar Ahora
          </Link>
          <Link to="/#features" className="btn btn--secondary btn--lg">
            Conocer Más
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>+95%</h3>
            <p>Precisión en análisis</p>
          </div>          
          <div className="stat">
            <h3>+80%</h3>
            <p>Tiempo ahorrado</p>
          </div>
        </div>
      </div>      
    </section>
  );
}