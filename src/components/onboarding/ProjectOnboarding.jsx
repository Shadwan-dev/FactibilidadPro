// src/components/onboarding/ProjectOnboarding.jsx
import React, { useState } from 'react';
import '../../styles/ProjectOnboarding.css';

export const ProjectOnboarding = React.memo(({ onProfileSelect, onSkip }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const userProfiles = [
    {
      id: 'first-time',
      title: '🚀 Emprendedor Nuevo',
      description: 'Es mi primer proyecto o startup',
      icon: '🎯',
      features: [
        'Guía completa paso a paso',
        'Ejemplos de negocios similares',
        'Estimaciones automáticas',
        'Explicaciones simples de conceptos'
      ],
      recommendedStartingPoint: 'market',
      difficulty: 'Principiante',
      estimatedTime: '15-20 minutos'
    },
    {
      id: 'existing-business',
      title: '🏢 Negocio Existente',
      description: 'Ya tengo un negocio funcionando',
      icon: '📊',
      features: [
        'Análisis de expansión o mejora',
        'Comparación con datos actuales',
        'Enfoque en rentabilidad',
        'Optimización de recursos'
      ],
      recommendedStartingPoint: 'financial',
      difficulty: 'Intermedio',
      estimatedTime: '10-15 minutos'
    },
    {
      id: 'technical-founder',
      title: '💻 Fundador Técnico',
      description: 'Tengo equipo técnico o soy desarrollador',
      icon: '⚙️',
      features: [
        'Enfoque en viabilidad técnica',
        'Estimación de tiempos de desarrollo',
        'Análisis de recursos tecnológicos',
        'Planificación de implementación'
      ],
      recommendedStartingPoint: 'technical',
      difficulty: 'Intermedio',
      estimatedTime: '12-18 minutos'
    },
    {
      id: 'expert',
      title: '📈 Experto en Negocios',
      description: 'Tengo experiencia en análisis de viabilidad',
      icon: '🎓',
      features: [
        'Guía avanzada paso a paso',
        'Acceso a análisis detallados',
        'Cálculos personalizados',
        'Comparativas avanzadas'
      ],
      recommendedStartingPoint: 'market',
      difficulty: 'Avanzado',
      estimatedTime: '8-12 minutos'
    }
  ];

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setShowDetails(true);
  };

  const handleConfirm = () => {
    if (selectedProfile) {
      onProfileSelect(selectedProfile);
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedProfile(null);
  };

  if (showDetails && selectedProfile) {
    return (
      <div className="onboarding-details">
        <div className="onboarding-details__header">
          <button onClick={handleBack} className="onboarding-details__back-btn">
            ← Volver a la selección
          </button>
          <h2>Perfecto para {selectedProfile.title.toLowerCase()}</h2>
          <p>Hemos personalizado la experiencia guiada para ti</p>
        </div>

        <div className="onboarding-details__content">
          <div className="onboarding-details__profile-card">
            <div className="onboarding-details__profile-header">
              <span className="onboarding-details__profile-icon">
                {selectedProfile.icon}
              </span>
              <div>
                <h3>{selectedProfile.title}</h3>
                <p>{selectedProfile.description}</p>
              </div>
            </div>

            <div className="onboarding-details__meta">
              <div className="onboarding-details__meta-item">
                <span>Dificultad:</span>
                <strong>{selectedProfile.difficulty}</strong>
              </div>
              <div className="onboarding-details__meta-item">
                <span>Tiempo estimado:</span>
                <strong>{selectedProfile.estimatedTime}</strong>
              </div>
            </div>
          </div>

          <div className="onboarding-details__benefits">
            <h4>🎁 Lo que obtendrás:</h4>
            <ul>
              {selectedProfile.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {selectedProfile.recommendedStartingPoint && (
            <div className="onboarding-details__recommendation">
              <h4>🎯 Recomendación de inicio</h4>
              <p>
                Te sugerimos comenzar con el análisis de{" "}
                <strong>
                  {selectedProfile.recommendedStartingPoint === "market" &&
                    "Mercado"}
                  {selectedProfile.recommendedStartingPoint === "financial" &&
                    "Financiero"}
                  {selectedProfile.recommendedStartingPoint === "technical" &&
                    "Técnico"}
                </strong>{" "}
                para una experiencia más fluida.
              </p>
            </div>
          )}

          <div className="onboarding-details__actions">
            <button
              onClick={handleConfirm}
              className="onboarding-details__confirm-btn"
            >
              ✅ Comenzar experiencia guiada
            </button>
            <button onClick={onSkip} className="onboarding-details__skip-btn">
              Explorar por mi cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-onboarding">
      <div className="project-onboarding__header">
        <h1>🎯 Bienvenido al Análisis de Factibilidad</h1>
        <p>Selecciona tu perfil para una experiencia guiada personalizada</p>
      </div>

      <div className="project-onboarding__profiles">
        {userProfiles.map((profile) => (
          <div 
            key={profile.id}
            className={`onboarding-profile ${selectedProfile?.id === profile.id ? 'selected' : ''}`}
            onClick={() => handleProfileSelect(profile)}
          >
            <div className="onboarding-profile__icon">
              {profile.icon}
            </div>
            <div className="onboarding-profile__content">
              <h3>{profile.title}</h3>
              <p>{profile.description}</p>
              <div className="onboarding-profile__tags">
                <span className="onboarding-profile__tag onboarding-profile__tag--difficulty">
                  {profile.difficulty}
                </span>
                <span className="onboarding-profile__tag onboarding-profile__tag--time">
                  {profile.estimatedTime}
                </span>
              </div>
            </div>
            <div className="onboarding-profile__selector">
              {selectedProfile?.id === profile.id ? '✅' : '○'}
            </div>
          </div>
        ))}
      </div>

      <div className="project-onboarding__help">
        <h4>💡 ¿No estás seguro?</h4>
        <p>
          Si es tu primera vez, te recomendamos "Emprendedor Nuevo". 
          Te guiaremos paso a paso con explicaciones claras y ejemplos prácticos.
          Todos los perfiles incluyen asistencia guiada.
        </p>
      </div>

      <div className="project-onboarding__actions">
        <button 
          onClick={() => selectedProfile && handleConfirm()}
          disabled={!selectedProfile}
          className="project-onboarding__continue-btn"
        >
          Comenzar experiencia guiada
        </button>
        <button 
          onClick={onSkip}
          className="project-onboarding__skip-btn"
        >
          Explorar por mi cuenta
        </button>
      </div>
    </div>
  );
});