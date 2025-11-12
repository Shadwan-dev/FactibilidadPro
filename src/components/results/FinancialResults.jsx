// src/components/results/FinancialResults.jsx
import React from 'react';

export const FinancialResults = ({ calculations }) => {
  if (!calculations || !calculations.financial) {
    return (
      <div className="results-section">
        <h3>Resultados Financieros</h3>
        <div className="empty-state">
          Complete los datos financieros para ver los resultados
        </div>
      </div>
    );
  }

  const { npv, irr, payback, annualCashFlow } = calculations.financial;

  const safeNPV = typeof npv === 'number' ? npv : 0;
  const safeIRR = typeof irr === 'number' ? irr : 0;
  const safePayback = typeof payback === 'number' ? payback : 0;
  const safeAnnualCashFlow = typeof annualCashFlow === 'number' ? annualCashFlow : 0;

  return (
    <div className="results-section">
      <h3>Resultados Financieros</h3>
      
      <div className="results-grid">
        <div className="result-card">
          <h4>Valor Presente Neto</h4>
          <span className={safeNPV >= 0 ? 'positive' : 'negative'}>
            ${safeNPV.toFixed(2)}
          </span>
          <small>{safeNPV >= 0 ? '✅ Rentable' : '❌ No rentable'}</small>
        </div>

        <div className="result-card">
          <h4>Tasa Interna de Retorno</h4>
          <span className={safeIRR >= 0.08 ? 'positive' : 'negative'}>
            {(safeIRR * 100).toFixed(2)}%
          </span>
          <small>Meta: 8% mínimo</small>
        </div>

        <div className="result-card">
          <h4>Período de Recuperación</h4>
          <span>{safePayback.toFixed(1)} años</span>
          <small>Tiempo para recuperar inversión</small>
        </div>

        <div className="result-card">
          <h4>Flujo de Caja Anual</h4>
          <span className={safeAnnualCashFlow >= 0 ? 'positive' : 'negative'}>
            ${safeAnnualCashFlow.toFixed(2)}
          </span>
          <small>Flujo neto anual</small>
        </div>
      </div>

      <div className={`feasibility-indicator ${safeNPV > 0 ? 'green' : 'red'}`}>
        <h4>Viabilidad Financiera: {safeNPV > 0 ? 'VIABLE' : 'NO VIABLE'}</h4>
        <p>El proyecto {safeNPV > 0 ? 'genera valor' : 'no genera valor'} económico</p>
        {safeNPV > 0 && safeIRR > 0.08 && (
          <p>✅ Cumple con criterios de rentabilidad</p>
        )}
      </div>
    </div>
  );
};