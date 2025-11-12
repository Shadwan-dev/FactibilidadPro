// src/components/forms/FinancialDataForm.jsx (CON CLASES ESPECÍFICAS)
import React, { useState, useCallback } from 'react';

export const FinancialDataForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState(data);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;
    
    const newData = {
      ...localData,
      [field]: numericValue
    };
    
    setLocalData(newData);
    onChange('financial', newData);
  }, [localData, onChange]);

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const hasValidData = localData.investment > 0 && localData.projectedRevenue > 0;

  return (
    <div className="form-section financial-form">
      <div className="financial-form__header">
        <h3>💰 Datos Financieros</h3>
        {hasValidData && (
          <button 
            onClick={() => setShowResults(!showResults)}
            className="financial-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Resultados' : '📈 Ver Resultados'}
          </button>
        )}
      </div>
      
      <div className="financial-form__inputs">
        <div className="financial-form__input-group">
          <label>Inversión Inicial ($)</label>
          <input
            type="number"
            value={localData.investment || ''}
            onChange={(e) => handleInputChange('investment', e.target.value)}
            placeholder="Ej: 100000"
          />
          <small>Costo total inicial del proyecto</small>
        </div>

        <div className="financial-form__input-group">
          <label>Costos Operativos Anuales ($)</label>
          <input
            type="number"
            value={localData.operationalCosts || ''}
            onChange={(e) => handleInputChange('operationalCosts', e.target.value)}
            placeholder="Ej: 50000"
          />
          <small>Gastos anuales de operación</small>
        </div>

        <div className="financial-form__input-group">
          <label>Ingresos Proyectados Anuales ($)</label>
          <input
            type="number"
            value={localData.projectedRevenue || ''}
            onChange={(e) => handleInputChange('projectedRevenue', e.target.value)}
            placeholder="Ej: 150000"
          />
          <small>Ventas o ingresos anuales esperados</small>
        </div>

        <div className="financial-form__input-group">
          <label>Tasa de Descuento (%)</label>
          <input
            type="number"
            step="0.1"
            value={localData.discountRate || ''}
            onChange={(e) => handleInputChange('discountRate', e.target.value)}
            placeholder="Ej: 10"
          />
          <small>Tasa de rendimiento requerida</small>
        </div>

        <div className="financial-form__input-group">
          <label>Período de Análisis (años)</label>
          <input
            type="number"
            value={localData.period || ''}
            onChange={(e) => handleInputChange('period', e.target.value)}
            placeholder="Ej: 5"
          />
          <small>Duración del análisis</small>
        </div>
      </div>

      {/* Resultados en Tiempo Real */}
      {showResults && calculations && (
        <div className="financial-form__results">
          <h4>📊 Resultados Financieros</h4>
          <div className="financial-form__results-grid">
            <div className="financial-form__result-item">
              <span className="financial-form__result-label">VAN (Valor Actual Neto):</span>
              <span className={`financial-form__result-value ${calculations.financial?.npv > 0 ? 'financial-form__result-positive' : 'financial-form__result-negative'}`}>
                ${calculations.financial?.npv?.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) || '0'}
              </span>
              <small>{calculations.financial?.npv > 0 ? '✅ Proyecto viable' : '❌ No viable'}</small>
            </div>

            <div className="financial-form__result-item">
              <span className="financial-form__result-label">TIR (Tasa Interna de Retorno):</span>
              <span className={`financial-form__result-value ${calculations.financial?.irr > 0.08 ? 'financial-form__result-positive' : 'financial-form__result-negative'}`}>
                {calculations.financial?.irr ? (calculations.financial.irr * 100).toFixed(2) : '0'}%
              </span>
              <small>Mínimo requerido: 8%</small>
            </div>

            <div className="financial-form__result-item">
              <span className="financial-form__result-label">Período de Recuperación:</span>
              <span className="financial-form__result-value">
                {calculations.financial?.payback?.toFixed(1) || '0'} años
              </span>
              <small>Tiempo para recuperar inversión</small>
            </div>

            <div className="financial-form__result-item">
              <span className="financial-form__result-label">Flujo de Caja Anual:</span>
              <span className={`financial-form__result-value ${calculations.financial?.annualCashFlow > 0 ? 'financial-form__result-positive' : 'financial-form__result-negative'}`}>
                ${calculations.financial?.annualCashFlow?.toLocaleString() || '0'}
              </span>
              <small>Ingresos - Costos operativos</small>
            </div>
          </div>

          {/* Análisis de Rentabilidad */}
          <div className="financial-form__profitability">
            <h5>📈 Análisis de Rentabilidad</h5>
            <div className="financial-form__analysis-grid">
              <div className="financial-form__analysis-item">
                <span>Margen Neto:</span>
                <strong>
                  {localData.projectedRevenue > 0 
                    ? ((calculations.financial?.annualCashFlow / localData.projectedRevenue) * 100).toFixed(1) 
                    : '0'
                  }%
                </strong>
              </div>
              <div className="financial-form__analysis-item">
                <span>ROI Anual:</span>
                <strong>
                  {localData.investment > 0 
                    ? ((calculations.financial?.annualCashFlow / localData.investment) * 100).toFixed(1) 
                    : '0'
                  }%
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de Estado */}
      {!hasValidData && (
        <div className="financial-form__data-required">
          <p>💡 Completa los datos básicos para ver los resultados financieros</p>
        </div>
      )}
    </div>
  );
});