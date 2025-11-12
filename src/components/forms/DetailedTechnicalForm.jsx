// src/components/forms/DetailedTechnicalForm.jsx
import React, { useState, useCallback } from 'react';
import '../../styles/DetailedTechnicalForm.css';

export const DetailedTechnicalForm = React.memo(({ data, onChange, calculations }) => {
  const [localData, setLocalData] = useState({
    teamCapacity: data.teamCapacity || 0,
    infrastructure: data.infrastructure || 0,
    implementationTime: data.implementationTime || 0,
    complexity: data.complexity || 0,
    requiredStaff: data.requiredStaff || 0,
    technologyAvailable: data.technologyAvailable || false
  });
  
  const [showResults, setShowResults] = useState(false);
  const [technicalRequirements, setTechnicalRequirements] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [infrastructureItems, setInfrastructureItems] = useState([]);
  const [newRequirement, setNewRequirement] = useState({ description: '', priority: 'medium' });
  const [newTeamMember, setNewTeamMember] = useState({ role: '', experience: '', quantity: '' });
  const [newInfrastructure, setNewInfrastructure] = useState({ item: '', cost: '' });

  // ✅ SOLO campos básicos afectan el estado global
  const handleBasicInputChange = useCallback((field, value) => {
    const numericValue = typeof value === 'number' ? value : (value === '' ? 0 : parseFloat(value) || 0);
    
    const newLocalData = {
      ...localData,
      [field]: numericValue
    };
    
    setLocalData(newLocalData);
    
    // ✅ DEBOUNCE: Esperar antes de actualizar el estado global
    setTimeout(() => {
      onChange('technical', newLocalData);
    }, 1000);
  }, [localData, onChange]);

  // ✅ Manejar requerimientos técnicos - SOLO estado local
  const addTechnicalRequirement = (e) => {
    e.preventDefault();
    if (newRequirement.description) {
      setTechnicalRequirements(prev => [...prev, { 
        ...newRequirement,
        id: Date.now()
      }]);
      setNewRequirement({ description: '', priority: 'medium' });
    }
  };

  const removeTechnicalRequirement = (id) => {
    setTechnicalRequirements(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Manejar miembros del equipo - SOLO estado local
  const addTeamMember = (e) => {
    e.preventDefault();
    if (newTeamMember.role && newTeamMember.quantity) {
      setTeamMembers(prev => [...prev, {
        ...newTeamMember,
        id: Date.now(),
        quantity: parseInt(newTeamMember.quantity)
      }]);
      setNewTeamMember({ role: '', experience: '', quantity: '' });
    }
  };

  const removeTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Manejar infraestructura - SOLO estado local
  const addInfrastructureItem = (e) => {
    e.preventDefault();
    if (newInfrastructure.item && newInfrastructure.cost) {
      setInfrastructureItems(prev => [...prev, {
        ...newInfrastructure,
        id: Date.now(),
        cost: parseFloat(newInfrastructure.cost)
      }]);
      setNewInfrastructure({ item: '', cost: '' });
    }
  };

  const removeInfrastructureItem = (id) => {
    setInfrastructureItems(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Calcular totales automáticamente
  const totalTeamCapacity = teamMembers.reduce((sum, member) => sum + (member.quantity || 0), 0);
  const totalInfrastructureCost = infrastructureItems.reduce((sum, item) => sum + (item.cost || 0), 0);

  // ✅ Aplicar totales calculados
  const applyCalculatedTotals = (e) => {
    e.preventDefault();
    
    const finalData = {
      ...localData,
      teamCapacity: totalTeamCapacity,
      infrastructure: totalInfrastructureCost,
      requiredStaff: totalTeamCapacity
    };
    
    setLocalData(finalData);
    onChange('technical', finalData);
    
    alert(`✅ Totales técnicos aplicados:\n- Capacidad del equipo: ${totalTeamCapacity} personas\n- Infraestructura: $${totalInfrastructureCost.toLocaleString()}`);
  };

  const hasValidData = localData.teamCapacity > 0 && localData.implementationTime > 0;

  return (
    <div className="form-section detailed-technical-form">
      <div className="detailed-technical-form__header">
        <h3>⚙️ Análisis Técnico - Modo Guiado</h3>
        <div className="detailed-technical-form__subtitle">
          <p>💡 <strong>Te guiaremos paso a paso para evaluar la viabilidad técnica de tu proyecto</strong></p>
          <p>Los cambios aquí no se guardarán hasta que hagas clic en "Aplicar Totales"</p>
        </div>
      </div>

      {/* Sección 1: Equipo de Trabajo */}
      <div className="detailed-technical-form__section">
        <h4>👥 Equipo de Trabajo Requerido</h4>
        <p className="detailed-technical-form__description">
          Define los roles y cantidades necesarias para ejecutar el proyecto
        </p>

        {/* Formulario para agregar miembros del equipo */}
        <form onSubmit={addTeamMember} className="detailed-technical-form__add-item">
          <h5>➕ Agregar Rol al Equipo</h5>
          <div className="detailed-technical-form__add-form">
            <input
              type="text"
              placeholder="Rol (ej: Desarrollador, Diseñador, etc.)"
              value={newTeamMember.role}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Experiencia requerida"
              value={newTeamMember.experience}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, experience: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={newTeamMember.quantity}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, quantity: e.target.value }))}
              required
            />
            <button type="submit" className="detailed-technical-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de miembros del equipo */}
        <div className="detailed-technical-form__items-list">
          <h5>Equipo Requerido (Vista Previa):</h5>
          {teamMembers.length === 0 ? (
            <p className="detailed-technical-form__empty-state">No hay roles agregados aún</p>
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="detailed-technical-form__item">
                <div className="detailed-technical-form__item-details">
                  <span className="detailed-technical-form__item-name">{member.role}</span>
                  <span className="detailed-technical-form__item-info">{member.experience}</span>
                </div>
                <span className="detailed-technical-form__item-amount">
                  {member.quantity} personas
                </span>
                <button 
                  type="button"
                  onClick={() => removeTeamMember(member.id)}
                  className="detailed-technical-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total del equipo */}
        <div className="detailed-technical-form__total-preview">
          <strong>Total Capacidad del Equipo (Vista Previa): {totalTeamCapacity} personas</strong>
        </div>

        <div className="detailed-technical-form__help">
          <strong>Roles técnicos comunes:</strong>
          <ul>
            <li>💻 <strong>Desarrolladores:</strong> Frontend, Backend, Full-stack</li>
            <li>🎨 <strong>Diseñadores:</strong> UI/UX, Gráfico</li>
            <li>📊 <strong>Analistas:</strong> Negocio, Sistemas, Datos</li>
            <li>🔧 <strong>Especialistas:</strong> DevOps, QA, Seguridad</li>
            <li>📋 <strong>Gestión:</strong> Project Manager, Scrum Master</li>
          </ul>
        </div>
      </div>

      {/* Sección 2: Infraestructura y Recursos */}
      <div className="detailed-technical-form__section">
        <h4>🏢 Infraestructura y Recursos</h4>
        <p className="detailed-technical-form__description">
          Lista los recursos físicos y tecnológicos necesarios
        </p>

        {/* Formulario para agregar infraestructura */}
        <form onSubmit={addInfrastructureItem} className="detailed-technical-form__add-item">
          <h5>➕ Agregar Recurso de Infraestructura</h5>
          <div className="detailed-technical-form__add-form">
            <input
              type="text"
              placeholder="Recurso (ej: Servidores, Licencias, etc.)"
              value={newInfrastructure.item}
              onChange={(e) => setNewInfrastructure(prev => ({ ...prev, item: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Costo ($)"
              value={newInfrastructure.cost}
              onChange={(e) => setNewInfrastructure(prev => ({ ...prev, cost: e.target.value }))}
              required
            />
            <button type="submit" className="detailed-technical-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de infraestructura */}
        <div className="detailed-technical-form__items-list">
          <h5>Infraestructura Requerida (Vista Previa):</h5>
          {infrastructureItems.length === 0 ? (
            <p className="detailed-technical-form__empty-state">No hay recursos agregados aún</p>
          ) : (
            infrastructureItems.map((item) => (
              <div key={item.id} className="detailed-technical-form__item">
                <span className="detailed-technical-form__item-name">{item.item}</span>
                <span className="detailed-technical-form__item-amount">
                  ${item.cost.toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => removeInfrastructureItem(item.id)}
                  className="detailed-technical-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total de infraestructura */}
        <div className="detailed-technical-form__total-preview">
          <strong>Total Infraestructura (Vista Previa): ${totalInfrastructureCost.toLocaleString()}</strong>
        </div>

        <div className="detailed-technical-form__help">
          <strong>Recursos comunes a considerar:</strong>
          <ul>
            <li>🖥️ <strong>Hardware:</strong> Servidores, computadoras, equipos</li>
            <li>📋 <strong>Software:</strong> Licencias, suscripciones</li>
            <li>🌐 <strong>Hosting:</strong> Servidores cloud, dominios</li>
            <li>🔒 <strong>Seguridad:</strong> Certificados SSL, firewalls</li>
            <li>📞 <strong>Comunicación:</strong> Teléfono, internet, videoconferencia</li>
          </ul>
        </div>
      </div>

      {/* Sección 3: Requerimientos Técnicos */}
      <div className="detailed-technical-form__section">
        <h4>🔧 Requerimientos Técnicos Específicos</h4>
        <p className="detailed-technical-form__description">
          Define los requisitos técnicos específicos de tu proyecto
        </p>

        {/* Formulario para agregar requerimientos */}
        <form onSubmit={addTechnicalRequirement} className="detailed-technical-form__add-item">
          <h5>➕ Agregar Requerimiento Técnico</h5>
          <div className="detailed-technical-form__add-form">
            <input
              type="text"
              placeholder="Descripción del requerimiento"
              value={newRequirement.description}
              onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <select
              value={newRequirement.priority}
              onChange={(e) => setNewRequirement(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="low">Baja Prioridad</option>
              <option value="medium">Media Prioridad</option>
              <option value="high">Alta Prioridad</option>
            </select>
            <button type="submit" className="detailed-technical-form__add-btn">
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de requerimientos */}
        <div className="detailed-technical-form__items-list">
          <h5>Requerimientos Técnicos:</h5>
          {technicalRequirements.length === 0 ? (
            <p className="detailed-technical-form__empty-state">No hay requerimientos agregados</p>
          ) : (
            technicalRequirements.map((req) => (
              <div key={req.id} className="detailed-technical-form__item">
                <div className="detailed-technical-form__item-details">
                  <span className="detailed-technical-form__item-name">{req.description}</span>
                  <span className={`detailed-technical-form__priority detailed-technical-form__priority--${req.priority}`}>
                    {req.priority === 'high' ? '🔴 Alta' : req.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeTechnicalRequirement(req.id)}
                  className="detailed-technical-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sección 4: Parámetros Técnicos */}
      <div className="detailed-technical-form__section">
        <h4>⏱️ Parámetros del Proyecto</h4>
        
        <div className="detailed-technical-form__input-group">
          <label>Tiempo de Implementación (meses)</label>
          <input
            type="number"
            value={localData.implementationTime || ''}
            onChange={(e) => handleBasicInputChange('implementationTime', e.target.value)}
            placeholder="Ej: 6"
          />
          <div className="detailed-technical-form__help">
            <strong>¿Cómo estimar?</strong>
            <p>Considera: análisis, desarrollo, pruebas, implementación y capacitación.</p>
          </div>
        </div>

        <div className="detailed-technical-form__input-group">
          <label>Complejidad Técnica (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={localData.complexity || ''}
            onChange={(e) => handleBasicInputChange('complexity', e.target.value)}
            placeholder="Ej: 7"
          />
          <div className="detailed-technical-form__help">
            <strong>Escala de complejidad:</strong>
            <p>1-3: Simple, 4-7: Moderada, 8-10: Compleja</p>
          </div>
        </div>

        <div className="detailed-technical-form__input-group">
          <label>
            <input
              type="checkbox"
              checked={localData.technologyAvailable || false}
              onChange={(e) => handleBasicInputChange('technologyAvailable', e.target.checked)}
            />
            ¿La tecnología requerida está disponible?
          </label>
          <div className="detailed-technical-form__help">
            <strong>Considera:</strong>
            <p>¿Tienes acceso a las herramientas, frameworks y tecnologías necesarias?</p>
          </div>
        </div>
      </div>

      {/* Botón para aplicar totales */}
      <form onSubmit={applyCalculatedTotals} className="detailed-technical-form__actions">
        <button 
          type="submit"
          className="detailed-technical-form__apply-btn"
          disabled={teamMembers.length === 0 && infrastructureItems.length === 0}
        >
          🧮 Aplicar Totales Técnicos
        </button>
        <div className="detailed-technical-form__totals-preview">
          <p><strong>Totales a aplicar:</strong></p>
          <p>• Capacidad del Equipo: <strong>{totalTeamCapacity} personas</strong></p>
          <p>• Infraestructura: <strong>${totalInfrastructureCost.toLocaleString()}</strong></p>
          <p>• Requerimientos: <strong>{technicalRequirements.length} especificados</strong></p>
        </div>
      </form>

      {/* Resultados */}
      {showResults && calculations && (
        <div className="detailed-technical-form__results">
          <h4>📊 Evaluación Técnica</h4>
          <div className="detailed-technical-form__results-grid">
            <div className="detailed-technical-form__result-item">
              <span className="detailed-technical-form__result-label">Viabilidad Técnica:</span>
              <span className={`detailed-technical-form__result-value ${calculations.technical?.viable ? 'detailed-technical-form__result-positive' : 'detailed-technical-form__result-negative'}`}>
                {calculations.technical?.viable ? '✅ VIABLE' : '❌ NO VIABLE'}
              </span>
            </div>
            <div className="detailed-technical-form__result-item">
              <span className="detailed-technical-form__result-label">Puntuación:</span>
              <span className="detailed-technical-form__result-value">
                {calculations.technical?.score || 0}/100
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle para resultados */}
      {hasValidData && (
        <div className="detailed-technical-form__toggle-results">
          <button 
            onClick={() => setShowResults(!showResults)}
            className="detailed-technical-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Resultados' : '📈 Ver Evaluación Técnica'}
          </button>
        </div>
      )}
    </div>
  );
});