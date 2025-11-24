// src/components/results/FinancialResultsProfessional.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import '../../styles/components/results/FinancialResultsProfessional.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const FinancialResultsProfessional = ({ calculations, formData }) => {
  if (!calculations || !calculations.financial) {
    return (
      <div className="financial-results-professional">
        <div className="financial-empty-state">
          <h3>💰 Análisis Financiero Integral</h3>
          <p>Complete los datos financieros para generar el análisis de viabilidad económica</p>
        </div>
      </div>
    );
  }

  const { 
    financial, 
    suggestions 
  } = calculations;

  const {
    npv,
    irr,
    payback,
    roi,
    profitabilityIndex,
    wacc,
    workingCapital,
    totalInvestment,
    afterTaxCashFlow,
    breakEven,
    scenarios,
    riskMetrics,
    annualCashFlow,
    depreciation
  } = financial;

  // ✅ NUEVOS CÁLCULOS SOLICITADOS
  const calculateBreakEvenPoint = () => {
    const fixedCosts = (formData.financial?.monthlyFixedCosts || 0) * 12;
    const variableCostPerUnit = formData.financial?.variableCostPerUnit || 0;
    const averagePrice = formData.financial?.averagePrice || 1;
    
    if (averagePrice <= variableCostPerUnit) return { units: 0, revenue: 0 };
    
    const breakEvenUnits = fixedCosts / (averagePrice - variableCostPerUnit);
    const breakEvenRevenue = breakEvenUnits * averagePrice;
    
    return {
      units: Math.ceil(breakEvenUnits),
      revenue: Math.ceil(breakEvenRevenue),
      contributionMargin: ((averagePrice - variableCostPerUnit) / averagePrice) * 100
    };
  };

  const calculateVATAnalysis = () => {
    const monthlyRevenue = (formData.financial?.projectedRevenue || 0) / 12;
    const vatRate = 0.21; // 21% IVA general
    const monthlyVAT = monthlyRevenue * vatRate;
    const quarterlyVAT = monthlyVAT * 3;
    const annualVAT = monthlyVAT * 12;
    
    return {
      monthlyVAT: Math.round(monthlyVAT),
      quarterlyVAT: Math.round(quarterlyVAT),
      annualVAT: Math.round(annualVAT),
      vatRate: vatRate * 100
    };
  };

  const calculateTaxOnIncome = () => {
    const grossIncome = formData.financial?.projectedRevenue || 0;
    const operationalCosts = formData.financial?.operationalCosts || 0;
    const taxableIncome = Math.max(0, grossIncome - operationalCosts - depreciation);
    const incomeTaxRate = 0.30; // 30% impuesto a las ganancias
    const incomeTax = taxableIncome * incomeTaxRate;
    const netIncome = taxableIncome - incomeTax;
    
    return {
      grossIncome: Math.round(grossIncome),
      taxableIncome: Math.round(taxableIncome),
      incomeTax: Math.round(incomeTax),
      netIncome: Math.round(netIncome),
      effectiveTaxRate: (incomeTax / grossIncome) * 100
    };
  };

  // ✅ DATOS PARA GRÁFICOS
  const profitabilityChartData = {
    labels: ['VAN', 'TIR', 'ROI', 'Índice Rentabilidad'],
    datasets: [
      {
        label: 'Indicadores de Rentabilidad',
        data: [
          Math.max(0, npv / 1000),
          irr * 100,
          roi * 100,
          profitabilityIndex * 100
        ],
        backgroundColor: [
          npv > 0 ? '#10b981' : '#ef4444',
          irr > wacc ? '#10b981' : '#f59e0b',
          roi > 0.2 ? '#10b981' : '#f59e0b',
          profitabilityIndex > 1 ? '#10b981' : '#ef4444'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const cashFlowChartData = {
    labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
    datasets: [
      {
        label: 'Flujo de Caja Anual',
        data: [afterTaxCashFlow * 0.8, afterTaxCashFlow * 0.9, afterTaxCashFlow, afterTaxCashFlow * 1.1, afterTaxCashFlow * 1.2],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const investmentBreakdownData = {
    labels: ['Inversión Inicial', 'Capital de Trabajo', 'Reserva Contingencia'],
    datasets: [
      {
        data: [
          formData.financial?.investment || 0,
          workingCapital,
          (formData.financial?.investment || 0) * 0.1
        ],
        backgroundColor: ['#8b5cf6', '#06b6d4', '#f97316'],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  // ✅ EJECUTAR NUEVOS CÁLCULOS
  const breakEvenAnalysis = calculateBreakEvenPoint();
  const vatAnalysis = calculateVATAnalysis();
  const taxAnalysis = calculateTaxOnIncome();

  return (
    <div className="financial-results-professional">
      {/* HEADER EJECUTIVO */}
      <div className="financial-executive-summary">
        <div className="financial-summary-header">
          <h2>💰 INFORME FINANCIERO EJECUTIVO</h2>
          <div className={`financial-viability-badge ${npv > 0 ? 'viable' : 'not-viable'}`}>
            {npv > 0 ? '✅ VIABLE FINANCIERAMENTE' : '❌ NO VIABLE FINANCIERAMENTE'}
          </div>
        </div>
        
        <div className="financial-summary-grid">
          <div className="financial-summary-card">
            <h4>Valor Presente Neto</h4>
            <div className={`financial-value ${npv >= 0 ? 'positive' : 'negative'}`}>
              ${npv >= 0 ? '+' : ''}{Math.round(npv).toLocaleString()}
            </div>
            <div className="financial-detail">
              <span>Valor actual de flujos futuros</span>
            </div>
          </div>
          
          <div className="financial-summary-card">
            <h4>Tasa Interna Retorno</h4>
            <div className={`financial-value ${irr > wacc ? 'positive' : 'warning'}`}>
              {Math.round(irr * 100)}%
            </div>
            <div className="financial-detail">
              <span>WACC: {Math.round(wacc * 100)}%</span>
            </div>
          </div>
          
          <div className="financial-summary-card">
            <h4>Período Recuperación</h4>
            <div className="financial-value">{payback.toFixed(1)} años</div>
            <div className="financial-detail">
              <span>Tiempo de retorno de inversión</span>
            </div>
          </div>
          
          <div className="financial-summary-card">
            <h4>Retorno Inversión</h4>
            <div className={`financial-value ${roi > 0.2 ? 'positive' : 'warning'}`}>
              {Math.round(roi * 100)}%
            </div>
            <div className="financial-detail">
              <span>Return on Investment</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICOS PRINCIPALES */}
      <div className="financial-charts-section">
        <h3>📈 Análisis Gráfico de Rentabilidad</h3>
        <div className="financial-charts-grid">
          
          <div className="financial-chart-card">
            <h5>📊 Indicadores de Rentabilidad</h5>
            <div className="chart-container">
              <Bar 
                data={profitabilityChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Valor (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="financial-chart-card">
            <h5>💵 Proyección Flujo de Caja</h5>
            <div className="chart-container">
              <Line 
                data={cashFlowChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Monto ($)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="financial-chart-card">
            <h5>🏗️ Desglose de Inversión</h5>
            <div className="chart-container">
              <Doughnut 
                data={investmentBreakdownData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* NUEVOS PARÁMETROS FINANCIEROS */}
      <div className="financial-parameters-section">
        <h3>🧮 Parámetros Financieros Detallados</h3>
        <div className="financial-parameters-grid">
          
          {/* PUNTO DE EQUILIBRIO */}
          <div className="parameter-card">
            <div className="parameter-header">
              <h5>⚖️ Punto de Equilibrio</h5>
              <span className="parameter-badge">ANÁLISIS COSTO-VOLUMEN</span>
            </div>
            <div className="parameter-content">
              <div className="parameter-metric">
                <label>Unidades a vender:</label>
                <span className="metric-value">{breakEvenAnalysis.units} unidades</span>
              </div>
              <div className="parameter-metric">
                <label>Ventas mínimas:</label>
                <span className="metric-value">${breakEvenAnalysis.revenue.toLocaleString()}</span>
              </div>
              <div className="parameter-metric">
                <label>Margen contribución:</label>
                <span className="metric-value">{breakEvenAnalysis.contributionMargin.toFixed(1)}%</span>
              </div>
              <div className="parameter-note">
                <small>Punto donde ingresos = costos totales</small>
              </div>
            </div>
          </div>

          {/* IMPUESTO AL VALOR AGREGADO */}
          <div className="parameter-card">
            <div className="parameter-header">
              <h5>🏛️ Impuesto al Valor Agregado (IVA)</h5>
              <span className="parameter-badge">{vatAnalysis.vatRate}% TASA</span>
            </div>
            <div className="parameter-content">
              <div className="parameter-metric">
                <label>IVA Mensual:</label>
                <span className="metric-value">${vatAnalysis.monthlyVAT.toLocaleString()}</span>
              </div>
              <div className="parameter-metric">
                <label>IVA Trimestral:</label>
                <span className="metric-value">${vatAnalysis.quarterlyVAT.toLocaleString()}</span>
              </div>
              <div className="parameter-metric">
                <label>IVA Anual:</label>
                <span className="metric-value">${vatAnalysis.annualVAT.toLocaleString()}</span>
              </div>
              <div className="parameter-note">
                <small>Obligación fiscal mensual/trimestral</small>
              </div>
            </div>
          </div>

          {/* IMPUESTOS SOBRE INGRESOS */}
          <div className="parameter-card">
            <div className="parameter-header">
              <h5>💰 Impuestos sobre Ingresos</h5>
              <span className="parameter-badge">GANANCIAS</span>
            </div>
            <div className="parameter-content">
              <div className="parameter-metric">
                <label>Ingreso gravable:</label>
                <span className="metric-value">${taxAnalysis.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="parameter-metric">
                <label>Impuesto ganancias:</label>
                <span className="metric-value">${taxAnalysis.incomeTax.toLocaleString()}</span>
              </div>
              <div className="parameter-metric">
                <label>Utilidad neta:</label>
                <span className="metric-value">${taxAnalysis.netIncome.toLocaleString()}</span>
              </div>
              <div className="parameter-metric">
                <label>Tasa efectiva:</label>
                <span className="metric-value">{taxAnalysis.effectiveTaxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ANÁLISIS DE INVERSIÓN DETALLADO */}
      <div className="investment-analysis-section">
        <h3>🏦 Análisis Detallado de Inversión</h3>
        <div className="investment-analysis-grid">
          
          <div className="investment-card">
            <h5>💼 Inversión Total Requerida</h5>
            <div className="investment-breakdown">
              <div className="investment-item">
                <span>Inversión inicial:</span>
                <span>${Math.round(formData.financial?.investment || 0).toLocaleString()}</span>
              </div>
              <div className="investment-item">
                <span>Capital de trabajo:</span>
                <span>${Math.round(workingCapital).toLocaleString()}</span>
              </div>
              <div className="investment-item total">
                <span>Inversión total:</span>
                <span>${Math.round(totalInvestment).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="investment-card">
            <h5>📊 Flujo de Caja Operativo</h5>
            <div className="cashflow-breakdown">
              <div className="cashflow-item">
                <span>Flujo anual después de impuestos:</span>
                <span>${Math.round(afterTaxCashFlow).toLocaleString()}</span>
              </div>
              <div className="cashflow-item">
                <span>Depreciación anual:</span>
                <span>${Math.round(depreciation).toLocaleString()}</span>
              </div>
              <div className="cashflow-item">
                <span>Margen operativo:</span>
                <span>{Math.round((afterTaxCashFlow / (formData.financial?.projectedRevenue || 1)) * 100)}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ANÁLISIS DE SENSIBILIDAD Y RIESGO */}
      <div className="sensitivity-analysis-section">
        <h3>🎯 Análisis de Sensibilidad y Riesgo</h3>
        <div className="sensitivity-grid">
          
          <div className="sensitivity-card">
            <h5>📈 Escenarios de Proyección</h5>
            <div className="scenarios-list">
              <div className={`scenario-item ${scenarios.optimistic ? 'optimistic' : ''}`}>
                <span className="scenario-label">Optimista (+25%):</span>
                <span className="scenario-value">VAN ${Math.round(scenarios.optimistic?.npv || 0).toLocaleString()}</span>
              </div>
              <div className="scenario-item base">
                <span className="scenario-label">Base:</span>
                <span className="scenario-value">VAN ${Math.round(npv).toLocaleString()}</span>
              </div>
              <div className={`scenario-item ${scenarios.pessimistic ? 'pessimistic' : ''}`}>
                <span className="scenario-label">Pesimista (-35%):</span>
                <span className="scenario-value">VAN ${Math.round(scenarios.pessimistic?.npv || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="sensitivity-card">
            <h5>⚠️ Perfil de Riesgo</h5>
            <div className="risk-profile">
              <div className="risk-metric">
                <label>Nivel de riesgo:</label>
                <span className={`risk-level ${riskMetrics.level?.toLowerCase()}`}>
                  {riskMetrics.level}
                </span>
              </div>
              <div className="risk-metric">
                <label>Puntuación riesgo:</label>
                <span className="risk-score">{riskMetrics.score}/100</span>
              </div>
              <div className="risk-description">
                {riskMetrics.description}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RECOMENDACIONES FINANCIERAS */}
      {suggestions && suggestions.length > 0 && (
        <div className="financial-recommendations-section">
          <h3>💡 Recomendaciones Financieras</h3>
          <div className="financial-recommendations-grid">
            {suggestions
              .filter(suggestion => suggestion.type && suggestion.type.includes('FINANCIAL'))
              .map((suggestion, index) => (
                <div key={index} className={`financial-recommendation-card ${suggestion.priority?.toLowerCase() || 'medium'}`}>
                  <div className="financial-recommendation-header">
                    <h5>{suggestion.title}</h5>
                    <span className={`financial-priority-badge ${suggestion.priority?.toLowerCase() || 'medium'}`}>
                      {suggestion.priority || 'MEDIUM'}
                    </span>
                  </div>
                  <div className="financial-recommendation-content">
                    <ul>
                      {suggestion.items && suggestion.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CONCLUSIÓN FINANCIERA */}
      <div className="financial-conclusion-section">
        <div className={`financial-conclusion ${npv > 0 ? 'positive' : 'negative'}`}>
          <h3>🎯 Conclusión de Viabilidad Financiera</h3>
          <div className="financial-conclusion-content">
            <div className="financial-conclusion-header">
              <span className="financial-conclusion-icon">
                {npv > 0 ? '✅' : '❌'}
              </span>
              <h4>
                {npv > 0 ? 
                  'EL PROYECTO ES FINANCIERAMENTE VIABLE' : 
                  'EL PROYECTO NO ES FINANCIERAMENTE VIABLE'
                }
              </h4>
            </div>
            
            <div className="financial-conclusion-details">
              <p><strong>Evaluación General:</strong> {npv > 0 ? 
                'El proyecto genera valor económico y supera el costo de capital requerido.' :
                'El proyecto no genera suficiente valor para justificar la inversión.'
              }</p>
              
              <div className="financial-conclusion-metrics">
                <div className="financial-conclusion-metric">
                  <label>Valor Presente Neto</label>
                  <span className={`financial-metric-value ${npv >= 0 ? 'good' : 'poor'}`}>
                    ${Math.round(npv).toLocaleString()}
                  </span>
                </div>
                <div className="financial-conclusion-metric">
                  <label>TIR vs WACC</label>
                  <span className={`financial-metric-value ${irr > wacc ? 'good' : 'poor'}`}>
                    {Math.round(irr * 100)}% vs {Math.round(wacc * 100)}%
                  </span>
                </div>
                <div className="financial-conclusion-metric">
                  <label>Período Recuperación</label>
                  <span className={`financial-metric-value ${payback <= 3 ? 'good' : payback <= 5 ? 'medium' : 'poor'}`}>
                    {payback.toFixed(1)} años
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