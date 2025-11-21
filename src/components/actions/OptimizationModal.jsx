// src/components/actions/OptimizationModal.jsx
import React, { useState } from 'react';
import '../../styles/OptimizationModal.css';

export const OptimizationModal = ({ 
  isOpen, 
  onClose, 
  recommendations, 
  onApply,
  currentScore,
  projectedScore 
}) => {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);

  if (!isOpen) return null;

  const toggleRecommendation = (index) => {
    setSelectedRecommendations(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleApplySelected = () => {
    const selectedRecs = recommendations.filter((_, index) => 
      selectedRecommendations.includes(index)
    );
    onApply(selectedRecs);
  };

  const handleApplyAll = () => {
    onApply(recommendations);
  };

  return (
    <div className="modal-overlay">
      <div className="optimization-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <h3>🎯 Recomendaciones de Optimización</h3>
            <div className="score-comparison">
              <span className="current-score">{currentScore}%</span>
              <span className="arrow">→</span>
              <span className="projected-score">{projectedScore}%</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="optimization-summary">
            <p>Hemos identificado {recommendations.length} oportunidades para mejorar la viabilidad de tu proyecto.</p>
          </div>

          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`recommendation-card ${selectedRecommendations.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleRecommendation(index)}
              >
                <div className="rec-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedRecommendations.includes(index)}
                    onChange={() => toggleRecommendation(index)}
                  />
                </div>
                <div className="rec-content">
                  <div className="rec-header">
                    <span className={`rec-area rec-area-${rec.area.toLowerCase()}`}>
                      {rec.area}
                    </span>
                    <span className="rec-priority">{rec.priority}</span>
                  </div>
                  <h4>{rec.title}</h4>
                  <p className="rec-description">{rec.description}</p>
                  <div className="rec-details">
                    <div className="rec-impact">
                      <span className="impact-icon">📈</span>
                      Impacto: {rec.impact}
                    </div>
                    <div className="rec-effort">
                      <span className="effort-icon">⏱️</span>
                      Esfuerzo: {rec.effort}
                    </div>
                  </div>
                  {rec.specifics && (
                    <div className="rec-specifics">
                      <strong>Acciones específicas:</strong>
                      <ul>
                        {rec.specifics.map((action, actionIndex) => (
                          <li key={actionIndex}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <div className="selection-info">
            {selectedRecommendations.length > 0 && (
              <span>{selectedRecommendations.length} recomendaciones seleccionadas</span>
            )}
          </div>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            {selectedRecommendations.length > 0 && (
              <button className="btn-primary" onClick={handleApplySelected}>
                ✅ Aplicar Seleccionadas
              </button>
            )}
            <button className="btn-primary" onClick={handleApplyAll}>
              🚀 Aplicar Todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};