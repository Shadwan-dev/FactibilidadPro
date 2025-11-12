// src/components/forms/TechnicalDataForm.jsx (ACTUALIZADO)
import React, { useState, useCallback } from 'react';

export const TechnicalDataForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState(data);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    const finalValue = typeof value === 'boolean' ? value : 
                      value === '' ? '' : isNaN(value) ? value : parseFloat(value) || 0;
    
    const newData = { 
      ...localData, 
      [field]: finalValue 
    };
    setLocalData(newData);
    onChange('technical', newData);
  }, [localData, onChange]);

  const handleSelectChange = useCallback((field, value) => {
    const newData = { 
      ...localData, 
      [field]: value === 'true' 
    };
    setLocalData(newData);
    onChange('technical', newData);
  }, [localData, onChange]);

  // Sincronizar cuando los props cambian externamente
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Verificar si hay datos suficientes para mostrar resultados
  const hasValidData = localData.teamCapacity !== undefined && localData.infrastructure !== undefined;

  // Calcular métricas técnicas adicionales
  const calculateTechnicalMetrics = () => {
    const technicalReadiness = ((localData.teamCapacity || 0) + (localData.infrastructure || 0)) / 2;
    const implementationRisk = (localData.complexity || 0) * (localData.implementationTime || 0) / 10;
    const resourceAdequacy = (localData.requiredStaff || 0) > 0 ? 'Definido' : 'Por definir';
    
    return {
      technicalReadiness,
      implementationRisk,
      resourceAdequacy
    };
  };

  const technicalMetrics = calculateTechnicalMetrics();

  return (
    <div className="form-section technical-form">
      <div className="technical-form__header">
        <h3>🔧 Factibilidad Técnica</h3>
        {hasValidData && (
          <button 
            onClick={() => setShowResults(!showResults)}
            className="technical-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Evaluación' : '⚙️ Ver Evaluación'}
          </button>
        )}
      </div>
      
      <div className="technical-form__inputs">
        <div className="technical-form__input-group">
          <label>Capacidad Técnica del Equipo (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={localData.teamCapacity || ''}
            onChange={(e) => handleInputChange('teamCapacity', e.target.value)}
            placeholder="1-10"
          />
          <small>1 = Baja capacidad, 10 = Alta capacidad</small>
        </div>

        <div className="technical-form__input-group">
          <label>Infraestructura Disponible (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={localData.infrastructure || ''}
            onChange={(e) => handleInputChange('infrastructure', e.target.value)}
            placeholder="1-10"
          />
          <small>1 = Insuficiente, 10 = Excelente</small>
        </div>

        <div className="technical-form__input-group">
          <label>Tecnología Requerida:</label>
          <select 
            value={localData.technologyAvailable || ''}
            onChange={(e) => handleSelectChange('technologyAvailable', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Disponible</option>
            <option value="false">No Disponible</option>
          </select>
          <small>Disponibilidad de tecnología necesaria</small>
        </div>

        <div className="technical-form__input-group">
          <label>Tiempo de Implementación (meses):</label>
          <input
            type="number"
            value={localData.implementationTime || ''}
            onChange={(e) => handleInputChange('implementationTime', e.target.value)}
            placeholder="Ej: 6"
          />
          <small>Tiempo estimado para implementación</small>
        </div>

        <div className="technical-form__input-group">
          <label>Complejidad Técnica (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={localData.complexity || ''}
            onChange={(e) => handleInputChange('complexity', e.target.value)}
            placeholder="1-10"
          />
          <small>1 = Simple, 10 = Muy complejo</small>
        </div>

        <div className="technical-form__input-group">
          <label>Recursos Humanos Necesarios:</label>
          <input
            type="number"
            value={localData.requiredStaff || ''}
            onChange={(e) => handleInputChange('requiredStaff', e.target.value)}
            placeholder="Ej: 5"
          />
          <small>Número de personas requeridas</small>
        </div>
      </div>

      {/* Resultados en Tiempo Real */}
      {showResults && calculations && (
        <div className="technical-form__results">
          <h4>⚙️ Evaluación Técnica</h4>
          
          {/* Puntuación General */}
          <div className="technical-form__score-section">
            <div className="technical-form__score-card">
              <div className="technical-form__score-header">
                <span>Puntuación Técnica</span>
                <span className={`technical-form__score-badge ${calculations.technical?.viable ? 'technical-form__score-viable' : 'technical-form__score-not-viable'}`}>
                  {calculations.technical?.viable ? 'VIABLE' : 'NO VIABLE'}
                </span>
              </div>
              <div className="technical-form__score-value">
                {calculations.technical?.score || 0}/100
              </div>
              <div className="technical-form__score-level">
                Nivel: {calculations.technical?.level || 'Bajo'}
              </div>
            </div>
          </div>

          {/* Métricas Técnicas */}
          <div className="technical-form__metrics">
            <h5>📊 Métricas Técnicas</h5>
            <div className="technical-form__metrics-grid">
              <div className="technical-form__metric-item">
                <span className="technical-form__metric-label">Preparación Técnica:</span>
                <span className={`technical-form__metric-value ${technicalMetrics.technicalReadiness >= 7 ? 'technical-form__metric-positive' : technicalMetrics.technicalReadiness >= 5 ? 'technical-form__metric-warning' : 'technical-form__metric-danger'}`}>
                  {technicalMetrics.technicalReadiness.toFixed(1)}/10
                </span>
                <small>Capacidad + Infraestructura</small>
              </div>

              <div className="technical-form__metric-item">
                <span className="technical-form__metric-label">Riesgo de Implementación:</span>
                <span className={`technical-form__metric-value ${technicalMetrics.implementationRisk <= 3 ? 'technical-form__metric-positive' : technicalMetrics.implementationRisk <= 6 ? 'technical-form__metric-warning' : 'technical-form__metric-danger'}`}>
                  {technicalMetrics.implementationRisk.toFixed(1)}/10
                </span>
                <small>Complejidad × Tiempo</small>
              </div>

              <div className="technical-form__metric-item">
                <span className="technical-form__metric-label">Recursos Humanos:</span>
                <span className={`technical-form__metric-value ${technicalMetrics.resourceAdequacy === 'Definido' ? 'technical-form__metric-positive' : 'technical-form__metric-warning'}`}>
                  {technicalMetrics.resourceAdequacy}
                </span>
                <small>Definición de equipo</small>
              </div>

              <div className="technical-form__metric-item">
                <span className="technical-form__metric-label">Disponibilidad Tecnológica:</span>
                <span className={`technical-form__metric-value ${localData.technologyAvailable ? 'technical-form__metric-positive' : 'technical-form__metric-danger'}`}>
                  {localData.technologyAvailable ? '✅ Disponible' : '❌ No disponible'}
                </span>
                <small>Tecnología requerida</small>
              </div>
            </div>
          </div>

          {/* Análisis de Capacidades */}
          <div className="technical-form__capabilities">
            <h5>🔍 Análisis de Capacidades</h5>
            <div className="technical-form__capabilities-grid">
              <div className="technical-form__capability-item">
                <span>Capacidad del Equipo:</span>
                <strong className={localData.teamCapacity >= 7 ? 'technical-form__status-good' : localData.teamCapacity >= 5 ? 'technical-form__status-fair' : 'technical-form__status-poor'}>
                  {localData.teamCapacity || 0}/10
                </strong>
              </div>
              
              <div className="technical-form__capability-item">
                <span>Infraestructura:</span>
                <strong className={localData.infrastructure >= 7 ? 'technical-form__status-good' : localData.infrastructure >= 5 ? 'technical-form__status-fair' : 'technical-form__status-poor'}>
                  {localData.infrastructure || 0}/10
                </strong>
              </div>
              
              <div className="technical-form__capability-item">
                <span>Complejidad:</span>
                <strong className={localData.complexity <= 3 ? 'technical-form__status-good' : localData.complexity <= 6 ? 'technical-form__status-fair' : 'technical-form__status-poor'}>
                  {localData.complexity || 0}/10
                </strong>
              </div>
              
              <div className="technical-form__capability-item">
                <span>Tiempo Implementación:</span>
                <strong className={localData.implementationTime <= 6 ? 'technical-form__status-good' : localData.implementationTime <= 12 ? 'technical-form__status-fair' : 'technical-form__status-poor'}>
                  {localData.implementationTime || 0} meses
                </strong>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {calculations.suggestions && calculations.suggestions.filter(s => s.campo === 'technical').length > 0 && (
            <div className="technical-form__recommendations">
              <h5>💡 Recomendaciones Técnicas</h5>
              {calculations.suggestions
                .filter(suggestion => suggestion.campo === 'technical')
                .map((suggestion, index) => (
                  <div key={index} className="technical-form__recommendation">
                    <p className="technical-form__recommendation-title">{suggestion.mensaje}</p>
                    <ul className="technical-form__recommendation-list">
                      {suggestion.sugerencias.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          )}

          {/* Evaluación de Riesgos Técnicos */}
          <div className="technical-form__risk-assessment">
            <h5>⚠️ Evaluación de Riesgos Técnicos</h5>
            <div className="technical-form__risk-indicators">
              <div className="technical-form__risk-item">
                <span>Riesgo de Capacidad:</span>
                <div className={localData.teamCapacity >= 7 ? 'technical-form__risk-low' : localData.teamCapacity >= 5 ? 'technical-form__risk-medium' : 'technical-form__risk-high'}>
                  {localData.teamCapacity >= 7 ? 'Bajo' : localData.teamCapacity >= 5 ? 'Medio' : 'Alto'}
                </div>
              </div>
              
              <div className="technical-form__risk-item">
                <span>Riesgo Tecnológico:</span>
                <div className={localData.technologyAvailable ? 'technical-form__risk-low' : 'technical-form__risk-high'}>
                  {localData.technologyAvailable ? 'Bajo' : 'Alto'}
                </div>
              </div>
              
              <div className="technical-form__risk-item">
                <span>Riesgo de Complejidad:</span>
                <div className={localData.complexity <= 4 ? 'technical-form__risk-low' : localData.complexity <= 7 ? 'technical-form__risk-medium' : 'technical-form__risk-high'}>
                  {localData.complexity <= 4 ? 'Bajo' : localData.complexity <= 7 ? 'Medio' : 'Alto'}
                </div>
              </div>
              
              <div className="technical-form__risk-item">
                <span>Riesgo de Tiempo:</span>
                <div className={localData.implementationTime <= 6 ? 'technical-form__risk-low' : localData.implementationTime <= 12 ? 'technical-form__risk-medium' : 'technical-form__risk-high'}>
                  {localData.implementationTime <= 6 ? 'Bajo' : localData.implementationTime <= 12 ? 'Medio' : 'Alto'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de Estado */}
      {!hasValidData && (
        <div className="technical-form__data-required">
          <p>🔧 Completa los datos técnicos para ver la evaluación</p>
        </div>
      )}
    </div>
  );
});