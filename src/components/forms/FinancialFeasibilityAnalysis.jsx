// src/components/forms/FinancialFeasibilityAnalysis.jsx
import React from 'react';

export const FinancialFeasibilityAnalysis = React.memo(({ calculations, formData }) => {
  const { financial } = calculations || {};

  if (!financial || !formData.financial) {
    return (
      <div className="financial-analysis">
        <div className="analysis-placeholder">
          <h4>📈 Análisis de Factibilidad Financiera</h4>
          <p>Complete los datos financieros para ver el análisis detallado</p>
        </div>
      </div>
    );
  }

  // Cálculos adicionales para el análisis
  const analysisData = calculateFinancialAnalysis(formData.financial, financial);

  return (
    <div className="financial-feasibility-analysis">
      <div className="analysis-header">
        <h4>📈 Análisis Completo de Factibilidad Financiera</h4>
        <p>Evaluación detallada de todos los indicadores financieros del proyecto</p>
      </div>

      {/* Resumen Ejecutivo */}
      <ExecutiveSummary analysisData={analysisData} />

      {/* Análisis de Rentabilidad */}
      <ProfitabilityAnalysis analysisData={analysisData} />

      {/* Análisis de Liquidez */}
      <LiquidityAnalysis analysisData={analysisData} />

      {/* Análisis de Endeudamiento */}
      <LeverageAnalysis analysisData={analysisData} />

      {/* Análisis de Sensibilidad */}
      <SensitivityAnalysis analysisData={analysisData} />

      {/* Punto de Equilibrio */}
      <BreakEvenAnalysis analysisData={analysisData} />

      {/* Análisis de Riesgo */}
      <RiskAnalysis analysisData={analysisData} />

      {/* Conclusiones y Recomendaciones */}
      <Conclusions analysisData={analysisData} />
    </div>
  );
});

// Cálculos financieros avanzados
const calculateFinancialAnalysis = (formData, financial) => {
  const investment = formData.investment || 0;
  const projectedRevenue = formData.projectedRevenue || 0;
  const operatingCosts = calculateTotalOperatingCosts(formData);
  const annualCashFlow = financial.annualCashFlow || 0;

  // Ratios de Rentabilidad
  const netProfitMargin = projectedRevenue > 0 ? (annualCashFlow / projectedRevenue) * 100 : 0;
  const grossProfitMargin = projectedRevenue > 0 ? ((projectedRevenue - operatingCosts) / projectedRevenue) * 100 : 0;
  const roi = investment > 0 ? (annualCashFlow / investment) * 100 : 0;
  const roe = formData.capital?.[0]?.amount > 0 ? (annualCashFlow / formData.capital[0].amount) * 100 : 0;

  // Ratios de Liquidez
  const currentRatio = calculateCurrentRatio(formData);
  const quickRatio = calculateQuickRatio(formData);
  const workingCapital = calculateWorkingCapital(formData);

  // Ratios de Endeudamiento
  const debtRatio = calculateDebtRatio(formData);
  const debtToEquity = calculateDebtToEquity(formData);
  const interestCoverage = calculateInterestCoverage(formData, annualCashFlow);

  // Punto de Equilibrio
  const breakEvenPoint = calculateBreakEvenPoint(formData);
  
  // Análisis de Sensibilidad
  const sensitivityAnalysis = calculateSensitivityAnalysis(formData, financial);

  return {
    // Básicos
    investment,
    projectedRevenue,
    operatingCosts,
    annualCashFlow,
    
    // Rentabilidad
    netProfitMargin,
    grossProfitMargin,
    roi,
    roe,
    npv: financial.npv,
    irr: financial.irr,
    payback: financial.payback,
    
    // Liquidez
    currentRatio,
    quickRatio,
    workingCapital,
    
    // Endeudamiento
    debtRatio,
    debtToEquity,
    interestCoverage,
    
    // Punto de Equilibrio
    breakEvenPoint,
    
    // Sensibilidad
    sensitivityAnalysis,
    
    // Estado general
    isViable: financial.npv > 0 && financial.irr > 0.08,
    riskLevel: calculateRiskLevel(financial, formData),
    recommendation: generateOverallRecommendation(financial, formData)
  };
};

// Componentes de Análisis Individuales
const ExecutiveSummary = ({ analysisData }) => (
  <div className="analysis-section executive-summary">
    <h5>📋 Resumen Ejecutivo</h5>
    <div className="executive-cards">
      <div className={`executive-card ${analysisData.isViable ? 'viable' : 'not-viable'}`}>
        <div className="executive-icon">
          {analysisData.isViable ? '✅' : '❌'}
        </div>
        <div className="executive-content">
          <h6>Veredicto de Factibilidad</h6>
          <p>
            {analysisData.isViable 
              ? 'EL PROYECTO ES FINANCIERAMENTE VIABLE' 
              : 'EL PROYECTO NO ES FINANCIERAMENTE VIABLE'
            }
          </p>
          <small>
            {analysisData.isViable
              ? 'Cumple con los criterios mínimos de rentabilidad y riesgo'
              : 'No cumple con los criterios mínimos de rentabilidad'
            }
          </small>
        </div>
      </div>

      <div className="executive-card">
        <div className="executive-icon">💰</div>
        <div className="executive-content">
          <h6>Inversión Requerida</h6>
          <p>${analysisData.investment.toLocaleString()}</p>
          <small>Capital necesario para implementación</small>
        </div>
      </div>

      <div className="executive-card">
        <div className="executive-icon">📈</div>
        <div className="executive-content">
          <h6>Retorno Anual Esperado</h6>
          <p>${analysisData.annualCashFlow.toLocaleString()}</p>
          <small>Flujo de caja anual proyectado</small>
        </div>
      </div>
    </div>
  </div>
);

const ProfitabilityAnalysis = ({ analysisData }) => (
  <div className="analysis-section profitability-analysis">
    <h5>💰 Análisis de Rentabilidad</h5>
    <div className="profitability-grid">
      <RatioCard
        label="Margen de Ganancia Neta"
        value={analysisData.netProfitMargin}
        format="percentage"
        benchmark={15}
        description="Porcentaje de ganancia después de todos los costos"
      />
      <RatioCard
        label="ROI (Retorno sobre Inversión)"
        value={analysisData.roi}
        format="percentage"
        benchmark={20}
        description="Retorno anual sobre la inversión total"
      />
      <RatioCard
        label="ROE (Retorno sobre Patrimonio)"
        value={analysisData.roe}
        format="percentage"
        benchmark={15}
        description="Retorno sobre el capital propio invertido"
      />
      <RatioCard
        label="Margen Bruto"
        value={analysisData.grossProfitMargin}
        format="percentage"
        benchmark={30}
        description="Margen después de costos directos"
      />
    </div>

    <div className="profitability-insights">
      <h6>🔍 Insights de Rentabilidad</h6>
      <ul>
        {analysisData.netProfitMargin < 10 && (
          <li>El margen neto es bajo, considera optimizar costos operativos</li>
        )}
        {analysisData.roi < 15 && (
          <li>El ROI podría mejorarse con mayor eficiencia operativa</li>
        )}
        {analysisData.grossProfitMargin > 40 && (
          <li>Excelente margen bruto, indica buen control de costos directos</li>
        )}
      </ul>
    </div>
  </div>
);

const LiquidityAnalysis = ({ analysisData }) => (
  <div className="analysis-section liquidity-analysis">
    <h5>💧 Análisis de Liquidez</h5>
    <div className="liquidity-grid">
      <RatioCard
        label="Capital de Trabajo"
        value={analysisData.workingCapital}
        format="currency"
        benchmark={analysisData.operatingCosts / 6} // 2 meses de operación
        description="Recursos disponibles para operaciones diarias"
      />
      <RatioCard
        label="Razón Corriente"
        value={analysisData.currentRatio}
        format="decimal"
        benchmark={1.5}
        description="Capacidad para pagar obligaciones a corto plazo"
      />
      <RatioCard
        label="Prueba Ácida"
        value={analysisData.quickRatio}
        format="decimal"
        benchmark={1.0}
        description="Liquidez inmediata sin inventarios"
      />
    </div>

    <div className="liquidity-warnings">
      {analysisData.currentRatio < 1 && (
        <div className="warning critical">
          ⚠️ <strong>Alerta de Liquidez:</strong> Razón corriente menor a 1 indica posibles problemas para pagar deudas cortas
        </div>
      )}
      {analysisData.workingCapital < 0 && (
        <div className="warning critical">
          ⚠️ <strong>Capital de Trabajo Negativo:</strong> El proyecto requiere financiamiento adicional para operar
        </div>
      )}
    </div>
  </div>
);

const LeverageAnalysis = ({ analysisData }) => (
  <div className="analysis-section leverage-analysis">
    <h5>⚖️ Análisis de Endeudamiento</h5>
    <div className="leverage-grid">
      <RatioCard
        label="Nivel de Endeudamiento"
        value={analysisData.debtRatio}
        format="percentage"
        benchmark={60}
        description="Porcentaje de activos financiados con deuda"
      />
      <RatioCard
        label="Deuda/Patrimonio"
        value={analysisData.debtToEquity}
        format="decimal"
        benchmark={1.5}
        description="Relación entre financiamiento externo y propio"
      />
      <RatioCard
        label="Cobertura de Intereses"
        value={analysisData.interestCoverage}
        format="decimal"
        benchmark={3}
        description="Capacidad para pagar intereses de deuda"
      />
    </div>

    <div className="leverage-recommendations">
      {analysisData.debtRatio > 70 && (
        <div className="recommendation warning">
          💡 <strong>Recomendación:</strong> El nivel de endeudamiento es alto, considera aumentar capital propio
        </div>
      )}
      {analysisData.interestCoverage < 2 && (
        <div className="recommendation critical">
          💡 <strong>Recomendación:</strong> Cobertura de intereses baja, riesgo de impago de deuda
        </div>
      )}
    </div>
  </div>
);

const BreakEvenAnalysis = ({ analysisData }) => (
  <div className="analysis-section breakeven-analysis">
    <h5>⚖️ Punto de Equilibrio</h5>
    <div className="breakeven-cards">
      <div className="breakeven-card">
        <div className="breakeven-label">Punto de Equilibrio en Unidades</div>
        <div className="breakeven-value">{analysisData.breakEvenPoint.units?.toLocaleString() || 'N/A'}</div>
        <div className="breakeven-help">Unidades necesarias para cubrir costos</div>
      </div>
      <div className="breakeven-card">
        <div className="breakeven-label">Punto de Equilibrio en Ventas</div>
        <div className="breakeven-value">${analysisData.breakEvenPoint.sales?.toLocaleString() || 'N/A'}</div>
        <div className="breakeven-help">Ventas necesarias para cubrir costos</div>
      </div>
      <div className="breakeven-card">
        <div className="breakeven-label">Margen de Seguridad</div>
        <div className="breakeven-value">{analysisData.breakEvenPoint.margin?.toFixed(1)}%</div>
        <div className="breakeven-help">Tolerancia a disminución en ventas</div>
      </div>
    </div>
  </div>
);

const SensitivityAnalysis = ({ analysisData }) => (
  <div className="analysis-section sensitivity-analysis">
    <h5>🎯 Análisis de Sensibilidad</h5>
    <div className="sensitivity-scenarios">
      <div className="scenario">
        <h6>Escenario Pesimista (-20% Ingresos)</h6>
        <div className="scenario-result">
          VAN: ${analysisData.sensitivityAnalysis.pessimistic.npv.toLocaleString()} | 
          TIR: {(analysisData.sensitivityAnalysis.pessimistic.irr * 100).toFixed(1)}%
        </div>
      </div>
      <div className="scenario">
        <h6>Escenario Base</h6>
        <div className="scenario-result">
          VAN: ${analysisData.sensitivityAnalysis.base.npv.toLocaleString()} | 
          TIR: {(analysisData.sensitivityAnalysis.base.irr * 100).toFixed(1)}%
        </div>
      </div>
      <div className="scenario">
        <h6>Escenario Optimista (+20% Ingresos)</h6>
        <div className="scenario-result">
          VAN: ${analysisData.sensitivityAnalysis.optimistic.npv.toLocaleString()} | 
          TIR: {(analysisData.sensitivityAnalysis.optimistic.irr * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  </div>
);

const RiskAnalysis = ({ analysisData }) => (
  <div className="analysis-section risk-analysis">
    <h5>⚠️ Análisis de Riesgo</h5>
    <div className="risk-indicators">
      <div className={`risk-indicator ${analysisData.riskLevel}`}>
        <div className="risk-level">{analysisData.riskLevel.toUpperCase()}</div>
        <div className="risk-description">
          {analysisData.riskLevel === 'bajo' && 'Riesgo aceptable para inversión'}
          {analysisData.riskLevel === 'medio' && 'Riesgo moderado, requiere monitoreo'}
          {analysisData.riskLevel === 'alto' && 'Riesgo elevado, reconsiderar inversión'}
        </div>
      </div>
    </div>
    
    <div className="risk-factors">
      <h6>Factores de Riesgo Identificados:</h6>
      <ul>
        {analysisData.payback > 5 && <li>Período de recuperación extenso</li>}
        {analysisData.debtRatio > 60 && <li>Alto nivel de endeudamiento</li>}
        {analysisData.currentRatio < 1.2 && <li>Baja liquidez corriente</li>}
        {analysisData.breakEvenPoint.margin < 20 && <li>Margen de seguridad reducido</li>}
      </ul>
    </div>
  </div>
);

const Conclusions = ({ analysisData }) => (
  <div className="analysis-section conclusions">
    <h5>🎯 Conclusiones y Recomendaciones Finales</h5>
    <div className="conclusions-content">
      <div className="conclusion-card">
        <h6>Recomendación de Inversión</h6>
        <p>{analysisData.recommendation}</p>
      </div>
      
      <div className="key-metrics">
        <h6>Métricas Clave</h6>
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">VAN</span>
            <span className={`metric-value ${analysisData.npv > 0 ? 'positive' : 'negative'}`}>
              ${analysisData.npv.toLocaleString()}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">TIR</span>
            <span className="metric-value">{(analysisData.irr * 100).toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Payback</span>
            <span className="metric-value">{analysisData.payback.toFixed(1)} años</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente auxiliar para ratios
const RatioCard = ({ label, value, format, benchmark, description }) => {
  const formatValue = (val, fmt) => {
    if (fmt === 'percentage') return `${val.toFixed(1)}%`;
    if (fmt === 'currency') return `$${val.toLocaleString()}`;
    if (fmt === 'decimal') return val.toFixed(2);
    return val;
  };

  const getStatus = (val, bench) => {
    if (bench === undefined) return 'neutral';
    return val >= bench ? 'good' : 'warning';
  };

  const status = getStatus(value, benchmark);

  return (
    <div className={`ratio-card ratio-card--${status}`}>
      <div className="ratio-header">
        <span className="ratio-label">{label}</span>
        <span className="ratio-badge">{status === 'good' ? '✅' : '⚠️'}</span>
      </div>
      <div className="ratio-value">{formatValue(value, format)}</div>
      {benchmark && (
        <div className="ratio-benchmark">Meta: {formatValue(benchmark, format)}</div>
      )}
      <div className="ratio-description">{description}</div>
    </div>
  );
};

// Funciones auxiliares de cálculo (implementar según tu lógica)
const calculateTotalOperatingCosts = (formData) => {
  // Implementar cálculo de costos operativos totales
  return (formData.operatingCosts || []).reduce((sum, cost) => sum + (cost.amount || 0), 0);
};

const calculateCurrentRatio = (formData) => {
  // Implementar cálculo de razón corriente
  return 1.8; // Ejemplo
};

const calculateQuickRatio = (formData) => {
  // Implementar cálculo de prueba ácida
  return 1.2; // Ejemplo
};

const calculateWorkingCapital = (formData) => {
  // Implementar cálculo de capital de trabajo
  return 50000; // Ejemplo
};

const calculateDebtRatio = (formData) => {
  // Implementar cálculo de nivel de endeudamiento
  return 45; // Ejemplo
};

const calculateDebtToEquity = (formData) => {
  // Implementar cálculo de deuda/patrimonio
  return 0.8; // Ejemplo
};

const calculateInterestCoverage = (formData, annualCashFlow) => {
  // Implementar cálculo de cobertura de intereses
  return 4.5; // Ejemplo
};

const calculateBreakEvenPoint = (formData) => {
  // Implementar cálculo de punto de equilibrio
  return {
    units: 1000,
    sales: 50000,
    margin: 25
  };
};

const calculateSensitivityAnalysis = (formData, financial) => {
  // Implementar análisis de sensibilidad
  return {
    pessimistic: { npv: financial.npv * 0.6, irr: financial.irr * 0.8 },
    base: { npv: financial.npv, irr: financial.irr },
    optimistic: { npv: financial.npv * 1.4, irr: financial.irr * 1.2 }
  };
};

const calculateRiskLevel = (financial, formData) => {
  // Implementar cálculo de nivel de riesgo
  if (financial.npv > 50000 && financial.irr > 0.15) return 'bajo';
  if (financial.npv > 0 && financial.irr > 0.08) return 'medio';
  return 'alto';
};

const generateOverallRecommendation = (financial, formData) => {
  if (financial.npv > 0 && financial.irr > 0.12) {
    return 'INVERSIÓN RECOMENDADA - Alto potencial de retorno y bajo riesgo';
  } else if (financial.npv > 0 && financial.irr > 0.08) {
    return 'INVERSIÓN CONDICIONAL - Requiere monitoreo cuidadoso de supuestos';
  } else {
    return 'INVERSIÓN NO RECOMENDADA - No cumple criterios mínimos de rentabilidad';
  }
};
// En tu hook useFeasibilityCalculations o archivo separado
export const calculateAdvancedFinancialRatios = (formData) => {
  const financial = formData.financial || {};
  
  // Cálculos reales basados en tus datos
  const totalAssets = financial.investment || 0;
  const totalLiabilities = (financial.bankCredit || []).reduce((sum, credit) => 
    sum + (credit.amount || 0), 0
  );
  const equity = (financial.capital || []).reduce((sum, cap) => 
    sum + (cap.amount || 0), 0
  );
  const currentAssets = totalAssets * 0.6; // Supuesto
  const currentLiabilities = totalLiabilities * 0.4; // Supuesto
  const inventory = totalAssets * 0.2; // Supuesto
  
  return {
    // Ratios de Liquidez
    currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
    quickRatio: currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0,
    workingCapital: currentAssets - currentLiabilities,
    
    // Ratios de Endeudamiento
    debtRatio: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0,
    debtToEquity: equity > 0 ? totalLiabilities / equity : 0,
    
    // Punto de Equilibrio (simplificado)
    breakEvenPoint: calculateRealBreakEven(financial),
    
    // Sensibilidad
    sensitivityAnalysis: calculateRealSensitivity(financial)
  };
};

const calculateRealBreakEven = (financial) => {
  const fixedCosts = (financial.operatingCosts || []).reduce((sum, cost) => 
    cost.type === 'fixed' ? sum + (cost.amount || 0) : sum, 0
  );
  const variableCostRate = 0.6; // Supuesto 60% costos variables
  const pricePerUnit = 100; // Supuesto
  
  const contributionMargin = pricePerUnit * (1 - variableCostRate);
  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenSales = breakEvenUnits * pricePerUnit;
  
  const currentSales = financial.projectedRevenue || 0;
  const safetyMargin = currentSales > 0 ? ((currentSales - breakEvenSales) / currentSales) * 100 : 0;
  
  return {
    units: Math.ceil(breakEvenUnits),
    sales: Math.ceil(breakEvenSales),
    margin: Math.max(0, safetyMargin)
  };
};

const calculateRealSensitivity = (financial) => {
  const baseNPV = financial.npv || 0;
  const baseIRR = financial.irr || 0;
  
  return {
    pessimistic: {
      npv: baseNPV * 0.7, // -30%
      irr: baseIRR * 0.8  // -20%
    },
    base: {
      npv: baseNPV,
      irr: baseIRR
    },
    optimistic: {
      npv: baseNPV * 1.3, // +30%
      irr: baseIRR * 1.2  // +20%
    }
  };
};

export default FinancialFeasibilityAnalysis;