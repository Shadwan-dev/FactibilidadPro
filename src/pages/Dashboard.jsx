// src/pages/Dashboard.jsx (VERSIÓN COMPLETA ACTUALIZADA)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FinancialDataForm } from '../components/forms/FinancialDataForm';
import { TechnicalDataForm } from '../components/forms/TechnicalDataForm';
import { MarketDataForm } from '../components/forms/MarketDataForm';
import { LegalDataForm } from '../components/forms/LegalDataForm';
import { FinancialResults } from '../components/results/FinancialResults';
import { TechnicalResults } from '../components/results/TechnicalResults';
import { MarketResults } from '../components/results/MarketResults';
import { LegalResults } from '../components/results/LegalResults';
import { OverallResults } from '../components/results/OverallResults';
import { Header } from '../components/layout/Header';
import { ProjectManager } from '../components/projects/ProjectManager';
import { useFeasibilityCalculations } from '../hooks/useFeasibilityCalculations';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { AdminNotifications } from '../components/admin/AdminNotifications';
import { useProjects } from '../hooks/useProjects';
import { Charts } from '../components/results/Charts';
import { ProjectDetails } from '../utils/ProjectDetails';
import { ValidationPanel } from '../utils/ValidationPanel';
import '../styles/App.css';

// Estado inicial organizado
const initialFormData = {
  financial: {
    investment: 0,
    operationalCosts: 0,
    projectedRevenue: 0,
    discountRate: 0.1,
    period: 5
  },
  technical: {
    teamCapacity: 0,
    infrastructure: 0,
    technologyAvailable: false,
    implementationTime: 0,
    complexity: 0,
    requiredStaff: 0
  },
  market: {
    marketSize: 0,
    marketGrowth: 0,
    marketShare: 0,
    competitors: 0,
    averagePrice: 0,
    seasonality: 0
  },
  legal: {
    permits: false,
    regulatoryCompliance: false,
    legalRisks: 0,
    intellectualProperty: false,
    processingTime: 0
  }
};

// Componente de Formularios para mejor performance
const FormSections = React.memo(({ formData, onChange, calculations }) => (
  <div className="forms-container">
    <FinancialDataForm 
      data={formData.financial} 
      onChange={onChange} 
      calculations={calculations} 
    />
    <TechnicalDataForm 
      data={formData.technical} 
      onChange={onChange} 
      calculations={calculations} 
    />
    <MarketDataForm 
      data={formData.market} 
      onChange={onChange} 
      calculations={calculations} 
    />
    <LegalDataForm 
      data={formData.legal} 
      onChange={onChange} 
      calculations={calculations} 
    />
  </div>
));

// Componente de Resultados para mejor performance
const ResultSections = React.memo(({ calculations, formData }) => (
  <div className="results-container">
    <Charts calculations={calculations} formData={formData} />
    <OverallResults calculations={calculations} />
    <FinancialResults calculations={calculations} />
    <TechnicalResults calculations={calculations} />
    <MarketResults calculations={calculations} />
    <LegalResults calculations={calculations} />
  </div>
));

// Componente para mostrar cuando se espera análisis
const WaitingForAnalysis = ({ projectName }) => (
  <div className="results-column">
    <div className="results-section">
      <div className="waiting-for-analysis">
        <div className="analysis-icon">⏳</div>
        <h3>Esperando Análisis del Administrador</h3>
        <p>Tu proyecto "<strong>{projectName}</strong>" está en revisión.</p>
        <p>Recibirás una notificación cuando el análisis esté completo.</p>
        <div className="analysis-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Estado: Pendiente de revisión</p>
        </div>
        <div className="analysis-info">
          <p><small>El administrador revisará tu proyecto y te notificará cuando esté listo.</small></p>
        </div>
      </div>
    </div>
  </div>
);

export function Dashboard({ user, onLogout }) {
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const isAdmin = user?.role === 'master' || user?.uid?.includes('master-');

  const [isFinancialDetailedMode, setIsFinancialDetailedMode] = useState(false);

  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Referencias para el auto-guardado optimizado
  const saveTimeoutRef = useRef(null);
  const previousFormDataRef = useRef(initialFormData);

  const { projects, createProject, saveFeasibilityData, updateProject, loading: projectsLoading, analyzeProject, sendExplicitNotification } = useProjects(user?.uid);
  const calculations = useFeasibilityCalculations(formData);

  // Función para sanear datos del proyecto
  const sanitizeProjectData = useCallback((project) => {
    if (!project) return null;
    
    // Asegurar que formData tenga la estructura correcta
    const safeFormData = {
      financial: project.formData?.financial || initialFormData.financial,
      technical: project.formData?.technical || initialFormData.technical,
      market: project.formData?.market || initialFormData.market,
      legal: project.formData?.legal || initialFormData.legal
    };
    
    return {
      ...project,
      formData: safeFormData
    };
  }, []);

  // Cargar proyecto cuando se selecciona uno
  useEffect(() => {
    if (currentProject) {
      const sanitizedProject = sanitizeProjectData(currentProject);
      if (sanitizedProject && sanitizedProject.formData) {
        setFormData(sanitizedProject.formData);
        previousFormDataRef.current = sanitizedProject.formData;
      }
    } else {
      setFormData(initialFormData);
      previousFormDataRef.current = initialFormData;
    }
  }, [currentProject, sanitizeProjectData]);

  // Función optimizada para comparar cambios
  const hasFormDataChanged = useCallback((oldData, newData) => {
    return JSON.stringify(oldData) !== JSON.stringify(newData);
  }, []);
  // ✅ NUEVO ESTADO: Para rastrear si estamos en modo detallado
  const [isDetailedMode, setIsDetailedMode] = useState({
    financial: false,
    technical: false,
    market: false,
    legal: false
  });
  // ✅ FUNCIÓN DE GUARDADO CORREGIDA - PASA EL USER ID
  const debouncedSave = useCallback((projectId, formData, calculations) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      // Verificar si realmente hay cambios antes de guardar
      if (!hasFormDataChanged(previousFormDataRef.current, formData)) {
        return; // No guardar si no hay cambios reales
      }

      setIsSaving(true);
      setSaveStatus('guardando...');
      
      try {
        // ✅ Pasar el userId actual como parámetro adicional
        const success = await saveFeasibilityData(
          projectId, 
          formData, 
          calculations, 
          user?.uid // 👈 Esto es importante para las notificaciones
        );
        
        if (success) {
          setSaveStatus('guardado');
          previousFormDataRef.current = formData;
          setTimeout(() => setSaveStatus(''), 1000);
        } else {
          setSaveStatus('error al guardar');
        }
      } catch (error) {
        console.error('Error guardando:', error);
        setSaveStatus('error al guardar');
      } finally {
        setIsSaving(false);
      }
    }, 2000);
  }, [saveFeasibilityData, hasFormDataChanged, user?.uid]);

  useEffect(() => {
    // ✅ NO guardar si estamos en modo detallado financiero
    if (currentProject && user && Object.keys(formData.financial).length > 0 && !isFinancialDetailedMode) {
      debouncedSave(currentProject.id, formData, calculations);
    }
  
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, currentProject, user, calculations, debouncedSave, isFinancialDetailedMode]);

  const handleFormChange = useCallback((section, data, isDetailed = false) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
    
    // ✅ ACTUALIZAR el estado del modo
    if (isDetailed) {
      setIsDetailedMode(prev => ({
        ...prev,
        [section]: true
      }));
    }
  }, []);

  const handleCreateProject = async (projectName) => {
    if (!user?.uid) {
      console.error('Usuario no autenticado');
      return;
    }
  
    try {
      const projectId = await createProject({
        name: projectName,
        description: 'Nuevo proyecto de factibilidad'
      }, user.uid);
  
      if (projectId) {
        const newProject = {
          id: projectId,
          name: projectName,
          userId: user.uid,
          formData: initialFormData,
          calculations: {},
          status: 'draft', // ✅ CAMBIAR de 'pending' a 'draft' (estado inicial)
          notificationSent: false, // ✅ Añadir esta propiedad
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setCurrentProject(newProject);
        previousFormDataRef.current = initialFormData;
        setShowValidationPanel(true);
      }
    } catch (error) {
      console.error('Error creando proyecto:', error);
    }
  };

  const handleSelectProject = useCallback((project) => {
    const sanitizedProject = sanitizeProjectData(project);
    setCurrentProject(sanitizedProject);
    
    // Mostrar paneles de validación si es admin
    if (isAdmin) {
      setShowValidationPanel(true);
      setShowProjectDetails(true);
    }
  }, [sanitizeProjectData, isAdmin]);

  const handleProjectUpdate = async (projectId, updates) => {
    try {
      return await updateProject(projectId, updates);
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      return false;
    }
  };

  // ✅ FUNCIÓN PARA ENVÍO EXPLÍCITO (usuarios normales)
  const handleExplicitSubmit = async () => {
    if (!currentProject) return;
    
    // Verificar si ya se envió notificación
    if (currentProject.notificationSent) {
      setSaveStatus('⚠️ Ya notificaste al administrador');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    if (currentProject.status === 'pending') {
      setSaveStatus('⏳ Ya hay una notificación pendiente');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveStatus('enviando notificación...');
    
    try {
      // Usar la nueva función de envío único
      const result = await sendExplicitNotification(
        currentProject.id, 
        formData, 
        calculations, 
        user?.uid
      );
      
      if (result === 'success') {
        setSaveStatus('✅ Notificación enviada');
        
        // Actualizar estado local del proyecto
        setCurrentProject(prev => ({
          ...prev,
          status: 'pending',
          notificationSent: true
        }));
      } else if (result === 'already_sent') {
        setSaveStatus('⚠️ Ya notificaste al administrador');
      } else {
        setSaveStatus('❌ Error al enviar');
      }
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error enviando notificación:', error);
      setSaveStatus('❌ Error al enviar');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };


  // Si no hay usuario, mostrar error
  if (!user) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error de Autenticación</h2>
          <p>No se pudo cargar la información del usuario.</p>
          <button onClick={onLogout} className="btn btn-primary">
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header username={user.displayName || user.email} onLogout={onLogout} />
      <div className="dashboard-container">
        {/* Header Personalizado del Dashboard */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              ¡Hola,{" "}
              <span className="user-name">
                {user.displayName || user.email}
              </span>
              ! 👋
              {isAdmin && <span className="master-badge">👑 MASTER</span>}
            </h1>
            <p className="dashboard-subtitle">
              {isAdmin
                ? "Tienes acceso completo a todos los proyectos"
                : "Completa los formularios para analizar tu proyecto"}
              {currentProject && saveStatus && (
                <span
                  className={`save-status ${
                    saveStatus.includes("error") ? "error" : ""
                  }`}
                >
                  • {saveStatus}
                </span>
              )}
            </p>
          </div>

          <ProjectManager
            projects={projects}
            currentProject={currentProject}
            onCreateProject={handleCreateProject}
            onSelectProject={handleSelectProject}
            onUpdateProject={handleProjectUpdate}
            user={user}
            loading={projectsLoading}
          />
        </div>

        {/* ✅ NOTIFICACIONES DE ADMIN - ARRIBA DE TODO */}
        {isAdmin && (
          <AdminNotifications isAdmin={isAdmin} currentUser={user} />
        )}

        {projectsLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando proyectos...</p>
          </div>
        ) : currentProject ? (
          <div className="main-layout">
            {/* Columna Izquierda: Formularios - SIEMPRE VISIBLE */}
            <div className="forms-column">
              <div className="forms-section">
                <div className="section-header">
                  <h3>
                    {isAdmin
                      ? "📊 Datos del Proyecto"
                      : "📝 Completa tu Información"}
                  </h3>
                  {isSaving && (
                    <span className="saving-indicator">💾 {saveStatus}</span>
                  )}

                  {/* BOTONES DE ACCIÓN */}
                  <div
                    className="action-buttons"
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    {isAdmin && (
                      <>
                        <button
                          onClick={() =>
                            setShowProjectDetails(!showProjectDetails)
                          }
                          className="btn btn-info btn-sm"
                        >
                          {showProjectDetails ? "👁️ Ocultar" : "📊 Ver"}{" "}
                          Detalles
                        </button>

                        <button
                          onClick={() =>
                            setShowValidationPanel(!showValidationPanel)
                          }
                          className="btn btn-warning btn-sm"
                        >
                          {showValidationPanel ? "❌ Ocultar" : "✅ Mostrar"}{" "}
                          Validación
                        </button>

                        <button
                          onClick={() => {
                            setShowValidationPanel(true);
                            setShowProjectDetails(true);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          👑 Vista Master
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isAdmin ? (
                  <FormSections
                    formData={formData}
                    onChange={handleFormChange}
                    calculations={calculations}
                  />
                ) : (
                  <UserDashboard
                    formData={formData}
                    onChange={handleFormChange}
                    currentProject={currentProject}
                    onExplicitSubmit={handleExplicitSubmit}
                  />
                )}
              </div>
            </div>

            {/* Columna Derecha: Resultados - CONDICIONAL */}
            {/* ✅ MOSTRAR GRÁFICOS SOLO SI ES ADMIN O PROYECTO ANALIZADO */}
            {(isAdmin || currentProject?.status === 'analyzed') ? (
              <div className="results-column">
                <div className="results-section">
                  <div className="section-header">
                    <h3>📊 Resultados y Análisis</h3>
                    {currentProject?.status === 'analyzed' && !isAdmin && (
                      <span className="analysis-badge">✅ Analizado</span>
                    )}
                    <span className="last-updated">
                      {currentProject.updatedAt &&
                        `Actualizado: ${new Date(
                          currentProject.updatedAt
                        ).toLocaleString()}`}
                    </span>
                  </div>

                  {/* MOSTRAR PROJECT DETAILS SI ESTÁ ACTIVO */}
                  {showProjectDetails && isAdmin && (
                    <div
                      style={{
                        marginBottom: "2rem",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <h4>📋 Detalles del Proyecto</h4>
                        <button
                          onClick={() => setShowProjectDetails(false)}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          ✕
                        </button>
                      </div>
                      <ProjectDetails
                        project={{
                          ...currentProject,
                          calculations: calculations,
                          financial: formData.financial,
                          technical: formData.technical,
                          market: formData.market,
                          legal: formData.legal,
                        }}
                      />
                    </div>
                  )}

                  {/* MOSTRAR VALIDATION PANEL SI ESTÁ ACTIVO */}
                  {showValidationPanel && isAdmin && (
                    <div style={{ marginBottom: "2rem" }}>
                      <ValidationPanel
                        project={{
                          ...currentProject,
                          calculations: calculations,
                          financial: formData.financial,
                          technical: formData.technical,
                          market: formData.market,
                          legal: formData.legal,
                          name: currentProject.name,
                          creationDate: currentProject.createdAt,
                        }}
                        suggestions={calculations?.suggestions || []}
                        isMasterUser={isAdmin}
                      />
                    </div>
                  )}

                  {/* COMPONENTES DE RESULTADOS */}
                  <ResultSections
                    calculations={calculations}
                    formData={formData}
                  />
                </div>
              </div>
            ) : (
              // ✅ MOSTRAR MENSAJE DE ESPERA PARA USUARIOS NORMALES
              <WaitingForAnalysis projectName={currentProject.name} />
            )}
          </div>
        ) : (
          <div className="no-project-selected">
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>Bienvenido al Gestor de Proyectos</h3>
              <p>
                {isAdmin
                  ? "Selecciona un proyecto existente o crea uno nuevo para comenzar el análisis."
                  : "Crea un nuevo proyecto para comenzar tu análisis de factibilidad."}
              </p>

              {projects.length > 0 ? (
                <div className="project-actions">
                  <p>Tienes {projects.length} proyecto(s) guardado(s)</p>
                  <button
                    onClick={() =>
                      handleCreateProject("Mi Proyecto de Factibilidad")
                    }
                    className="btn btn-primary btn-large"
                  >
                    ➕ Crear Nuevo Proyecto
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleCreateProject("Mi Primer Proyecto")}
                  className="btn btn-primary btn-large"
                >
                  🚀 Crear Mi Primer Proyecto
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* COMPONENTE OCULTO PARA PDF */}
      {currentProject && isAdmin && (
        <div style={{ display: "none" }}>
          <ProjectDetails
            project={{
              ...currentProject,
              calculations: calculations,
              financial: formData.financial,
              technical: formData.technical,
              market: formData.market,
              legal: formData.legal,
              name: currentProject.name,
              creationDate: currentProject.createdAt,
            }}
          />
        </div>
      )}
    </div>
  );
}