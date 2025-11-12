// src/components/forms/MarketDataForm.jsx (ACTUALIZADO)
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
    <div className="form-section market-form">
      <div className="market-form__header">
        <h3>📈 Factibilidad de Mercado</h3>
        {hasValidData && (
          <button 
            onClick={() => setShowResults(!showResults)}
            className="market-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Análisis' : '🔍 Ver Análisis'}
          </button>
        )}
      </div>
      
      <div className="market-form__inputs">
        <div className="market-form__input-group">
          <label>Tamaño del Mercado (en unidades):</label>
          <input
            type="number"
            value={localData.marketSize || ''}
            onChange={(e) => handleInputChange('marketSize', e.target.value)}
            placeholder="Ej: 10000"
          />
          <small>Unidades totales en el mercado anual</small>
        </div>

        <div className="market-form__input-group">
          <label>Crecimiento Anual del Mercado (%):</label>
          <input
            type="number"
            step="0.1"
            value={localData.marketGrowth || ''}
            onChange={(e) => handleInputChange('marketGrowth', e.target.value)}
            placeholder="Ej: 8.5"
          />
          <small>Tasa de crecimiento anual esperada</small>
        </div>

        <div className="market-form__input-group">
          <label>Participación de Mercado Esperada (%):</label>
          <input
            type="number"
            step="0.1"
            value={localData.marketShare || ''}
            onChange={(e) => handleInputChange('marketShare', e.target.value)}
            placeholder="Ej: 15.0"
          />
          <small>Porcentaje del mercado que esperas capturar</small>
        </div>

        <div className="market-form__input-group">
          <label>Número de Competidores Directos:</label>
          <input
            type="number"
            value={localData.competitors || ''}
            onChange={(e) => handleInputChange('competitors', e.target.value)}
            placeholder="Ej: 5"
          />
          <small>Competidores principales en el mercado</small>
        </div>

        <div className="market-form__input-group">
          <label>Precio Promedio del Producto/Servicio ($):</label>
          <input
            type="number"
            value={localData.averagePrice || ''}
            onChange={(e) => handleInputChange('averagePrice', e.target.value)}
            placeholder="Ej: 99.99"
          />
          <small>Precio promedio de venta</small>
        </div>

        <div className="market-form__input-group">
          <label>Estacionalidad (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={localData.seasonality || ''}
            onChange={(e) => handleInputChange('seasonality', e.target.value)}
            placeholder="1-10"
          />
          <small>1 = Estable, 10 = Muy estacional</small>
        </div>
      </div>

      {/* Resultados en Tiempo Real */}
      {showResults && calculations && (
        <div className="market-form__results">
          <h4>🎯 Análisis de Mercado</h4>
          
          {/* Puntuación General */}
          <div className="market-form__score-section">
            <div className="market-form__score-card">
              <div className="market-form__score-header">
                <span>Puntuación de Mercado</span>
                <span className={`market-form__score-badge ${calculations.market?.viable ? 'market-form__score-viable' : 'market-form__score-not-viable'}`}>
                  {calculations.market?.viable ? 'VIABLE' : 'NO VIABLE'}
                </span>
              </div>
              <div className="market-form__score-value">
                {calculations.market?.score || 0}/100
              </div>
              <div className="market-form__score-level">
                Nivel: {calculations.market?.level || 'Bajo'}
              </div>
            </div>
          </div>

          {/* Métricas del Mercado */}
          <div className="market-form__metrics">
            <h5>📊 Métricas del Mercado</h5>
            <div className="market-form__metrics-grid">
              <div className="market-form__metric-item">
                <span className="market-form__metric-label">Valor Total del Mercado:</span>
                <span className="market-form__metric-value">
                  ${marketMetrics.marketValue.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                <small>Potencial total del mercado</small>
              </div>

              <div className="market-form__metric-item">
                <span className="market-form__metric-label">Ingresos Potenciales:</span>
                <span className="market-form__metric-value">
                  ${marketMetrics.potentialRevenue.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                <small>Basado en participación esperada</small>
              </div>

              <div className="market-form__metric-item">
                <span className="market-form__metric-label">Intensidad Competitiva:</span>
                <span className={`market-form__metric-value ${marketMetrics.competitionIntensity === 'Baja' ? 'market-form__metric-positive' : marketMetrics.competitionIntensity === 'Media' ? 'market-form__metric-warning' : 'market-form__metric-danger'}`}>
                  {marketMetrics.competitionIntensity}
                </span>
                <small>Nivel de competencia</small>
              </div>

              <div className="market-form__metric-item">
                <span className="market-form__metric-label">Crecimiento del Mercado:</span>
                <span className={`market-form__metric-value ${localData.marketGrowth > 8 ? 'market-form__metric-positive' : localData.marketGrowth > 5 ? 'market-form__metric-warning' : 'market-form__metric-danger'}`}>
                  {localData.marketGrowth || 0}%
                </span>
                <small>Tasa de crecimiento anual</small>
              </div>
            </div>
          </div>

          {/* Análisis de Oportunidad */}
          <div className="market-form__opportunity">
            <h5>💼 Análisis de Oportunidad</h5>
            <div className="market-form__opportunity-grid">
              <div className="market-form__opportunity-item">
                <span>Tamaño de Mercado:</span>
                <strong className={localData.marketSize > 5000 ? 'market-form__status-good' : localData.marketSize > 1000 ? 'market-form__status-fair' : 'market-form__status-poor'}>
                  {localData.marketSize > 5000 ? 'Grande' : localData.marketSize > 1000 ? 'Mediano' : 'Pequeño'}
                </strong>
              </div>
              
              <div className="market-form__opportunity-item">
                <span>Participación Objetivo:</span>
                <strong className={localData.marketShare > 20 ? 'market-form__status-good' : localData.marketShare > 10 ? 'market-form__status-fair' : 'market-form__status-poor'}>
                  {localData.marketShare || 0}%
                </strong>
              </div>
              
              <div className="market-form__opportunity-item">
                <span>Estacionalidad:</span>
                <strong className={localData.seasonality <= 3 ? 'market-form__status-good' : localData.seasonality <= 6 ? 'market-form__status-fair' : 'market-form__status-poor'}>
                  {localData.seasonality <= 3 ? 'Estable' : localData.seasonality <= 6 ? 'Moderada' : 'Alta'}
                </strong>
              </div>
              
              <div className="market-form__opportunity-item">
                <span>Competencia:</span>
                <strong className={localData.competitors <= 3 ? 'market-form__status-good' : localData.competitors <= 7 ? 'market-form__status-fair' : 'market-form__status-poor'}>
                  {localData.competitors || 0} competidores
                </strong>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {calculations.suggestions && calculations.suggestions.filter(s => s.campo === 'market').length > 0 && (
            <div className="market-form__recommendations">
              <h5>💡 Recomendaciones de Mercado</h5>
              {calculations.suggestions
                .filter(suggestion => suggestion.campo === 'market')
                .map((suggestion, index) => (
                  <div key={index} className="market-form__recommendation">
                    <p className="market-form__recommendation-title">{suggestion.mensaje}</p>
                    <ul className="market-form__recommendation-list">
                      {suggestion.sugerencias.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          )}

          {/* Potencial de Crecimiento */}
          <div className="market-form__growth-potential">
            <h5>📈 Potencial de Crecimiento</h5>
            <div className="market-form__growth-indicators">
              <div className="market-form__growth-item">
                <span>Mercado en Crecimiento:</span>
                <div className={localData.marketGrowth > 10 ? 'market-form__growth-high' : localData.marketGrowth > 5 ? 'market-form__growth-medium' : 'market-form__growth-low'}>
                  {localData.marketGrowth > 10 ? 'Alto' : localData.marketGrowth > 5 ? 'Moderado' : 'Bajo'}
                </div>
              </div>
              
              <div className="market-form__growth-item">
                <span>Oportunidad de Penetración:</span>
                <div className={localData.competitors <= 3 ? 'market-form__growth-high' : localData.competitors <= 7 ? 'market-form__growth-medium' : 'market-form__growth-low'}>
                  {localData.competitors <= 3 ? 'Alta' : localData.competitors <= 7 ? 'Media' : 'Baja'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de Estado */}
      {!hasValidData && (
        <div className="market-form__data-required">
          <p>📈 Completa los datos de mercado para ver el análisis</p>
        </div>
      )}
    </div>
  );
});