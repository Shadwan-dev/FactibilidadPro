// src/pages/Dashboard.jsx (VERSIÓN CORREGIDA)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FinancialDataForm } from '../components/forms/FinancialDataForm';
import { TechnicalDataForm } from '../components/forms/TechnicalDataForm';
import { MarketDataForm } from '../components/forms/MarketDataForm';
import { LegalDataForm } from '../components/forms/LegalDataForm';
import { Header } from '../components/layout/Header';
import { ProjectManager } from '../components/projects/ProjectManager';
import { useFeasibilityCalculations } from '../hooks/useFeasibilityCalculations';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { AdminNotifications } from '../components/admin/AdminNotifications';
import { useProjects } from '../hooks/useProjects';
import { Charts } from '../components/results/Charts';
import { ProjectDetails } from '../utils/ProjectDetails';
import { ValidationPanel } from '../utils/ValidationPanel';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/Dashboard.css';

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

// Componente para mostrar cuando se espera análisis
const WaitingForAnalysis = ({ projectName }) => (
  <div className="waiting-container">
    <div className="waiting-card">
      <div className="waiting-icon">⏳</div>
      <h3 className="waiting-title">Esperando Análisis del Administrador</h3>
      <p className="waiting-description">
        Tu proyecto "<strong>{projectName}</strong>" está en revisión.
      </p>
      <p className="waiting-info">
        Recibirás una notificación cuando el análisis esté completo.
      </p>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p className="progress-status">Estado: Pendiente de revisión</p>
      </div>
      <div className="waiting-note">
        <p><small>El administrador revisará tu proyecto y te notificará cuando esté listo.</small></p>
      </div>
    </div>
  </div>
);

// Componente de Estado de Guardado
const SaveStatus = ({ isSaving, saveStatus }) => {
  if (!saveStatus && !isSaving) return null;
  
  return (
    <div className={`save-status ${saveStatus.includes('error') ? 'save-status--error' : ''}`}>
      {isSaving ? '💾 Guardando...' : saveStatus}
    </div>
  );
};

// Componente de Botones de Acción para Admin
const AdminActionButtons = ({ 
  showProjectDetails, 
  showValidationPanel, 
  onToggleDetails, 
  onToggleValidation, 
  onShowMasterView 
}) => (
  <div className="action-buttons">
    <button
      onClick={onToggleDetails}
      className="btn btn--secondary btn--sm"
    >
      {showProjectDetails ? "👁️ Ocultar" : "📊 Ver"} Detalles
    </button>

    <button
      onClick={onToggleValidation}
      className="btn btn--secondary btn--sm"
    >
      {showValidationPanel ? "❌ Ocultar" : "✅ Mostrar"} Validación
    </button>

    <button
      onClick={onShowMasterView}
      className="btn btn--primary btn--sm"
    >
      👑 Vista Master
    </button>
  </div>
);

// ✅ CORREGIDO: Función handleFormChange movida a la posición correcta
export function Dashboard({ onLogout }) {
  const { currentUser, logout, isAdmin: authIsAdmin } = useAuth();
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const isAdmin = authIsAdmin || currentUser?.role === 'master' || currentUser?.uid?.includes('master-');
  const [isFinancialDetailedMode, setIsFinancialDetailedMode] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Referencias para el auto-guardado optimizado
  const saveTimeoutRef = useRef(null);
  const previousFormDataRef = useRef(initialFormData);

  const { projects, createProject, saveFeasibilityData, updateProject, loading: projectsLoading, sendExplicitNotification } = useProjects(currentUser?.uid);
  const calculations = useFeasibilityCalculations(formData);

  // ✅ CORREGIDO: handleFormChange declarada una sola vez en el lugar correcto
  const handleFormChange = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  // Función para sanear datos del proyecto
  const sanitizeProjectData = useCallback((project) => {
    if (!project) return null;
    
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

  // Función de guardado optimizada
  const debouncedSave = useCallback((projectId, formData, calculations) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (!hasFormDataChanged(previousFormDataRef.current, formData)) {
        return;
      }

      setIsSaving(true);
      setSaveStatus('guardando...');
      
      try {
        const success = await saveFeasibilityData(
          projectId, 
          formData, 
          calculations, 
          currentUser?.uid
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
  }, [saveFeasibilityData, hasFormDataChanged, currentUser?.uid]);

  // Effect para guardado automático
  useEffect(() => {
    if (currentProject && currentUser && Object.keys(formData.financial).length > 0 && !isFinancialDetailedMode) {
      debouncedSave(currentProject.id, formData, calculations);
    }
  
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, currentProject, currentUser, calculations, debouncedSave, isFinancialDetailedMode]);

  const handleCreateProject = async (projectName) => {
    if (!currentUser?.uid) {
      console.error('Usuario no autenticado');
      return;
    }
  
    try {
      const projectId = await createProject({
        name: projectName,
        description: 'Nuevo proyecto de factibilidad'
      }, currentUser.uid);
  
      if (projectId) {
        const newProject = {
          id: projectId,
          name: projectName,
          userId: currentUser.uid,
          formData: initialFormData,
          calculations: {},
          status: 'draft',
          notificationSent: false,
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

  // Función para envío explícito
  const handleExplicitSubmit = async () => {
    if (!currentProject) return;
    
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
      const result = await sendExplicitNotification(
        currentProject.id, 
        formData, 
        calculations, 
        currentUser?.uid
      );
      
      if (result === 'success') {
        setSaveStatus('✅ Notificación enviada');
        
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

  // Verificar autenticación
  if (!currentUser) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error de Autenticación</h2>
          <p>No se pudo cargar la información del usuario.</p>
          <button onClick={logout} className="btn btn--primary">
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header username={currentUser.displayName || currentUser.email} onLogout={logout} />

      <div className="dashboard-container">
        {/* Header compacto */}
        <div className="dashboard-header compact">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              ¡Hola,{" "}
              <span className="user-name">
                {currentUser.displayName || currentUser.email}
              </span>
              ! 👋
              {isAdmin && <span className="master-badge">👑 MASTER</span>}
            </h1>
            <p className="dashboard-subtitle">
              {isAdmin
                ? "Tienes acceso completo a todos los proyectos y análisis del sistema"
                : "Gestiona tus proyectos y completa los formularios para analizar su factibilidad"}
            </p>
            <SaveStatus isSaving={isSaving} saveStatus={saveStatus} />
          </div>
        </div>

        {/* Sección de Project Manager */}
        <div className="project-manager-section">
          <ProjectManager
            projects={projects}
            currentProject={currentProject}
            onCreateProject={handleCreateProject}
            onSelectProject={handleSelectProject}
            onUpdateProject={handleProjectUpdate}
            user={currentUser}
            loading={projectsLoading}
          />
        </div>

        {/* Notificaciones de Admin */}
        {isAdmin && <AdminNotifications isAdmin={isAdmin} currentUser={currentUser} />}

        {projectsLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando proyectos...</p>
          </div>
        ) : currentProject ? (
          <div className="main-layout">
            {/* Mostrar formularios SOLO si el proyecto NO está analizado */}
            {(isAdmin || currentProject?.status !== "analyzed") && (
              <div className="forms-column">
                <div className="forms-section">
                  <div className="section-header">
                    <h3 className="section-title">
                      {isAdmin
                        ? "📊 Datos del Proyecto"
                        : "📝 Completa tu Información"}
                    </h3>

                    {/* Botones de acción para admin */}
                    {isAdmin && (
                      <AdminActionButtons
                        showProjectDetails={showProjectDetails}
                        showValidationPanel={showValidationPanel}
                        onToggleDetails={() =>
                          setShowProjectDetails(!showProjectDetails)
                        }
                        onToggleValidation={() =>
                          setShowValidationPanel(!showValidationPanel)
                        }
                        onShowMasterView={() => {
                          setShowValidationPanel(true);
                          setShowProjectDetails(true);
                        }}
                      />
                    )}
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
            )}

            {/* ANÁLISIS: Solo si el proyecto ESTÁ analizado O es admin */}
            {(isAdmin || currentProject?.status === "analyzed") && (
              <div className={`results-column ${currentProject?.status === "analyzed" ? 'full-width' : ''}`}>
                <div className="results-section">
                  <div className="section-header">
                    <h3 className="section-title">
                      {currentProject?.status === "analyzed" 
                        ? "📊 Resultados del Análisis" 
                        : "📊 Vista Previa (Admin)"
                      }
                    </h3>
                    {currentProject?.status === "analyzed" && (
                      <span className="status-badge status-badge--success">
                        ✅ Analizado
                      </span>
                    )}
                    {isAdmin && currentProject?.status !== "analyzed" && (
                      <span className="status-badge status-badge--pending">
                        👁️ Vista Admin
                      </span>
                    )}
                  </div>

                  {/* Mensaje informativo cuando el proyecto está analizado */}
                  {currentProject?.status === "analyzed" && !isAdmin && (
                    <div className="analysis-complete-message">
                      <div className="completion-icon">🎉</div>
                      <h4>¡Análisis Completado!</h4>
                      <p>
                        Tu proyecto <strong>"{currentProject.name}"</strong> ha sido analizado. 
                        Aquí tienes los resultados y recomendaciones.
                      </p>
                    </div>
                  )}

                  {/* Mensaje para admin cuando el proyecto no está analizado */}
                  {isAdmin && currentProject?.status !== "analyzed" && (
                    <div className="admin-preview-message">
                      <div className="preview-icon">👑</div>
                      <h4>Vista de Administrador</h4>
                      <p>
                        Estás viendo una vista previa del proyecto. 
                        Los resultados se mostrarán al usuario cuando cambies el estado a "Analizado".
                      </p>
                    </div>
                  )}

                  {/* Project Details para Admin */}
                  {showProjectDetails && isAdmin && (
                    <div className="details-panel">
                      <div className="panel-header">
                        <h4 className="panel-title">
                          📋 Detalles del Proyecto
                        </h4>
                        <button
                          onClick={() => setShowProjectDetails(false)}
                          className="btn btn--sm btn--secondary"
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

                  {/* Validation Panel para Admin */}
                  {showValidationPanel && isAdmin && (
                    <div className="validation-panel">
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

                  {/* Gráficos y Resultados */}
                  <div className="results-content">
                    <Charts calculations={calculations} formData={formData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">🎯</div>
              <h3 className="empty-title">Bienvenido al Gestor de Proyectos</h3>
              <p className="empty-description">
                {isAdmin
                  ? "Selecciona un proyecto existente o crea uno nuevo para comenzar el análisis."
                  : "Crea un nuevo proyecto para comenzar tu análisis de factibilidad."}
              </p>              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}