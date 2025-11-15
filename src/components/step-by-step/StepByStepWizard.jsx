// src/components/onboarding/StepByStepWizard.jsx
import React, { useState } from 'react';
import '../../styles/StepByStepWizard.css';

export const StepByStepWizard = React.memo(({ 
  formData, 
  onChange, 
  onComplete,
  onBackToAdvanced 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState(formData);

  const steps = [
    {
      id: 1,
      title: "🎯 Cuéntame sobre tu producto",
      subtitle: "Empecemos por entender qué quieres ofrecer",
      description: "Esta información nos ayudará a analizar el mercado potencial",
      component: 'market',
      icon: '🎯',
      progress: 25
    },
    {
      id: 2,
      title: "⚙️ ¿Qué necesitas para hacerlo realidad?",
      subtitle: "Hablemos de los recursos necesarios",
      description: "Evaluemos tu capacidad técnica y equipo",
      component: 'technical', 
      icon: '⚙️',
      progress: 50
    },
    {
      id: 3,
      title: "💰 ¿Cuánto cuesta y cuánto genera?",
      subtitle: "Analicemos los números de tu proyecto",
      description: "Veamos la viabilidad financiera",
      component: 'financial',
      icon: '💰',
      progress: 75
    },
    {
      id: 4,
      title: "⚖️ ¿Qué permisos necesitas?",
      subtitle: "Revisemos los aspectos legales",
      description: "Aseguremos el cumplimiento normativo",
      component: 'legal',
      icon: '⚖️',
      progress: 100
    }
  ];

  const currentStepInfo = steps.find(step => step.id === currentStep);

  const handleStepDataChange = (component, data) => {
    const newStepData = {
      ...stepData,
      [component]: data
    };
    setStepData(newStepData);
    onChange(newStepData);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(stepData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepComponent = () => {
    switch(currentStepInfo.component) {
      case 'market':
        return (
          <div className="step-content">
            <h3>Describe tu producto o servicio</h3>
            <div className="step-guided-questions">
              <div className="guided-question">
                <label>¿Qué problema resuelve tu producto?</label>
                <textarea placeholder="Ej: Ayuda a pequeñas empresas a gestionar sus inventarios de forma más eficiente..." />
              </div>
              <div className="guided-question">
                <label>¿Para quién es tu producto?</label>
                <input type="text" placeholder="Ej: Pequeños comercios, emprendedores, etc." />
              </div>
              <div className="guided-question">
                <label>¿Qué hace único a tu producto?</label>
                <textarea placeholder="Ej: Es más económico que la competencia, tiene funciones exclusivas..." />
              </div>
            </div>
          </div>
        );
      
      case 'technical':
        return (
          <div className="step-content">
            <h3>Recursos necesarios</h3>
            <div className="step-guided-questions">
              <div className="guided-question">
                <label>¿Qué habilidades necesita tu equipo?</label>
                <div className="skills-selector">
                  {['Desarrollo web', 'Diseño', 'Marketing', 'Ventas', 'Atención al cliente'].map(skill => (
                    <button key={skill} className="skill-tag">{skill}</button>
                  ))}
                </div>
              </div>
              <div className="guided-question">
                <label>¿Qué tecnología necesitas?</label>
                <input type="text" placeholder="Ej: Sitio web, app móvil, software especializado..." />
              </div>
              <div className="guided-question">
                <label>¿Cuánto tiempo estimas para desarrollarlo?</label>
                <select>
                  <option>Menos de 1 mes</option>
                  <option>1-3 meses</option>
                  <option>3-6 meses</option>
                  <option>Más de 6 meses</option>
                </select>
              </div>
            </div>
          </div>
        );

      // ... componentes para financial y legal
    }
  };

  return (
    <div className="step-by-step-wizard">
      {/* Header del wizard */}
      <div className="wizard-header">
        <button onClick={onBackToAdvanced} className="wizard-back-btn">
          ← Volver al modo avanzado
        </button>
        <h1>Guía de Factibilidad Paso a Paso</h1>
        <p>Sigue estos pasos simples para evaluar tu proyecto</p>
      </div>

      {/* Barra de progreso */}
      <div className="wizard-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${currentStepInfo.progress}%` }}
          ></div>
        </div>
        <div className="progress-steps">
          {steps.map(step => (
            <div 
              key={step.id}
              className={`progress-step ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}`}
            >
              <span className="step-number">{step.id}</span>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="wizard-content">
        <div className="step-header">
          <span className="step-icon">{currentStepInfo.icon}</span>
          <div>
            <h2>{currentStepInfo.title}</h2>
            <p>{currentStepInfo.subtitle}</p>
            <small>{currentStepInfo.description}</small>
          </div>
        </div>

        {getStepComponent()}

        {/* Navegación */}
        <div className="wizard-navigation">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="wizard-btn wizard-btn--secondary"
          >
            ← Anterior
          </button>
          
          <div className="step-indicator">
            Paso {currentStep} de {steps.length}
          </div>

          <button 
            onClick={handleNext}
            className="wizard-btn wizard-btn--primary"
          >
            {currentStep === steps.length ? '🎉 Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>

      {/* Tips contextuales */}
      <div className="wizard-tips">
        <h4>💡 Tip para este paso:</h4>
        <p>
          {currentStep === 1 && "Sé específico sobre el problema que resuelves. Esto te ayudará a identificar mejor tu mercado."}
          {currentStep === 2 && "No subestimes los recursos necesarios. Es mejor ser conservador en las estimaciones."}
          {currentStep === 3 && "Considera todos los costos, incluyendo aquellos que no son obvios como marketing y mantenimiento."}
          {currentStep === 4 && "Investiga los requisitos legales específicos de tu industria y ubicación."}
        </p>
      </div>
    </div>
  );
});