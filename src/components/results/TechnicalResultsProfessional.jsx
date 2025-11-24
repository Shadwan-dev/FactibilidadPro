// src/components/results/TechnicalResultsProfessional.jsx
import React from 'react';
import '../../styles/components/results/TechnicalResultsProfessional.css';

export const TechnicalResultsProfessional = ({ calculations, formData }) => {
  if (!calculations || !calculations.technical) {
    return (
      <div className="professional-technical-results">
        <div className="empty-state-technical">
          <h3>🔧 Análisis Técnico Integral</h3>
          <p>Complete los datos técnicos para generar el análisis de viabilidad técnica</p>
        </div>
      </div>
    );
  }

  const { 
    technical, 
    overall,
    suggestions 
  } = calculations;

  const {
    score,
    viable,
    level,
    detailedAnalysis
  } = technical;

  return (
    <div className="professional-technical-results">
      {/* HEADER EJECUTIVO */}
      <div className="technical-executive-summary">
        <div className="technical-summary-header">
          <h2>🔧 INFORME TÉCNICO EJECUTIVO</h2>
          <div className={`technical-viability-badge ${viable ? 'viable' : 'not-viable'}`}>
            {viable ? '✅ VIABLE TÉCNICAMENTE' : '❌ NO VIABLE TÉCNICAMENTE'}
          </div>
        </div>
        
        <div className="technical-summary-grid">
          <div className="technical-summary-card">
            <h4>Puntuación Técnica</h4>
            <div className="technical-score">{score}/100</div>
            <div className="technical-level">
              Nivel: <span className={`level-${level}`}>{level.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="technical-summary-card">
            <h4>Capacidades Evaluadas</h4>
            <div className="capabilities-count">
              {detailedAnalysis?.completedAreas || 0}/6 áreas
            </div>
            <div className="capabilities-detail">
              <span>Análisis por dimensiones técnicas</span>
            </div>
          </div>
          
          <div className="technical-summary-card">
            <h4>Factibilidad Operativa</h4>
            <div className={`operational-feasibility ${viable ? 'feasible' : 'not-feasible'}`}>
              {viable ? 'ALTA' : 'BAJA'}
            </div>
            <div className="feasibility-detail">
              <span>Capacidad de implementación</span>
            </div>
          </div>
        </div>
      </div>

      {/* EVALUACIÓN POR DIMENSIONES TÉCNICAS */}
      <div className="technical-dimensions-section">
        <h3>📊 Evaluación por Dimensiones Técnicas</h3>
        <div className="dimensions-grid">
          
          {/* LOCALIZACIÓN */}
          <div className="dimension-card">
            <div className="dimension-header">
              <h5>📍 Localización</h5>
              <span className="dimension-weight">Peso: 20%</span>
            </div>
            <div className="dimension-progress">
              <div 
                className="dimension-progress-fill" 
                style={{ width: `${calculateDimensionScore(formData, 'location')}%` }}
              ></div>
            </div>
            <div className="dimension-score">
              {calculateDimensionScore(formData, 'location')}%
            </div>
            <div className="dimension-details">
              <ul>
                <li className={formData.macrolocationDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.macrolocationDetails?.length > 0 ? '✅' : '⭕'} Macrolocalización
                </li>
                <li className={formData.microlocationDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.microlocationDetails?.length > 0 ? '✅' : '⭕'} Microlocalización
                </li>
                <li className={formData.locationFactors?.length > 0 ? 'completed' : 'pending'}>
                  {formData.locationFactors?.length > 0 ? '✅' : '⭕'} Factores de localización
                </li>
              </ul>
            </div>
          </div>

          {/* CAPACIDAD Y TAMAÑO */}
          <div className="dimension-card">
            <div className="dimension-header">
              <h5>📈 Capacidad y Tamaño</h5>
              <span className="dimension-weight">Peso: 15%</span>
            </div>
            <div className="dimension-progress">
              <div 
                className="dimension-progress-fill" 
                style={{ width: `${calculateDimensionScore(formData, 'capacity')}%` }}
              ></div>
            </div>
            <div className="dimension-score">
              {calculateDimensionScore(formData, 'capacity')}%
            </div>
            <div className="dimension-details">
              <ul>
                <li className={formData.capacityDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.capacityDetails?.length > 0 ? '✅' : '⭕'} Capacidad instalada
                </li>
                <li className={formData.productionDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.productionDetails?.length > 0 ? '✅' : '⭕'} Volumen producción
                </li>
                <li className={formData.limitingFactors?.length > 0 ? 'completed' : 'pending'}>
                  {formData.limitingFactors?.length > 0 ? '✅' : '⭕'} Factores limitantes
                </li>
              </ul>
            </div>
          </div>

          {/* INGENIERÍA Y PROCESOS */}
          <div className="dimension-card">
            <div className="dimension-header">
              <h5>⚙️ Ingeniería y Procesos</h5>
              <span className="dimension-weight">Peso: 25%</span>
            </div>
            <div className="dimension-progress">
              <div 
                className="dimension-progress-fill" 
                style={{ width: `${calculateDimensionScore(formData, 'engineering')}%` }}
              ></div>
            </div>
            <div className="dimension-score">
              {calculateDimensionScore(formData, 'engineering')}%
            </div>
            <div className="dimension-details">
              <ul>
                <li className={formData.productDescription?.length > 0 ? 'completed' : 'pending'}>
                  {formData.productDescription?.length > 0 ? '✅' : '⭕'} Descripción producto
                </li>
                <li className={formData.productionProcess?.length > 0 ? 'completed' : 'pending'}>
                  {formData.productionProcess?.length > 0 ? '✅' : '⭕'} Proceso productivo
                </li>
                <li className={formData.technologyDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.technologyDetails?.length > 0 ? '✅' : '⭕'} Tecnología requerida
                </li>
                <li className={formData.layoutDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.layoutDetails?.length > 0 ? '✅' : '⭕'} Distribución planta
                </li>
              </ul>
            </div>
          </div>

          {/* RECURSOS Y SUMINISTROS */}
          <div className="dimension-card">
            <div className="dimension-header">
              <h5>🛠️ Recursos y Suministros</h5>
              <span className="dimension-weight">Peso: 20%</span>
            </div>
            <div className="dimension-progress">
              <div 
                className="dimension-progress-fill" 
                style={{ width: `${calculateDimensionScore(formData, 'resources')}%` }}
              ></div>
            </div>
            <div className="dimension-score">
              {calculateDimensionScore(formData, 'resources')}%
            </div>
            <div className="dimension-details">
              <ul>
                <li className={formData.rawMaterials?.length > 0 ? 'completed' : 'pending'}>
                  {formData.rawMaterials?.length > 0 ? '✅' : '⭕'} Materias primas
                </li>
                <li className={formData.laborDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.laborDetails?.length > 0 ? '✅' : '⭕'} Mano de obra
                </li>
                <li className={formData.servicesDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.servicesDetails?.length > 0 ? '✅' : '⭕'} Servicios básicos
                </li>
              </ul>
            </div>
          </div>

          {/* INFRAESTRUCTURA */}
          <div className="dimension-card">
            <div className="dimension-header">
              <h5>🏗️ Infraestructura</h5>
              <span className="dimension-weight">Peso: 15%</span>
            </div>
            <div className="dimension-progress">
              <div 
                className="dimension-progress-fill" 
                style={{ width: `${calculateDimensionScore(formData, 'infrastructure')}%` }}
              ></div>
            </div>
            <div className="dimension-score">
              {calculateDimensionScore(formData, 'infrastructure')}%
            </div>
            <div className="dimension-details">
              <ul>
                <li className={formData.buildingsDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.buildingsDetails?.length > 0 ? '✅' : '⭕'} Edificaciones
                </li>
                <li className={formData.equipmentDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.equipmentDetails?.length > 0 ? '✅' : '⭕'} Equipos
                </li>
                <li className={formData.furnitureDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.furnitureDetails?.length > 0 ? '✅' : '⭕'} Mobiliario
                </li>
              </ul>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="dimension-card">
            <div className="dimension-header">
              <h5>📅 Cronograma</h5>
              <span className="dimension-weight">Peso: 5%</span>
            </div>
            <div className="dimension-progress">
              <div 
                className="dimension-progress-fill" 
                style={{ width: `${calculateDimensionScore(formData, 'timeline')}%` }}
              ></div>
            </div>
            <div className="dimension-score">
              {calculateDimensionScore(formData, 'timeline')}%
            </div>
            <div className="dimension-details">
              <ul>
                <li className={formData.projectPhases?.length > 0 ? 'completed' : 'pending'}>
                  {formData.projectPhases?.length > 0 ? '✅' : '⭕'} Fases del proyecto
                </li>
                <li className={formData.timelineDetails?.length > 0 ? 'completed' : 'pending'}>
                  {formData.timelineDetails?.length > 0 ? '✅' : '⭕'} Tiempos ejecución
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* ANÁLISIS DE FORTALEZAS Y DEBILIDADES */}
      <div className="technical-swot-section">
        <h3>🎯 Análisis de Fortalezas y Debilidades Técnicas</h3>
        <div className="swot-grid">
          
          <div className="swot-card strengths">
            <h4>💪 Fortalezas Técnicas</h4>
            <div className="swot-content">
              {generateStrengths(formData).map((strength, index) => (
                <div key={index} className="swot-item">
                  <span className="swot-icon">✅</span>
                  {strength}
                </div>
              ))}
              {generateStrengths(formData).length === 0 && (
                <div className="swot-empty">No se identificaron fortalezas técnicas significativas</div>
              )}
            </div>
          </div>

          <div className="swot-card weaknesses">
            <h4>⚠️ Debilidades Técnicas</h4>
            <div className="swot-content">
              {generateWeaknesses(formData).map((weakness, index) => (
                <div key={index} className="swot-item">
                  <span className="swot-icon">❌</span>
                  {weakness}
                </div>
              ))}
              {generateWeaknesses(formData).length === 0 && (
                <div className="swot-empty">No se identificaron debilidades técnicas críticas</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* EVALUACIÓN DE RIESGOS TÉCNICOS */}
      <div className="technical-risks-section">
        <h3>🔍 Evaluación de Riesgos Técnicos</h3>
        <div className="risks-grid">
          
          <div className="risk-card high">
            <h5>🚨 Riesgos Críticos</h5>
            <div className="risk-items">
              {generateTechnicalRisks(formData, 'high').map((risk, index) => (
                <div key={index} className="risk-item">
                  {risk}
                </div>
              ))}
            </div>
          </div>

          <div className="risk-card medium">
            <h5>⚠️ Riesgos Moderados</h5>
            <div className="risk-items">
              {generateTechnicalRisks(formData, 'medium').map((risk, index) => (
                <div key={index} className="risk-item">
                  {risk}
                </div>
              ))}
            </div>
          </div>

          <div className="risk-card low">
            <h5>📝 Riesgos Menores</h5>
            <div className="risk-items">
              {generateTechnicalRisks(formData, 'low').map((risk, index) => (
                <div key={index} className="risk-item">
                  {risk}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RECOMENDACIONES TÉCNICAS */}
      {suggestions && suggestions.length > 0 && (
        <div className="technical-recommendations-section">
          <h3>💡 Recomendaciones Técnicas</h3>
          <div className="technical-recommendations-grid">
            {suggestions
              .filter(suggestion => suggestion.type.includes('TECHNICAL'))
              .map((suggestion, index) => (
                <div key={index} className={`technical-recommendation-card ${suggestion.priority.toLowerCase()}`}>
                  <div className="technical-recommendation-header">
                    <h5>{suggestion.title}</h5>
                    <span className={`technical-priority-badge ${suggestion.priority.toLowerCase()}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <div className="technical-recommendation-content">
                    <ul>
                      {suggestion.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CONCLUSIÓN TÉCNICA */}
      <div className="technical-conclusion-section">
        <div className={`technical-conclusion ${viable ? 'positive' : 'negative'}`}>
          <h3>🎯 Conclusión de Viabilidad Técnica</h3>
          <div className="conclusion-content">
            <div className="conclusion-header">
              <span className="conclusion-icon">
                {viable ? '✅' : '❌'}
              </span>
              <h4>
                {viable ? 
                  'EL PROYECTO ES TÉCNICAMENTE VIABLE' : 
                  'EL PROYECTO PRESENTA LIMITACIONES TÉCNICAS SIGNIFICATIVAS'
                }
              </h4>
            </div>
            
            <div className="conclusion-details">
              <p><strong>Evaluación General:</strong> {viable ? 
                'El proyecto cuenta con las capacidades técnicas necesarias para su implementación exitosa.' :
                'Se requieren mejoras significativas en aspectos técnicos antes de proceder con la implementación.'
              }</p>
              
              <div className="conclusion-metrics">
                <div className="conclusion-metric">
                  <label>Puntuación Técnica</label>
                  <span className={`metric-value ${score >= 70 ? 'good' : score >= 50 ? 'medium' : 'poor'}`}>
                    {score}/100
                  </span>
                </div>
                <div className="conclusion-metric">
                  <label>Áreas Completadas</label>
                  <span className="metric-value">
                    {detailedAnalysis?.completedAreas || 0}/6
                  </span>
                </div>
                <div className="conclusion-metric">
                  <label>Nivel de Confianza</label>
                  <span className={`metric-value ${level === 'high' ? 'good' : level === 'medium' ? 'medium' : 'poor'}`}>
                    {level.toUpperCase()}
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

// FUNCIONES AUXILIARES

const calculateDimensionScore = (formData, dimension) => {
    const dimensionFields = {
      location: ['macrolocationDetails', 'microlocationDetails', 'locationFactors'],
      capacity: ['capacityDetails', 'productionDetails', 'limitingFactors'],
      engineering: ['productDescription', 'productionProcess', 'technologyDetails', 'layoutDetails'],
      resources: ['rawMaterials', 'laborDetails', 'servicesDetails'],
      infrastructure: ['buildingsDetails', 'equipmentDetails', 'furnitureDetails'],
      timeline: ['projectPhases', 'timelineDetails']
    };
  
    const fields = dimensionFields[dimension] || [];
    if (fields.length === 0) return 0;
  
    const completedFields = fields.filter(field => 
      formData[field] && formData[field].length > 0
    ).length;
  
    return Math.round((completedFields / fields.length) * 100);
  };
  
  const generateStrengths = (formData) => {
    const strengths = [];
    
    if (formData.technologyDetails?.length > 0) {
      strengths.push('Tecnología adecuada y disponible');
    }
    if (formData.rawMaterials?.length > 0) {
      strengths.push('Acceso a materias primas identificado');
    }
    if (formData.locationFactors?.length > 0) {
      strengths.push('Factores de localización favorables');
    }
    if (formData.capacityDetails?.length > 0) {
      strengths.push('Capacidad de producción definida');
    }
    if (formData.laborDetails?.length > 0) {
      strengths.push('Mano de obra calificada identificada');
    }
    
    return strengths;
  };
  
  const generateWeaknesses = (formData) => {
    const weaknesses = [];
    
    if (!formData.technologyDetails || formData.technologyDetails.length === 0) {
      weaknesses.push('Tecnología requerida no especificada');
    }
    if (!formData.rawMaterials || formData.rawMaterials.length === 0) {
      weaknesses.push('Cadena de suministro no definida');
    }
    if (!formData.laborDetails || formData.laborDetails.length === 0) {
      weaknesses.push('Requerimientos de personal no especificados');
    }
    if (!formData.projectPhases || formData.projectPhases.length === 0) {
      weaknesses.push('Cronograma de implementación no definido');
    }
    if (!formData.servicesDetails || formData.servicesDetails.length === 0) {
      weaknesses.push('Servicios básicos no garantizados');
    }
    
    return weaknesses;
  };
  
  const generateTechnicalRisks = (formData, riskLevel) => {
    const risks = {
      high: [
        !formData.technologyDetails?.length && 'Falta de tecnología adecuada',
        !formData.rawMaterials?.length && 'Dependencia de materias primas críticas',
        !formData.locationFactors?.length && 'Localización no optimizada'
      ].filter(Boolean),
      medium: [
        !formData.capacityDetails?.length && 'Capacidad de producción no dimensionada',
        !formData.laborDetails?.length && 'Disponibilidad de mano de obra calificada',
        !formData.servicesDetails?.length && 'Servicios básicos no garantizados'
      ].filter(Boolean),
      low: [
        !formData.furnitureDetails?.length && 'Mobiliario e instalaciones por definir',
        !formData.timelineDetails?.length && 'Tiempos de ejecución no especificados'
      ].filter(Boolean)
    };
  
    return risks[riskLevel] || [];
  };