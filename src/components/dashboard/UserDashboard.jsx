// UserDashboard.jsx - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { AnalysisDashboard } from '../analysis/AnalysisDashboard';
import { useFeasibilityCalculations } from '../../hooks/useFeasibilityCalculations';
import { useAssistant } from '../../hooks/useAssistant';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { StepByStepWizard } from '../step-by-step/StepByStepWizard';
import { ProjectOnboarding } from '../onboarding/ProjectOnboarding';
import { OptimizeButton } from '../actions/OptimizeButton'; 
import { OptimizationModal } from '../actions/OptimizationModal';
import { OptimizationService } from '../services/OptimizationService';
import { BusinessTypeModal } from '../onboarding/BusinessTypeModal';
import { FinancialDataForm } from '../forms/FinancialDataForm';
import { TechnicalDataForm } from '../forms/TechnicalDataForm';
import '../../styles/components/dashboard/user-dashboard.css';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';

function UserDashboard({ 
  formData: externalFormData,
  onChange, 
  currentProject: propCurrentProject,
  onExplicitSubmit 
}) {
  // ✅ HOOKS AL PRINCIPIO - ORDEN CORRECTO
  const { currentUser } = useAuth();
  const calculations = useFeasibilityCalculations(externalFormData);
  const { 
    currentProject: firebaseProject, 
    isSaving, 
    lastSave, 
    saveError,
    saveSection,
    createProject 
  } = useProjects(propCurrentProject?.id);
  const lastSavedDataRef = useRef(externalFormData);
  const saveTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Estados
  
  const [showOptimization, setShowOptimization] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [optimizedData, setOptimizedData] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(!propCurrentProject?.onboardingCompleted);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('forms');
  const [showBusinessTypeModal, setShowBusinessTypeModal] = useState(false);
  const [showFinancialFormDirectly, setShowFinancialFormDirectly] = useState(false);
  const [isStepByStepMode, setIsStepByStepMode] = useState(false);
  const [currentForm, setCurrentForm] = useState('financial');
  const [hasCompletedGuidedMode, setHasCompletedGuidedMode] = useState(
    propCurrentProject?.hasCompletedGuidedMode || false
  );

  // Debug esencial
  useEffect(() => {
    console.log('📊 Formulario actual:', currentForm);
    console.log('👤 Usuario actual:', currentUser);
  }, [currentForm, currentUser]);

  // ✅ HANDLER PRINCIPAL DE FORMULARIOS
  const handleFormChange = useCallback((formType, data) => {
    console.log('📝 Actualizando formulario:', formType, data);
    
    // Actualizar estado local inmediatamente
    onChange({
      ...externalFormData,
      [formType]: data
    });
  }, [externalFormData, onChange]);

  // ✅ EFFECT PARA CLEANUP
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // ✅ FUNCIÓN MEJORADA PARA COMPARAR DATOS
  const hasDataChanged = useCallback((oldData, newData) => {
    return JSON.stringify(oldData) !== JSON.stringify(newData);
  }, []);

  // ✅ HANDLERS DE NAVEGACIÓN CORREGIDOS
  const handleNextToTechnical = useCallback(async () => {
    console.log('➡️ Navegando a técnico, usuario:', currentUser);
    
    if (propCurrentProject?.id && currentUser && externalFormData.financial) {
      try {
        // Bloquear navegación mientras guarda
        const result = await saveSection(
          'financial', 
          externalFormData.financial, 
          currentUser.uid, 
          propCurrentProject.id,
          {
            description: 'Guardado final antes de análisis técnico',
            saveToHistory: true
          }
        );

        if (result?.success) {
          // Actualizar referencia y navegar
          lastSavedDataRef.current = externalFormData;
          setShowFinancialFormDirectly(false);
          setCurrentForm('technical');
        } else {
          alert('❌ Error al guardar. Revisa tu conexión.');
        }
      } catch (error) {
        console.error('Error en navegación:', error);
        alert('❌ Error al guardar los datos.');
      }
    } else {
      setShowFinancialFormDirectly(false);
      setCurrentForm('technical');
    }
  }, [propCurrentProject?.id, currentUser, externalFormData.financial, saveSection]);

  const handleBackToFinancial = useCallback(async () => {
    console.log('⬅️ Volviendo a financiero, usuario:', currentUser);
    
    if (propCurrentProject?.id && currentUser && externalFormData.technical) {
      try {
        await saveSection('technical', externalFormData.technical, currentUser.uid, {
          description: 'Guardado antes de volver a finanzas',
          saveToHistory: false
        });
      } catch (error) {
        console.error('Error guardando técnico:', error);
      }
    }
    setCurrentForm('financial');
  }, [propCurrentProject?.id, currentUser, externalFormData.technical, saveSection]);

  // ✅ HANDLERS DE OPTIMIZACIÓN
  const handleOptimize = useCallback(() => {
    if (!calculations) {
      console.warn('No hay cálculos disponibles para optimizar');
      return;
    }
    
    try {
      const { optimizedData: newData, recommendations: recs } = 
        OptimizationService.optimizeProject(externalFormData, calculations);
      
      setOptimizedData(newData);
      setRecommendations(recs);
      setShowOptimization(true);
    } catch (error) {
      console.error('Error en optimización:', error);
    }
  }, [calculations, externalFormData]);

  const applyOptimizations = useCallback(() => {
    if (optimizedData) {
      onChange(optimizedData);
      setShowOptimization(false);
      setOptimizedData(null);
      setRecommendations([]);
    }
  }, [optimizedData, onChange]);

  // ✅ HOOK DEL ASISTENTE
  const {
    suggestions: assistantSuggestions,
    showAssistant,
    toggleAssistant,
    dismissSuggestion,
    hasSuggestions
  } = useAssistant(externalFormData, calculations);

  // ✅ HANDLERS DE ONBOARDING
  const handleProfileSelect = useCallback((profile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    
    if (profile.id === 'first-time') {
      setIsStepByStepMode(true);
    }
  }, []);

  const handleSkipOnboarding = useCallback(() => {
    setShowOnboarding(false);
    setUserProfile({ id: 'skipped', title: 'Usuario Avanzado' });
  }, []);

  const handleBusinessTypeSelect = useCallback((typeId) => {
    if (typeId === 'enterprise') {
      setShowFinancialFormDirectly(true);
      setIsStepByStepMode(false);
      setHasCompletedGuidedMode(true);
    } else if (typeId === 'small-business') {
      setIsStepByStepMode(true);
      setHasCompletedGuidedMode(true);
    }
  }, []);

  // ✅ HANDLERS DE MODO GUIADO
  const handleCompleteGuidedMode = useCallback(() => {
    setHasCompletedGuidedMode(true);
    setIsStepByStepMode(false);
  }, []);

  const handleStartGuidedMode = useCallback(() => {
    setIsStepByStepMode(true);
    setHasCompletedGuidedMode(true);
  }, []);

  // ✅ HANDLER PARA CREAR PROYECTO
  const handleCreateProject = useCallback(async (projectData) => {
    if (!propCurrentProject?.id && currentUser) {
      try {
        const newProjectId = await createProject(projectData, currentUser.uid);
        if (newProjectId) {
          console.log('🎉 Nuevo proyecto creado:', newProjectId);
        }
      } catch (error) {
        console.error('Error creando proyecto:', error);
      }
    }
  }, [propCurrentProject?.id, currentUser, createProject]);

  // ✅ EFFECTS
  useEffect(() => {
    if (firebaseProject && firebaseProject.sections) {
      console.log('🔄 Sincronizando datos de Firestore:', firebaseProject.sections);
      
      const firebaseData = {
        financial: firebaseProject.sections.financial || {},
        technical: firebaseProject.sections.technical || {},
        market: firebaseProject.sections.market || {}
      };
      
      if (JSON.stringify(firebaseData) !== JSON.stringify(externalFormData)) {
        onChange(firebaseData);
      }
    }
  }, [firebaseProject, externalFormData, onChange]);

  // ✅ EFFECT DE GUARDADO AUTOMÁTICO CORREGIDO
  useEffect(() => {
    if (!propCurrentProject?.id || !currentUser || isSaving) return;
    if (!hasDataChanged(lastSavedDataRef.current, externalFormData)) {
      return; // No guardar si no hay cambios reales
    }

    // Limpiar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Nuevo timeout con debounce más largo
    saveTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      try {
        let updatedSection = null;
        let sectionData = null;

        // Determinar qué sección cambiar
        if (externalFormData.financial && hasDataChanged(lastSavedDataRef.current.financial, externalFormData.financial)) {
          updatedSection = 'financial';
          sectionData = externalFormData.financial;
        } else if (externalFormData.technical && hasDataChanged(lastSavedDataRef.current.technical, externalFormData.technical)) {
          updatedSection = 'technical';
          sectionData = externalFormData.technical;
        } else if (externalFormData.market && hasDataChanged(lastSavedDataRef.current.market, externalFormData.market)) {
          updatedSection = 'market';
          sectionData = externalFormData.market;
        }

        if (updatedSection && sectionData) {
          console.log(`🔄 Guardando automáticamente: ${updatedSection}`);
          const result = await saveSection(
            updatedSection, 
            sectionData, 
            currentUser.uid, 
            propCurrentProject.id,
            {
              description: `Guardado automático de ${updatedSection}`,
              saveToHistory: false
            }
          );

          if (result?.success) {
            // Actualizar referencia solo si el guardado fue exitoso
            lastSavedDataRef.current = {
              ...lastSavedDataRef.current,
              [updatedSection]: sectionData
            };
            console.log(`✅ Guardado automático exitoso: ${updatedSection}`);
          }
        }
      } catch (error) {
        console.error('❌ Error en guardado automático:', error);
      }
    }, 5000); // ✅ Aumentar debounce a 5 segundos

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [externalFormData, propCurrentProject?.id, currentUser, isSaving, saveSection, hasDataChanged]);

   // ✅ ACTUALIZAR LA REFERENCIA CUANDO CAMBIA EL PROYECTO
   useEffect(() => {
    lastSavedDataRef.current = externalFormData;
  }, [propCurrentProject?.id]); // Solo cuando cambia el proyecto

  // ✅ ESTADO DEL BOTÓN DE NOTIFICACIÓN
  const getButtonState = useCallback(() => {
    if (propCurrentProject?.status === 'analyzed') {
      return {
        disabled: true,
        text: '✅ Proyecto Analizado',
        className: 'btn-success'
      };
    }
    
    if (propCurrentProject?.notificationSent || propCurrentProject?.status === 'pending') {
      return {
        disabled: true,
        text: '⏳ Notificación Enviada',
        className: 'btn-secondary'
      };
    }
    
    return {
      disabled: false,
      text: '📤 Notificar al Administrador',
      className: 'btn-success'
    };
  }, [propCurrentProject]);

  const buttonState = getButtonState();

  // ✅ RENDERIZADO DE CONTENIDO DE FORMULARIOS
  const renderFormsContent = useCallback(() => {
    if (showFinancialFormDirectly) {
      return (
        <FinancialDataForm
          data={externalFormData.financial || {}}
          onChange={(data) => handleFormChange('financial', data)}
          onNext={handleNextToTechnical}
        />
      );
    }
  
    if (isStepByStepMode) {
      return (
        <StepByStepWizard
          formData={externalFormData}
          onChange={onChange}
          onComplete={handleCompleteGuidedMode}
          onBackToAdvanced={() => setIsStepByStepMode(false)}
        />
      );
    }
  
    if (currentForm === 'financial') {
      return (
        <FinancialDataForm 
          data={externalFormData.financial || {}}
          onChange={(data) => handleFormChange('financial', data)}
          onNext={handleNextToTechnical}
        />
      );
    } else {
      return (
        <TechnicalDataForm 
          data={externalFormData.technical || {}}
          onChange={(data) => handleFormChange('technical', data)}
          onBack={handleBackToFinancial}
          onNavigateToFinancial={handleBackToFinancial}
        />
      );
    }
  }, [
    showFinancialFormDirectly, 
    isStepByStepMode, 
    currentForm, 
    externalFormData, 
    handleFormChange, 
    handleNextToTechnical, 
    onChange, 
    handleCompleteGuidedMode,
    handleBackToFinancial
  ]);

  // ✅ RENDERIZADO DE SECCIONES ADICIONALES
  const renderAdditionalSections = useCallback(() => {
    if (currentForm !== 'financial' || showFinancialFormDirectly || isStepByStepMode) {
      return null;
    }

    return (
      <>
        {/* Mensaje de bienvenida */}
        <div className="completion-message success">
          <h4>🎉 ¡Excelente! Completaste la guía inicial</h4>
          <p>
            Ahora puedes usar los formularios avanzados para ajustar los
            detalles específicos de tu proyecto.
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="form-progress">
          <div className={`progress-step ${currentForm === 'financial' ? 'active' : 'completed'}`}>
            <span className="step-number">1</span>
            <span className="step-label">Análisis Financiero</span>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${currentForm === 'technical' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Análisis Técnico</span>
          </div>
        </div>

        {/* Sección de optimización */}
        <div className="user-submission-info">
          <h3>✅ Información Guardada Automáticamente</h3>
          <p>
            Tu información se guarda automáticamente mientras completas los formularios.
          </p>

          {propCurrentProject?.status === "pending" && (
            <div className="notification-status pending">
              <p>
                <strong>⏳ Estado:</strong> Esperando análisis del administrador
              </p>
              <p>
                <small>Recibirás los resultados por email en 48 horas.</small>
              </p>
            </div>
          )}

          {propCurrentProject?.status === "analyzed" && calculations && (
            <div className="notification-status analyzed">
              <OptimizeButton
                onOptimize={handleOptimize}
                calculations={calculations}
                formData={externalFormData}
              />

              <OptimizationModal
                isOpen={showOptimization}
                onClose={() => setShowOptimization(false)}
                recommendations={recommendations}
                onApply={applyOptimizations}
              />

              <p>
                <strong>✅ Estado:</strong> Proyecto analizado
              </p>
              <p>
                <small>Ya puedes ver los resultados y gráficos completos.</small>
              </p>

              {calculations.overall && (
                <div className="viability-badge">
                  <strong>
                    {calculations.overall.viable
                      ? "✅ PROYECTO VIABLE"
                      : "❌ PROYECTO NO VIABLE"}
                  </strong>
                  <br />
                  <small>Puntuación general: {calculations.overall.score.toFixed(1)}%</small>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección de envío */}
        <div className="submit-section">
          <div className="submit-info">
            <h3>📤 Notificar al Administrador</h3>
            <p>
              {buttonState.disabled
                ? "Ya notificaste al administrador sobre este proyecto."
                : "Cuando termines de completar los formularios, notifica al administrador para que revise tu proyecto."}
            </p>

            <button
              onClick={onExplicitSubmit}
              disabled={buttonState.disabled}
              className={`btn btn-large ${buttonState.className}`}
            >
              {buttonState.text}
            </button>

            {!buttonState.disabled && (
              <div className="notification-warning">
                <small>
                  ⚠️ <strong>Solo puedes enviar una notificación por proyecto.</strong>
                  <br />
                  Asegúrate de haber completado toda la información antes de notificar.
                </small>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }, [
    currentForm, 
    showFinancialFormDirectly, 
    isStepByStepMode, 
    propCurrentProject, 
    calculations, 
    handleOptimize, 
    externalFormData, 
    showOptimization, 
    recommendations, 
    applyOptimizations, 
    buttonState, 
    onExplicitSubmit
  ]);

  // ✅ RENDERIZADO CONDICIONAL

  // Si es la primera vez, mostrar onboarding
  if (showOnboarding) {
    return (
      <ProjectOnboarding 
        onProfileSelect={handleProfileSelect}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  // Si NO ha completado el modo guiado, mostrar selección obligatoria
  if (!hasCompletedGuidedMode && !isStepByStepMode && !showFinancialFormDirectly) {
    return (
      <div className="guided-mode-required">
        <div className="guided-mode-container">
          <div className="guided-mode-header">
            <h1>🎯 Bienvenido al Análisis de Factibilidad</h1>
            <p>Te guiaremos paso a paso para evaluar la viabilidad de tu proyecto</p>
          </div>

          <div className="guided-mode-content">
            <div className="guided-features">
              <h3>📋 Lo que incluye nuestro modo guiado:</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">💰</div>
                  <h4>Análisis Financiero Completo</h4>
                  <p>Evaluación de inversión, ingresos, costos y proyecciones</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔧</div>
                  <h4>Análisis Técnico Detallado</h4>
                  <p>Evaluación de localización, capacidad, tecnología y recursos</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h4>Análisis de Mercado</h4>
                  <p>Estudio de competencia, demanda y potencial de crecimiento</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚖️</div>
                  <h4>Análisis Legal</h4>
                  <p>Revisión de permisos, regulaciones y requisitos legales</p>
                </div>
              </div>
            </div>

            <div className="guided-benefits">
              <h3>🎓 Beneficios del Modo Guiado:</h3>
              <ul className="benefits-list">
                <li>✅ <strong>Explicaciones claras</strong> de cada concepto</li>
                <li>✅ <strong>Ejemplos prácticos</strong> para entender mejor</li>
                <li>✅ <strong>Recomendaciones personalizadas</strong> según tu proyecto</li>
                <li>✅ <strong>Evita errores comunes</strong> en la evaluación</li>
                <li>✅ <strong>Resultados más precisos</strong> y confiables</li>
                <li>✅ <strong>Ahorro de tiempo</strong> en la planificación</li>
              </ul>
            </div>

            <div className="guided-cta">
              <h3>🚀 ¿Listo para comenzar?</h3>
              <p>Elige cómo prefieres trabajar:</p>
              
              <div className="cta-buttons">
                <button
                  onClick={() => setShowBusinessTypeModal(true)}
                  className="btn btn-guided btn-large"
                >
                  🎓 Empezar con Modo Guiado (Recomendado)
                </button>
                
                <div className="alternative-option">
                  <p>¿Eres un usuario avanzado?</p>
                  <button
                    onClick={handleStartGuidedMode}
                    className="btn btn-secondary btn-sm"
                  >
                    Saltar directamente a formularios
                  </button>
                  <small className="warning-text">
                    ⚠️ Te recomendamos el modo guiado para mejores resultados
                  </small>
                </div>
              </div>
            </div>
          </div>

          <BusinessTypeModal
            isOpen={showBusinessTypeModal}
            onClose={() => setShowBusinessTypeModal(false)}
            onBusinessTypeSelect={handleBusinessTypeSelect}
          />
        </div>
      </div>
    );
  }

  // ✅ RENDERIZADO PRINCIPAL
  return (
    <div className="user-dashboard">
      {/* BARRA DE ESTADO DE FIRESTORE */}
      <div className="firestore-status-bar">
        <div className="status-content">
          <div className="save-status">
            {isSaving ? (
              <span className="saving">⏳ Guardando en Firestore...</span>
            ) : lastSave ? (
              <span className="saved">✅ Guardado: {lastSave.toLocaleTimeString()}</span>
            ) : (
              <span className="ready">📝 Los cambios se guardan automáticamente</span>
            )}
          </div>
          
          {saveError && (
            <div className="error-alert">
              ⚠️ Error: {saveError}
              <button onClick={() => window.location.reload()} className="retry-btn">
                Reintentar
              </button>
            </div>
          )}

          {firebaseProject && (
            <div className="project-info">
              <small>Proyecto: {firebaseProject.id}</small>
              {firebaseProject.updatedAt && (
                <small>Última actualización: {firebaseProject.updatedAt.toDate().toLocaleString()}</small>
              )}
            </div>
          )}
        </div>
      </div>

      {hasCompletedGuidedMode && (
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "forms" ? "active" : ""}`}
            onClick={() => setActiveTab("forms")}
          >
            📝 Formularios
          </button>
          <button
            className={`tab-button ${activeTab === "analysis" ? "active" : ""}`}
            onClick={() => setActiveTab("analysis")}
            disabled={!calculations || Object.keys(calculations).length === 0}
          >
            📊 Análisis y Gráficos
          </button>
        </div>
      )}

      {/* AssistantPanel */}
      <AssistantPanel
        suggestions={assistantSuggestions}
        showAssistant={showAssistant}
        onToggle={toggleAssistant}
        onDismiss={dismissSuggestion}
      />

      {/* Contenido según pestaña activa */}
      {activeTab === "forms" || !hasCompletedGuidedMode ? (
        <div className="forms-tab">
          {/* Header informativo */}
          {userProfile && hasCompletedGuidedMode && (
            <div className="user-profile-header">
              <h2>¡Hola, {userProfile.title}! 👋</h2>
              <p>
                {userProfile.id === "first-time" && "Has completado la guía inicial. Ahora puedes revisar y ajustar los detalles."}
                {userProfile.id === "existing-business" && "Perfecto! Ahora puedes revisar y ajustar los análisis específicos"}
                {userProfile.id === "technical-founder" && "Guía completada. Enfócate en los aspectos técnicos de tu proyecto"}
                {userProfile.id === "expert" && "Accede a todas las herramientas avanzadas de análisis"}
                {userProfile.id === "skipped" && "Usa los formularios avanzados para un análisis detallado"}
              </p>
            </div>
          )}

          {/* Contenido de formularios */}
          {renderFormsContent()}
          
          {/* Secciones adicionales */}
          {renderAdditionalSections()}
        </div>
      ) : (
        <div className="analysis-tab">
          <AnalysisDashboard
            calculations={calculations}
            formData={externalFormData}
            onOptimize={handleOptimize}
            showOptimization={showOptimization}
            recommendations={recommendations}
            onCloseOptimization={() => setShowOptimization(false)}
            onApplyOptimizations={applyOptimizations}
          />
        </div>
      )}
    </div>
  );
}

export { UserDashboard };