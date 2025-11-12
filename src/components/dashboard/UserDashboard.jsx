// src/components/dashboard/UserDashboard.jsx (ACTUALIZADO)
import React, { useState } from 'react';
import { TechnicalFormSelector } from '../forms/TechnicalFormSelector';
import { MarketFormSelector } from '../forms/MarketFormSelector'; // ✅ NUEVO IMPORT
import { LegalFormSelector }  from '../forms/LegalFormSelector' 
import { FinancialFormSelector } from '../forms/FinancialFormSelector';
import { useFeasibilityCalculations } from '../../hooks/useFeasibilityCalculations';

export function UserDashboard({ 
  formData, 
  onChange, 
  currentProject,
  onExplicitSubmit 
}) {

  const calculations = useFeasibilityCalculations(formData);
  
  const [isFinancialDetailedMode, setIsFinancialDetailedMode] = useState(false);
  const [isTechnicalDetailedMode, setIsTechnicalDetailedMode] = useState(false);
  const [isMarketDetailedMode, setIsMarketDetailedMode] = useState(false); // ✅ NUEVO ESTADO
  const [isLegalDetailedMode, setIsLegalDetailedMode] = useState(false);
  
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
      <div className="forms-explained">
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
          {/* ✅ REEMPLAZAR MarketDataForm por MarketFormSelector */}
          <MarketFormSelector
            data={formData.market}
            onChange={onChange}
            calculations={calculations}
            onDetailedModeChange={setIsMarketDetailedMode} // ✅ Nueva prop
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
            onDetailedModeChange={setIsLegalDetailedMode} // Nuevo estado que debes agregar
          />
        </div>

        {/* MENSAJE FINAL MEJORADO */}
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