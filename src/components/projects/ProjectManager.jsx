// src/components/projects/ProjectManager.jsx - VERSIÓN FINAL
import React, { useState, useCallback, useMemo } from 'react';
import '../../styles/components/projects/project-manager.css';

export function ProjectManager({ 
  projects, 
  currentProject, 
  onCreateProject, 
  onSelectProject, 
  user,
  loading = false 
}) {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // ✅ Manejo optimizado de creación de proyecto
  const handleCreateProject = useCallback((e) => {
    e.preventDefault();
    const trimmedName = newProjectName.trim();
    
    if (trimmedName && trimmedName.length >= 3) {
      onCreateProject(trimmedName);
      setNewProjectName('');
      setShowProjectForm(false);
    }
  }, [newProjectName, onCreateProject]);

  // ✅ Manejo optimizado de selección de proyecto
  const handleProjectSelect = useCallback((e) => {
    const projectId = e.target.value;
    
    if (projectId === 'new') {
      setShowProjectForm(true);
      return;
    }
    
    if (!projectId) return;
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
      onSelectProject(project);
    }
  }, [projects, onSelectProject]);

  // ✅ Abrir modal de creación
  const handleOpenCreateModal = useCallback(() => {
    setShowProjectForm(true);
  }, []);

  // ✅ Proyectos memoizados para performance
  const projectOptions = useMemo(() => 
    projects.map(project => (
      <option key={project.id} value={project.id}>
        {project.name} {project.status === 'analyzed' && ' ✅'}
      </option>
    )), [projects]
  );

  // ✅ Cerrar modal con ESC
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowProjectForm(false);
    }
  }, []);

  // ✅ Reset form al cerrar
  const handleCloseForm = useCallback(() => {
    setShowProjectForm(false);
    setNewProjectName('');
  }, []);

  if (loading) {
    return (
      <div className="project-manager-loading">
        <div className="loading-spinner-small"></div>
        <span>Cargando proyectos...</span>
      </div>
    );
  }

  return (
    <div className="project-manager">
      <div className="project-selector-wrapper">
        <div className="selector-header">
          <h3 className="selector-title">📁 Gestor de Proyectos</h3>
          <span className="projects-count">
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
          </span>
        </div>
        
        {/* ✅ Selector de proyectos existentes */}
        <div className="project-selector">
          <select 
            value={currentProject?.id || ''}
            onChange={handleProjectSelect}
            className="project-dropdown"
            aria-label="Seleccionar proyecto"
          >
            <option value="">
              {projects.length === 0 ? 'No hay proyectos' : 'Selecciona un proyecto...'}
            </option>
            {projectOptions}
          </select>
        </div>

        {/* ✅ BOTÓN PRINCIPAL DE CREACIÓN - ÚNICO Y ESTILADO */}
        <div className="create-project-section">
          <button 
            onClick={handleOpenCreateModal}
            className="btn-create-project-main"
            aria-label="Crear nuevo proyecto"
          >
            <span className="btn-icon">🚀</span>
            <span className="btn-text">Crear Nuevo Proyecto</span>
            <span className="btn-subtext">Iniciar análisis de factibilidad</span>
          </button>
        </div>

        {/* ✅ Información del proyecto actual */}
        {currentProject && (
          <div className="current-project-info">
            <div className="project-meta">
              <span className="project-name">{currentProject.name}</span>
              <span className={`project-status status-${currentProject.status || 'draft'}`}>
                {currentProject.status === 'analyzed' && '✅ Analizado'}
                {currentProject.status === 'pending' && '⏳ En revisión'}
                {currentProject.status === 'draft' && '📝 Borrador'}
              </span>
            </div>
            {currentProject.createdAt && (
              <span className="project-date">
                Creado: {new Date(currentProject.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ✅ Modal de creación */}
      {showProjectForm && (
        <div className="project-form-overlay" onClick={handleCloseForm}>
          <div className="project-form" onClick={(e) => e.stopPropagation()}>
            <h4>🎯 Crear Nuevo Proyecto</h4>
            
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="project-name" className="form-label">
                  Nombre del Proyecto
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Ej: Mi Startup Tecnológica"
                  className="form-input"
                  autoFocus
                  required
                  minLength={3}
                />
                <small className="form-hint">
                  Mínimo 3 caracteres
                </small>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  disabled={!newProjectName.trim() || newProjectName.trim().length < 3}
                >
                  🚀 Crear Proyecto
                </button>
                
                <button 
                  type="button" 
                  onClick={handleCloseForm}
                  className="btn btn--secondary"
                >
                  ↩️ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}