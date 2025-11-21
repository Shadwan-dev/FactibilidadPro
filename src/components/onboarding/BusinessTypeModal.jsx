// src/components/onboarding/BusinessTypeModal.jsx
import React from 'react';
import '../../styles/components/onboarding/BusinessTypeModal.css';

export const BusinessTypeModal = ({ isOpen, onClose, onBusinessTypeSelect }) => {
  if (!isOpen) return null;

  const businessTypes = [
    {
      id: 'enterprise',
      title: '🏢 Empresa Establecida',
      description: 'Ya tienes una empresa funcionando con estructura organizada',
      features: [
        'Análisis financiero avanzado',
        'Múltiples departamentos',
        'Estructura de costos compleja',
        'Flujos de caja consolidados'
      ],
      available: true
    },
    {
      id: 'small-business',
      title: '🚀 Negocio Pequeño o Startup',
      description: 'Eres un emprendedor, startup o negocio en crecimiento',
      features: [
        'Enfoque en viabilidad inicial',
        'Estructura simple de costos',
        'Crecimiento escalable',
        'Análisis ágil y práctico'
      ],
      available: false,
      comingSoon: true
    }
  ];

  const handleTypeSelect = (typeId) => {
    if (typeId === 'small-business') {
      // Mostrar mensaje de "próximamente" para negocio pequeño
      return;
    }
    onBusinessTypeSelect(typeId);
    onClose();
  };

  return (
    <div className="business-type-modal-overlay">
      <div className="business-type-modal">
        <div className="modal-header">
          <h2>🎯 Selecciona tu Tipo de Negocio</h2>
          <p>Elige la opción que mejor describa tu situación actual</p>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="business-types-grid">
          {businessTypes.map((type) => (
            <div 
              key={type.id}
              className={`business-type-card ${type.available ? 'available' : 'coming-soon'} ${!type.available ? 'disabled' : ''}`}
              onClick={() => type.available && handleTypeSelect(type.id)}
            >
              <div className="type-header">
                <h3>{type.title}</h3>
                {type.comingSoon && (
                  <span className="coming-soon-badge">Próximamente</span>
                )}
              </div>
              
              <p className="type-description">{type.description}</p>
              
              <div className="type-features">
                <h4>Incluye:</h4>
                <ul>
                  {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="type-footer">
                {type.available ? (
                  <button className="select-btn">
                    Seleccionar ✅
                  </button>
                ) : (
                  <div className="coming-soon-message">
                    <span>🚧 En desarrollo</span>
                    <small>Disponible en la próxima actualización</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <p className="selection-help">
            💡 <strong>¿No estás seguro?</strong> Elige "Empresa Establecida" si ya tienes operaciones en marcha
          </p>
        </div>
      </div>
    </div>
  );
};