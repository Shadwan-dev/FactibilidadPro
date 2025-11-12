// src/components/home/Features.jsx
import React from 'react';

export function Features() {
  const features = [
    {
      icon: '💰',
      title: 'Análisis Financiero Completo',
      description: 'Calcula VPN, TIR, período de recuperación y flujos de caja proyectados.'
    },
    {
      icon: '🔧',
      title: 'Evaluación Técnica',
      description: 'Analiza capacidades técnicas, infraestructura y recursos necesarios.'
    },
    {
      icon: '📈',
      title: 'Estudio de Mercado',
      description: 'Evalúa tamaño de mercado, competencia y potencial de crecimiento.'
    },
    {
      icon: '⚖️',
      title: 'Análisis Legal',
      description: 'Verifica cumplimiento normativo, permisos y riesgos legales.'
    },
    {
      icon: '📊',
      title: 'Reportes Automatizados',
      description: 'Genera reportes ejecutivos con gráficos profesionales.'
    },
    {
      icon: '🚀',
      title: 'Resultados en Tiempo Real',
      description: 'Visualiza resultados inmediatamente al modificar los datos.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">Características Principales</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}