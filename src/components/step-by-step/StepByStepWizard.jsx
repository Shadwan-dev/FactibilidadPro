// src/components/onboarding/StepByStepWizard.jsx (VERSIÓN EDUCATIVA)
import React, { useState } from 'react';
import '../../styles/StepByStepWizard.css';

export const StepByStepWizard = React.memo(({ 
  userProfile, // ✅ Recibimos el perfil del usuario
  formData, 
  onChange, 
  onComplete,
  onBackToAdvanced 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState(formData);
  const [userKnowledge, setUserKnowledge] = useState({});

  // ✅ Determinar nivel de detalle según perfil
  const getDetailLevel = () => {
    if (userProfile?.id === 'expert') return 'minimal';
    if (userProfile?.id === 'technical-founder' || userProfile?.id === 'existing-business') return 'moderate';
    return 'detailed'; // first-time y otros
  };

  const detailLevel = getDetailLevel();

  const steps = [
    {
      id: 1,
      title: "🎯 Define tu Propuesta de Valor",
      subtitle: "Vamos a entender qué hace único tu proyecto",
      description: detailLevel === 'detailed' 
        ? "Identificaremos el problema que resuelves y para quién" 
        : "Define tu mercado objetivo",
      component: 'market',
      icon: '🎯',
      progress: 25,
      concepts: detailLevel === 'detailed' ? [
        "Mercado objetivo: Grupo específico de clientes a los que te diriges",
        "Propuesta de valor: Qué hace que tu solución sea única y deseable",
        "Problema a resolver: La necesidad o dolor que alivias"
      ] : []
    },
    {
      id: 2,
      title: "⚙️ Planifica tu Ejecución",
      subtitle: "Organiza los recursos necesarios",
      description: detailLevel === 'detailed' 
        ? "Evaluaremos tu capacidad técnica y equipo requerido" 
        : "Define recursos y tiempos",
      component: 'technical', 
      icon: '⚙️',
      progress: 50,
      concepts: detailLevel === 'detailed' ? [
        "Recursos técnicos: Equipamiento y tecnología necesarios",
        "Capacidad del equipo: Habilidades y experiencia requeridas",
        "Tiempo de implementación: Cronograma realista de desarrollo"
      ] : []
    },
    {
      id: 3,
      title: "💰 Analiza la Viabilidad Financiera",
      subtitle: "Comprendamos los números de tu proyecto",
      description: "Evaluaremos rentabilidad y sostenibilidad",
      component: 'financial',
      icon: '💰',
      progress: 75,
      concepts: [
        "Inversión inicial: Dinero necesario para comenzar",
        "Costos operativos: Gastos mensuales para mantener el negocio",
        "Flujo de caja: Entrada y salida de dinero en el tiempo",
        "Punto de equilibrio: Cuando los ingresos igualan a los costos",
        "VAN (Valor Actual Neto): Valor presente de los flujos futuros",
        "TIR (Tasa Interna de Retorno): Rentabilidad porcentual del proyecto"
      ].slice(0, detailLevel === 'detailed' ? 6 : detailLevel === 'moderate' ? 4 : 2)
    },
    {
      id: 4,
      title: "⚖️ Considera los Aspectos Legales",
      subtitle: "Aseguremos el cumplimiento normativo",
      description: detailLevel === 'detailed' 
        ? "Revisaremos permisos, regulaciones y protección intelectual" 
        : "Verifica requisitos legales",
      component: 'legal',
      icon: '⚖️',
      progress: 100,
      concepts: detailLevel === 'detailed' ? [
        "Permisos y licencias: Autorizaciones necesarias para operar",
        "Propiedad intelectual: Protección de tus ideas y creaciones",
        "Riesgos legales: Posibles problemas regulatorios a considerar"
      ] : []
    }
  ];

  const currentStepInfo = steps.find(step => step.id === currentStep);

  // ✅ Componente educativo para explicar conceptos
  const ConceptExplainer = ({ concepts }) => (
    <div className="concept-explainer">
      <h4>📚 Conceptos Clave para este Paso:</h4>
      <div className="concepts-grid">
        {concepts.map((concept, index) => (
          <div key={index} className="concept-card">
            <div className="concept-content">
              <p>{concept}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ✅ Componente de preguntas guiadas con palabras clave
  const GuidedQuestions = ({ questions }) => (
    <div className="guided-questions">
      {questions.map((question, index) => (
        <div key={index} className="guided-question-card">
          <h5>{question.question}</h5>
          <div className="keywords-section">
            <span className="keywords-label">Palabras clave a considerar:</span>
            <div className="keywords-container">
              {question.keywords.map((keyword, kwIndex) => (
                <span key={kwIndex} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </div>
          <textarea 
            placeholder={question.placeholder}
            className="idea-input"
            onChange={(e) => handleIdeaCapture(question.field, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  const handleIdeaCapture = (field, value) => {
    setUserKnowledge(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStepComponent = () => {
    const questions = {
      market: [
        {
          question: "¿Qué problema específico resuelve tu producto o servicio?",
          keywords: ["Dolor del cliente", "Necesidad insatisfecha", "Ineficiencia actual", "Oportunidad de mejora"],
          placeholder: "Describe el problema principal que tu solución aborda...",
          field: "problemDefinition"
        },
        {
          question: "¿Quiénes son tus clientes ideales y por qué te elegirían?",
          keywords: ["Perfil demográfico", "Comportamiento", "Motivación de compra", "Alternativas actuales"],
          placeholder: "Describe a tu cliente ideal y qué los motivaría a elegirte...",
          field: "targetCustomer"
        },
        {
          question: "¿Qué hace que tu solución sea única en el mercado?",
          keywords: ["Ventaja competitiva", "Diferenciación", "Propuesta de valor", "Innovación"],
          placeholder: "Explica qué te distingue de la competencia...",
          field: "uniqueValue"
        }
      ],
      technical: [
        {
          question: "¿Qué recursos y habilidades necesitas para desarrollar tu solución?",
          keywords: ["Talento especializado", "Tecnología", "Infraestructura", "Herramientas"],
          placeholder: "Lista los recursos humanos y técnicos necesarios...",
          field: "requiredResources"
        },
        {
          question: "¿Cuál es tu plan de implementación y cronograma?",
          keywords: ["Fases del proyecto", "Hitoss importantes", "Dependencias", "Riesgos técnicos"],
          placeholder: "Describe las etapas principales y tiempos estimados...",
          field: "implementationPlan"
        }
      ],
      financial: [
        {
          question: "¿Cuáles son los costos principales de tu proyecto?",
          keywords: ["Inversión inicial", "Costos fijos", "Costos variables", "Gastos operativos"],
          placeholder: "Detalla los principales gastos que anticipas...",
          field: "costStructure"
        },
        {
          question: "¿Cómo generará ingresos tu proyecto y a qué precio?",
          keywords: ["Modelo de ingresos", "Estrategia de precios", "Volumen de ventas", "Márgenes"],
          placeholder: "Explica tu modelo de negocio y estructura de precios...",
          field: "revenueModel"
        }
      ],
      legal: [
        {
          question: "¿Qué permisos o regulaciones aplican a tu proyecto?",
          keywords: ["Licencias comerciales", "Permisos sanitarios", "Regulaciones sectoriales", "Certificaciones"],
          placeholder: "Lista los requisitos legales específicos de tu industria...",
          field: "legalRequirements"
        },
        {
          question: "¿Cómo protegerás tu propiedad intelectual?",
          keywords: ["Patentes", "Marcas registradas", "Derechos de autor", "Secretos comerciales"],
          placeholder: "Describe tu estrategia de protección intelectual...",
          field: "ipProtection"
        }
      ]
    };

    return (
      <div className="step-content">
        {/* ✅ Mostrar conceptos solo si hay que educar */}
        {currentStepInfo.concepts.length > 0 && (
          <ConceptExplainer concepts={currentStepInfo.concepts} />
        )}
        
        {/* ✅ Preguntas guiadas con palabras clave */}
        <GuidedQuestions questions={questions[currentStepInfo.component] || []} />
        
        {/* ✅ Resumen de ideas capturadas */}
        {Object.keys(userKnowledge).length > 0 && (
          <div className="knowledge-summary">
            <h4>💡 Ideas Capturadas:</h4>
            <div className="summary-cards">
              {Object.entries(userKnowledge).map(([key, value]) => (
                value && (
                  <div key={key} className="summary-card">
                    <strong>{key}:</strong> {value}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // ✅ Pasar el conocimiento capturado al completar
      onComplete({
        ...stepData,
        userKnowledge // Información cualitativa capturada
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ✅ Si es experto, redirigir directamente a formularios avanzados
  if (userProfile?.id === 'expert') {
    React.useEffect(() => {
      onBackToAdvanced();
    }, []);
    
    return (
      <div className="expert-redirect">
        <h2>🎓 Modo Experto Activado</h2>
        <p>Redirigiendo directamente a los formularios avanzados...</p>
      </div>
    );
  }

  return (
    <div className="step-by-step-wizard">
      {/* Header del wizard */}
      <div className="wizard-header">
        <button onClick={onBackToAdvanced} className="wizard-back-btn">
          ← Volver al modo avanzado
        </button>
        <h1>Guía de Factibilidad Paso a Paso</h1>
        <p>
          {detailLevel === 'detailed' 
            ? "Te guiaremos a través de cada concepto importante" 
            : "Resumen ejecutivo de los aspectos clave"}
        </p>
        <div className="detail-level-badge">
          Nivel de detalle: {detailLevel === 'detailed' ? 'Completo' : detailLevel === 'moderate' ? 'Moderado' : 'Mínimo'}
        </div>
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