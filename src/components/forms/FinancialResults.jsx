// src/components/forms/FinancialResults.jsx - VERSIÓN CON ESTILOS ÚNICOS
import React from "react";
import '../../styles/components/forms/financial-results.css'; // ✅ Importar estilos únicos

export const FinancialResults = React.memo(({ calculations, formData }) => {
  const { financial, overall, suggestions } = calculations || {};

  // Ocultar resultados si no hay datos financieros suficientes
  const hasBasicData = formData.financial && (
    formData.financial.investment > 0 || 
    formData.financial.projectedRevenue > 0
  );

  if (!hasBasicData) {
    return (
      <div className="financial-results-container">
        <div className="financial-results-message">
          <p>💡 Complete los datos financieros básicos para ver resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-results-container">
      <h4 className="financial-results-title">📊 Resumen Financiero</h4>

      <div className="financial-results-grid">
        <FinancialResultCard 
          label="VAN (Valor Actual Neto)"
          value={financial.npv}
          badge={financial.npv > 0 ? "✅ Viable" : "❌ No viable"}
          badgeType={financial.npv > 0 ? "success" : "danger"}
          help="Valor presente de los flujos futuros"
          format="currency"
        />

        <FinancialResultCard 
          label="TIR (Tasa Interna de Retorno)"
          value={financial.irr}
          badge={financial.irr > 0.08 ? "✅ Meta" : "⚠️ Baja"}
          badgeType={financial.irr > 0.08 ? "success" : "warning"}
          help="Mínimo requerido: 8%"
          format="percentage"
        />

        <FinancialResultCard 
          label="Período de Recuperación"
          value={financial.payback}
          badge={financial.payback <= 3 ? "🚀 Rápido" : "📅 Normal"}
          badgeType={financial.payback <= 3 ? "success" : "info"}
          help="Tiempo para recuperar inversión"
          format="years"
        />
      </div>

      {/* Información de Rentabilidad Básica */}
      <FinancialProfitabilitySummary 
        financial={financial}
        formData={formData}
      />

      {/* Sugerencias - Mantener solo si son útiles */}
      {suggestions && suggestions.length > 0 && (
        <FinancialSuggestionsList suggestions={suggestions} />
      )}
    </div>
  );
});

// ✅ Renombrar componentes internos para evitar conflictos
const FinancialResultCard = ({ label, value, badge, badgeType, help, format }) => {
  const formatValue = (val, type) => {
    if (type === "currency") {
      return `$${val?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) || "0"}`;
    }
    if (type === "percentage") {
      return `${(val * 100)?.toFixed(2) || "0"}%`;
    }
    if (type === "years") {
      return `${val?.toFixed(1) || "0"} años`;
    }
    return val;
  };

  return (
    <div className="financial-result-card">
      <div className="financial-result-header">
        <span className="financial-result-label">{label}</span>
        <span className={`financial-result-badge financial-badge--${badgeType}`}>
          {badge}
        </span>
      </div>
      <div className={`financial-result-value ${
        value > 0 && label.includes('VAN') ? 'financial-value--positive' : 
        value < 0 && label.includes('VAN') ? 'financial-value--negative' : 
        value < 0.08 && label.includes('TIR') ? 'financial-value--warning' : ''
      }`}>
        {formatValue(value, format)}
      </div>
      <div className="financial-result-help">{help}</div>
    </div>
  );
};

const FinancialProfitabilitySummary = ({ financial, formData }) => {
  const netMargin = formData.financial?.projectedRevenue > 0 
    ? (financial.annualCashFlow / formData.financial.projectedRevenue) * 100 
    : 0;

  const annualROI = formData.financial?.investment > 0 
    ? (financial.annualCashFlow / formData.financial.investment) * 100 
    : 0;

  return (
    <div className="financial-profitability-analysis">
      <h5 className="financial-analysis-title">📈 Métricas de Rentabilidad</h5>
      <div className="financial-analysis-grid">
        <div className="financial-analysis-item">
          <div className="financial-analysis-label">Flujo de Caja Anual</div>
          <div className={`financial-analysis-value ${
            financial.annualCashFlow > 0 ? 'financial-value--positive' : 'financial-value--negative'
          }`}>
            ${financial.annualCashFlow?.toLocaleString() || "0"}
          </div>
          <div className="financial-analysis-help">Ingresos - Costos operativos</div>
        </div>

        <div className="financial-analysis-item">
          <div className="financial-analysis-label">Margen Neto</div>
          <div className="financial-analysis-value">
            {netMargin.toFixed(1)}%
          </div>
          <div className="financial-analysis-help">Porcentaje de ganancia</div>
        </div>

        <div className="financial-analysis-item">
          <div className="financial-analysis-label">ROI Anual</div>
          <div className="financial-analysis-value">
            {annualROI.toFixed(1)}%
          </div>
          <div className="financial-analysis-help">Retorno sobre inversión</div>
        </div>
      </div>
    </div>
  );
};

const FinancialSuggestionsList = ({ suggestions }) => (
  <div className="financial-suggestions-section">
    <h5 className="financial-suggestions-title">💡 Recomendaciones</h5>
    <div className="financial-suggestions-list">
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <div key={index} className="financial-suggestion-item">
          <div className="financial-suggestion-message">{suggestion.mensaje}</div>
          <ul className="financial-suggestion-list">
            {suggestion.sugerencias.slice(0, 2).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);