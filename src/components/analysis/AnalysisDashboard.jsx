// src/components/analysis/AnalysisDashboard.jsx
import React from 'react';
import { Charts } from '../results/Charts';
import { OptimizeButton } from '../actions/OptimizeButton';
import { OptimizationModal } from '../actions/OptimizationModal';

export const AnalysisDashboard = ({ 
  calculations, 
  formData, 
  onOptimize,
  showOptimization,
  recommendations,
  onCloseOptimization,
  onApplyOptimizations 
}) => {
  return (
    <div className="analysis-dashboard">
      {/* Header del análisis */}
      <div className="analysis-header">
        <h1>📊 Análisis Completo del Proyecto</h1>
        <p>Resultados detallados y visualizaciones de viabilidad</p>
      </div>

      {/* Resumen ejecutivo destacado */}
      <div className="executive-summary-card">
        <div className="viability-badge">
          <span className={`status ${calculations?.overall?.viable ? 'viable' : 'not-viable'}`}>
            {calculations?.overall?.viable ? '✅ VIABLE' : '❌ NO VIABLE'}
          </span>
          <span className="score">Puntuación: {calculations?.overall?.score?.toFixed(1)}%</span>
        </div>
        
        <OptimizeButton 
          onOptimize={onOptimize}
          calculations={calculations}
          formData={formData}
        />
      </div>

      {/* Gráficos y visualizaciones */}
      <div className="charts-section">
        <Charts calculations={calculations} formData={formData} />
      </div>

      {/* Modal de optimización */}
      <OptimizationModal
        isOpen={showOptimization}
        onClose={onCloseOptimization}
        recommendations={recommendations}
        onApply={onApplyOptimizations}
      />
    </div>
  );
};