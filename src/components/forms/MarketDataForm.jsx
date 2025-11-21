// src/components/forms/MarketDataForm.jsx (UNIFICADO)
import React, { useState, useCallback } from 'react';

export const MarketDataForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState(data);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;
    const newData = { 
      ...localData, 
      [field]: numericValue 
    };
    setLocalData(newData);
    onChange('market', newData);
  }, [localData, onChange]);

  // Sincronizar cuando los props cambian externamente
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Verificar si hay datos suficientes para mostrar resultados
  const hasValidData = localData.marketSize > 0 && localData.marketGrowth !== undefined;

  // Calcular métricas de mercado adicionales
  const calculateMarketMetrics = () => {
    const marketValue = localData.marketSize * (localData.averagePrice || 1);
    const potentialRevenue = marketValue * ((localData.marketShare || 0) / 100);
    const competitionIntensity = localData.competitors > 10 ? 'Alta' : localData.competitors > 5 ? 'Media' : 'Baja';
    
    return {
      marketValue,
      potentialRevenue,
      competitionIntensity
    };
  };

  const marketMetrics = calculateMarketMetrics();

  return (
    <div className="form-container market-form">
      <div className="form-header">
        <h3 className="form-title">Factibilidad de Mercado</h3>
        {hasValidData && (
          <button 
            onClick={() => setShowResults(!showResults)}
            className="btn btn--secondary btn--sm"
          >
            {showResults ? '📊 Ocultar Análisis' : '🔍 Ver Análisis'}
          </button>
        )}
      </div>
      
      <div className="form-grid">
        <div className="input-group">
          <label className="input-label">Tamaño del Mercado (en unidades)</label>
          <input
            className="input-field"
            type="number"
            value={localData.marketSize || ''}
            onChange={(e) => handleInputChange('marketSize', e.target.value)}
            placeholder="Ej: 10000"
          />
          <small className="input-help">Unidades totales en el mercado anual</small>
        </div>

        <div className="input-group">
          <label className="input-label">Crecimiento Anual del Mercado (%)</label>
          <input
            className="input-field"
            type="number"
            step="0.1"
            value={localData.marketGrowth || ''}
            onChange={(e) => handleInputChange('marketGrowth', e.target.value)}
            placeholder="Ej: 8.5"
          />
          <small className="input-help">Tasa de crecimiento anual esperada</small>
        </div>

        <div className="input-group">
          <label className="input-label">Participación de Mercado Esperada (%)</label>
          <input
            className="input-field"
            type="number"
            step="0.1"
            value={localData.marketShare || ''}
            onChange={(e) => handleInputChange('marketShare', e.target.value)}
            placeholder="Ej: 15.0"
          />
          <small className="input-help">Porcentaje del mercado que esperas capturar</small>
        </div>

        <div className="input-group">
          <label className="input-label">Número de Competidores Directos</label>
          <input
            className="input-field"
            type="number"
            value={localData.competitors || ''}
            onChange={(e) => handleInputChange('competitors', e.target.value)}
            placeholder="Ej: 5"
          />
          <small className="input-help">Competidores principales en el mercado</small>
        </div>

        <div className="input-group">
          <label className="input-label">Precio Promedio del Producto/Servicio ($)</label>
          <input
            className="input-field"
            type="number"
            value={localData.averagePrice || ''}
            onChange={(e) => handleInputChange('averagePrice', e.target.value)}
            placeholder="Ej: 99.99"
          />
          <small className="input-help">Precio promedio de venta</small>
        </div>

        <div className="input-group">
          <label className="input-label">Estacionalidad (1-10)</label>
          <input
            className="input-field"
            type="number"
            min="1"
            max="10"
            value={localData.seasonality || ''}
            onChange={(e) => handleInputChange('seasonality', e.target.value)}
            placeholder="1-10"
          />
          <small className="input-help">1 = Estable, 10 = Muy estacional</small>
        </div>
      </div>

      {/* Resultados en Tiempo Real */}
      {showResults && calculations && (
        <div className="form-results">
          <h4 className="results-title">🎯 Análisis de Mercado</h4>
          
          {/* Puntuación General */}
          <div className="score-section">
            <div className="score-card">
              <div className="score-header">
                <span className="score-label">Puntuación de Mercado</span>
                <span className={`result-badge ${calculations.market?.viable ? 'badge--success' : 'badge--danger'}`}>
                  {calculations.market?.viable ? '✅ VIABLE' : '❌ NO VIABLE'}
                </span>
              </div>
              <div className={`score-value ${calculations.market?.viable ? 'value--positive' : 'value--negative'}`}>
                {calculations.market?.score || 0}/100
              </div>
              <div className="score-level">
                Nivel: <strong>{calculations.market?.level || 'Bajo'}</strong>
              </div>
            </div>
          </div>

          {/* Métricas del Mercado */}
          <div className="metrics-section">
            <h5 className="section-subtitle">📊 Métricas del Mercado</h5>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-header">
                  <span className="result-label">Valor Total del Mercado</span>
                  <span className="result-badge badge--info">
                    💰 Total
                  </span>
                </div>
                <div className="result-value">
                  ${marketMetrics.marketValue.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className="result-help">Potencial total del mercado</div>
              </div>

              <div className="result-card">
                <div className="result-header">
                  <span className="result-label">Ingresos Potenciales</span>
                  <span className={`result-badge ${
                    marketMetrics.potentialRevenue > marketMetrics.marketValue * 0.1 ? 'badge--success' : 
                    marketMetrics.potentialRevenue > marketMetrics.marketValue * 0.05 ? 'badge--warning' : 'badge--danger'
                  }`}>
                    {marketMetrics.potentialRevenue > marketMetrics.marketValue * 0.1 ? '🎯 Alto' : 
                     marketMetrics.potentialRevenue > marketMetrics.marketValue * 0.05 ? '📈 Medio' : '📉 Bajo'}
                  </span>
                </div>
                <div className={`result-value ${
                  marketMetrics.potentialRevenue > marketMetrics.marketValue * 0.1 ? 'value--positive' : 
                  marketMetrics.potentialRevenue > marketMetrics.marketValue * 0.05 ? 'value--warning' : 'value--negative'
                }`}>
                  ${marketMetrics.potentialRevenue.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className="result-help">Basado en participación esperada</div>
              </div>

              <div className="result-card">
                <div className="result-header">
                  <span className="result-label">Intensidad Competitiva</span>
                  <span className={`result-badge ${
                    marketMetrics.competitionIntensity === 'Baja' ? 'badge--success' : 
                    marketMetrics.competitionIntensity === 'Media' ? 'badge--warning' : 'badge--danger'
                  }`}>
                    {marketMetrics.competitionIntensity === 'Baja' ? '✅ Baja' : 
                     marketMetrics.competitionIntensity === 'Media' ? '⚠️ Media' : '❌ Alta'}
                  </span>
                </div>
                <div className={`result-value ${
                  marketMetrics.competitionIntensity === 'Baja' ? 'value--positive' : 
                  marketMetrics.competitionIntensity === 'Media' ? 'value--warning' : 'value--negative'
                }`}>
                  {marketMetrics.competitionIntensity}
                </div>
                <div className="result-help">Nivel de competencia</div>
              </div>

              <div className="result-card">
                <div className="result-header">
                  <span className="result-label">Crecimiento del Mercado</span>
                  <span className={`result-badge ${
                    localData.marketGrowth > 8 ? 'badge--success' : 
                    localData.marketGrowth > 5 ? 'badge--warning' : 'badge--danger'
                  }`}>
                    {localData.marketGrowth > 8 ? '🚀 Alto' : 
                     localData.marketGrowth > 5 ? '📈 Medio' : '📉 Bajo'}
                  </span>
                </div>
                <div className={`result-value ${
                  localData.marketGrowth > 8 ? 'value--positive' : 
                  localData.marketGrowth > 5 ? 'value--warning' : 'value--negative'
                }`}>
                  {localData.marketGrowth || 0}%
                </div>
                <div className="result-help">Tasa de crecimiento anual</div>
              </div>
            </div>
          </div>

          {/* Análisis de Oportunidad */}
          <div className="analysis-section">
            <h5 className="section-subtitle">💼 Análisis de Oportunidad</h5>
            <div className="analysis-grid">
              <div className="analysis-item">
                <div className="analysis-label">Tamaño de Mercado</div>
                <div className={`analysis-value ${
                  localData.marketSize > 5000 ? 'value--positive' : 
                  localData.marketSize > 1000 ? 'value--warning' : 'value--negative'
                }`}>
                  {localData.marketSize > 5000 ? 'Grande' : 
                   localData.marketSize > 1000 ? 'Mediano' : 'Pequeño'}
                </div>
                <div className="analysis-help">
                  {localData.marketSize > 5000 ? 'Mercado extenso' : 
                   localData.marketSize > 1000 ? 'Mercado moderado' : 'Mercado limitado'}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-label">Participación Objetivo</div>
                <div className={`analysis-value ${
                  localData.marketShare > 20 ? 'value--positive' : 
                  localData.marketShare > 10 ? 'value--warning' : 'value--negative'
                }`}>
                  {localData.marketShare || 0}%
                </div>
                <div className="analysis-help">
                  {localData.marketShare > 20 ? 'Alta participación' : 
                   localData.marketShare > 10 ? 'Participación media' : 'Baja participación'}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-label">Estacionalidad</div>
                <div className={`analysis-value ${
                  localData.seasonality <= 3 ? 'value--positive' : 
                  localData.seasonality <= 6 ? 'value--warning' : 'value--negative'
                }`}>
                  {localData.seasonality <= 3 ? 'Estable' : 
                   localData.seasonality <= 6 ? 'Moderada' : 'Alta'}
                </div>
                <div className="analysis-help">
                  {localData.seasonality <= 3 ? 'Demanda constante' : 
                   localData.seasonality <= 6 ? 'Variación moderada' : 'Alta variación estacional'}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-label">Competencia</div>
                <div className={`analysis-value ${
                  localData.competitors <= 3 ? 'value--positive' : 
                  localData.competitors <= 7 ? 'value--warning' : 'value--negative'
                }`}>
                  {localData.competitors || 0} competidores
                </div>
                <div className="analysis-help">
                  {localData.competitors <= 3 ? 'Baja competencia' : 
                   localData.competitors <= 7 ? 'Competencia media' : 'Alta competencia'}
                </div>
              </div>
            </div>
          </div>

          {/* Potencial de Crecimiento */}
          <div className="growth-section">
            <h5 className="section-subtitle">📈 Potencial de Crecimiento</h5>
            <div className="growth-grid">
              <div className="growth-item">
                <div className="growth-label">Mercado en Crecimiento</div>
                <div className={`growth-indicator ${
                  localData.marketGrowth > 10 ? 'growth-high' : 
                  localData.marketGrowth > 5 ? 'growth-medium' : 'growth-low'
                }`}>
                  {localData.marketGrowth > 10 ? 'Alto' : 
                   localData.marketGrowth > 5 ? 'Moderado' : 'Bajo'}
                </div>
                <div className="growth-description">
                  {localData.marketGrowth > 10 ? 'Crecimiento acelerado' : 
                   localData.marketGrowth > 5 ? 'Crecimiento estable' : 'Crecimiento limitado'}
                </div>
              </div>
              
              <div className="growth-item">
                <div className="growth-label">Oportunidad de Penetración</div>
                <div className={`growth-indicator ${
                  localData.competitors <= 3 ? 'growth-high' : 
                  localData.competitors <= 7 ? 'growth-medium' : 'growth-low'
                }`}>
                  {localData.competitors <= 3 ? 'Alta' : 
                   localData.competitors <= 7 ? 'Media' : 'Baja'}
                </div>
                <div className="growth-description">
                  {localData.competitors <= 3 ? 'Mercado con espacio' : 
                   localData.competitors <= 7 ? 'Competencia manejable' : 'Mercado saturado'}
                </div>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {calculations.suggestions && calculations.suggestions.filter(s => s.campo === 'market').length > 0 && (
            <div className="recommendations-section">
              <h5 className="section-subtitle">💡 Recomendaciones de Mercado</h5>
              {calculations.suggestions
                .filter(suggestion => suggestion.campo === 'market')
                .map((suggestion, index) => (
                  <div key={index} className="recommendation-card">
                    <p className="recommendation-title">{suggestion.mensaje}</p>
                    <ul className="recommendation-list">
                      {suggestion.sugerencias.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* Indicador de Estado */}
      {!hasValidData && (
        <div className="form-message form-message--info">
          <p>📈 Completa los datos de mercado para ver el análisis</p>
        </div>
      )}
    </div>
  );
});