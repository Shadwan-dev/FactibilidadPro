// src/components/forms/FinancialFormSelector.jsx (VERSIÓN CORREGIDA)
import React, { useState } from 'react';
import { FinancialDataForm } from './FinancialDataForm';
import { DetailedFinancialForm } from './DetailedFinancialForm';

export const FinancialFormSelector = React.memo(({ 
  data, 
  onChange, 
  calculations,
  onDetailedModeChange // ✅ AÑADIR esta prop
}) => {
  const [selectedMode, setSelectedMode] = useState(null);

  // Si ya hay datos, usar el modo que corresponda
  React.useEffect(() => {
    if (data.investment > 0 || data.operationalCosts > 0 || data.projectedRevenue > 0) {
      setSelectedMode('simple');
    }
  }, [data]);

  // ✅ Notificar cuando se entra en modo detallado
  React.useEffect(() => {
    if (selectedMode === 'detailed' && onDetailedModeChange) {
      onDetailedModeChange(true);
    } else if (selectedMode === 'simple' && onDetailedModeChange) {
      onDetailedModeChange(false);
    }
  }, [selectedMode, onDetailedModeChange]); // ✅ CORREGIDO: onDetailedModeChange está ahora en las props

  if (selectedMode === null) {
    return (
      <div className="financial-form-selector">
        <div className="financial-form-selector__header">
          <h3>💰 Selecciona cómo quieres ingresar los datos financieros</h3>
          <p>Elige el método que mejor se adapte a tu situación</p>
        </div>

        <div className="financial-form-selector__options">
          <div className="financial-form-selector__option">
            <div className="financial-form-selector__option-header">
              <h4>🚀 Modo Rápido</h4>
              <span className="financial-form-selector__badge">Recomendado si tienes experiencia</span>
            </div>
            <div className="financial-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>✅ Ya tienes los totales calculados</li>
                <li>✅ Eres experto en finanzas</li>
                <li>✅ Quieres resultados rápidos</li>
                <li>✅ Tienes un presupuesto definido</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('simple')}
                className="financial-form-selector__btn financial-form-selector__btn--primary"
              >
                Usar Modo Rápido
              </button>
            </div>
          </div>

          <div className="financial-form-selector__option">
            <div className="financial-form-selector__option-header">
              <h4>🎓 Modo Guiado</h4>
              <span className="financial-form-selector__badge">Perfecto para principiantes</span>
            </div>
            <div className="financial-form-selector__option-content">
              <p><strong>Ideal para:</strong></p>
              <ul>
                <li>📝 No tienes los totales calculados</li>
                <li>🎯 Estás empezando en finanzas</li>
                <li>🔍 Quieres calcular paso a paso</li>
                <li>💡 Necesitas guía y explicaciones</li>
              </ul>
              <button 
                onClick={() => setSelectedMode('detailed')}
                className="financial-form-selector__btn financial-form-selector__btn--secondary"
              >
                Usar Modo Guiado
              </button>
            </div>
          </div>
        </div>

        <div className="financial-form-selector__help">
          <h5>💡 ¿No estás seguro?</h5>
          <p>
            Si es tu primera vez o no tienes experiencia financiera, te recomendamos el 
            <strong> Modo Guiado</strong>. Te ayudaremos a calcular todo paso a paso con explicaciones claras.
          </p>
        </div>
      </div>
    );
  }

  // Renderizar el formulario seleccionado
  return (
    <div className="financial-form-container">
      <div className="financial-form-container__header">
        <button 
          onClick={() => setSelectedMode(null)}
          className="financial-form-container__back-btn"
        >
          ↩️ Cambiar Método
        </button>
        <span className="financial-form-container__mode">
          Modo: {selectedMode === 'simple' ? '🚀 Rápido' : '🎓 Guiado'}
        </span>
      </div>

      {selectedMode === 'simple' ? (
        <FinancialDataForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      ) : (
        <DetailedFinancialForm 
          data={data} 
          onChange={onChange} 
          calculations={calculations} 
        />
      )}
    </div>
  );
});