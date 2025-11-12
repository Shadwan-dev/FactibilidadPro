// src/components/results/LegalResults.jsx
import React from 'react';

export const LegalResults = ({ calculations }) => {
  if (!calculations || !calculations.legal) {
    return (
      <div className="results-section">
        <h3>Factibilidad Legal</h3>
        <p>Complete los datos legales para ver los resultados</p>
      </div>
    );
  }

  const { score, viable, level } = calculations.legal;
  const safeScore = typeof score === 'number' ? score : 0;

  return (
    <div className="results-section">
      <h3>Factibilidad Legal</h3>
      
      <div className="results-grid">
        <div className="result-card">
          <h4>Puntuación Legal</h4>
          <span className={safeScore >= 80 ? 'positive' : 'negative'}>
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
        <h4>Estado Legal: {level?.toUpperCase() || 'BAJO'}</h4>
        <p>{safeScore >= 80 ? 'Cumplimiento normativo adecuado' : 'Se requieren trámites o revisiones'}</p>
      </div>
    </div>
  );
};

