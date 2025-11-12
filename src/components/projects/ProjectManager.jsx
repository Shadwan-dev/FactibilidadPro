// src/components/projects/ProjectManager.jsx
import React, { useState } from 'react';

export function ProjectManager({ projects, currentProject, onCreateProject, onSelectProject, user }) {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setShowProjectForm(false);
    }
  };

  return (
    <div className="project-manager">
      <div className="project-selector">
        <select 
          value={currentProject?.id || ''}
          onChange={(e) => {
            const project = projects.find(p => p.id === e.target.value);
            if (project) onSelectProject(project);
          }}
          className="project-dropdown"
        >
          <option value="">Seleccionar proyecto...</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        
        <button 
          onClick={() => setShowProjectForm(true)}
          className="btn btn-secondary"
        >
          ➕ Nuevo
        </button>
      </div>

      {showProjectForm && (
        <div className="project-form-overlay">
          <div className="project-form">
            <h4>Crear Nuevo Proyecto</h4>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Nombre del proyecto"
                className="form-input"
                autoFocus
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Crear Proyecto
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowProjectForm(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}