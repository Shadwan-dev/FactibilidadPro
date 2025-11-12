// src/components/forms/DetailedLegalForm.jsx
import React, { useState, useCallback } from 'react';
import '../../styles/DetailedLegalForm.css';

export const DetailedLegalForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState({
    permits: data.permits || false,
    regulatoryCompliance: data.regulatoryCompliance || false,
    legalRisks: data.legalRisks || 0,
    intellectualProperty: data.intellectualProperty || false,
    processingTime: data.processingTime || 0
  });
  
  const [showResults, setShowResults] = useState(false);
  const [requiredPermits, setRequiredPermits] = useState([]);
  const [legalRequirements, setLegalRequirements] = useState([]);
  const [riskFactors, setRiskFactors] = useState([]);
  const [newPermit, setNewPermit] = useState({ name: '', status: 'pending', timeframe: '' });
  const [newRequirement, setNewRequirement] = useState({ description: '', category: '', compliance: 'pending' });
  const [newRisk, setNewRisk] = useState({ description: '', severity: 'low', mitigation: '' });

  // ✅ SOLO campos básicos afectan el estado global
  const handleBasicInputChange = useCallback((field, value) => {
    const newValue = typeof value === 'boolean' ? value : (value === '' ? 0 : parseFloat(value) || 0);
    
    const newLocalData = {
      ...localData,
      [field]: newValue
    };
    
    setLocalData(newLocalData);
    
    // ✅ DEBOUNCE: Esperar antes de actualizar el estado global
    setTimeout(() => {
      onChange('legal', newLocalData);
    }, 1000);
  }, [localData, onChange]);

  // ✅ Manejar permisos requeridos - SOLO estado local
  const addRequiredPermit = (e) => {
    e.preventDefault();
    if (newPermit.name) {
      setRequiredPermits(prev => [...prev, { 
        ...newPermit,
        id: Date.now(),
        timeframe: parseInt(newPermit.timeframe) || 0
      }]);
      setNewPermit({ name: '', status: 'pending', timeframe: '' });
    }
  };

  const removeRequiredPermit = (id) => {
    setRequiredPermits(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Manejar requisitos legales - SOLO estado local
  const addLegalRequirement = (e) => {
    e.preventDefault();
    if (newRequirement.description) {
      setLegalRequirements(prev => [...prev, {
        ...newRequirement,
        id: Date.now()
      }]);
      setNewRequirement({ description: '', category: '', compliance: 'pending' });
    }
  };

  const removeLegalRequirement = (id) => {
    setLegalRequirements(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Manejar factores de riesgo - SOLO estado local
  const addRiskFactor = (e) => {
    e.preventDefault();
    if (newRisk.description) {
      setRiskFactors(prev => [...prev, {
        ...newRisk,
        id: Date.now()
      }]);
      setNewRisk({ description: '', severity: 'low', mitigation: '' });
    }
  };

  const removeRiskFactor = (id) => {
    setRiskFactors(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Calcular totales automáticamente
  const totalPermits = requiredPermits.length;
  const approvedPermits = requiredPermits.filter(p => p.status === 'approved').length;
  const averageProcessingTime = requiredPermits.length > 0 
    ? requiredPermits.reduce((sum, permit) => sum + (permit.timeframe || 0), 0) / requiredPermits.length 
    : 0;
  const highRisks = riskFactors.filter(r => r.severity === 'high').length;

  // ✅ Aplicar totales calculados
  const applyCalculatedTotals = (e) => {
    e.preventDefault();
    
    // Calcular riesgo legal basado en factores
    const calculatedLegalRisks = Math.min(10, highRisks * 2 + riskFactors.length);
    
    const finalData = {
      ...localData,
      legalRisks: calculatedLegalRisks,
      processingTime: Math.round(averageProcessingTime),
      permits: approvedPermits === totalPermits && totalPermits > 0
    };
    
    setLocalData(finalData);
    onChange('legal', finalData);
    
    alert(`✅ Totales legales aplicados:\n- Permisos: ${approvedPermits}/${totalPermits} aprobados\n- Tiempo promedio: ${Math.round(averageProcessingTime)} meses\n- Riesgo calculado: ${calculatedLegalRisks}/10`);
  };

  const hasValidData = localData.legalRisks >= 0 && localData.processingTime >= 0;

  return (
    <div className="form-section detailed-legal-form">
      <div className="detailed-legal-form__header">
        <h3>⚖️ Análisis Legal - Modo Guiado</h3>
        <div className="detailed-legal-form__subtitle">
          <p>💡 <strong>Te guiaremos paso a paso para evaluar la viabilidad legal de tu proyecto</strong></p>
          <p>Los cambios aquí no se guardarán hasta que hagas clic en "Aplicar Totales"</p>
        </div>
      </div>

      {/* Sección 1: Permisos y Licencias */}
      <div className="detailed-legal-form__section">
        <h4>📋 Permisos y Licencias Requeridas</h4>
        <p className="detailed-legal-form__description">
          Identifica todos los permisos, licencias y autorizaciones necesarias
        </p>

        {/* Formulario para agregar permisos */}
        <form onSubmit={addRequiredPermit} className="detailed-legal-form__add-item">
          <h5>➕ Agregar Permiso o Licencia</h5>
          <div className="detailed-legal-form__add-form">
            <input
              type="text"
              placeholder="Nombre del permiso (ej: Licencia Municipal, Permiso Sanitario)"
              value={newPermit.name}
              onChange={(e) => setNewPermit(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <select
              value={newPermit.status}
              onChange={(e) => setNewPermit(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="pending">Pendiente</option>
              <option value="in-process">En Trámite</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>
            <input
              type="number"
              placeholder="Tiempo (meses)"
              value={newPermit.timeframe}
              onChange={(e) => setNewPermit(prev => ({ ...prev, timeframe: e.target.value }))}
            />
            <button type="submit" className="detailed-legal-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de permisos */}
        <div className="detailed-legal-form__items-list">
          <h5>Permisos Identificados (Vista Previa):</h5>
          {requiredPermits.length === 0 ? (
            <p className="detailed-legal-form__empty-state">No hay permisos agregados aún</p>
          ) : (
            requiredPermits.map((permit) => (
              <div key={permit.id} className="detailed-legal-form__item">
                <div className="detailed-legal-form__item-details">
                  <span className="detailed-legal-form__item-name">{permit.name}</span>
                  <span className="detailed-legal-form__item-info">
                    <span className={`detailed-legal-form__status detailed-legal-form__status--${permit.status}`}>
                      {permit.status === 'approved' ? '✅ Aprobado' : 
                       permit.status === 'in-process' ? '🟡 En trámite' : 
                       permit.status === 'rejected' ? '❌ Rechazado' : '⚪ Pendiente'}
                    </span>
                    {permit.timeframe ? ` • ${permit.timeframe} meses` : ''}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeRequiredPermit(permit.id)}
                  className="detailed-legal-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumen de permisos */}
        <div className="detailed-legal-form__total-preview">
          <strong>Resumen Permisos: {approvedPermits}/{totalPermits} aprobados • Tiempo promedio: {Math.round(averageProcessingTime)} meses</strong>
        </div>

        <div className="detailed-legal-form__help">
          <strong>Permisos comunes a considerar:</strong>
          <ul>
            <li>🏢 <strong>Municipales:</strong> Licencia de funcionamiento, uso de suelo</li>
            <li>🌿 <strong>Ambientales:</strong> Impacto ambiental, permisos de emisiones</li>
            <li>🔧 <strong>Sectoriales:</strong> Sanitarios, de construcción, específicos de industria</li>
            <li>👥 <strong>Laborales:</strong> Registro patronal, seguridad social</li>
          </ul>
        </div>
      </div>

      {/* Sección 2: Requisitos Legales */}
      <div className="detailed-legal-form__section">
        <h4>📜 Requisitos Legales y Normativos</h4>
        <p className="detailed-legal-form__description">
          Especifica los requisitos legales que debe cumplir tu proyecto
        </p>

        {/* Formulario para agregar requisitos */}
        <form onSubmit={addLegalRequirement} className="detailed-legal-form__add-item">
          <h5>➕ Agregar Requisito Legal</h5>
          <div className="detailed-legal-form__add-form">
            <input
              type="text"
              placeholder="Descripción del requisito"
              value={newRequirement.description}
              onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <select
              value={newRequirement.category}
              onChange={(e) => setNewRequirement(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Categoría</option>
              <option value="fiscal">Fiscal/Tributario</option>
              <option value="laboral">Laboral</option>
              <option value="ambiental">Ambiental</option>
              <option value="sanitario">Sanitario</option>
              <option value="comercial">Comercial</option>
              <option value="sectorial">Sectorial</option>
            </select>
            <select
              value={newRequirement.compliance}
              onChange={(e) => setNewRequirement(prev => ({ ...prev, compliance: e.target.value }))}
            >
              <option value="pending">Pendiente</option>
              <option value="partial">Parcial</option>
              <option value="complete">Cumplido</option>
            </select>
            <button type="submit" className="detailed-legal-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de requisitos */}
        <div className="detailed-legal-form__items-list">
          <h5>Requisitos Legales Identificados:</h5>
          {legalRequirements.length === 0 ? (
            <p className="detailed-legal-form__empty-state">No hay requisitos agregados aún</p>
          ) : (
            legalRequirements.map((requirement) => (
              <div key={requirement.id} className="detailed-legal-form__item">
                <div className="detailed-legal-form__item-details">
                  <span className="detailed-legal-form__item-name">{requirement.description}</span>
                  <span className="detailed-legal-form__item-info">
                    <span className="detailed-legal-form__category">{requirement.category}</span>
                    <span className={`detailed-legal-form__compliance detailed-legal-form__compliance--${requirement.compliance}`}>
                      {requirement.compliance === 'complete' ? '✅ Cumplido' : 
                       requirement.compliance === 'partial' ? '🟡 Parcial' : '⚪ Pendiente'}
                    </span>
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeLegalRequirement(requirement.id)}
                  className="detailed-legal-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sección 3: Factores de Riesgo Legal */}
      <div className="detailed-legal-form__section">
        <h4>⚠️ Factores de Riesgo Legal</h4>
        <p className="detailed-legal-form__description">
          Identifica y evalúa los posibles riesgos legales de tu proyecto
        </p>

        {/* Formulario para agregar riesgos */}
        <form onSubmit={addRiskFactor} className="detailed-legal-form__add-item">
          <h5>➕ Agregar Factor de Riesgo</h5>
          <div className="detailed-legal-form__add-form">
            <input
              type="text"
              placeholder="Descripción del riesgo"
              value={newRisk.description}
              onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <select
              value={newRisk.severity}
              onChange={(e) => setNewRisk(prev => ({ ...prev, severity: e.target.value }))}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            <input
              type="text"
              placeholder="Medida de mitigación"
              value={newRisk.mitigation}
              onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation: e.target.value }))}
            />
            <button type="submit" className="detailed-legal-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de riesgos */}
        <div className="detailed-legal-form__items-list">
          <h5>Factores de Riesgo Identificados:</h5>
          {riskFactors.length === 0 ? (
            <p className="detailed-legal-form__empty-state">No hay riesgos identificados aún</p>
          ) : (
            riskFactors.map((risk) => (
              <div key={risk.id} className="detailed-legal-form__item">
                <div className="detailed-legal-form__item-details">
                  <span className="detailed-legal-form__item-name">{risk.description}</span>
                  <span className="detailed-legal-form__item-info">
                    <span className={`detailed-legal-form__severity detailed-legal-form__severity--${risk.severity}`}>
                      {risk.severity === 'high' ? '🔴 Alta' : 
                       risk.severity === 'medium' ? '🟡 Media' : '🟢 Baja'}
                    </span>
                    {risk.mitigation && ` • Mitigación: ${risk.mitigation}`}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeRiskFactor(risk.id)}
                  className="detailed-legal-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumen de riesgos */}
        <div className="detailed-legal-form__total-preview">
          <strong>Resumen Riesgos: {riskFactors.length} identificados • {highRisks} de alta severidad</strong>
        </div>
      </div>

      {/* Sección 4: Parámetros Legales Generales */}
      <div className="detailed-legal-form__section">
        <h4>⚖️ Parámetros Legales Generales</h4>
        
        <div className="detailed-legal-form__input-group">
          <label>
            <input
              type="checkbox"
              checked={localData.regulatoryCompliance || false}
              onChange={(e) => handleBasicInputChange('regulatoryCompliance', e.target.checked)}
            />
            ¿Cumple con todas las regulaciones aplicables?
          </label>
          <div className="detailed-legal-form__help">
            <strong>Considera:</strong>
            <p>Leyes laborales, fiscales, ambientales, sectoriales y municipales aplicables a tu actividad.</p>
          </div>
        </div>

        <div className="detailed-legal-form__input-group">
          <label>
            <input
              type="checkbox"
              checked={localData.intellectualProperty || false}
              onChange={(e) => handleBasicInputChange('intellectualProperty', e.target.checked)}
            />
            ¿Tienes protección de propiedad intelectual?
          </label>
          <div className="detailed-legal-form__help">
            <strong>Protección IP:</strong>
            <p>Marcas, patentes, derechos de autor, secretos comerciales, diseños industriales.</p>
          </div>
        </div>
      </div>

      {/* Botón para aplicar totales */}
      <form onSubmit={applyCalculatedTotals} className="detailed-legal-form__actions">
        <button 
          type="submit"
          className="detailed-legal-form__apply-btn"
          disabled={requiredPermits.length === 0 && legalRequirements.length === 0}
        >
          🧮 Aplicar Evaluación Legal
        </button>
        <div className="detailed-legal-form__totals-preview">
          <p><strong>Evaluación a aplicar:</strong></p>
          <p>• Permisos: <strong>{approvedPermits}/{totalPermits} aprobados</strong></p>
          <p>• Riesgo Legal: <strong>{Math.min(10, highRisks * 2 + riskFactors.length)}/10</strong></p>
          <p>• Tiempo Estimado: <strong>{Math.round(averageProcessingTime)} meses</strong></p>
          <p>• Requisitos: <strong>{legalRequirements.length} identificados</strong></p>
        </div>
      </form>

      {/* Resultados (usando el mismo componente de resultados que el LegalDataForm) */}
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

      {/* Toggle para resultados */}
      {hasValidData && (
        <div className="detailed-legal-form__toggle-results">
          <button 
            onClick={() => setShowResults(!showResults)}
            className="detailed-legal-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Resultados' : '⚖️ Ver Evaluación Legal'}
          </button>
        </div>
      )}
    </div>
  );
});