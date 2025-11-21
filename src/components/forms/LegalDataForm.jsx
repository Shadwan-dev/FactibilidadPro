// src/components/forms/LegalDataForm.jsx (UNIFICADO)
import React, { useState, useCallback } from 'react';

export const LegalDataForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState(data);
  const [showResults, setShowResults] = useState(false);

  const handleSelectChange = useCallback((field, value) => {
    const newData = { 
      ...localData, 
      [field]: value === 'true' 
    };
    setLocalData(newData);
    onChange('legal', newData);
  }, [localData, onChange]);

  const handleInputChange = useCallback((field, value) => {
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;
    const newData = { 
      ...localData, 
      [field]: numericValue 
    };
    setLocalData(newData);
    onChange('legal', newData);
  }, [localData, onChange]);

  // Sincronizar cuando los props cambian externamente
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Verificar si hay datos suficientes para mostrar resultados
  const hasValidData = localData.legalRisks !== undefined && localData.permits !== undefined;

  return (
    <div className="form-container legal-form">
      <div className="form-header">
        <h3 className="form-title">Factibilidad Legal y Normativa</h3>
        {hasValidData && (
          <button 
            onClick={() => setShowResults(!showResults)}
            className="btn btn--secondary btn--sm"
          >
            {showResults ? '📊 Ocultar Evaluación' : '⚖️ Ver Evaluación'}
          </button>
        )}
      </div>
      
      <div className="form-grid">
        <div className="input-group">
          <label className="input-label">Permisos y Licencias</label>
          <select 
            className="input-field"
            value={localData.permits || ''}
            onChange={(e) => handleSelectChange('permits', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Obtenidos</option>
            <option value="false">Pendientes</option>
          </select>
          <small className="input-help">Estado de permisos requeridos</small>
        </div>

        <div className="input-group">
          <label className="input-label">Cumplimiento Normativo</label>
          <select 
            className="input-field"
            value={localData.regulatoryCompliance || ''}
            onChange={(e) => handleSelectChange('regulatoryCompliance', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Cumple</option>
            <option value="false">No Cumple</option>
          </select>
          <small className="input-help">Cumplimiento con regulaciones aplicables</small>
        </div>

        <div className="input-group">
          <label className="input-label">Riesgos Legales Identificados (0-10)</label>
          <input
            className="input-field"
            type="number"
            min="0"
            max="10"
            value={localData.legalRisks || ''}
            onChange={(e) => handleInputChange('legalRisks', e.target.value)}
            placeholder="0-10"
          />
          <small className="input-help">0 = Sin riesgos, 10 = Muy riesgoso</small>
        </div>

        <div className="input-group">
          <label className="input-label">Propiedad Intelectual</label>
          <select 
            className="input-field"
            value={localData.intellectualProperty || ''}
            onChange={(e) => handleSelectChange('intellectualProperty', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Protegida</option>
            <option value="false">No Protegida</option>
          </select>
          <small className="input-help">Protección de propiedad intelectual</small>
        </div>

        <div className="input-group">
          <label className="input-label">Tiempo Estimado para Trámites (meses)</label>
          <input
            className="input-field"
            type="number"
            value={localData.processingTime || ''}
            onChange={(e) => handleInputChange('processingTime', e.target.value)}
            placeholder="Ej: 3"
          />
          <small className="input-help">Tiempo estimado para procesos legales</small>
        </div>
      </div>

      {/* Resultados en Tiempo Real */}
      {showResults && calculations && (
        <div className="form-results">
          <h4 className="results-title">📋 Evaluación Legal</h4>
          
          {/* Puntuación General */}
          <div className="score-section">
            <div className="score-card">
              <div className="score-header">
                <span className="score-label">Puntuación Legal</span>
                <span className={`result-badge ${calculations.legal?.viable ? 'badge--success' : 'badge--danger'}`}>
                  {calculations.legal?.viable ? '✅ VIABLE' : '❌ NO VIABLE'}
                </span>
              </div>
              <div className={`score-value ${calculations.legal?.viable ? 'value--positive' : 'value--negative'}`}>
                {calculations.legal?.score || 0}/100
              </div>
              <div className="score-level">
                Nivel: <strong>{calculations.legal?.level || 'Bajo'}</strong>
              </div>
            </div>
          </div>

          {/* Análisis Detallado */}
          <div className="analysis-section">
            <h5 className="section-subtitle">🔍 Análisis Detallado</h5>
            <div className="analysis-grid">
              <div className="analysis-item">
                <div className="analysis-label">Permisos Obtenidos</div>
                <div className={`analysis-value ${localData.permits ? 'value--positive' : 'value--negative'}`}>
                  {localData.permits ? '✅ Sí' : '❌ No'}
                </div>
                <div className="analysis-help">
                  {localData.permits ? 'Permisos en regla' : 'Permisos pendientes'}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-label">Cumplimiento Normativo</div>
                <div className={`analysis-value ${localData.regulatoryCompliance ? 'value--positive' : 'value--negative'}`}>
                  {localData.regulatoryCompliance ? '✅ Sí' : '❌ No'}
                </div>
                <div className="analysis-help">
                  {localData.regulatoryCompliance ? 'Cumple normativas' : 'No cumple normativas'}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-label">Propiedad Intelectual</div>
                <div className={`analysis-value ${localData.intellectualProperty ? 'value--positive' : 'value--warning'}`}>
                  {localData.intellectualProperty ? '✅ Protegida' : '⚠️ No protegida'}
                </div>
                <div className="analysis-help">
                  {localData.intellectualProperty ? 'IP asegurada' : 'IP sin protección'}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-label">Nivel de Riesgo Legal</div>
                <div className={`analysis-value ${
                  localData.legalRisks <= 3 ? 'value--positive' : 
                  localData.legalRisks <= 6 ? 'value--warning' : 'value--negative'
                }`}>
                  {localData.legalRisks || 0}/10
                </div>
                <div className="analysis-help">
                  {localData.legalRisks <= 3 ? 'Riesgo bajo' : 
                   localData.legalRisks <= 6 ? 'Riesgo medio' : 'Riesgo alto'}
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de Riesgo */}
          <div className="risk-section">
            <h5 className="section-subtitle">📊 Indicadores de Riesgo</h5>
            <div className="risk-grid">
              <div className="risk-item">
                <div className="risk-label">Tiempo de Trámites</div>
                <div className={`risk-indicator ${
                  localData.processingTime <= 3 ? 'risk-low' : 
                  localData.processingTime <= 6 ? 'risk-medium' : 'risk-high'
                }`}>
                  {localData.processingTime || 0} meses
                </div>
                <div className="risk-description">
                  {localData.processingTime <= 3 ? 'Trámites rápidos' : 
                   localData.processingTime <= 6 ? 'Tiempo aceptable' : 'Trámites extensos'}
                </div>
              </div>
              
              <div className="risk-item">
                <div className="risk-label">Completitud Documental</div>
                <div className={`risk-indicator ${
                  (localData.permits && localData.regulatoryCompliance) ? 'risk-low' : 'risk-high'
                }`}>
                  {(localData.permits && localData.regulatoryCompliance) ? '✅ Completa' : '⚠️ Incompleta'}
                </div>
                <div className="risk-description">
                  {(localData.permits && localData.regulatoryCompliance) ? 'Documentación completa' : 'Falta documentación'}
                </div>
              </div>

              <div className="risk-item">
                <div className="risk-label">Protección Legal</div>
                <div className={`risk-indicator ${
                  localData.intellectualProperty ? 'risk-low' : 'risk-medium'
                }`}>
                  {localData.intellectualProperty ? '✅ Protegida' : '⚠️ Limitada'}
                </div>
                <div className="risk-description">
                  {localData.intellectualProperty ? 'IP asegurada' : 'IP vulnerable'}
                </div>
              </div>

              <div className="risk-item">
                <div className="risk-label">Exposición a Riesgos</div>
                <div className={`risk-indicator ${
                  localData.legalRisks <= 3 ? 'risk-low' : 
                  localData.legalRisks <= 6 ? 'risk-medium' : 'risk-high'
                }`}>
                  {localData.legalRisks <= 3 ? 'Baja' : 
                   localData.legalRisks <= 6 ? 'Media' : 'Alta'}
                </div>
                <div className="risk-description">
                  {localData.legalRisks <= 3 ? 'Exposición mínima' : 
                   localData.legalRisks <= 6 ? 'Exposición moderada' : 'Alta exposición'}
                </div>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {calculations.suggestions && calculations.suggestions.filter(s => s.campo === 'legal').length > 0 && (
            <div className="recommendations-section">
              <h5 className="section-subtitle">💡 Recomendaciones Legales</h5>
              {calculations.suggestions
                .filter(suggestion => suggestion.campo === 'legal')
                .map((suggestion, index) => (
                  <div key={index} className="recommendation-card">
                    <p className="recommendation-title">{suggestion.mensaje}</p>
                    <ul className="recommendation-list">
                      {suggestion.sugerencias.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          )}

          {/* Resumen de Cumplimiento */}
          <div className="compliance-summary">
            <h5 className="section-subtitle">📝 Resumen de Cumplimiento</h5>
            <div className="compliance-grid">
              <div className="compliance-item">
                <div className="compliance-label">Estado General</div>
                <div className={`compliance-status ${
                  calculations.legal?.viable ? 'compliance-ok' : 'compliance-warning'
                }`}>
                  {calculations.legal?.viable ? '✅ Conforme' : '⚠️ Requiere atención'}
                </div>
                <div className="compliance-details">
                  {calculations.legal?.viable ? 
                    'Cumple con requisitos legales mínimos' : 
                    'No cumple con algunos requisitos legales'
                  }
                </div>
              </div>

              <div className="compliance-item">
                <div className="compliance-label">Acciones Prioritarias</div>
                <div className="compliance-actions">
                  {!localData.permits && <span className="action-item action-urgent">📋 Obtener permisos</span>}
                  {!localData.regulatoryCompliance && <span className="action-item action-important">⚖️ Regularizar cumplimiento</span>}
                  {!localData.intellectualProperty && <span className="action-item action-recommended">🛡️ Proteger propiedad intelectual</span>}
                  {localData.legalRisks > 6 && <span className="action-item action-critical">🚨 Mitigar riesgos legales</span>}
                  {localData.processingTime > 6 && <span className="action-item action-suggested">⏰ Acelerar trámites</span>}
                  
                  {localData.permits && localData.regulatoryCompliance && localData.legalRisks <= 3 && (
                    <span className="action-item action-completed">✅ Situación legal favorable</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de Estado */}
      {!hasValidData && (
        <div className="form-message form-message--info">
          <p>⚖️ Completa los datos legales para ver la evaluación</p>
        </div>
      )}
    </div>
  );
});