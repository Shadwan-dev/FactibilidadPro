// src/components/results/TechnicalResults.jsx
import React from 'react';

export const TechnicalResults = ({ calculations }) => {
  if (!calculations || !calculations.technical) {
    return (
      <div className="results-section">
        <h3>Factibilidad Técnica</h3>
        <p>Complete los datos técnicos para ver los resultados</p>
      </div>
    );
  }

  const { score, viable, level } = calculations.technical;
  const safeScore = typeof score === 'number' ? score : 0;

  return (
    <div className="results-section">
      <h3>Factibilidad Técnica</h3>
      
      <div className="results-grid">
        <div className="result-card">
          <h4>Puntuación Técnica</h4>
          <span className={safeScore >= 70 ? 'positive' : 'negative'}>
            {safeScore.toFixed(1)}%
          </span>
        </div>

        <div className="result-card">
          <h4>Viabilidad</h4>
          <span className={viable ? 'positive' : 'negative'}>
            {viable ? 'VIABLE' : 'NO VIABLE'}
          </span>
        </div>
      </div>

      <div className={`feasibility-indicator ${level === 'high' ? 'green' : level === 'medium' ? 'orange' : 'red'}`}>
        <h4>Nivel Técnico: {level?.toUpperCase() || 'BAJO'}</h4>
        <p>{safeScore >= 70 ? 'Capacidad técnica adecuada' : 'Se requieren mejoras técnicas'}</p>
      </div>
    </div>
  );
};