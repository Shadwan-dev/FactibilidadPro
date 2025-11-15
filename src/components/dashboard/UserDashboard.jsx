// src/components/dashboard/UserDashboard.jsx
import React, { useState } from 'react';
import { TechnicalFormSelector } from '../forms/TechnicalFormSelector';
import { MarketFormSelector } from '../forms/MarketFormSelector';
import { LegalFormSelector } from '../forms/LegalFormSelector';
import { FinancialFormSelector } from '../forms/FinancialFormSelector';
import { useFeasibilityCalculations } from '../../hooks/useFeasibilityCalculations';
import { useAssistant } from '../../hooks/useAssistant';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { StepByStepWizard } from '../step-by-step/StepByStepWizard';
import { ProjectOnboarding } from '../onboarding/ProjectOnboarding';

function UserDashboard({ 
  formData, 
  onChange, 
  currentProject,
  onExplicitSubmit 
}) {
  const calculations = useFeasibilityCalculations(formData);
  
  // Estados para modos detallados
  const [isFinancialDetailedMode, setIsFinancialDetailedMode] = useState(false);
  const [isTechnicalDetailedMode, setIsTechnicalDetailedMode] = useState(false);
  const [isMarketDetailedMode, setIsMarketDetailedMode] = useState(false);
  const [isLegalDetailedMode, setIsLegalDetailedMode] = useState(false);
  
  // ✅ Estados para el flujo integrado
  const [showOnboarding, setShowOnboarding] = useState(!currentProject?.onboardingCompleted);
  const [userProfile, setUserProfile] = useState(null);
  const [isStepByStepMode, setIsStepByStepMode] = useState(
    userProfile?.selectedMode === 'guided' // ✅ Usar el modo seleccionado en el onboarding
  );

  // Hook del asistente
  const {
    suggestions,
    showAssistant,
    toggleAssistant,
    dismissSuggestion,
    hasSuggestions
  } = useAssistant(formData, calculations);

  // ✅ Manejar selección de perfil en el onboarding
  const handleProfileSelect = (profile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    
    // Auto-activar modo paso a paso para emprendedores nuevos
    if (profile.id === 'first-time') {
      setIsStepByStepMode(true);
    }
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    setUserProfile({ id: 'skipped', title: 'Usuario Avanzado' });
  };

  // ✅ Si es la primera vez, mostrar onboarding
  if (showOnboarding) {
    return (
      <ProjectOnboarding 
        onProfileSelect={handleProfileSelect}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  const getButtonState = () => {
    if (currentProject?.status === 'analyzed') {
      return {
        disabled: true,
        text: '✅ Proyecto Analizado',
        className: 'btn-success'
      };
    }
    
    if (currentProject?.notificationSent || currentProject?.status === 'pending') {
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
  };

  const buttonState = getButtonState();

  return (
    <div className="user-dashboard">
      {/* ✅ AssistantPanel siempre visible */}
      <AssistantPanel
        suggestions={suggestions}
        showAssistant={showAssistant}
        onToggle={toggleAssistant}
        onDismiss={dismissSuggestion}
      />

      {/* ✅ Header informativo basado en el perfil */}
      {userProfile && (
        <div className="user-profile-header" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2>¡Hola, {userProfile.title}! 👋</h2>
          <p>
            {userProfile.id === 'first-time' && 'Te guiaremos paso a paso en tu primer análisis de factibilidad'}
            {userProfile.id === 'existing-business' && 'Perfecto! Analicemos la expansión de tu negocio existente'}
            {userProfile.id === 'technical-founder' && 'Enfoquémonos en los aspectos técnicos de tu proyecto'}
            {userProfile.id === 'expert' && 'Accede a todas las herramientas avanzadas de análisis'}
            {userProfile.id === 'skipped' && 'Usa los formularios avanzados para un análisis detallado'}
          </p>
        </div>
      )}

      {/* ✅ Selector de modo (solo mostrar si no está en paso a paso) */}
      {!isStepByStepMode && (
        <div className="mode-selector" style={{
          textAlign: 'center', 
          marginBottom: '2rem',
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '2px solid #e1e5e9'
        }}>
          <h3>🎯 ¿Cómo prefieres trabajar?</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button 
              onClick={() => setIsStepByStepMode(true)}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🎓 Modo Guiado (Paso a Paso)
            </button>
            
            <button 
              onClick={() => setIsStepByStepMode(false)}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #2196f3 0%, #0d47a1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ⚡ Modo Avanzado (Formularios)
            </button>
          </div>
          <p style={{ marginTop: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>
            {userProfile?.id === 'first-time' 
              ? 'Recomendado: Modo Guiado - Te acompañaremos en cada paso'
              : 'Elige el modo que mejor se adapte a tu experiencia'
            }
          </p>
        </div>
      )}

      {/* ✅ Contenido principal según el modo seleccionado */}
      {isStepByStepMode ? (
        <StepByStepWizard
          formData={formData}
          onChange={onChange}
          onComplete={(data) => {
            // Cuando termina el wizard, mostrar opción para ver análisis avanzado
            setIsStepByStepMode(false);
            onChange(data);
          }}
          onBackToAdvanced={() => setIsStepByStepMode(false)}
        />
      ) : (
        <div className="forms-explained">
          {/* ✅ Mensaje especial para usuarios que completaron el paso a paso */}
          {userProfile?.id === 'first-time' && (
            <div style={{
              background: '#e8f5e8',
              border: '1px solid #c8e6c9',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h4>🎉 ¡Excelente! Completaste la guía inicial</h4>
              <p>Ahora puedes usar los formularios avanzados para ajustar los detalles específicos de tu proyecto.</p>
            </div>
          )}

          <div className="form-section-explained">
            <div className="form-header">
              <h2>💰 Análisis Financiero</h2>
              <div className="form-description">
                <p>
                  <strong>¿Qué evaluamos?</strong> Rentabilidad, flujo de caja y
                  viabilidad económica.
                </p>
                <p>
                  <strong>¿Cómo se calcula?</strong> Usamos VAN (Valor Actual
                  Neto), TIR (Tasa Interna de Retorno) y período de recuperación.
                </p>
              </div>
            </div>
            <FinancialFormSelector
              data={formData.financial}
              onChange={onChange}
              calculations={calculations}
              onDetailedModeChange={setIsFinancialDetailedMode}
            />
          </div>

          <div className="form-section-explained">
            <div className="form-header">
              <h2>⚙️ Análisis Técnico</h2>
              <div className="form-description">
                <p>
                  <strong>¿Qué evaluamos?</strong> Capacidad operativa, recursos
                  técnicos y viabilidad de implementación.
                </p>
                <p>
                  <strong>¿Cómo se calcula?</strong> Analizamos capacidad vs
                  demanda, complejidad técnica y tiempos de implementación.
                </p>
              </div>
            </div>
            <TechnicalFormSelector
              data={formData.technical}
              onChange={onChange}
              calculations={calculations}
              onDetailedModeChange={setIsTechnicalDetailedMode}
            />
          </div>

          <div className="form-section-explained">
            <div className="form-header">
              <h2>📈 Análisis de Mercado</h2>
              <div className="form-description">
                <p>
                  <strong>¿Qué evaluamos?</strong> Potencial de mercado,
                  competencia y aceptación del producto/servicio.
                </p>
                <p>
                  <strong>¿Cómo se calcula?</strong> Usamos análisis FODA,
                  participación de mercado y proyecciones de crecimiento.
                </p>
              </div>
            </div>
            <MarketFormSelector
              data={formData.market}
              onChange={onChange}
              calculations={calculations}
              onDetailedModeChange={setIsMarketDetailedMode}
            />
          </div>

          <div className="form-section-explained">
            <div className="form-header">
              <h2>⚖️ Análisis Legal</h2>
              <div className="form-description">
                <p>
                  <strong>¿Qué evaluamos?</strong> Cumplimiento normativo,
                  permisos requeridos y riesgos legales.
                </p>
                <p>
                  <strong>¿Cómo se calcula?</strong> Evaluamos requisitos legales,
                  tiempos de tramitación y riesgos regulatorios.
                </p>
              </div>
            </div>
            <LegalFormSelector
              data={formData.legal}
              onChange={onChange}
              calculations={calculations}
              onDetailedModeChange={setIsLegalDetailedMode}
            />
          </div>

          <div className="user-submission-info">
            <h3>✅ Información Guardada Automáticamente</h3>
            <p>
              Tu información se guarda automáticamente mientras completas los
              formularios.
            </p>

            {currentProject?.status === "pending" && (
              <div className="notification-status pending">
                <p>
                  <strong>⏳ Estado:</strong> Esperando análisis del administrador
                </p>
                <p>
                  <small>Recibirás los resultados por email en 48 horas.</small>
                </p>
              </div>
            )}

            {currentProject?.status === "analyzed" && (
              <div className="notification-status analyzed">
                <p>
                  <strong>✅ Estado:</strong> Proyecto analizado
                </p>
                <p>
                  <small>
                    Ya puedes ver los resultados y gráficos completos.
                  </small>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Sección de envío (siempre visible) */}
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
            <p className="notification-warning">
              <small>
                ⚠️{" "}
                <strong>
                  Solo puedes enviar una notificación por proyecto.
                </strong>
                <br />
                Asegúrate de haber completado toda la información antes de
                notificar.
              </small>
            </p>
          )}

          {currentProject?.status === "pending" && (
            <p className="waiting-message">
              <strong>
                Soporte revisará tu proyecto y te contactará pronto.
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { UserDashboard };