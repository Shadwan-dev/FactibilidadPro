// src/components/forms/MarketFormSelector.jsx
import React, { useState } from 'react';
import { MarketDataForm } from './MarketDataForm';
import { DetailedMarketForm } from './DetailedMarketForm'; 
import '../../styles/MarketFormSelector.css';

export const MarketFormSelector = React.memo(({ 
  data, 
  onChange, 
  calculations,
  onDetailedModeChange 
}) => {
  const [selectedMode, setSelectedMode] = useState(null);

  // Si ya hay datos, usar el modo que corresponda
  React.useEffect(() => {
    if (data.marketSize > 0 || data.marketGrowth > 0 || data.competitors > 0) {
      setSelectedMode('simple');
    }
  }, [data]);

  // Notificar cuando se entra en modo detallado
  React.useEffect(() => {
    if (selectedMode === 'detailed' && onDetailedModeChange) {
      onDetailedModeChange(true);
    } else if (selectedMode === 'simple' && onDetailedModeChange) {
      onDetailedModeChange(false);
    }
  }, [selectedMode, onDetailedModeChange]);

  if (selectedMode === null) {
    return (
      <div className="market-form-selector">
        <div className="market-form-selector__header">
          <h3>📈 Selecciona cómo quieres evaluar el mercado</h3>
          <p>Elige el método que mejor se adapte a tu conocimiento del mercado</p>
        </div>

        <div className="market-form-selector__options">
          <div className="market-form-selector__option">
            <div className="market-form-selector__option-header">
              <h4>🚀 Modo Rápido</h4>
              <span className="market-form-selector__badge">Para expertos en mercado</span>
            </div>
            <div className="market-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>✅ Ya tienes estudios de mercado</li>
                <li>✅ Conoces la competencia</li>
                <li>✅ Tienes datos del tamaño del mercado</li>
                <li>✅ Quieres evaluación rápida</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('simple')}
                className="market-form-selector__btn market-form-selector__btn--primary"
              >
                Usar Modo Rápido
              </button>
            </div>
          </div>

          <div className="market-form-selector__option">
            <div className="market-form-selector__option-header">
              <h4>🎓 Modo Guiado</h4>
              <span className="market-form-selector__badge">Perfecto para emprendedores</span>
            </div>
            <div className="market-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>📝 No tienes estudios de mercado</li>
                <li>🎯 Estás validando una idea de negocio</li>
                <li>🔍 Quieres definir tu mercado paso a paso</li>
                <li>💡 Necesitas ayuda para identificar competencia</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('detailed')}
                className="market-form-selector__btn market-form-selector__btn--secondary"
              >
                Usar Modo Guiado
              </button>
            </div>
          </div>
        </div>

        <div className="market-form-selector__help">
          <h5>💡 ¿No estás seguro?</h5>
          <p>
            Si es tu primer emprendimiento o no tienes datos de mercado claros, 
            te recomendamos el <strong>Modo Guiado</strong>. Te ayudaremos a definir 
            tu mercado objetivo, competencia y potencial de crecimiento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="market-form-container">
      <div className="market-form-container__header">
        <button 
          onClick={() => setSelectedMode(null)}
          className="market-form-container__back-btn"
        >
          ↩️ Cambiar Método
        </button>
        <span className="market-form-container__mode">
          Modo: {selectedMode === 'simple' ? '🚀 Rápido' : '🎓 Guiado'}
        </span>
      </div>

      {selectedMode === 'simple' ? (
        <MarketDataForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      ) : (
        <DetailedMarketForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      )}
    </div>
  );
});