// src/components/results/Charts.jsx (VERSIÓN CORREGIDA)
import React from 'react';

export const Charts = ({ calculations, formData }) => {
  if (!calculations) {
    return (
      <div className="charts-section">
        <h3>Gráficos de Análisis</h3>
        <div className="empty-state">
          Complete los datos para ver los análisis visuales
        </div>
      </div>
    );
  }

  // Datos para mostrar
  const feasibilityData = [
    { 
      name: 'Financiera', 
      score: calculations.financial?.npv > 0 ? 100 : 0,
      color: calculations.financial?.npv > 0 ? '#22c55e' : '#ef4444',
      viable: calculations.financial?.npv > 0
    },
    { 
      name: 'Técnica', 
      score: calculations.technical?.score || 0,
      color: (calculations.technical?.score || 0) >= 70 ? '#22c55e' : '#ef4444',
      viable: calculations.technical?.viable
    },
    { 
      name: 'Mercado', 
      score: calculations.market?.score || 0,
      color: (calculations.market?.score || 0) >= 65 ? '#22c55e' : '#ef4444',
      viable: calculations.market?.viable
    },
    { 
      name: 'Legal', 
      score: calculations.legal?.score || 0,
      color: (calculations.legal?.score || 0) >= 80 ? '#22c55e' : '#ef4444',
      viable: calculations.legal?.viable
    }
  ];

  // Calcular proyección de flujo de caja
  const calculateCashFlowProjection = () => {
    if (!formData?.financial) return [];
    
    const { investment = 0, operationalCosts = 0, projectedRevenue = 0, period = 5 } = formData.financial;
    const annualCashFlow = projectedRevenue - operationalCosts;
    const projection = [];
    let accumulated = -investment;
    
    // Año 0
    projection.push({ 
      year: 'Año 0', 
      value: -investment, 
      accumulated: -investment,
      type: 'investment'
    });
    
    // Años siguientes
    for (let i = 1; i <= period; i++) {
      accumulated += annualCashFlow;
      projection.push({ 
        year: `Año ${i}`, 
        value: annualCashFlow, 
        accumulated: accumulated,
        type: 'cashflow'
      });
    }
    
    return projection;
  };

  const cashFlowData = calculateCashFlowProjection();

  // Barras de progreso mejoradas
  const ProgressBar = ({ percentage, color, label }) => (
    <div className="progress-bar-container">
      <div className="progress-bar-label">
        <span>{label}</span>
        <span className="progress-percentage">{percentage.toFixed(1)}%</span>
      </div>
      <div className="progress-bar-background">
        <div 
          className="progress-bar-fill"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="charts-section">
      <h3>📊 Análisis Visual del Proyecto</h3>
      
      <div className="charts-grid">
        {/* Viabilidad por área con barras de progreso */}
        <div className="chart-container">
          <h4>🎯 Viabilidad por Área</h4>
          <div className="chart-content">
            {feasibilityData.map((item, index) => (
              <div key={index} className="progress-item">
                <div className="progress-header">
                  <span className="area-name">{item.name}</span>
                  <span 
                    className="area-status"
                    style={{ color: item.color }}
                  >
                    {item.viable ? '✅ VIABLE' : '❌ NO VIABLE'}
                  </span>
                </div>
                <ProgressBar 
                  percentage={item.score} 
                  color={item.color}
                  label={item.name}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Métricas financieras */}
        <div className="chart-container">
          <h4>💰 Métricas Financieras Clave</h4>
          <div className="chart-content">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-name">Valor Presente Neto (VPN)</span>
                <span 
                  className="metric-value"
                  style={{ 
                    color: (calculations.financial?.npv || 0) >= 0 ? '#22c55e' : '#ef4444'
                  }}
                >
                  ${(calculations.financial?.npv || 0).toFixed(2)}
                </span>
              </div>
              <div className="metric-description">
                {calculations.financial?.npv >= 0 ? 
                  '✅ El proyecto genera valor económico' : 
                  '❌ El proyecto no genera valor económico'
                }
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-name">Tasa Interna de Retorno (TIR)</span>
                <span 
                  className="metric-value"
                  style={{ 
                    color: (calculations.financial?.irr || 0) >= 0.08 ? '#22c55e' : '#ef4444'
                  }}
                >
                  {((calculations.financial?.irr || 0) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="metric-description">
                Meta mínima: 8% | 
                {calculations.financial?.irr >= 0.08 ? 
                  ' ✅ Cumple' : ' ❌ No cumple'
                }
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-name">Período de Recuperación</span>
                <span className="metric-value">
                  {(calculations.financial?.payback || 0).toFixed(1)} años
                </span>
              </div>
              <div className="metric-description">
                Tiempo estimado para recuperar la inversión inicial
              </div>
            </div>
          </div>
        </div>

        {/* Proyección de flujo de caja */}
        {cashFlowData.length > 0 && (
          <div className="chart-container">
            <h4>📈 Proyección de Flujo de Caja</h4>
            <div className="chart-content">
              <div className="cashflow-header">
                <span>Período</span>
                <span>Flujo Anual</span>
                <span>Acumulado</span>
              </div>
              {cashFlowData.map((item, index) => (
                <div 
                  key={index} 
                  className={`cashflow-row ${item.type === 'investment' ? 'investment-row' : ''}`}
                >
                  <span className="cashflow-period">{item.year}</span>
                  <span 
                    className="cashflow-amount"
                    style={{ color: item.value >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    ${item.value.toFixed(2)}
                  </span>
                  <span 
                    className="cashflow-accumulated"
                    style={{ color: item.accumulated >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    ${item.accumulated.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen ejecutivo */}
        <div className="chart-container">
          <h4>📋 Resumen Ejecutivo</h4>
          <div className="executive-summary">
            <div 
              className="viability-circle"
              style={{ 
                backgroundColor: calculations.overall?.viable ? '#22c55e' : '#ef4444'
              }}
            >
              <div className="viability-text">
                {calculations.overall?.viable ? 'VIABLE' : 'NO VIABLE'}
              </div>
            </div>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-value">{(calculations.overall?.score || 0).toFixed(1)}%</span>
                <span className="stat-label">Puntuación General</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">
                  {feasibilityData.filter(item => item.viable).length}/4
                </span>
                <span className="stat-label">Áreas Viables</span>
              </div>
            </div>
            <div className="summary-conclusion">
              <p>
                <strong>Nivel de Confianza:</strong> {calculations.overall?.level?.toUpperCase() || 'BAJO'}
              </p>
              {calculations.overall?.viable ? (
                <p className="positive-conclusion">
                  ✅ El proyecto cumple con los criterios de factibilidad requeridos
                </p>
              ) : (
                <p className="negative-conclusion">
                  ❌ El proyecto no cumple con los criterios mínimos de viabilidad
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};