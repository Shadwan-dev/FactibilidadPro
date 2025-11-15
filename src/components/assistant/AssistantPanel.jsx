// src/components/assistant/AssistantPanel.jsx
import React from 'react';
import '../../styles/AssistantPanel.css';

export const AssistantPanel = React.memo(({ 
  suggestions, 
  showAssistant, 
  onToggle, 
  onDismiss 
}) => {
  if (!showAssistant) {
    return (
      <div className="assistant-minimized">
        <button onClick={onToggle} className="assistant-toggle-btn">
          💡 Asistente ({suggestions.length})
        </button>
      </div>
    );
  }

  return (
    <div className="assistant-panel">
      <div className="assistant-panel__header">
        <div className="assistant-panel__title">
          <span className="assistant-panel__icon">🤖</span>
          <div>
            <h3>Asistente de Viabilidad</h3>
            <p>Recomendaciones basadas en tus datos</p>
          </div>
        </div>
        <button onClick={onToggle} className="assistant-panel__close-btn">
          ↓ Minimizar
        </button>
      </div>

      <div className="assistant-panel__content">
        {suggestions.length === 0 ? (
          <div className="assistant-panel__empty">
            <div className="assistant-panel__empty-icon">✅</div>
            <h4>¡Todo se ve bien!</h4>
            <p>Continúa completando los formularios y te avisaremos si detectamos oportunidades de mejora.</p>
          </div>
        ) : (
          <div className="assistant-panel__suggestions">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`assistant-suggestion assistant-suggestion--${suggestion.type}`}
              >
                <div className="assistant-suggestion__header">
                  <div className="assistant-suggestion__icon">
                    {suggestion.type === 'warning' && '⚠️'}
                    {suggestion.type === 'success' && '✅'}
                    {suggestion.type === 'info' && '💡'}
                  </div>
                  <div className="assistant-suggestion__title">
                    <h4>{suggestion.message}</h4>
                    <span className="assistant-suggestion__field">
                      {suggestion.field === 'marketSize' && 'Tamaño de Mercado'}
                      {suggestion.field === 'marketGrowth' && 'Crecimiento de Mercado'}
                      {suggestion.field === 'marketShare' && 'Participación de Mercado'}
                      {suggestion.field === 'investment' && 'Inversión'}
                      {suggestion.field === 'discountRate' && 'Tasa de Descuento'}
                      {suggestion.field === 'implementationTime' && 'Tiempo de Implementación'}
                      {suggestion.field === 'complexity' && 'Complejidad Técnica'}
                      {suggestion.field === 'legalRisks' && 'Riesgos Legales'}
                      {suggestion.field === 'processingTime' && 'Tiempo de Trámites'}
                      {suggestion.field === 'market' && 'Análisis de Mercado'}
                      {suggestion.field === 'financial' && 'Análisis Financiero'}
                      {suggestion.field === 'technical' && 'Análisis Técnico'}
                      {suggestion.field === 'legal' && 'Análisis Legal'}
                      {suggestion.field === 'overall' && 'Viabilidad General'}
                    </span>
                  </div>
                  <button 
                    onClick={() => onDismiss(index)}
                    className="assistant-suggestion__dismiss"
                  >
                    ✕
                  </button>
                </div>

                <div className="assistant-suggestion__body">
                  <p className="assistant-suggestion__description">
                    {suggestion.description}
                  </p>

                  {suggestion.benchmark && (
                    <div className="assistant-suggestion__benchmark">
                      <strong>Referencia del sector:</strong> {suggestion.benchmark}
                    </div>
                  )}

                  <div className="assistant-suggestion__actions">
                    <h5>💡 Sugerencias:</h5>
                    <ul>
                      {suggestion.suggestions.map((action, actionIndex) => (
                        <li key={actionIndex}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="assistant-panel__footer">
        <p>
          <small>
            💡 El asistente analiza tus datos en tiempo real y compara con benchmarks de la industria.
          </small>
        </p>
      </div>
    </div>
  );
});