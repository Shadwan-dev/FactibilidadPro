// src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Toma Decisiones Inteligentes con 
          <span className="highlight"> Nuestro Software de Factibilidad</span>
        </h1>
        <p className="hero-description">
          Analiza la viabilidad de tus proyectos de manera rápida, precisa y profesional. 
          Evaluación financiera, técnica, de mercado y legal en una sola plataforma.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn btn-primary">
            Comenzar Ahora
          </Link>
          <Link to="/#features" className="btn btn-secondary">
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