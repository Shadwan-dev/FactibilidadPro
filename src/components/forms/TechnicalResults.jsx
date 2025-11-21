// TechnicalResults.jsx - COMPONENTE COMPLETO
import React from 'react';
import '../../styles/components/forms/technical-results.css';

export const TechnicalResults = ({ formData }) => {
  // Calcular puntuaciones por categoría
  const calculateCategoryScore = (categoryFields) => {
    const ratings = {
      'excellent': 4,
      'good': 3,
      'regular': 2,
      'poor': 1,
      '': 0
    };

    let totalScore = 0;
    let ratedFields = 0;

    categoryFields.forEach(field => {
      const rating = formData[field];
      if (rating && ratings[rating] > 0) {
        totalScore += ratings[rating];
        ratedFields++;
      }
    });

    return ratedFields > 0 ? (totalScore / (ratedFields * 4)) * 100 : 0;
  };

  // Definir categorías y sus campos
  const categories = {
    localization: {
      name: '📍 Localización',
      fields: ['macrolocationRating', 'microlocationRating', 'locationFactorsRating'],
      weight: 0.15
    },
    capacity: {
      name: '📊 Tamaño y Capacidad',
      fields: ['capacityRating', 'productionRating', 'limitingFactorsRating'],
      weight: 0.20
    },
    engineering: {
      name: '⚙️ Ingeniería',
      fields: ['productDescriptionRating', 'productionProcessRating', 'technologyRating', 'layoutRating'],
      weight: 0.25
    },
    resources: {
      name: '🛠️ Recursos',
      fields: ['rawMaterialsRating', 'laborRating', 'servicesRating'],
      weight: 0.15
    },
    infrastructure: {
      name: '🏗️ Infraestructura',
      fields: ['buildingsRating', 'equipmentRating', 'furnitureRating'],
      weight: 0.15
    },
    timeline: {
      name: '📅 Cronograma',
      fields: ['phasesRating', 'timelineRating'],
      weight: 0.10
    }
  };

  // Calcular puntuaciones
  const categoryScores = Object.keys(categories).map(key => {
    const category = categories[key];
    const score = calculateCategoryScore(category.fields);
    return {
      ...category,
      key,
      score: Math.round(score),
      weightedScore: Math.round(score * category.weight)
    };
  });

  // Calcular puntuación total
  const totalScore = categoryScores.reduce((total, category) => total + category.weightedScore, 0);
  const overallScore = Math.round(totalScore);

  // Determinar nivel de viabilidad
  const getFeasibilityLevel = (score) => {
    if (score >= 80) return { level: 'Alta', color: '#10b981', description: 'Proyecto técnicamente viable' };
    if (score >= 60) return { level: 'Media', color: '#f59e0b', description: 'Proyecto viable con observaciones' };
    return { level: 'Baja', color: '#ef4444', description: 'Proyecto requiere revisión técnica' };
  };

  const feasibility = getFeasibilityLevel(overallScore);

  // Contar elementos por categoría
  const countItems = (fields) => {
    return fields.reduce((total, field) => {
      const items = formData[field.replace('Rating', '')] || [];
      return total + items.length;
    }, 0);
  };

  return (
    <div className="technical-results">
      <div className="technical-results-header">
        <h3 className="technical-results-title">📊 Resultados del Análisis Técnico</h3>
        <p className="technical-results-subtitle">Evaluación integral de la viabilidad técnica del proyecto</p>
      </div>

      {/* Score General */}
      <div className="technical-overall-score">
        <div className="technical-score-card">
          <div className="technical-score-main">
            <div className="technical-score-value">{overallScore}%</div>
            <div className="technical-score-label">Puntuación General</div>
          </div>
          <div 
            className="technical-feasibility-badge"
            style={{ backgroundColor: feasibility.color }}
          >
            <span className="technical-feasibility-level">{feasibility.level}</span>
            <span className="technical-feasibility-desc">{feasibility.description}</span>
          </div>
        </div>
      </div>

      {/* Desglose por Categorías */}
      <div className="technical-categories-breakdown">
        <h4 className="technical-breakdown-title">Desglose por Categorías</h4>
        
        <div className="technical-categories-grid">
          {categoryScores.map(category => (
            <div key={category.key} className="technical-category-card">
              <div className="technical-category-header">
                <h5 className="technical-category-name">{category.name}</h5>
                <div className="technical-category-weight">Peso: {category.weight * 100}%</div>
              </div>
              
              <div className="technical-category-progress">
                <div className="technical-progress-bar">
                  <div 
                    className="technical-progress-fill"
                    style={{ 
                      width: `${category.score}%`,
                      backgroundColor: getFeasibilityLevel(category.score).color
                    }}
                  ></div>
                </div>
                <div className="technical-progress-text">
                  <span className="technical-progress-value">{category.score}%</span>
                  <span className="technical-progress-weighted">
                    ({category.weightedScore} pts)
                  </span>
                </div>
              </div>

              <div className="technical-category-stats">
                <div className="technical-stat">
                  <span className="technical-stat-label">Elementos evaluados:</span>
                  <span className="technical-stat-value">
                    {countItems(category.fields)}
                  </span>
                </div>
                <div className="technical-stat">
                  <span className="technical-stat-label">Nivel:</span>
                  <span 
                    className="technical-stat-level"
                    style={{ color: getFeasibilityLevel(category.score).color }}
                  >
                    {getFeasibilityLevel(category.score).level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="technical-recommendations">
        <h4 className="technical-recommendations-title">💡 Recomendaciones Técnicas</h4>
        
        <div className="technical-recommendations-grid">
          {overallScore < 60 && (
            <div className="technical-recommendation technical-recommendation--critical">
              <h5>🚨 Acciones Críticas Requeridas</h5>
              <ul>
                <li>Revisar y fortalecer los aspectos con puntuación más baja</li>
                <li>Realizar un estudio técnico más detallado</li>
                <li>Considerar alternativas técnicas viables</li>
                <li>Validar la disponibilidad de recursos críticos</li>
              </ul>
            </div>
          )}

          {overallScore >= 60 && overallScore < 80 && (
            <div className="technical-recommendation technical-recommendation--improvement">
              <h5>⚡ Áreas de Mejora</h5>
              <ul>
                <li>Optimizar los procesos productivos identificados</li>
                <li>Fortalecer la planificación de recursos</li>
                <li>Mejorar la definición de especificaciones técnicas</li>
                <li>Establecer planes de contingencia técnica</li>
              </ul>
            </div>
          )}

          {overallScore >= 80 && (
            <div className="technical-recommendation technical-recommendation--success">
              <h5>✅ Próximos Pasos Recomendados</h5>
              <ul>
                <li>Proceder con la implementación técnica</li>
                <li>Mantener el monitoreo de los aspectos técnicos</li>
                <li>Documentar lecciones aprendidas</li>
                <li>Planificar mejoras continuas</li>
              </ul>
            </div>
          )}

          <div className="technical-recommendation technical-recommendation--general">
            <h5>🔧 Mejoras Generales</h5>
            <ul>
              <li>Actualizar regularmente el análisis técnico</li>
              <li>Mantener documentación técnica actualizada</li>
              <li>Establecer métricas de seguimiento técnico</li>
              <li>Capacitar al equipo en aspectos técnicos relevantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};