// src/context/ProjectContext.jsx - VERSIÓN COMPLETA CORREGIDA
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { projectService } from '../service/projectService'; // ✅ CORREGIDO: services (plural)
import { useAuth } from '../hooks/useAuth';

// ✅ DEBUG INICIAL
console.log('🔴🔴🔴 PROJECT CONTEXT - ARCHIVO CARGADO 🔴🔴🔴');

const ProjectContext = createContext();
console.log('🔴 PROJECT CONTEXT - Contexto creado');

const initialState = {
  currentProjectId: null,
  projectData: {
    financial: {},
    technical: {},
    market: {},
    legal: {},
    metadata: {}
  },
  loading: true,
  saving: false,
  error: null,
  lastSaved: null,
  mostrarValidacion: false,
  esUsuarioMaster: false
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_SAVING':
      return { ...state, saving: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_PROJECT_DATA':
      return { 
        ...state, 
        projectData: action.payload,
        loading: false,
        error: null 
      };
    
    case 'UPDATE_SECTION_DATA':
      return {
        ...state,
        projectData: {
          ...state.projectData,
          [action.payload.section]: action.payload.data
        },
        lastSaved: new Date().toISOString()
      };
    
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProjectId: action.payload };
    
    case 'SET_VALIDACION':
      return { ...state, mostrarValidacion: action.payload };
    
    case 'SET_USUARIO_MASTER':
      return { ...state, esUsuarioMaster: action.payload };
    
    case 'RESET_PROJECT':
      return {
        ...initialState,
        currentProjectId: null,
        loading: false
      };
    
    default:
      return state;
  }
}

export const ProjectProvider = ({ children, initialProjectId = null }) => {
  console.log('🔴🔴🔴 PROJECT CONTEXT - PROVIDER RENDERIZADO 🔴🔴🔴', {
    initialProjectId,
    childrenType: typeof children
  });

  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { currentUser, isAdmin } = useAuth();

  // ✅ DEBUG DEL ESTADO INICIAL
  console.log('🔍 PROJECT CONTEXT - Estado después de useReducer:', {
    currentProjectId: state.currentProjectId,
    currentUser: currentUser?.uid,
    tieneUsuario: !!currentUser,
    stateKeys: Object.keys(state)
  });

  // Crear nuevo proyecto
  const createNewProject = useCallback(async (projectId) => {
    if (!currentUser) return;
    
    try {
      const initialData = {
        financial: {},
        technical: {},
        market: {},
        legal: {},
        metadata: {
          createdAt: new Date().toISOString(),
          createdBy: currentUser.uid,
          createdByEmail: currentUser.email,
          lastUpdated: new Date().toISOString()
        }
      };
      
      await projectService.saveProject(projectId, initialData, currentUser.uid);
      dispatch({ type: 'SET_PROJECT_DATA', payload: initialData });
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: projectId });
      console.log('✅ Nuevo proyecto creado en Firebase');
    } catch (error) {
      console.error('❌ Error creando proyecto:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [currentUser]);

  // Cargar proyecto
  const loadProject = useCallback(async (projectId) => {
    if (!currentUser || !projectId) {
      console.log('⏳ Esperando autenticación o projectId...');
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('📥 Cargando proyecto:', projectId);
      
      const projectData = await projectService.getProject(projectId);
      
      if (projectData) {
        console.log('✅ Proyecto cargado de Firebase:', projectData);
        dispatch({ type: 'SET_PROJECT_DATA', payload: projectData });
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: projectId });
      } else {
        console.log('📝 Proyecto no existe, creando nuevo...');
        await createNewProject(projectId);
      }
    } catch (error) {
      console.error('❌ Error cargando proyecto:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [currentUser, createNewProject]);

  // Efecto para cargar proyecto inicial
  useEffect(() => {
    if (initialProjectId) {
      loadProject(initialProjectId);
    }
  }, [initialProjectId, loadProject]);

  // Sincronizar rol de usuario
  useEffect(() => {
    if (currentUser) {
      dispatch({ type: 'SET_USUARIO_MASTER', payload: isAdmin });
    } else {
      dispatch({ type: 'SET_USUARIO_MASTER', payload: false });
    }
  }, [currentUser, isAdmin]);

  // ✅ FUNCIÓN updateSection CORREGIDA
  // ✅ FUNCIÓN CORREGIDA - LIMPIAR DATOS PARA FIREBASE
const updateSection = useCallback(async (section, data) => {
  console.log('🔄🔄🔄 PROJECT CONTEXT - updateSection EJECUTÁNDOSE 🔄🔄🔄');
  console.log('📊 Estado actual:', {
    currentProjectId: state.currentProjectId,
    currentUser: currentUser?.uid,
    section,
    data
  });

  if (!state.currentProjectId) {
    console.error('❌ FALTA currentProjectId:', state.currentProjectId);
    return false;
  }

  if (!currentUser) {
    console.error('❌ FALTA currentUser:', currentUser);
    return false;
  }

  console.log('✅✅✅ CONDICIONES CUMPLIDAS - PROCEDIENDO CON GUARDADO');

  try {
    dispatch({ type: 'SET_SAVING', payload: true });
    
    // 1. Actualizar estado local
    dispatch({
      type: 'UPDATE_SECTION_DATA',
      payload: { section, data }
    });

    // 2. Preparar datos para Firebase - CON LIMPIEZA
    const updatedProjectData = {
      ...state.projectData,
      [section]: data,
      metadata: {
        ...state.projectData.metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid,
        updatedByEmail: currentUser.email,
        lastUpdatedSection: section
      }
    };

    // ✅ LIMPIAR DATOS PARA FIREBASE
    const cleanedProjectData = cleanDataForFirebase(updatedProjectData);
    
    console.log('💾 Enviando a Firebase (datos limpiados):', {
      section,
      data: cleanedProjectData[section],
      metadata: cleanedProjectData.metadata
    });

    // 3. Guardar en Firebase
    const success = await projectService.saveProject(
      state.currentProjectId, 
      cleanedProjectData, // ✅ Usar datos limpiados
      currentUser.uid
    );
    
    console.log('📩 saveProject retornó:', success);
    
    dispatch({ type: 'SET_SAVING', payload: false });
    return success;
    
  } catch (error) {
    console.error('❌❌❌ PROJECT CONTEXT - ERROR CAPTURADO EN updateSection:', error);
    console.error('Error completo:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    dispatch({ type: 'SET_ERROR', payload: error.message });
    dispatch({ type: 'SET_SAVING', payload: false });
    return false;
  }
}, [state.currentProjectId, state.projectData, currentUser]);
// ✅ FUNCIÓN PARA LIMPIAR DATOS PARA FIREBASE
const cleanDataForFirebase = (data) => {
  const cleaned = JSON.parse(JSON.stringify(data, (key, value) => {
    // Remover valores undefined, funciones, y símbolos
    if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
      return null;
    }
    
    // Convertir objetos complejos a objetos simples
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Si es un objeto con métodos, convertirlo a objeto plano
      if (Object.getOwnPropertyNames(value).some(prop => typeof value[prop] === 'function')) {
        return Object.fromEntries(
          Object.entries(value).filter(([_, val]) => typeof val !== 'function')
        );
      }
    }
    
    return value;
  }));
  
  console.log('🧹 Datos limpiados para Firebase:', {
    originalKeys: Object.keys(data),
    cleanedKeys: Object.keys(cleaned),
    hasUndefined: JSON.stringify(data).includes('undefined')
  });
  
  return cleaned;
};

  // ✅ MÉTODOS DE UI (FALTANTES)
  const setProyectoActual = useCallback((projectId) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: projectId });
    if (projectId) {
      loadProject(projectId);
    } else {
      dispatch({ type: 'RESET_PROJECT' });
    }
  }, [loadProject]);

  const setMostrarValidacion = useCallback((mostrar) => {
    dispatch({ type: 'SET_VALIDACION', payload: mostrar });
  }, []);

  const resetProject = useCallback(() => {
    dispatch({ type: 'RESET_PROJECT' });
  }, []);

  // ✅ FORCE SAVE (FALTANTE)
  const forceSave = useCallback(async () => {
    if (state.currentProjectId && currentUser) {
      try {
        dispatch({ type: 'SET_SAVING', payload: true });
        
        const projectDataToSave = {
          ...state.projectData,
          metadata: {
            ...state.projectData.metadata,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.uid,
            updatedByEmail: currentUser.email,
            forceSaved: true
          }
        };

        await projectService.saveProject(
          state.currentProjectId, 
          projectDataToSave, 
          currentUser.uid
        );
        
        console.log('💾 Guardado forzado exitoso');
        dispatch({ type: 'SET_SAVING', payload: false });
        return true;
      } catch (error) {
        console.error('❌ Error en guardado forzado:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_SAVING', payload: false });
        return false;
      }
    }
    return false;
  }, [state.currentProjectId, state.projectData, currentUser]);

  // ✅ VALUE DEL CONTEXTO (FALTANTE)
  const value = {
    // Estado (compatible)
    formData: state.projectData,
    proyectoActual: state.currentProjectId,
    mostrarValidacion: state.mostrarValidacion,
    esUsuarioMaster: state.esUsuarioMaster,
    
    // Estados adicionales
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    lastSaved: state.lastSaved,
    
    // ✅ currentUser disponible
    currentUser: currentUser,
    
    // Métodos (compatibles)
    updateFormData: updateSection,
    setProyectoActual,
    setMostrarValidacion,
    setEsUsuarioMaster: (esMaster) => dispatch({ type: 'SET_USUARIO_MASTER', payload: esMaster }),
    resetFormData: resetProject,
    
    // Métodos nuevos
    updateSection,
    loadProject,
    forceSave,
    
    // Utilidades adicionales
    hasProject: !!state.currentProjectId,
    isProjectLoaded: !state.loading && !!state.currentProjectId
  };

  // ✅ DEBUG FINAL DEL VALUE
  console.log('🔍 PROJECT CONTEXT - Value a exportar:', {
    keys: Object.keys(value),
    tieneUpdateFormData: typeof value.updateFormData === 'function',
    proyectoActual: value.proyectoActual,
    currentUser: value.currentUser?.uid
  });

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject debe usarse dentro de ProjectProvider');
  }
  return context;
};