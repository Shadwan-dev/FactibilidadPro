// src/components/results/MarketResults.jsx
import React from 'react';

export const MarketResults = ({ calculations }) => {
  if (!calculations || !calculations.market) {
    return (
      <div className="results-section">
        <h3>Factibilidad de Mercado</h3>
        <p>Complete los datos de mercado para ver los resultados</p>
      </div>
    );
  }

  const { score, viable, level } = calculations.market;
  const safeScore = typeof score === 'number' ? score : 0;

  return (
    <div className="results-section">
      <h3>Factibilidad de Mercado</h3>
      
      <div className="results-grid">
        <div className="result-card">
          <h4>Puntuación de Mercado</h4>
          <span className={safeScore >= 65 ? 'positive' : 'negative'}>
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
        <h4>Potencial de Mercado: {level?.toUpperCase() || 'BAJO'}</h4>
        <p>{safeScore >= 65 ? 'Mercado atractivo' : 'Mercado limitado o competitivo'}</p>
      </div>
    </div>
  );
};