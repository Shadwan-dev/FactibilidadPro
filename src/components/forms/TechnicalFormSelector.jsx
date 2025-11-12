// src/components/forms/TechnicalFormSelector.jsx
import React, { useState } from 'react';
import { TechnicalDataForm } from './TechnicalDataForm';
import { DetailedTechnicalForm } from './DetailedTechnicalForm';
import '../../styles/TechnicalFormSelector.css';

export const TechnicalFormSelector = React.memo(({ 
  data, 
  onChange, 
  calculations,
  onDetailedModeChange 
}) => {
  const [selectedMode, setSelectedMode] = useState(null);

  // Si ya hay datos, usar el modo que corresponda
  React.useEffect(() => {
    if (data.teamCapacity > 0 || data.infrastructure > 0 || data.implementationTime > 0) {
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
      <div className="technical-form-selector">
        <div className="technical-form-selector__header">
          <h3>⚙️ Selecciona cómo quieres evaluar la viabilidad técnica</h3>
          <p>Elige el método que mejor se adapte a tu conocimiento técnico</p>
        </div>

        <div className="technical-form-selector__options">
          <div className="technical-form-selector__option">
            <div className="technical-form-selector__option-header">
              <h4>🚀 Modo Rápido</h4>
              <span className="technical-form-selector__badge">Para expertos técnicos</span>
            </div>
            <div className="technical-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>✅ Ya tienes el equipo definido</li>
                <li>✅ Conoces los requerimientos técnicos</li>
                <li>✅ Tienes experiencia en gestión de proyectos</li>
                <li>✅ Quieres evaluación rápida</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('simple')}
                className="technical-form-selector__btn technical-form-selector__btn--primary"
              >
                Usar Modo Rápido
              </button>
            </div>
          </div>

          <div className="technical-form-selector__option">
            <div className="technical-form-selector__option-header">
              <h4>🎓 Modo Guiado</h4>
              <span className="technical-form-selector__badge">Perfecto para no técnicos</span>
            </div>
            <div className="technical-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>📝 No tienes claro el equipo necesario</li>
                <li>🎯 Estás empezando en proyectos técnicos</li>
                <li>🔍 Quieres definir paso a paso</li>
                <li>💡 Necesitas guía en requerimientos</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('detailed')}
                className="technical-form-selector__btn technical-form-selector__btn--secondary"
              >
                Usar Modo Guiado
              </button>
            </div>
          </div>
        </div>

        <div className="technical-form-selector__help">
          <h5>💡 ¿No estás seguro?</h5>
          <p>
            Si no tienes experiencia técnica o no estás seguro de los requerimientos, 
            te recomendamos el <strong>Modo Guiado</strong>. Te ayudaremos a definir 
            equipo, infraestructura y requerimientos técnicos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="technical-form-container">
      <div className="technical-form-container__header">
        <button 
          onClick={() => setSelectedMode(null)}
          className="technical-form-container__back-btn"
        >
          ↩️ Cambiar Método
        </button>
        <span className="technical-form-container__mode">
          Modo: {selectedMode === 'simple' ? '🚀 Rápido' : '🎓 Guiado'}
        </span>
      </div>

      {selectedMode === 'simple' ? (
        <TechnicalDataForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      ) : (
        <DetailedTechnicalForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      )}
    </div>
  );
});