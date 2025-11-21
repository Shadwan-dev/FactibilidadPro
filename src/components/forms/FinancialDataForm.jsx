// src/components/forms/FinancialDataForm.jsx - VERSIÓN CORREGIDA
import React, { useEffect, useState } from "react";
import { useFinancialForm } from "../../hooks/useFinancialForm";
import { useProject } from "../../context/ProjectContext";
import { useAuth } from "../../hooks/useAuth";
import { ModalManager } from "./modals/ModalManager";
import { FinancingSection } from "./sections/FinancingSection";
import { IncomeSection } from "./sections/IncomeSection";
import { CostsSection } from "./sections/CostsSection";
import { ExpensesSection } from "./sections/ExpensesSection";
import '../../styles/components/forms/financial-data-form.css';
import { financialTranslations as t } from '../../utils/translations';

export const FinancialDataForm = React.memo(({ onNext }) => {
  console.log('🔵🔵🔵 FINANCIAL DATA FORM - COMPONENTE RENDERIZADO 🔵🔵🔵');

  // ✅ OBTENER EL CONTEXTO COMPLETO
  const context = useProject();
  console.log('🔵 FINANCIAL DATA FORM - Contexto obtenido:', {
    todasLasKeys: Object.keys(context),
    tieneUpdateFormData: typeof context.updateFormData === 'function',
    contextoCompleto: context
  });

  // ✅ DESTRUCTURING DESPUÉS DEL DEBUG
  const { 
    formData: projectData,
    updateFormData,
    saving,
    error,
    proyectoActual
  } = context;

  const { currentUser } = useAuth();

  const financialData = projectData.financial || {};

  const {
    formData,
    activeModal,
    modalData,
    openModal,
    closeModal,
    updateFromModal,
    updateField,
    calculateTotal,
    resetFormData
  } = useFinancialForm(financialData);

  const [lastModalUpdate, setLastModalUpdate] = useState(null);
  const [localSaveStatus, setLocalSaveStatus] = useState('');

  // ✅ CORRECCIÓN CRÍTICA: Sincronizar cuando los datos de Firebase cambian
  useEffect(() => {
    if (financialData && Object.keys(financialData).length > 0) {
      console.log('🔄 FinancialDataForm - Sincronizando con datos de Firebase:', financialData);
      
      const hasSignificantChanges = Object.keys(financialData).some(key => {
        const contextValue = financialData[key];
        const hookValue = formData[key];
        
        if (Array.isArray(contextValue) && Array.isArray(hookValue)) {
          return JSON.stringify(contextValue) !== JSON.stringify(hookValue);
        }
        return contextValue !== hookValue;
      });

      if (hasSignificantChanges) {
        console.log('🔄 Se detectaron cambios, reseteando formulario...');
        resetFormData(financialData);
      }
    }
  }, [financialData, resetFormData, formData]);

  // ✅ FUNCIÓN CORREGIDA
  const handleUpdateFromModal = async (modalType, modalData) => {
    console.log(`📋 MODAL UPDATE - Tipo: ${modalType}`, modalData);

    // ✅ VERIFICACIÓN COMPLETA
    console.log('🔍 VERIFICANDO ANTES DE GUARDAR:', {
      proyectoActual,
      currentUser: currentUser?.uid,
      tieneProyecto: !!proyectoActual,
      tieneUsuario: !!currentUser,
      modalData
    });

    if (!proyectoActual || !currentUser) {
      const errorMsg = '❌ No se puede guardar - Falta proyecto o usuario';
      console.error(errorMsg, { proyectoActual, currentUser });
      alert(errorMsg);
      return false;
    }

    try {
      // 1. Actualizar estado local
      console.log('🔄 Actualizando estado local del hook...');
      updateFromModal(modalType, modalData);
      
      // 2. Preparar datos para Firebase
      const updatedFinancial = {
        ...financialData,
        [modalType]: modalData
      };
      
      console.log(`💾 PREPARANDO DATOS para ${modalType}:`, {
        projectId: proyectoActual,
        section: 'financial',
        data: updatedFinancial[modalType],
        datosCompletos: updatedFinancial
      });
      
      // 3. Guardar en Firebase
      console.log(`🚀 LLAMANDO A updateFormData...`);
      
      // ✅ VERIFICAR SI updateFormData ES UNA FUNCIÓN
      if (typeof updateFormData !== 'function') {
        console.error('❌❌❌ updateFormData NO ES UNA FUNCIÓN:', typeof updateFormData);
        alert('Error: updateFormData no es una función');
        return false;
      }

      console.log('🔍 ANTES DE LLAMAR updateFormData...');
      const success = await updateFormData('financial', updatedFinancial);
      console.log(`📩 RESPUESTA DE updateFormData:`, success);
      
      if (success) {
        console.log(`✅ ${modalType} guardado exitosamente en Firebase`);
        setLastModalUpdate({
          type: modalType,
          data: modalData,
          timestamp: new Date().toISOString()
        });
        return true;
      } else {
        console.error(`❌ updateFormData retornó FALSE para ${modalType}`);
        alert('Error: No se pudo guardar en la base de datos.');
        return false;
      }
      
    } catch (error) {
      console.error(`❌ ERROR CAPTURADO en handleUpdateFromModal (${modalType}):`, error);
      console.error('Stack trace:', error.stack);
      alert(`Error: ${error.message}`);
      return false;
    }
  };

  // ✅ ACTUALIZAR CAMPOS INDIVIDUALES CON GUARDADO EN FIREBASE
  const handleUpdateField = async (field, value) => {
    console.log(`📝 Actualizando campo ${field}:`, value);
    
    // 1. Actualizar estado local (para UI responsiva)
    updateField(field, value);
    
    // 2. Preparar datos actualizados
    const updatedFinancial = {
      ...financialData,
      [field]: value
    };
    
    // 3. Guardar en Firebase a través del contexto
    const success = await updateFormData('financial', updatedFinancial);
    
    if (success) {
      console.log(`✅ Campo ${field} guardado en Firebase`);
    } else {
      console.error(`❌ Error guardando campo ${field}`);
    }
  };

  // Verificar si hay datos suficientes para continuar
  const hasFinancialData = formData && (
    formData.capital?.length > 0 ||
    formData.bankCredit?.length > 0 ||
    formData.otherFinancing?.length > 0 ||
    formData.salesServices?.length > 0 ||
    formData.financialIncome?.length > 0 ||
    formData.otherIncome?.length > 0 ||
    formData.investment > 0 ||
    formData.projectedRevenue > 0
  );

  // ✅ FUNCIÓN SIMPLIFICADA PARA CONTINUAR (los datos ya se guardan automáticamente)
  const handleSaveAndContinue = async () => {
    if (!hasFinancialData) {
      alert('❌ Completa al menos un campo financiero antes de continuar');
      return;
    }
    
    // Mostrar estado de guardado
    setLocalSaveStatus('guardando');
    
    try {
      // Forzar un guardado final por si acaso
      const success = await updateFormData('financial', financialData);
      
      if (success) {
        setLocalSaveStatus('guardado');
        console.log('✅ Guardado final exitoso, navegando...');
        
        // Pequeña pausa para mostrar el estado "guardado"
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (onNext) {
          console.log('🚀 Navegando al análisis técnico...');
          onNext();
        }
      } else {
        setLocalSaveStatus('error');
        alert('Error al guardar los datos. Revisa la conexión.');
      }
      
    } catch (error) {
      console.error('❌ Error al continuar:', error);
      setLocalSaveStatus('error');
    } finally {
      setTimeout(() => setLocalSaveStatus(''), 3000);
    }
  };

  const getButtonText = () => {
    if (saving) return '💾 GUARDANDO...';
    
    switch (localSaveStatus) {
      case 'guardando': return '💾 GUARDANDO...';
      case 'guardado': return '✅ DATOS GUARDADOS!';
      case 'error': return '❌ ERROR AL GUARDAR';
      default: return '🚀 CONTINUAR AL ANÁLISIS TÉCNICO';
    }
  };

  return (
    <div className="financial-data-form-container">
      {/* ✅ INDICADOR MEJORADO */}
      <div className="financial-data-status">
        <div className={`financial-status-dot ${!saving ? 'loaded' : 'loading'}`}></div>
        <span className="financial-status-text">
          {saving ? '💾 Guardando...' : 
           currentUser ? '✅ Conectado' : '⚠️ Sin conexión'}
        </span>
        {!currentUser && (
          <span className="financial-warning-badge">⚠️ No autenticado</span>
        )}
        {error && (
          <span className="financial-error-badge">❌ Error: {error}</span>
        )}
        {lastModalUpdate && (
          <span className="financial-modal-update">🔄 {lastModalUpdate.type}</span>
        )}
      </div>
  
      <div className="financial-form-header">
        <h3 className="financial-form-title">📊 {t.completeFinancialForm}</h3>
        <div className="financial-years-selector">
          <label className="financial-years-label">{t.analysisPeriod}:</label>
          <select
            value={formData.analysisYears || 5}
            onChange={(e) => handleUpdateField("analysisYears", parseInt(e.target.value))}
            className="financial-year-select"
          >
            {[1, 2, 3, 4, 5, 7, 10, 15, 20].map((year) => (
              <option key={year} value={year}>
                {year} {t.years}
              </option>
            ))}
          </select>
        </div>
      </div>
  
      <div className="financial-form-sections">
        {/* ✅ SECCIONES PRINCIPALES */}
        <div className="financial-section-container">
          <FinancingSection
            data={formData}
            onOpenModal={openModal}
            calculateTotal={calculateTotal}
            onUpdateField={handleUpdateField}
          />
        </div>
  
        <div className="financial-section-container">     
          <IncomeSection
            data={formData}
            onOpenModal={openModal}
            calculateTotal={calculateTotal}
            onUpdateField={handleUpdateField}
          />
        </div>

        <div className="financial-section-container"> 
          <CostsSection
            data={formData}
            onOpenModal={openModal}
            calculateTotal={calculateTotal}
            onUpdateField={handleUpdateField}
          />
        </div>

        <div className="financial-section-container"> 
          <ExpensesSection
            data={formData}
            onOpenModal={openModal}
            calculateTotal={calculateTotal}
            onUpdateField={handleUpdateField}
          />
        </div>
      </div>

      {/* ✅ BOTÓN CTA MEJORADO */}
      {hasFinancialData && onNext && (
        <div className="financial-next-section-cta">
          <div className="cta-container">
            <div className="cta-content">
              <h3>🎯 ¡Excelente! Análisis Financiero Completado</h3>
              <p>
                {saving 
                  ? 'Guardando tus datos en la nube...' 
                  : 'Has completado la información financiera básica. Continúa con el análisis técnico.'
                }
              </p>
              
              <div className="cta-features">
                <div className="cta-feature">
                  <span className="feature-icon">🔧</span>
                  <span>Evaluación de localización y capacidad</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🏗️</span>
                  <span>Análisis de infraestructura y recursos</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">📅</span>
                  <span>Planificación de implementación</span>
                </div>
              </div>

              <button 
                className={`cta-button ${localSaveStatus || (saving ? 'guardando' : '')}`}
                onClick={handleSaveAndContinue}
                disabled={saving || localSaveStatus === 'guardando'}
              >
                <span className="button-icon">
                  {saving || localSaveStatus === 'guardando' ? '⏳' : 
                   localSaveStatus === 'guardado' ? '✅' : 
                   localSaveStatus === 'error' ? '❌' : '🚀'}
                </span>
                <span className="button-text">{getButtonText()}</span>
                {!saving && !localSaveStatus && (
                  <span className="button-arrow">→</span>
                )}
              </button>

              <div className="save-info">
                <div className="save-status">
                  {saving && (
                    <span className="saving-indicator">
                      ⏳ Guardando en Firebase...
                    </span>
                  )}
                  {localSaveStatus === 'guardando' && (
                    <span className="saving-indicator">
                      ⏳ Guardando final...
                    </span>
                  )}
                  {localSaveStatus === 'guardado' && (
                    <span className="saved-indicator">
                      ✅ Todo guardado exitosamente
                    </span>
                  )}
                  {localSaveStatus === 'error' && (
                    <span className="error-indicator">
                      ❌ Error al guardar. Intenta nuevamente.
                    </span>
                  )}
                </div>
                
                <div className="cta-note">
                  <small>
                    💡 <strong>Los datos se guardan automáticamente en la nube</strong> mientras completas el formulario
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL MANAGER */}
      <ModalManager
        activeModal={activeModal}
        modalData={modalData}
        onClose={closeModal}
        onSave={handleUpdateFromModal}
        calculateTotal={calculateTotal}
        analysisYears={formData.analysisYears}
      />
    </div>
  );
});         