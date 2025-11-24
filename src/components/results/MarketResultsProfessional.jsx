// src/components/results/MarketResultsProfessional.jsx
import React from 'react';
import '../../styles/components/results/MarketResultsProfessional.css'

export const MarketResultsProfessional = ({ calculations, formData }) => {
  if (!calculations || !calculations.market) {
    return (
      <div className="professional-market-results">
        <div className="empty-state-market">
          <h3>📊 Análisis de Mercado Integral</h3>
          <p>Complete los datos de mercado para generar el análisis de viabilidad comercial</p>
        </div>
      </div>
    );
  }

  const { 
    market, 
    suggestions 
  } = calculations;

  const {
    score,
    viable,
    level,
    detailedAnalysis
  } = market;

  // ✅ FUNCIONES AUXILIARES PARA RENDERIZADO
  const getCompetitionIntensityText = (intensity) => {
    switch(intensity) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'No evaluada';
    }
  };

  const getCompetitionIntensityColor = (intensity) => {
    switch(intensity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getOutlookText = (outlook) => {
    switch(outlook) {
      case 'positive': return 'Positivo';
      case 'neutral': return 'Neutral';
      case 'negative': return 'Negativo';
      default: return 'No evaluado';
    }
  };

  const getOutlookColor = (outlook) => {
    switch(outlook) {
      case 'positive': return '#10b981';
      case 'neutral': return '#f59e0b';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="professional-market-results">
      {/* HEADER EJECUTIVO */}
      <div className="market-executive-summary">
        <div className="market-summary-header">
          <h2>📊 INFORME DE MERCADO EJECUTIVO</h2>
          <div className={`market-viability-badge ${viable ? 'viable' : 'not-viable'}`}>
            {viable ? '✅ VIABLE COMERCIALMENTE' : '❌ NO VIABLE COMERCIALMENTE'}
          </div>
        </div>
        
        <div className="market-summary-grid">
          <div className="market-summary-card">
            <h4>Puntuación de Mercado</h4>
            <div className="market-score">{score}/100</div>
            <div className="market-level">
              Nivel: <span className={`level-${level}`}>{level.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="market-summary-card">
            <h4>Participación Estimada</h4>
            <div className="market-share">{detailedAnalysis?.marketShare || 0}%</div>
            <div className="market-share-detail">
              <span>Del mercado objetivo</span>
            </div>
          </div>
          
          <div className="market-summary-card">
            <h4>Crecimiento Anual</h4>
            <div className="market-growth">{detailedAnalysis?.growthRate || 0}%</div>
            <div className="market-growth-detail">
              <span>Tasa de crecimiento proyectada</span>
            </div>
          </div>
          
          <div className="market-summary-card">
            <h4>Intensidad Competitiva</h4>
            <div 
              className="market-competition"
              style={{ color: getCompetitionIntensityColor(detailedAnalysis?.competition?.intensity) }}
            >
              {getCompetitionIntensityText(detailedAnalysis?.competition?.intensity)}
            </div>
            <div className="market-competition-detail">
              <span>Nivel de competencia</span>
            </div>
          </div>
        </div>
      </div>

      {/* MÉTRICAS CLAVE DEL MERCADO */}
      <div className="market-metrics-section">
        <h3>📈 Métricas Clave del Mercado</h3>
        <div className="market-metrics-grid">
          
          <div className="market-metric-card">
            <div className="metric-header">
              <h5>🏢 Tamaño y Participación</h5>
              <span className="metric-weight">Peso: 30%</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{detailedAnalysis?.marketShare || 0}%</div>
              <div className="metric-label">Participación Estimada</div>
              <div className="metric-description">
                {detailedAnalysis?.marketShare >= 5 ? 
                  'Participación suficiente para ser viable' : 
                  'Participación por debajo del mínimo recomendado'
                }
              </div>
            </div>
          </div>

          <div className="market-metric-card">
            <div className="metric-header">
              <h5>📈 Crecimiento y Demanda</h5>
              <span className="metric-weight">Peso: 25%</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{detailedAnalysis?.growthRate || 0}%</div>
              <div className="metric-label">Crecimiento Anual</div>
              <div className="metric-description">
                {detailedAnalysis?.growthRate >= 10 ? 
                  'Mercado en crecimiento atractivo' : 
                  'Crecimiento limitado del mercado'
                }
              </div>
            </div>
          </div>

          <div className="market-metric-card">
            <div className="metric-header">
              <h5>⚔️ Análisis Competitivo</h5>
              <span className="metric-weight">Peso: 25%</span>
            </div>
            <div className="metric-content">
              <div 
                className="metric-value"
                style={{ color: getCompetitionIntensityColor(detailedAnalysis?.competition?.intensity) }}
              >
                {getCompetitionIntensityText(detailedAnalysis?.competition?.intensity)}
              </div>
              <div className="metric-label">Intensidad Competitiva</div>
              <div className="metric-description">
                {detailedAnalysis?.competition?.totalCompetitors || 0} competidores identificados
              </div>
            </div>
          </div>

          <div className="market-metric-card">
            <div className="metric-header">
              <h5>💰 Rentabilidad</h5>
              <span className="metric-weight">Peso: 20%</span>
            </div>
            <div className="metric-content">
              <div 
                className="metric-value"
                style={{ color: detailedAnalysis?.pricing?.marginPotential === 'high' ? '#10b981' : 
                        detailedAnalysis?.pricing?.marginPotential === 'medium' ? '#f59e0b' : '#ef4444' }}
              >
                {detailedAnalysis?.pricing?.marginPotential === 'high' ? 'Alta' : 
                 detailedAnalysis?.pricing?.marginPotential === 'medium' ? 'Media' : 'Baja'}
              </div>
              <div className="metric-label">Potencial de Margen</div>
              <div className="metric-description">
                {detailedAnalysis?.pricing?.averageMargin ? 
                  `Margen promedio: ${Math.round(detailedAnalysis.pricing.averageMargin)}%` : 
                  'Datos de márgenes no disponibles'
                }
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ANÁLISIS DETALLADO POR DIMENSIONES */}
      <div className="market-dimensions-section">
        <h3>🔍 Análisis Detallado por Dimensiones</h3>
        <div className="market-dimensions-grid">
          
          {/* COMPETENCIA */}
          <div className="market-dimension-card">
            <div className="dimension-header">
              <h5>⚔️ Análisis Competitivo</h5>
            </div>
            <div className="dimension-content">
              <div className="dimension-metric">
                <label>Intensidad Competitiva:</label>
                <span 
                  className="metric-value"
                  style={{ color: getCompetitionIntensityColor(detailedAnalysis?.competition?.intensity) }}
                >
                  {getCompetitionIntensityText(detailedAnalysis?.competition?.intensity)}
                </span>
              </div>
              <div className="dimension-metric">
                <label>Concentración de Mercado (CR4):</label>
                <span className="metric-value">
                  {detailedAnalysis?.competition?.cr4 ? Math.round(detailedAnalysis.competition.cr4) + '%' : 'N/A'}
                </span>
              </div>
              <div className="dimension-metric">
                <label>Número de Competidores:</label>
                <span className="metric-value">
                  {detailedAnalysis?.competition?.totalCompetitors || 0}
                </span>
              </div>
            </div>
          </div>

          {/* DEMANDA */}
          <div className="market-dimension-card">
            <div className="dimension-header">
              <h5>📈 Análisis de Demanda</h5>
            </div>
            <div className="dimension-content">
              <div className="dimension-metric">
                <label>Fuerza de la Demanda:</label>
                <span 
                  className="metric-value"
                  style={{ 
                    color: detailedAnalysis?.demand?.strength === 'high' ? '#10b981' : 
                           detailedAnalysis?.demand?.strength === 'medium' ? '#f59e0b' : '#ef4444' 
                  }}
                >
                  {detailedAnalysis?.demand?.strength === 'high' ? 'Alta' : 
                   detailedAnalysis?.demand?.strength === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <div className="dimension-metric">
                <label>Demanda Insatisfecha:</label>
                <span className="metric-value">
                  {detailedAnalysis?.demand?.unmetNeedRatio ? Math.round(detailedAnalysis.demand.unmetNeedRatio * 100) + '%' : 'N/A'}
                </span>
              </div>
              <div className="dimension-metric">
                <label>Crecimiento Proyectado:</label>
                <span className="metric-value">
                  {detailedAnalysis?.growthRate || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* PRECIOS */}
          <div className="market-dimension-card">
            <div className="dimension-header">
              <h5>💰 Análisis de Precios</h5>
            </div>
            <div className="dimension-content">
              <div className="dimension-metric">
                <label>Competitividad de Precios:</label>
                <span 
                  className="metric-value"
                  style={{ 
                    color: detailedAnalysis?.pricing?.competitiveness === 'high' ? '#10b981' : 
                           detailedAnalysis?.pricing?.competitiveness === 'medium' ? '#f59e0b' : '#ef4444' 
                  }}
                >
                  {detailedAnalysis?.pricing?.competitiveness === 'high' ? 'Alta' : 
                   detailedAnalysis?.pricing?.competitiveness === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <div className="dimension-metric">
                <label>Rango de Precios:</label>
                <span className="metric-value">
                  {detailedAnalysis?.pricing?.priceRange ? 
                    `$${detailedAnalysis.pricing.priceRange.min} - $${detailedAnalysis.pricing.priceRange.max}` : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="dimension-metric">
                <label>Margen Promedio:</label>
                <span className="metric-value">
                  {detailedAnalysis?.pricing?.averageMargin ? Math.round(detailedAnalysis.pricing.averageMargin) + '%' : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* OPORTUNIDADES */}
          <div className="market-dimension-card">
            <div className="dimension-header">
              <h5>🎯 Outlook del Mercado</h5>
            </div>
            <div className="dimension-content">
              <div className="dimension-metric">
                <label>Perspectiva General:</label>
                <span 
                  className="metric-value"
                  style={{ color: getOutlookColor(detailedAnalysis?.outlook?.outlook) }}
                >
                  {getOutlookText(detailedAnalysis?.outlook?.outlook)}
                </span>
              </div>
              <div className="dimension-metric">
                <label>Puntuación Oportunidades:</label>
                <span className="metric-value">
                  {detailedAnalysis?.outlook?.opportunityScore || 0}/100
                </span>
              </div>
              <div className="dimension-metric">
                <label>Puntuación Amenazas:</label>
                <span className="metric-value">
                  {detailedAnalysis?.outlook?.threatScore || 0}/100
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FORTALEZAS Y DEBILIDADES */}
      <div className="market-swot-section">
        <h3>🎯 Análisis de Fortalezas y Debilidades Comerciales</h3>
        <div className="market-swot-grid">
          
          <div className="market-swot-card strengths">
            <h4>💪 Fortalezas Comerciales</h4>
            <div className="market-swot-content">
              {detailedAnalysis?.strengths?.map((strength, index) => (
                <div key={index} className="market-swot-item">
                  <span className="market-swot-icon">✅</span>
                  {strength}
                </div>
              ))}
              {(!detailedAnalysis?.strengths || detailedAnalysis.strengths.length === 0) && (
                <div className="market-swot-empty">No se identificaron fortalezas comerciales significativas</div>
              )}
            </div>
          </div>

          <div className="market-swot-card weaknesses">
            <h4>⚠️ Debilidades Comerciales</h4>
            <div className="market-swot-content">
              {detailedAnalysis?.weaknesses?.map((weakness, index) => (
                <div key={index} className="market-swot-item">
                  <span className="market-swot-icon">❌</span>
                  {weakness}
                </div>
              ))}
              {(!detailedAnalysis?.weaknesses || detailedAnalysis.weaknesses.length === 0) && (
                <div className="market-swot-empty">No se identificaron debilidades comerciales críticas</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* RECOMENDACIONES ESTRATÉGICAS */}
      {detailedAnalysis?.recommendations && detailedAnalysis.recommendations.length > 0 && (
        <div className="market-recommendations-section">
          <h3>💡 Recomendaciones Estratégicas</h3>
          <div className="market-recommendations-grid">
            {detailedAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="market-recommendation-card">
                <div className="market-recommendation-header">
                  <h5>Recomendación {index + 1}</h5>
                  <span className="market-priority-badge">
                    PRIORITARIA
                  </span>
                </div>
                <div className="market-recommendation-content">
                  <p>{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONCLUSIÓN COMERCIAL */}
      <div className="market-conclusion-section">
        <div className={`market-conclusion ${viable ? 'positive' : 'negative'}`}>
          <h3>🎯 Conclusión de Viabilidad Comercial</h3>
          <div className="market-conclusion-content">
            <div className="market-conclusion-header">
              <span className="market-conclusion-icon">
                {viable ? '✅' : '❌'}
              </span>
              <h4>
                {viable ? 
                  'EL MERCADO PRESENTA CONDICIONES FAVORABLES' : 
                  'EL MERCADO PRESENTA LIMITACIONES SIGNIFICATIVAS'
                }
              </h4>
            </div>
            
            <div className="market-conclusion-details">
              <p><strong>Evaluación General:</strong> {viable ? 
                'Las condiciones del mercado son favorables para el lanzamiento y crecimiento del proyecto.' :
                'Se requieren ajustes significativos en la estrategia comercial antes de proceder.'
              }</p>
              
              <div className="market-conclusion-metrics">
                <div className="market-conclusion-metric">
                  <label>Puntuación Comercial</label>
                  <span className={`market-metric-value ${score >= 70 ? 'good' : score >= 50 ? 'medium' : 'poor'}`}>
                    {score}/100
                  </span>
                </div>
                <div className="market-conclusion-metric">
                  <label>Participación Estimada</label>
                  <span className="market-metric-value">
                    {detailedAnalysis?.marketShare || 0}%
                  </span>
                </div>
                <div className="market-conclusion-metric">
                  <label>Potencial de Crecimiento</label>
                  <span className={`market-metric-value ${detailedAnalysis?.growthRate >= 10 ? 'good' : detailedAnalysis?.growthRate >= 5 ? 'medium' : 'poor'}`}>
                    {detailedAnalysis?.growthRate || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};