// src/components/forms/FinancialRecommendations.jsx
import React from 'react';

export const FinancialRecommendations = React.memo(({ calculations, formData }) => {
  const { financial } = calculations || {};

  // Generar recomendaciones basadas en el análisis
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (!financial) return recommendations;

    // Análisis de VAN
    if (financial.npv < 0) {
      recommendations.push({
        type: 'critical',
        icon: '🚨',
        title: 'VAN Negativo - Proyecto No Viable',
        message: 'El Valor Actual Neto es negativo, lo que indica que el proyecto no genera valor.',
        suggestions: [
          'Reducir costos de inversión inicial',
          'Aumentar los ingresos proyectados',
          'Revisar la estructura de costos operativos',
          'Considerar fuentes de financiamiento más económicas'
        ],
        priority: 1
      });
    } else if (financial.npv < 10000) {
      recommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'VAN Bajo - Margen Ajustado',
        message: 'El VAN es positivo pero bajo, lo que representa riesgo moderado.',
        suggestions: [
          'Optimizar eficiencias operativas',
          'Explorar oportunidades de ingresos adicionales',
          'Revisar cronograma de implementación',
          'Considerar escalamiento progresivo'
        ],
        priority: 2
      });
    }

    // Análisis de TIR
    if (financial.irr < 0.08) {
      recommendations.push({
        type: 'critical',
        icon: '📉',
        title: 'TIR por Debajo del Mínimo',
        message: `La Tasa Interna de Retorno (${(financial.irr * 100).toFixed(1)}%) está por debajo del 8% mínimo recomendado.`,
        suggestions: [
          'Revisar estructura de costos',
          'Mejorar márgenes de utilidad',
          'Optimizar ciclo de ingresos',
          'Considerar reducción de inversión inicial'
        ],
        priority: 1
      });
    } else if (financial.irr > 0.25) {
      recommendations.push({
        type: 'success',
        icon: '🎯',
        title: 'TIR Excelente',
        message: `La TIR del ${(financial.irr * 100).toFixed(1)}% es excelente.`,
        suggestions: [
          'Considerar acelerar la implementación',
          'Evaluar oportunidades de expansión',
          'Mantener controles de calidad',
          'Planificar reinversión de utilidades'
        ],
        priority: 3
      });
    }

    // Análisis de Payback
    if (financial.payback > 5) {
      recommendations.push({
        type: 'warning',
        icon: '⏳',
        title: 'Período de Recuperación Largo',
        message: `El período de recuperación de ${financial.payback.toFixed(1)} años puede ser riesgoso.`,
        suggestions: [
          'Buscar financiamiento a más largo plazo',
          'Estructurar ingresos más tempranos',
          'Considerar fases de implementación',
          'Revisar cronograma de desembolsos'
        ],
        priority: 2
      });
    }

    // Análisis de Flujo de Caja
    if (financial.annualCashFlow < 0) {
      recommendations.push({
        type: 'critical',
        icon: '💸',
        title: 'Flujo de Caja Negativo',
        message: 'El flujo de caja anual es negativo, lo que indica problemas de liquidez.',
        suggestions: [
          'Revisar urgentemente estructura de costos',
          'Ajustar cronograma de inversiones',
          'Buscar líneas de crédito de working capital',
          'Reprogramar obligaciones financieras'
        ],
        priority: 1
      });
    }

    // Análisis de Margen Neto
    const netMargin = formData.financial?.projectedRevenue > 0 
      ? (financial.annualCashFlow / formData.financial.projectedRevenue) * 100 
      : 0;

    if (netMargin < 10) {
      recommendations.push({
        type: 'warning',
        icon: '📊',
        title: 'Margen Neto Bajo',
        message: `El margen neto del ${netMargin.toFixed(1)}% puede ser insuficiente para contingencias.`,
        suggestions: [
          'Revisar precios de venta',
          'Optimizar costos variables',
          'Reducir gastos administrativos',
          'Mejorar eficiencia operativa'
        ],
        priority: 2
      });
    }

    // Análisis de ROI
    const annualROI = formData.financial?.investment > 0 
      ? (financial.annualCashFlow / formData.financial.investment) * 100 
      : 0;

    if (annualROI < 15) {
      recommendations.push({
        type: 'warning',
        icon: '📈',
        title: 'ROI Mejorable',
        message: `El ROI anual del ${annualROI.toFixed(1)}% puede optimizarse.`,
        suggestions: [
          'Revisar eficiencia de la inversión',
          'Buscar sinergias operativas',
          'Optimizar uso de activos',
          'Considerar outsourcing de funciones no core'
        ],
        priority: 2
      });
    }

    // Ordenar por prioridad (críticas primero)
    return recommendations.sort((a, b) => a.priority - b.priority);
  };

  const recommendations = generateRecommendations();

  if (recommendations.length === 0) {
    return (
      <div className="financial-recommendations">
        <div className="recommendations-header">
          <h4>✅ Análisis Financiero Óptimo</h4>
          <p>Todos los indicadores financieros se encuentran dentro de los parámetros recomendados.</p>
        </div>
        
        <div className="optimal-indicators">
          <div className="optimal-indicator">
            <span className="indicator-icon">💰</span>
            <span className="indicator-text">VAN positivo y saludable</span>
          </div>
          <div className="optimal-indicator">
            <span className="indicator-icon">📈</span>
            <span className="indicator-text">TIR superior al 8%</span>
          </div>
          <div className="optimal-indicator">
            <span className="indicator-icon">⏱️</span>
            <span className="indicator-text">Payback razonable</span>
          </div>
          <div className="optimal-indicator">
            <span className="indicator-icon">💧</span>
            <span className="indicator-text">Flujo de caja positivo</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-recommendations">
      <div className="recommendations-header">
        <h4>🎯 Recomendaciones para Optimizar tu Proyecto</h4>
        <p>Basado en el análisis de tus indicadores financieros</p>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} />
        ))}
      </div>

      <div className="recommendations-summary">
        <h5>📋 Resumen de Acciones Prioritarias</h5>
        <div className="priority-actions">
          {recommendations
            .filter(rec => rec.priority === 1)
            .map((rec, index) => (
              <div key={index} className="priority-action">
                <span className="priority-badge">CRÍTICO</span>
                <span>{rec.title}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

const RecommendationCard = ({ recommendation }) => {
  const getCardClass = () => {
    switch (recommendation.type) {
      case 'critical': return 'recommendation-card--critical';
      case 'warning': return 'recommendation-card--warning';
      case 'success': return 'recommendation-card--success';
      default: return 'recommendation-card--info';
    }
  };

  return (
    <div className={`recommendation-card ${getCardClass()}`}>
      <div className="recommendation-header">
        <div className="recommendation-icon">{recommendation.icon}</div>
        <div className="recommendation-title">
          <h5>{recommendation.title}</h5>
          <div className="recommendation-priority">
            {recommendation.priority === 1 && <span className="priority-critical">ALTA PRIORIDAD</span>}
            {recommendation.priority === 2 && <span className="priority-medium">MEDIA PRIORIDAD</span>}
            {recommendation.priority === 3 && <span className="priority-low">BAJA PRIORIDAD</span>}
          </div>
        </div>
      </div>
      
      <div className="recommendation-message">
        {recommendation.message}
      </div>
      
      <div className="recommendation-suggestions">
        <h6>💡 Acciones Recomendadas:</h6>
        <ul>
          {recommendation.suggestions.map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};