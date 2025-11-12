// src/components/forms/LegalDataForm.jsx (ACTUALIZADO)
import React, { useState, useCallback } from 'react';
import '../../styles/LegalFormSelector.css';

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
    <div className="form-section legal-form">
      <div className="legal-form__header">
        <h3>⚖️ Factibilidad Legal y Normativa</h3>
        {hasValidData && (
          <button 
            onClick={() => setShowResults(!showResults)}
            className="legal-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Evaluación' : '⚖️ Ver Evaluación'}
          </button>
        )}
      </div>
      
      <div className="legal-form__inputs">
        <div className="legal-form__input-group">
          <label>Permisos y Licencias:</label>
          <select 
            value={localData.permits || ''}
            onChange={(e) => handleSelectChange('permits', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Obtenidos</option>
            <option value="false">Pendientes</option>
          </select>
          <small>Estado de permisos requeridos</small>
        </div>

        <div className="legal-form__input-group">
          <label>Cumplimiento Normativo:</label>
          <select 
            value={localData.regulatoryCompliance || ''}
            onChange={(e) => handleSelectChange('regulatoryCompliance', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Cumple</option>
            <option value="false">No Cumple</option>
          </select>
          <small>Cumplimiento con regulaciones aplicables</small>
        </div>

        <div className="legal-form__input-group">
          <label>Riesgos Legales Identificados:</label>
          <input
            type="number"
            min="0"
            max="10"
            value={localData.legalRisks || ''}
            onChange={(e) => handleInputChange('legalRisks', e.target.value)}
            placeholder="0-10"
          />
          <small>0 = Sin riesgos, 10 = Muy riesgoso</small>
        </div>

        <div className="legal-form__input-group">
          <label>Propiedad Intelectual:</label>
          <select 
            value={localData.intellectualProperty || ''}
            onChange={(e) => handleSelectChange('intellectualProperty', e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="true">Protegida</option>
            <option value="false">No Protegida</option>
          </select>
          <small>Protección de propiedad intelectual</small>
        </div>

        <div className="legal-form__input-group">
          <label>Tiempo Estimado para Trámites (meses):</label>
          <input
            type="number"
            value={localData.processingTime || ''}
            onChange={(e) => handleInputChange('processingTime', e.target.value)}
            placeholder="Ej: 3"
          />
          <small>Tiempo estimado para procesos legales</small>
        </div>
      </div>

      {/* Resultados en Tiempo Real */}
      {showResults && calculations && (
        <div className="legal-form__results">
          <h4>📋 Evaluación Legal</h4>
          
          {/* Puntuación General */}
          <div className="legal-form__score-section">
            <div className="legal-form__score-card">
              <div className="legal-form__score-header">
                <span>Puntuación Legal</span>
                <span className={`legal-form__score-badge ${calculations.legal?.viable ? 'legal-form__score-viable' : 'legal-form__score-not-viable'}`}>
                  {calculations.legal?.viable ? 'VIABLE' : 'NO VIABLE'}
                </span>
              </div>
              <div className="legal-form__score-value">
                {calculations.legal?.score || 0}/100
              </div>
              <div className="legal-form__score-level">
                Nivel: {calculations.legal?.level || 'Bajo'}
              </div>
            </div>
          </div>

          {/* Análisis Detallado */}
          <div className="legal-form__analysis">
            <h5>🔍 Análisis Detallado</h5>
            <div className="legal-form__analysis-grid">
              <div className="legal-form__analysis-item">
                <span>Permisos Obtenidos:</span>
                <strong className={localData.permits ? 'legal-form__status-ok' : 'legal-form__status-warning'}>
                  {localData.permits ? '✅ Sí' : '❌ No'}
                </strong>
              </div>
              
              <div className="legal-form__analysis-item">
                <span>Cumplimiento Normativo:</span>
                <strong className={localData.regulatoryCompliance ? 'legal-form__status-ok' : 'legal-form__status-warning'}>
                  {localData.regulatoryCompliance ? '✅ Sí' : '❌ No'}
                </strong>
              </div>
              
              <div className="legal-form__analysis-item">
                <span>Propiedad Intelectual:</span>
                <strong className={localData.intellectualProperty ? 'legal-form__status-ok' : 'legal-form__status-warning'}>
                  {localData.intellectualProperty ? '✅ Protegida' : '⚠️ No protegida'}
                </strong>
              </div>
              
              <div className="legal-form__analysis-item">
                <span>Nivel de Riesgo Legal:</span>
                <strong className={localData.legalRisks <= 3 ? 'legal-form__status-ok' : localData.legalRisks <= 6 ? 'legal-form__status-warning' : 'legal-form__status-danger'}>
                  {localData.legalRisks || 0}/10
                </strong>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {calculations.suggestions && calculations.suggestions.filter(s => s.campo === 'legal').length > 0 && (
            <div className="legal-form__recommendations">
              <h5>💡 Recomendaciones Legales</h5>
              {calculations.suggestions
                .filter(suggestion => suggestion.campo === 'legal')
                .map((suggestion, index) => (
                  <div key={index} className="legal-form__recommendation">
                    <p className="legal-form__recommendation-title">{suggestion.mensaje}</p>
                    <ul className="legal-form__recommendation-list">
                      {suggestion.sugerencias.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          )}

          {/* Indicadores de Riesgo */}
          <div className="legal-form__risk-indicators">
            <h5>📊 Indicadores de Riesgo</h5>
            <div className="legal-form__risk-grid">
              <div className="legal-form__risk-item">
                <span>Tiempo de Trámites:</span>
                <div className={`legal-form__risk-level ${localData.processingTime <= 3 ? 'legal-form__risk-low' : localData.processingTime <= 6 ? 'legal-form__risk-medium' : 'legal-form__risk-high'}`}>
                  {localData.processingTime || 0} meses
                </div>
              </div>
              
              <div className="legal-form__risk-item">
                <span>Completitud Documental:</span>
                <div className={`legal-form__risk-level ${(localData.permits && localData.regulatoryCompliance) ? 'legal-form__risk-low' : 'legal-form__risk-high'}`}>
                  {(localData.permits && localData.regulatoryCompliance) ? '✅ Completa' : '⚠️ Incompleta'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de Estado */}
      {!hasValidData && (
        <div className="legal-form__data-required">
          <p>⚖️ Completa los datos legales para ver la evaluación</p>
        </div>
      )}
    </div>
  );
});