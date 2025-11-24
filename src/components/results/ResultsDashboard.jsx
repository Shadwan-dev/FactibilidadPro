// src/components/results/ResultsDashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Charts } from './Charts';
import { TechnicalResultsProfessional } from './TechnicalResultsProfessional';
import { MarketResultsProfessional } from './MarketResultsProfessional';
import { FinancialResultsProfessional } from './FinancialResultsProfessional';
import { ExportPDFButton } from '../actions/ExportPDFButton';
import '../../styles/components/results/results-dashboard.css';

export const ResultsDashboard = ({ calculations, formData, projectData = {} }) => {
  const [activeSection, setActiveSection] = useState('charts');
  const [progress, setProgress] = useState(0);
  const dashboardRef = useRef(null);
  
  const sections = [
    { id: 'charts', label: '📊 Dashboard', component: Charts },
    { id: 'financial', label: '💰 Financiero', component: FinancialResultsProfessional },
    { id: 'technical', label: '🔧 Técnico', component: TechnicalResultsProfessional },
    { id: 'market', label: '📈 Mercado', component: MarketResultsProfessional }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (dashboardRef.current) {
        const scrollTop = dashboardRef.current.scrollTop;
        const scrollHeight = dashboardRef.current.scrollHeight - dashboardRef.current.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        setProgress(scrollProgress);
      }
    };

    const dashboardElement = dashboardRef.current;
    if (dashboardElement) {
      dashboardElement.addEventListener('scroll', handleScroll);
      return () => dashboardElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!calculations) {
    return (
      <div className="results-dashboard" ref={dashboardRef}>
        <div className="dashboard-empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>Análisis No Disponible</h3>
          <p>Complete los formularios para generar los reportes de factibilidad</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component;

  // Calcular indicadores rápidos
  const quickIndicators = [
    {
      icon: '💰',
      value: `$${Math.round(calculations.financial?.npv || 0).toLocaleString()}`,
      label: 'Valor Presente Neto',
      trend: calculations.financial?.npv >= 0 ? 'positive' : 'negative'
    },
    {
      icon: '📊',
      value: `${Math.round(calculations.overall?.score || 0)}/100`,
      label: 'Puntuación Total',
      trend: calculations.overall?.score >= 70 ? 'positive' : calculations.overall?.score >= 50 ? 'neutral' : 'negative'
    },
    {
      icon: '⚡',
      value: calculations.overall?.viable ? 'VIABLE' : 'REVISAR',
      label: 'Viabilidad',
      trend: calculations.overall?.viable ? 'positive' : 'negative'
    },
    {
      icon: '🎯',
      value: `${calculations.technical?.detailedAnalysis?.completedAreas || 0}/6`,
      label: 'Áreas Técnicas',
      trend: 'neutral'
    }
  ];

  // Datos del proyecto por defecto si no se proporcionan
  const safeProjectData = {
    name: projectData?.name || 'Proyecto Sin Nombre',
    status: projectData?.status || 'En análisis',
    description: projectData?.description || 'Proyecto de viabilidad',
    ...projectData
  };

  return (
    <div className="results-dashboard" ref={dashboardRef}>
      {/* INDICADOR DE PROGRESO */}
      <div className="progress-indicator">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* HEADER PRINCIPAL */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">Dashboard de Factibilidad</h1>
            <p className="dashboard-subtitle">
              {safeProjectData.name} -{" "}
              {calculations.overall?.viable
                ? "✅ VIABLE"
                : "⚠️ REQUIERE AJUSTES"}
            </p>
          </div>

          <div className="dashboard-actions-header">
            <ExportPDFButton
              projectData={{
                name: projectData?.name || "Proyecto Sin Nombre",
                status: projectData?.status || "En análisis",
                description:
                  projectData?.description || "Proyecto de viabilidad",
                // ✅ AGREGAR DATOS ADICIONALES DEL PROYECTO SI ESTÁN DISPONIBLES
                createdAt: projectData?.createdAt,
                updatedAt: projectData?.updatedAt,
                ...projectData,
              }}
              formData={formData}
              calculations={calculations}
              disabled={!calculations}
            />
          </div>
        </div>
      </div>

      {/* INDICADORES RÁPIDOS */}
      <div className="quick-indicators">
        {quickIndicators.map((indicator, index) => (
          <div key={index} className="quick-indicator">
            <div className="indicator-icon">{indicator.icon}</div>
            <div className="indicator-value">{indicator.value}</div>
            <div className="indicator-label">{indicator.label}</div>
            <div className={`indicator-trend ${indicator.trend}`}>
              {indicator.trend === "positive"
                ? "✅ Favorable"
                : indicator.trend === "negative"
                ? "⚠️ Mejorable"
                : "📊 Neutral"}
            </div>
          </div>
        ))}
      </div>

      {/* NAVEGACIÓN */}
      <div className="dashboard-navigation">
        <div className="nav-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-tab ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="dashboard-content">
        {ActiveComponent && (
          <div className="dashboard-section">
            <ActiveComponent calculations={calculations} formData={formData} />
          </div>
        )}
      </div>

      {/* ACCIONES */}
      <div className="dashboard-actions">
        <button className="action-button primary">💾 Guardar Análisis</button>
        <button className="action-button success">🚀 Plan de Acción</button>
      </div>
    </div>
  );
};