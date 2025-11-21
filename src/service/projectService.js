// src/services/projectService.js - VERSIÓN CORREGIDA CON DEBUGGING
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const projectService = {
  // Crear o actualizar proyecto completo - VERSIÓN CORREGIDA
  // En projectService.js - AGREGAR ESTA VERSIÓN
  async saveProject(projectId, projectData, userId) {
    console.log('💾💾💾 PROJECT SERVICE - saveProject INICIANDO 💾💾💾', {
      projectId,
      userId,
      projectDataKeys: Object.keys(projectData),
      tieneFinancial: !!projectData.financial,
      financialKeys: projectData.financial ? Object.keys(projectData.financial) : 'No financial'
    });
  
    try {
      const projectRef = doc(db, 'projects', projectId);
      
      // ✅ VERIFICAR DATOS ANTES DE ENVIAR
      console.log('🔍 PROJECT SERVICE - Verificando datos:', {
        projectDataType: typeof projectData,
        isObject: projectData && typeof projectData === 'object',
        hasUndefined: JSON.stringify(projectData).includes('undefined'),
        hasFunctions: JSON.stringify(projectData).includes('function')
      });
      
      const dataToSave = {
        ...projectData,
        updatedAt: new Date().toISOString(),
        updatedBy: userId,
        ...(!projectData.createdAt && { createdAt: new Date().toISOString() })
      };
  
      console.log('🚀 PROJECT SERVICE - Enviando a Firestore...');
      
      await setDoc(projectRef, dataToSave, { merge: true });
      
      console.log('✅✅✅ PROJECT SERVICE - GUARDADO EXITOSO EN FIRESTORE');
      return true;
      
    } catch (error) {
      console.error('❌❌❌ PROJECT SERVICE - ERROR EN saveProject:', error);
      console.error('Detalles completos:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  },

  // Actualizar solo una sección del proyecto - VERSIÓN CORREGIDA
  async updateProjectSection(projectId, section, sectionData, userId) {
    console.log('🔄 projectService.updateProjectSection - INICIANDO:', {
      projectId,
      section,
      sectionData,
      userId
    });

    try {
      const projectRef = doc(db, 'projects', projectId);
      
      await updateDoc(projectRef, {
        [`${section}`]: sectionData, // ✅ CORRECCIÓN: Sin "sections." prefix
        updatedAt: new Date().toISOString(), // ✅ Cambiado para debugging
        updatedBy: userId,
        lastUpdatedSection: section
      });
      
      console.log(`✅ projectService - Sección ${section} actualizada exitosamente`);
      return true; // ✅ CORRECCIÓN: Retornar boolean simple
      
    } catch (error) {
      console.error(`❌ projectService - Error actualizando sección ${section}:`, error);
      console.error('Detalles del error:', {
        code: error.code,
        message: error.message
      });
      throw error;
    }
  },

  // Obtener proyecto completo - VERSIÓN CORREGIDA
  async getProject(projectId) {
    console.log('📥 projectService.getProject - Solicitando:', projectId);
    
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        console.log('✅ projectService - Proyecto encontrado:', {
          projectId,
          dataKeys: Object.keys(data),
          tieneFinancial: !!data.financial,
          financialKeys: data.financial ? Object.keys(data.financial) : 'No financial'
        });
        return data;
      } else {
        console.log('📝 projectService - Proyecto no existe en Firestore');
        return null;
      }
    } catch (error) {
      console.error('❌ projectService - Error obteniendo proyecto:', error);
      console.error('Detalles del error:', {
        code: error.code,
        message: error.message
      });
      throw error;
    }
  },

  // Agregar al historial de cambios - VERSIÓN CORREGIDA
  async addToChangeHistory(projectId, changeData) {
    console.log('📝 projectService.addToChangeHistory - Agregando:', {
      projectId,
      changeData
    });

    try {
      const projectRef = doc(db, 'projects', projectId);
      
      await updateDoc(projectRef, {
        changeHistory: arrayUnion({
          ...changeData,
          timestamp: new Date().toISOString() // ✅ Cambiado para debugging
        })
      });
      
      console.log('✅ projectService - Historial actualizado');
      
    } catch (error) {
      console.error('❌ projectService - Error guardando historial:', error);
      // No throw para no interrumpir el flujo principal
    }
  }
};