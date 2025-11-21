// src/hooks/useProjects.js - VERSIÓN CORREGIDA
import { useFirestore } from './useFirestore';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export const useProjects = (userId = null) => {
  const { documents, error, loading, addDocument, updateDocument, deleteDocument } = useFirestore('projects');

  const userProjects = userId 
    ? documents.filter(project => {
        if (userId.includes('master-')) {
          return true;
        }
        return project.userId === userId;
      })
    : documents;

  // Crear nuevo proyecto
  const createProject = async (projectData, userId) => {
    if (!userId) {
      console.error('UserId es requerido para crear proyecto');
      return null;
    }

    const project = {
      ...projectData,
      userId: userId,
      name: projectData.name || 'Nuevo Proyecto',
      description: projectData.description || '',
      status: 'draft',
      notificationSent: false,
      formData: {},
      calculations: {},
      isMasterProject: userId.includes('master-'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    return await addDocument(project);
  };

  // ✅ FUNCIÓN CORREGIDA: saveSection con mejor búsqueda
  const saveSection = async (section, sectionData, userId, projectId = null, options = {}) => {
    try {
      console.log('💾 Guardando sección:', section, 'para usuario:', userId, 'proyecto:', projectId);
      
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      let targetProject;

      // Si se proporciona projectId, usar ese proyecto
      if (projectId) {
        targetProject = documents.find(p => p.id === projectId);
      } else {
        // Si no, buscar el proyecto más reciente del usuario
        targetProject = userProjects
          .filter(p => p.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      }

      if (!targetProject) {
        console.error('❌ No se encontró proyecto para el usuario:', userId);
        console.log('📋 Proyectos disponibles:', userProjects.map(p => ({ id: p.id, userId: p.userId })));
        return { success: false, error: 'Proyecto no encontrado. Crea un proyecto primero.' };
      }

      console.log('🎯 Proyecto encontrado:', targetProject.id, targetProject.name);

      // Actualizar la sección específica en formData
      const updateData = {
        [`formData.${section}`]: sectionData,
        updatedAt: serverTimestamp(),
        lastUpdatedSection: section
      };

      // Si options.saveToHistory es true, guardar en historial
      if (options.saveToHistory) {
        updateData.lastSavedAt = serverTimestamp();
        updateData.lastSaveDescription = options.description || `Guardado de ${section}`;
      }

      const success = await updateDocument(targetProject.id, updateData);
      
      if (success) {
        console.log(`✅ Sección ${section} guardada correctamente en proyecto:`, targetProject.id);
        return { success: true, projectId: targetProject.id };
      } else {
        return { success: false, error: 'Error al guardar en Firestore' };
      }
    } catch (error) {
      console.error(`❌ Error guardando sección ${section}:`, error);
      return { success: false, error: error.message };
    }
  };
  
  // ✅ FUNCIÓN MEJORADA: Verificar si ya existe notificación para este proyecto
  const checkExistingNotification = async (projectId) => {
    try {
      const q = query(
        collection(db, 'adminNotifications'),
        where('projectId', '==', projectId),
        where('status', '==', 'unread')
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error verificando notificación:', error);
      return false;
    }
  };

  // ✅ FUNCIÓN MEJORADA: Guardar datos y enviar notificación UNA SOLA VEZ
  const saveFeasibilityData = async (projectId, formData, calculations, currentUserId) => {
    try {
      // 1. Verificar si ya se envió notificación para este proyecto
      const hasExistingNotification = await checkExistingNotification(projectId);
      
      // 2. Actualizar proyecto
      const updateData = {
        formData: formData,
        calculations: calculations,
        updatedAt: serverTimestamp(),
      };

      // Solo cambiar estado si es la primera vez
      if (!hasExistingNotification) {
        updateData.status = 'pending';
        updateData.notificationSent = false;
      }

      await updateDoc(doc(db, 'projects', projectId), updateData);

      // 3. Crear notificación SOLO si no existe una previa
      if (!hasExistingNotification) {
        await createAdminNotification(projectId, formData, calculations, currentUserId);
        
        // 4. Marcar en el proyecto que ya se envió notificación
        await updateDoc(doc(db, 'projects', projectId), {
          notificationSent: true,
          notificationSentAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error guardando datos:', error);
      return false;
    }
  };

  // ✅ FUNCIÓN PARA ENVÍO EXPLÍCITO (UNA SOLA VEZ)
  const sendExplicitNotification = async (projectId, formData, calculations, currentUserId) => {
    try {
      // 1. Verificar si ya se envió notificación
      const hasExistingNotification = await checkExistingNotification(projectId);
      
      if (hasExistingNotification) {
        console.log('⚠️ Ya existe una notificación pendiente para este proyecto');
        return 'already_sent';
      }

      // 2. Crear notificación
      await createAdminNotification(projectId, formData, calculations, currentUserId);
      
      // 3. Actualizar estado del proyecto
      await updateDoc(doc(db, 'projects', projectId), {
        status: 'pending',
        notificationSent: true,
        notificationSentAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Notificación enviada al administrador');
      return 'success';
      
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return 'error';
    }
  };

  const markAdminNotificationAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'adminNotifications', notificationId), {
        status: 'read',
        readAt: serverTimestamp()
      });
      console.log('✅ Notificación marcada como leída');
      return true;
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      return false;
    }
  };

  const createAdminNotification = async (projectId, formData, calculations, currentUserId) => {
    try {
      const project = documents.find(p => p.id === projectId);
      if (!project) return;

      const notificationData = {
        type: 'project_submitted',
        projectId: projectId,
        projectName: project.name,
        userId: currentUserId,
        userEmail: project.userEmail || 'usuario@email.com',
        userName: project.userName || 'Usuario',
        formData: {
          financialSummary: {
            investment: formData.financial?.investment || 0,
            revenue: formData.financial?.projectedRevenue || 0
          }
        },
        calculations: {
          overallScore: calculations.overallScore || 0,
          viability: calculations.viability || 'pending',
        },
        status: 'unread',
        createdAt: serverTimestamp(),
        priority: 'high'
      };

      await addDoc(collection(db, 'adminNotifications'), notificationData);
      console.log('✅ Notificación creada para administrador');
      
    } catch (error) {
      console.error('Error creando notificación:', error);
    }
  };

  const analyzeProject = async (projectId, adminId, notificationId = null) => {
    try {
      // 1. Actualizar estado del proyecto
      await updateDoc(doc(db, 'projects', projectId), {
        status: 'analyzed',
        analyzedAt: serverTimestamp(),
        analyzedBy: adminId,
        updatedAt: serverTimestamp()
      });
  
      // 2. ✅ MARCAR NOTIFICACIÓN COMO LEÍDA SI SE PROPORCIONA
      if (notificationId) {
        await markAdminNotificationAsRead(notificationId);
      }
  
      const project = documents.find(p => p.id === projectId);
      if (!project) return false;
  
      // 3. Enviar notificación al usuario
      await addDoc(collection(db, 'userNotifications'), {
        userId: project.userId,
        type: 'project_analyzed',
        title: '🎉 ¡Tu proyecto ha sido analizado!',
        message: `El administrador ha completado el análisis de "${project.name}". Ya puedes ver los resultados detallados, gráficos y recomendaciones.`,
        projectId: projectId,
        read: false,
        createdAt: serverTimestamp(),
        priority: 'high',
        actionUrl: `/project/${projectId}`
      });
  
      console.log(`✅ Proyecto ${projectId} analizado y notificación enviada`);
      return true;
      
    } catch (error) {
      console.error('Error analizando proyecto:', error);
      return false;
    }
  };

  const getAdminNotifications = async () => {
    try {
      const q = query(
        collection(db, 'adminNotifications'),
        where('status', '==', 'unread')
      );
      const snapshot = await getDocs(q);
      const notifications = [];
      snapshot.forEach(doc => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      return notifications;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  };

  const duplicateProject = async (projectId, userId) => {
    const originalProject = documents.find(p => p.id === projectId);
    if (!originalProject) return null;

    const newProject = {
      ...originalProject,
      name: `${originalProject.name} (Copia)`,
      userId: userId,
      status: 'draft',
      notificationSent: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    delete newProject.id;
    
    return await addDocument(newProject);
  };

  return {
    projects: userProjects,
    error,
    loading,
    createProject,
    saveSection, // ✅ AGREGAR ESTA FUNCIÓN AL RETURN
    saveFeasibilityData,
    updateProject: updateDocument,
    deleteProject: deleteDocument,
    duplicateProject,
    analyzeProject,
    getAdminNotifications,
    sendExplicitNotification,
    markAdminNotificationAsRead
  };
};