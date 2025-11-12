// src/components/forms/LegalFormSelector.jsx
import React, { useState } from 'react';
import { LegalDataForm } from './LegalDataForm';
import { DetailedLegalForm } from './DetailedLegalForm';

export const LegalFormSelector = React.memo(({ 
  data, 
  onChange, 
  calculations,
  onDetailedModeChange 
}) => {
  const [selectedMode, setSelectedMode] = useState(null);

  // Si ya hay datos, usar el modo que corresponda
  React.useEffect(() => {
    if (data.permits !== undefined || data.legalRisks > 0 || data.processingTime > 0) {
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
      <div className="legal-form-selector">
        <div className="legal-form-selector__header">
          <h3>⚖️ Selecciona cómo quieres evaluar la viabilidad legal</h3>
          <p>Elige el método que mejor se adapte a tu conocimiento legal</p>
        </div>

        <div className="legal-form-selector__options">
          <div className="legal-form-selector__option">
            <div className="legal-form-selector__option-header">
              <h4>🚀 Modo Rápido</h4>
              <span className="legal-form-selector__badge">Para expertos legales</span>
            </div>
            <div className="legal-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>✅ Ya tienes asesoría legal</li>
                <li>✅ Conoces los requisitos normativos</li>
                <li>✅ Tienes experiencia en trámites</li>
                <li>✅ Quieres evaluación rápida</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('simple')}
                className="legal-form-selector__btn legal-form-selector__btn--primary"
              >
                Usar Modo Rápido
              </button>
            </div>
          </div>

          <div className="legal-form-selector__option">
            <div className="legal-form-selector__option-header">
              <h4>🎓 Modo Guiado</h4>
              <span className="legal-form-selector__badge">Perfecto para emprendedores</span>
            </div>
            <div className="legal-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>📝 No tienes asesoría legal</li>
                <li>🎯 Estás empezando tu proyecto</li>
                <li>🔍 Quieres identificar requisitos legales</li>
                <li>💡 Necesitas ayuda con trámites</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('detailed')}
                className="legal-form-selector__btn legal-form-selector__btn--secondary"
              >
                Usar Modo Guiado
              </button>
            </div>
          </div>
        </div>

        <div className="legal-form-selector__help">
          <h5>💡 ¿No estás seguro?</h5>
          <p>
            Si es tu primer emprendimiento o no tienes claros los requisitos legales, 
            te recomendamos el <strong>Modo Guiado</strong>. Te ayudaremos a identificar 
            permisos, riesgos legales y requisitos normativos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-form-container">
      <div className="legal-form-container__header">
        <button 
          onClick={() => setSelectedMode(null)}
          className="legal-form-container__back-btn"
        >
          ↩️ Cambiar Método
        </button>
        <span className="legal-form-container__mode">
          Modo: {selectedMode === 'simple' ? '🚀 Rápido' : '🎓 Guiado'}
        </span>
      </div>

      {selectedMode === 'simple' ? (
        <LegalDataForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      ) : (
        <DetailedLegalForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      )}
    </div>
  );
});