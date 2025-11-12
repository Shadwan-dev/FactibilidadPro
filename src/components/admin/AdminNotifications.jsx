// src/components/admin/AdminNotifications.jsx (VERSIÓN COMPLETA CORREGIDA)
import React, { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';

export function AdminNotifications({ isAdmin, currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [analyzingProject, setAnalyzingProject] = useState(null);
  const { getAdminNotifications, analyzeProject, projects } = useProjects();

  useEffect(() => {
    if (!isAdmin) return;

    const loadNotifications = async () => {
      try {
        const adminNotifications = await getAdminNotifications();
        setNotifications(adminNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
    
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAdmin, getAdminNotifications]);

  const handleAnalyzeProject = async (notification) => {
    if (!currentUser?.uid) {
      console.error('Usuario no autenticado');
      return;
    }

    setAnalyzingProject(notification.projectId);
    
    try {
      const success = await analyzeProject(
        notification.projectId, 
        currentUser.uid, 
        notification.id
      );
      
      if (success) {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        console.log(`✅ Proyecto ${notification.projectName} analizado`);
      }
    } catch (error) {
      console.error('Error analizando proyecto:', error);
    } finally {
      setAnalyzingProject(null);
    }
  };

  // ✅ FUNCIÓN SEGURA para obtener estado del proyecto
  const getProjectStatus = (projectId) => {
    if (!projects || !Array.isArray(projects)) return 'unknown';
    const project = projects.find(p => p.id === projectId);
    return project?.status || 'unknown';
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-notifications">
      <div className="notifications-header">
        <h3>📋 Proyectos Pendientes de Análisis</h3>
        <span className="badge">{notifications.length}</span>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <p>No hay proyectos pendientes de análisis 🎉</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const projectStatus = getProjectStatus(notification.projectId);
            const isAnalyzed = projectStatus === 'analyzed';
            const isAnalyzing = analyzingProject === notification.projectId;
            
            return (
              <div 
                key={notification.id} 
                className={`notification-item ${isAnalyzed ? 'analyzed' : ''}`}
              >
                <div className="project-info">
                  <h4>{notification.projectName}</h4>
                  <p>
                    <strong>Usuario:</strong> {notification.userName || notification.userEmail}
                  </p>
                  <p>
                    <strong>Inversión:</strong> ${notification.formData?.financialSummary?.investment?.toLocaleString() || 0}
                  </p>
                  <p>
                    <strong>Ingresos proyectados:</strong> ${notification.formData?.financialSummary?.revenue?.toLocaleString() || 0}
                  </p>
                  <p>
                    <strong>Puntuación:</strong> {notification.calculations?.overallScore || 'N/A'}
                  </p>
                  
                  {/* ✅ ESTADO SEGURO */}
                  <div className="project-status">
                    {isAnalyzed ? '✅ Analizado' : '⏳ Pendiente de análisis'}
                  </div>
                </div>
                
                <div className="notification-actions">
                  <button
                    onClick={() => handleAnalyzeProject(notification)}
                    disabled={isAnalyzing || isAnalyzed}
                    className={`btn btn-sm ${isAnalyzed ? 'btn-success' : 'btn-primary'}`}
                  >
                    {isAnalyzing ? (
                      <>⏳ Analizando...</>
                    ) : isAnalyzed ? (
                      <>✅ Analizado</>
                    ) : (
                      <>📊 Analizar Proyecto</>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      console.log('Ver proyecto:', notification.projectId);
                    }}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    👀 Ver Detalles
                  </button>

                  {isAnalyzed && (
                    <div className="analyzed-message">
                      ✅ Proyecto analizado
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}