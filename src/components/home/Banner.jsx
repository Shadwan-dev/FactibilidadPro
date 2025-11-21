// src/components/home/Banner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/sections/banner.css'; // ✅ Import del CSS específico

export function Banner() {
  const bannerItems = [
    {
      title: 'Para Emprendedores',
      description: 'Valida tu idea de negocio antes de invertir',
      icon: '💼'
    },
    {
      title: 'Para Empresas',
      description: 'Evalúa proyectos de expansión e inversión',
      icon: '🏢'
    },
    {
      title: 'Para Consultores',
      description: 'Herramienta profesional para tus clientes',
      icon: '👨‍💼'
    },
    {
      title: 'Para Inversionistas',
      description: 'Analiza oportunidades de inversión',
      icon: '📈'
    }
  ];

  return (
    <section className="banner">
      <div className="container">
        <h2 className="section-title">¿Para Quién es Nuestro Software?</h2>
        <div className="banner-grid">
          {bannerItems.map((item, index) => (
            <div key={index} className="banner-card">
              <div className="banner-icon">{item.icon}</div>
              <h3 className="banner-card-title">{item.title}</h3>
              <p className="banner-card-description">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="banner-cta">
          <h3 className="banner-cta-title">¿Listo para tomar mejores decisiones?</h3>
          <Link to="/login" className="btn btn--primary btn--lg">
            Comenzar Evaluación Gratis
          </Link>
        </div>
      </div>
    </section>
  );
}