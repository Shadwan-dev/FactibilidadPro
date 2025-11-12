// src/components/forms/DetailedMarketForm.jsx
import React, { useState, useCallback } from 'react';
import '../../styles/DetailedMarketForm.css'

export const DetailedMarketForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState({
    marketSize: data.marketSize || 0,
    marketGrowth: data.marketGrowth || 0,
    marketShare: data.marketShare || 0,
    competitors: data.competitors || 0,
    averagePrice: data.averagePrice || 0,
    seasonality: data.seasonality || 0
  });
  
  const [showResults, setShowResults] = useState(false);
  const [targetSegments, setTargetSegments] = useState([]);
  const [competitorList, setCompetitorList] = useState([]);
  const [marketResearch, setMarketResearch] = useState([]);
  const [newSegment, setNewSegment] = useState({ name: '', size: '', growth: '' });
  const [newCompetitor, setNewCompetitor] = useState({ name: '', strength: '', marketShare: '' });
  const [newResearch, setNewResearch] = useState({ source: '', finding: '', impact: '' });

  // ✅ SOLO campos básicos afectan el estado global
  const handleBasicInputChange = useCallback((field, value) => {
    const numericValue = typeof value === 'number' ? value : (value === '' ? 0 : parseFloat(value) || 0);
    
    const newLocalData = {
      ...localData,
      [field]: numericValue
    };
    
    setLocalData(newLocalData);
    
    // ✅ DEBOUNCE: Esperar antes de actualizar el estado global
    setTimeout(() => {
      onChange('market', newLocalData);
    }, 1000);
  }, [localData, onChange]);

  // ✅ Manejar segmentos de mercado - SOLO estado local
  const addTargetSegment = (e) => {
    e.preventDefault();
    if (newSegment.name && newSegment.size) {
      setTargetSegments(prev => [...prev, { 
        ...newSegment,
        id: Date.now(),
        size: parseFloat(newSegment.size),
        growth: parseFloat(newSegment.growth) || 0
      }]);
      setNewSegment({ name: '', size: '', growth: '' });
    }
  };

  const removeTargetSegment = (id) => {
    setTargetSegments(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Manejar competidores - SOLO estado local
  const addCompetitor = (e) => {
    e.preventDefault();
    if (newCompetitor.name) {
      setCompetitorList(prev => [...prev, {
        ...newCompetitor,
        id: Date.now(),
        marketShare: parseFloat(newCompetitor.marketShare) || 0
      }]);
      setNewCompetitor({ name: '', strength: '', marketShare: '' });
    }
  };

  const removeCompetitor = (id) => {
    setCompetitorList(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Manejar investigación de mercado - SOLO estado local
  const addMarketResearch = (e) => {
    e.preventDefault();
    if (newResearch.source && newResearch.finding) {
      setMarketResearch(prev => [...prev, {
        ...newResearch,
        id: Date.now()
      }]);
      setNewResearch({ source: '', finding: '', impact: '' });
    }
  };

  const removeMarketResearch = (id) => {
    setMarketResearch(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Calcular totales automáticamente
  const totalMarketSize = targetSegments.reduce((sum, segment) => sum + (segment.size || 0), 0);
  const totalCompetitors = competitorList.length;
  const averageMarketGrowth = targetSegments.length > 0 
    ? targetSegments.reduce((sum, segment) => sum + (segment.growth || 0), 0) / targetSegments.length 
    : 0;

  // ✅ Aplicar totales calculados
  const applyCalculatedTotals = (e) => {
    e.preventDefault();
    
    const finalData = {
      ...localData,
      marketSize: totalMarketSize,
      competitors: totalCompetitors,
      marketGrowth: averageMarketGrowth
    };
    
    setLocalData(finalData);
    onChange('market', finalData);
    
    alert(`✅ Totales de mercado aplicados:\n- Tamaño del mercado: ${totalMarketSize.toLocaleString()} unidades\n- Competidores identificados: ${totalCompetitors}\n- Crecimiento promedio: ${averageMarketGrowth.toFixed(1)}%`);
  };

  const hasValidData = localData.marketSize > 0 && localData.marketGrowth > 0;

  return (
    <div className="form-section detailed-market-form">
      <div className="detailed-market-form__header">
        <h3>📈 Análisis de Mercado - Modo Guiado</h3>
        <div className="detailed-market-form__subtitle">
          <p>💡 <strong>Te guiaremos paso a paso para entender tu mercado objetivo</strong></p>
          <p>Los cambios aquí no se guardarán hasta que hagas clic en "Aplicar Totales"</p>
        </div>
      </div>

      {/* Sección 1: Segmentos de Mercado */}
      <div className="detailed-market-form__section">
        <h4>🎯 Segmentos de Mercado Objetivo</h4>
        <p className="detailed-market-form__description">
          Define los diferentes segmentos de clientes a los que te diriges
        </p>

        {/* Formulario para agregar segmentos */}
        <form onSubmit={addTargetSegment} className="detailed-market-form__add-item">
          <h5>➕ Agregar Segmento de Mercado</h5>
          <div className="detailed-market-form__add-form">
            <input
              type="text"
              placeholder="Nombre del segmento (ej: Jóvenes 18-25, Empresas PYMES)"
              value={newSegment.name}
              onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Tamaño (unidades)"
              value={newSegment.size}
              onChange={(e) => setNewSegment(prev => ({ ...prev, size: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Crecimiento anual (%)"
              value={newSegment.growth}
              onChange={(e) => setNewSegment(prev => ({ ...prev, growth: e.target.value }))}
            />
            <button type="submit" className="detailed-market-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de segmentos */}
        <div className="detailed-market-form__items-list">
          <h5>Segmentos Identificados (Vista Previa):</h5>
          {targetSegments.length === 0 ? (
            <p className="detailed-market-form__empty-state">No hay segmentos agregados aún</p>
          ) : (
            targetSegments.map((segment) => (
              <div key={segment.id} className="detailed-market-form__item">
                <div className="detailed-market-form__item-details">
                  <span className="detailed-market-form__item-name">{segment.name}</span>
                  <span className="detailed-market-form__item-info">
                    {segment.size.toLocaleString()} unidades • {segment.growth}% crecimiento
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeTargetSegment(segment.id)}
                  className="detailed-market-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total del mercado */}
        <div className="detailed-market-form__total-preview">
          <strong>Total Mercado Objetivo (Vista Previa): {totalMarketSize.toLocaleString()} unidades</strong>
        </div>

        <div className="detailed-market-form__help">
          <strong>Ejemplos de segmentación:</strong>
          <ul>
            <li>👥 <strong>Demográfica:</strong> Edad, género, ingresos, educación</li>
            <li>🏢 <strong>Empresarial:</strong> Tamaño, industria, ubicación</li>
            <li>🎯 <strong>Conductual:</strong> Frecuencia de uso, lealtad, beneficios buscados</li>
            <li>🌍 <strong>Geográfica:</strong> Ciudad, región, país</li>
          </ul>
        </div>
      </div>

      {/* Sección 2: Análisis de Competencia */}
      <div className="detailed-market-form__section">
        <h4>⚔️ Análisis de Competencia</h4>
        <p className="detailed-market-form__description">
          Identifica y analiza a tus competidores principales
        </p>

        {/* Formulario para agregar competidores */}
        <form onSubmit={addCompetitor} className="detailed-market-form__add-item">
          <h5>➕ Agregar Competidor</h5>
          <div className="detailed-market-form__add-form">
            <input
              type="text"
              placeholder="Nombre del competidor"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Fortaleza principal"
              value={newCompetitor.strength}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, strength: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Participación mercado (%)"
              value={newCompetitor.marketShare}
              onChange={(e) => setNewCompetitor(prev => ({ ...prev, marketShare: e.target.value }))}
            />
            <button type="submit" className="detailed-market-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de competidores */}
        <div className="detailed-market-form__items-list">
          <h5>Competidores Identificados (Vista Previa):</h5>
          {competitorList.length === 0 ? (
            <p className="detailed-market-form__empty-state">No hay competidores agregados aún</p>
          ) : (
            competitorList.map((competitor) => (
              <div key={competitor.id} className="detailed-market-form__item">
                <div className="detailed-market-form__item-details">
                  <span className="detailed-market-form__item-name">{competitor.name}</span>
                  <span className="detailed-market-form__item-info">
                    {competitor.strength} • {competitor.marketShare}% del mercado
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeCompetitor(competitor.id)}
                  className="detailed-market-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total de competidores */}
        <div className="detailed-market-form__total-preview">
          <strong>Total Competidores Identificados: {totalCompetitors}</strong>
        </div>

        <div className="detailed-market-form__help">
          <strong>¿Qué analizar de los competidores?</strong>
          <ul>
            <li>💰 <strong>Precios:</strong> Estrategia de precios y posicionamiento</li>
            <li>🎯 <strong>Propuesta de valor:</strong> Qué los hace diferentes</li>
            <li>📱 <strong>Presencia:</strong> Canales de venta y marketing</li>
            <li>⭐ <strong>Reputación:</strong> Reseñas y percepción del cliente</li>
          </ul>
        </div>
      </div>

      {/* Sección 3: Investigación de Mercado */}
      <div className="detailed-market-form__section">
        <h4>🔍 Investigación y Hallazgos</h4>
        <p className="detailed-market-form__description">
          Registra los hallazgos clave de tu investigación de mercado
        </p>

        {/* Formulario para agregar investigación */}
        <form onSubmit={addMarketResearch} className="detailed-market-form__add-item">
          <h5>➕ Agregar Hallazgo de Investigación</h5>
          <div className="detailed-market-form__add-form">
            <input
              type="text"
              placeholder="Fuente (ej: Encuesta, Estudio, Entrevista)"
              value={newResearch.source}
              onChange={(e) => setNewResearch(prev => ({ ...prev, source: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Hallazgo clave"
              value={newResearch.finding}
              onChange={(e) => setNewResearch(prev => ({ ...prev, finding: e.target.value }))}
              required
            />
            <select
              value={newResearch.impact}
              onChange={(e) => setNewResearch(prev => ({ ...prev, impact: e.target.value }))}
            >
              <option value="">Impacto</option>
              <option value="positive">Positivo</option>
              <option value="negative">Negativo</option>
              <option value="neutral">Neutral</option>
            </select>
            <button type="submit" className="detailed-market-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de investigación */}
        <div className="detailed-market-form__items-list">
          <h5>Hallazgos de Investigación:</h5>
          {marketResearch.length === 0 ? (
            <p className="detailed-market-form__empty-state">No hay hallazgos agregados</p>
          ) : (
            marketResearch.map((research) => (
              <div key={research.id} className="detailed-market-form__item">
                <div className="detailed-market-form__item-details">
                  <span className="detailed-market-form__item-name">{research.finding}</span>
                  <span className="detailed-market-form__item-info">
                    Fuente: {research.source} • 
                    <span className={`detailed-market-form__impact detailed-market-form__impact--${research.impact}`}>
                      {research.impact === 'positive' ? '✅ Positivo' : research.impact === 'negative' ? '❌ Negativo' : '⚪ Neutral'}
                    </span>
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeMarketResearch(research.id)}
                  className="detailed-market-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sección 4: Parámetros del Mercado */}
      <div className="detailed-market-form__section">
        <h4>📊 Parámetros del Mercado</h4>
        
        <div className="detailed-market-form__input-group">
          <label>Participación de Mercado Esperada (%)</label>
          <input
            type="number"
            step="0.1"
            value={localData.marketShare || ''}
            onChange={(e) => handleBasicInputChange('marketShare', e.target.value)}
            placeholder="Ej: 15.0"
          />
          <div className="detailed-market-form__help">
            <strong>¿Cómo estimar?</strong>
            <p>Considera: fortalezas de tu producto, debilidades de competencia, recursos de marketing.</p>
          </div>
        </div>

        <div className="detailed-market-form__input-group">
          <label>Precio Promedio del Producto/Servicio ($)</label>
          <input
            type="number"
            value={localData.averagePrice || ''}
            onChange={(e) => handleBasicInputChange('averagePrice', e.target.value)}
            placeholder="Ej: 99.99"
          />
          <div className="detailed-market-form__help">
            <strong>Estrategia de precios:</strong>
            <p>Basado en: costos, valor percibido, precios de competencia, posicionamiento.</p>
          </div>
        </div>

        <div className="detailed-market-form__input-group">
          <label>Estacionalidad (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={localData.seasonality || ''}
            onChange={(e) => handleBasicInputChange('seasonality', e.target.value)}
            placeholder="1-10"
          />
          <div className="detailed-market-form__help">
            <strong>Escala de estacionalidad:</strong>
            <p>1-3: Estable, 4-7: Moderada, 8-10: Muy estacional</p>
          </div>
        </div>
      </div>

      {/* Botón para aplicar totales */}
      <form onSubmit={applyCalculatedTotals} className="detailed-market-form__actions">
        <button 
          type="submit"
          className="detailed-market-form__apply-btn"
          disabled={targetSegments.length === 0 && competitorList.length === 0}
        >
          🧮 Aplicar Totales de Mercado
        </button>
        <div className="detailed-market-form__totals-preview">
          <p><strong>Totales a aplicar:</strong></p>
          <p>• Tamaño del Mercado: <strong>{totalMarketSize.toLocaleString()} unidades</strong></p>
          <p>• Competidores: <strong>{totalCompetitors} identificados</strong></p>
          <p>• Crecimiento Promedio: <strong>{averageMarketGrowth.toFixed(1)}%</strong></p>
          <p>• Hallazgos: <strong>{marketResearch.length} documentados</strong></p>
        </div>
      </form>

      {/* Resultados (usando el mismo componente de resultados que el MarketDataForm) */}
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

      {/* Toggle para resultados */}
      {hasValidData && (
        <div className="detailed-market-form__toggle-results">
          <button 
            onClick={() => setShowResults(!showResults)}
            className="detailed-market-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Resultados' : '📈 Ver Análisis de Mercado'}
          </button>
        </div>
      )}
    </div>
  );
});