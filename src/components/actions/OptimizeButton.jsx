// src/components/actions/OptimizeButton.jsx (VERSIÓN MEJORADA)
import React, { useState } from 'react';
import '../../styles/OptimizeButton.css';

export const OptimizeButton = ({ onOptimize, calculations, formData, showDetails = false }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      await onOptimize();
    } finally {
      setIsOptimizing(false);
    }
  };

  // Análisis de áreas que necesitan optimización
  const getOptimizationAreas = () => {
    const areas = [];
    
    if (!calculations?.financial?.viable) areas.push('Financiera');
    if (!calculations?.technical?.viable) areas.push('Técnica');
    if (!calculations?.market?.viable) areas.push('Mercado');
    if (!calculations?.legal?.viable) areas.push('Legal');
    
    return areas;
  };

  const optimizationAreas = getOptimizationAreas();
  const canOptimize = optimizationAreas.length > 0;
  const overallScore = calculations?.overall?.score || 0;
  const projectedScore = Math.min(95, overallScore + 25); // Proyección realista

  return (
    <div className="optimize-section">
      <div className="optimize-header">
        <h4>⚡ Optimización Inteligente</h4>
        {showDetails && canOptimize && (
          <div className="optimization-badge">
            {optimizationAreas.length} área{optimizationAreas.length > 1 ? 's' : ''} por mejorar
          </div>
        )}
      </div>

      <button 
        className={`optimize-btn ${canOptimize ? 'can-optimize' : 'already-viable'}`}
        onClick={handleOptimize}
        disabled={!canOptimize || isOptimizing}
      >
        {isOptimizing ? (
          <>
            <span className="optimize-spinner">🔄</span>
            Analizando optimizaciones...
          </>
        ) : canOptimize ? (
          <>
            <span className="optimize-icon">🚀</span>
            Optimizar Proyecto
          </>
        ) : (
          <>
            <span className="success-icon">✅</span>
            Proyecto Óptimo
          </>
        )}
      </button>

      {showDetails && (
        <div className="optimization-details">
          {canOptimize ? (
            <>
              <p className="optimization-hint">
                Se detectaron oportunidades de mejora en:
              </p>
              
              <div className="areas-list">
                {optimizationAreas.map((area, index) => (
                  <span key={index} className="area-tag">
                    {area}
                  </span>
                ))}
              </div>

              <div className="score-improvement-card">
                <div className="score-comparison">
                  <span className="current-score">{overallScore}%</span>
                  <span className="arrow">→</span>
                  <span className="projected-score">{projectedScore}%</span>
                </div>
                <p className="improvement-text">
                  La optimización podría aumentar tu puntuación general
                </p>
              </div>

              <div className="optimization-benefit">
                <strong>💡 Beneficio esperado:</strong> Mejora significativa en la 
                viabilidad del proyecto y aumento en las probabilidades de éxito.
              </div>
            </>
          ) : (
            <div className="optimization-success">
              <strong>¡Excelente trabajo!</strong> Tu proyecto alcanza los estándares 
              óptimos de viabilidad en todas las áreas analizadas.
            </div>
          )}
        </div>
      )}
    </div>
  );
};