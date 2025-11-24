// src/components/forms/market/MarketResults.jsx
import React from 'react';

export const MarketResults = ({ formData }) => {
  // Calcular métricas resumidas
  const calculateMetrics = () => {
    const quantitativeFields = [
      'totalMarketData', 'availableMarketData', 'targetMarketData',
      'marketValueData', 'growthRatesData', 'currentDemandData',
      'historicalDemandData', 'projectedDemandData'
    ];
    
    const qualitativeFields = [
      'painPointsAnalysis', 'unmetNeedsAnalysis', 'purchaseMotivationsAnalysis',
      'decisionProcessAnalysis', 'competitorStrengthsAnalysis', 'opportunitiesAnalysis'
    ];

    const completedQuantitative = quantitativeFields.filter(field => 
      formData[field] && formData[field].length > 0
    ).length;

    const completedQualitative = qualitativeFields.filter(field => 
      formData[field] && formData[field].length > 0
    ).length;

    const totalRatings = Object.keys(formData).filter(key => 
      key.includes('Rating') && formData[key] && formData[key] !== ''
    ).length;

    return {
      quantitativeCompletion: Math.round((completedQuantitative / quantitativeFields.length) * 100),
      qualitativeCompletion: Math.round((completedQualitative / qualitativeFields.length) * 100),
      totalRatings,
      overallScore: Math.round((completedQuantitative + completedQualitative) / (quantitativeFields.length + qualitativeFields.length) * 100)
    };
  };

  const metrics = calculateMetrics();

  const getRatingSummary = () => {
    const ratings = {
      excellent: 0,
      good: 0,
      regular: 0,
      poor: 0
    };

    Object.keys(formData).forEach(key => {
      if (key.includes('Rating') && formData[key]) {
        ratings[formData[key]] = (ratings[formData[key]] || 0) + 1;
      }
    });

    return ratings;
  };

  const ratingSummary = getRatingSummary();

  return (
    <div className="market-results">
      <h4 className="market-results-title">📈 Resumen del Análisis de Mercado</h4>
      
      <div className="market-results-grid">
        {/* Métricas Principales */}
        <div className="market-metric-card">
          <div className="market-metric-value">{metrics.overallScore}%</div>
          <div className="market-metric-label">Completitud General</div>
          <div className="market-metric-progress">
            <div 
              className="market-metric-progress-fill"
              style={{ width: `${metrics.overallScore}%` }}
            ></div>
          </div>
        </div>

        <div className="market-metric-card">
          <div className="market-metric-value">{metrics.quantitativeCompletion}%</div>
          <div className="market-metric-label">Datos Cuantitativos</div>
          <div className="market-metric-progress">
            <div 
              className="market-metric-progress-fill"
              style={{ width: `${metrics.quantitativeCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="market-metric-card">
          <div className="market-metric-value">{metrics.qualitativeCompletion}%</div>
          <div className="market-metric-label">Datos Cualitativos</div>
          <div className="market-metric-progress">
            <div 
              className="market-metric-progress-fill"
              style={{ width: `${metrics.qualitativeCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="market-metric-card">
          <div className="market-metric-value">{metrics.totalRatings}</div>
          <div className="market-metric-label">Campos Evaluados</div>
          <div className="market-metric-description">
            De 35 campos posibles
          </div>
        </div>
      </div>

      {/* Distribución de Ratings */}
      <div className="market-ratings-distribution">
        <h5>Distribución de Evaluaciones</h5>
        <div className="market-ratings-grid">
          <div className="market-rating-item market-rating-excellent">
            <span className="market-rating-count">{ratingSummary.excellent}</span>
            <span className="market-rating-label">Excelente</span>
          </div>
          <div className="market-rating-item market-rating-good">
            <span className="market-rating-count">{ratingSummary.good}</span>
            <span className="market-rating-label">Buena</span>
          </div>
          <div className="market-rating-item market-rating-regular">
            <span className="market-rating-count">{ratingSummary.regular}</span>
            <span className="market-rating-label">Regular</span>
          </div>
          <div className="market-rating-item market-rating-poor">
            <span className="market-rating-count">{ratingSummary.poor}</span>
            <span className="market-rating-label">Mala</span>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="market-recommendations">
        <h5>Recomendaciones</h5>
        <div className="market-recommendations-list">
          {metrics.quantitativeCompletion < 50 && (
            <div className="market-recommendation market-recommendation-warning">
              <strong>📊 Completa más datos cuantitativos:</strong> Necesitas más información numérica sobre tamaño de mercado, demanda y competencia.
            </div>
          )}
          
          {metrics.qualitativeCompletion < 50 && (
            <div className="market-recommendation market-recommendation-warning">
              <strong>🎯 Profundiza en el análisis cualitativo:</strong> Es crucial entender las necesidades y comportamientos de los consumidores.
            </div>
          )}
          
          {ratingSummary.poor > 2 && (
            <div className="market-recommendation market-recommendation-critical">
              <strong>⚠️ Atención a áreas críticas:</strong> Tienes {ratingSummary.poor} evaluaciones marcadas como "Mala". Revisa estos aspectos.
            </div>
          )}
          
          {metrics.overallScore > 80 && (
            <div className="market-recommendation market-recommendation-success">
              <strong>✅ Buen trabajo:</strong> Tu análisis de mercado está bastante completo. Considera solo algunos ajustes menores.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};