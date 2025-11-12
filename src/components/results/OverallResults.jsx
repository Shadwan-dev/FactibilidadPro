// src/components/results/OverallResults.jsx
import React from 'react';

export const OverallResults = ({ calculations }) => {
  if (!calculations || !calculations.overall) {
    return (
      <div className="results-section">
        <h3>Evaluación General</h3>
        <p>Complete los datos para ver la evaluación general</p>
      </div>
    );
  }

  const { score, viable, level, color } = calculations.overall;
  const safeScore = typeof score === 'number' ? score : 0;

  return (
    <div className="results-section">
      <h3>Evaluación General</h3>
      
      <div className="results-grid">
        <div className="result-card">
          <h4>Puntuación General</h4>
          <span className={safeScore >= 70 ? 'positive' : 'negative'}>
            {safeScore.toFixed(1)}%
          </span>
        </div>

        <div className="result-card">
          <h4>Decisión Final</h4>
          <span className={viable ? 'positive' : 'negative'}>
            {viable ? 'APROBADO' : 'RECHAZADO'}
          </span>
        </div>
      </div>

      <div className={`feasibility-indicator ${color || 'red'}`}>
        <h4>PROYECTO {viable ? 'VIABLE' : 'NO VIABLE'}</h4>
        <p>Nivel de confianza: {level?.toUpperCase() || 'BAJO'}</p>
        {viable ? (
          <p>✅ El proyecto cumple con los criterios de factibilidad</p>
        ) : (
          <p>❌ El proyecto no cumple con los criterios mínimos</p>
        )}
      </div>
    </div>
  );
};