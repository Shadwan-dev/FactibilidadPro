// src/hooks/useTechnicalForm.js - VERSIÓN CORREGIDA
import { useState, useCallback, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

const initialTechnicalData = {
  // Localización
  macrolocationRating: '',
  macrolocationDetails: [],
  microlocationRating: '',
  microlocationDetails: [],
  locationFactorsRating: '',
  locationFactors: [],

  // Tamaño y capacidad
  capacityRating: '',
  capacityDetails: [],
  productionRating: '',
  productionDetails: [],
  limitingFactorsRating: '',
  limitingFactors: [],

  // Ingeniería
  productDescriptionRating: '',
  productDescription: [],
  productionProcessRating: '',
  productionProcess: [],
  technologyRating: '',
  technologyDetails: [],
  layoutRating: '',
  layoutDetails: [],

  // Recursos
  rawMaterialsRating: '',
  rawMaterials: [],
  laborRating: '',
  laborDetails: [],
  servicesRating: '',
  servicesDetails: [],

  // Infraestructura
  buildingsRating: '',
  buildingsDetails: [],
  equipmentRating: '',
  equipmentDetails: [],
  furnitureRating: '',
  furnitureDetails: [],

  // Cronograma
  phasesRating: '',
  projectPhases: [],
  timelineRating: '',
  timelineDetails: []
};

export const useTechnicalForm = (initialData = {}) => {
  const { updateFormData, formData: contextData } = useProject();
  const initialDataRef = useRef(initialData);
  
  // Sincronizar con datos del contexto
  const [formData, setFormData] = useState(() => ({
    ...initialTechnicalData,
    ...initialDataRef.current,
    ...(contextData.technical || {})
  }));
  
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sincronizar con cambios en el contexto
  useEffect(() => {
    if (contextData.technical && JSON.stringify(contextData.technical) !== JSON.stringify(formData)) {
      console.log('🔄 Sincronizando datos técnicos desde contexto');
      setFormData(prev => ({
        ...prev,
        ...contextData.technical
      }));
    }
  }, [contextData.technical]);

  const openModal = useCallback((modalType, data = []) => {
    setActiveModal(modalType);
    setModalData(data || []);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // ✅ FUNCIÓN CORREGIDA - Guarda en Firebase automáticamente
  const saveFieldEvaluation = useCallback(async (field, items, rating) => {
    try {
      setSaving(true);
      
      const updatedData = {
        ...formData,
        [field]: items,
        [`${field}Rating`]: rating
      };

      // Actualizar estado local inmediatamente
      setFormData(updatedData);
      
      // Guardar en Firebase a través del contexto
      const success = await updateFormData('technical', updatedData);
      
      if (success) {
        setLastSaved({
          field,
          timestamp: new Date().toLocaleTimeString()
        });
        console.log(`✅ Campo ${field} guardado en Firebase`);
      } else {
        console.error('❌ Error guardando en Firebase');
      }
      
      closeModal();
      setSaving(false);
      return success;
      
    } catch (error) {
      console.error('❌ Error en saveFieldEvaluation:', error);
      setSaving(false);
      return false;
    }
  }, [formData, updateFormData, closeModal]);

  // ✅ FUNCIÓN PARA GUARDAR TODO EL FORMULARIO
  const saveAllFormData = useCallback(async () => {
    try {
      setSaving(true);
      
      // Verificar que hay datos para guardar
      const hasData = Object.values(formData).some(value => 
        (Array.isArray(value) && value.length > 0) || 
        (typeof value === 'string' && value.trim() !== '')
      );
      
      if (!hasData) {
        console.log('⚠️ No hay datos para guardar');
        setSaving(false);
        return false;
      }

      const success = await updateFormData('technical', formData);
      
      if (success) {
        setLastSaved({
          field: 'all',
          timestamp: new Date().toLocaleTimeString()
        });
        console.log('✅ Todos los datos técnicos guardados en Firebase');
      } else {
        console.error('❌ Error guardando todos los datos');
      }
      
      setSaving(false);
      return success;
      
    } catch (error) {
      console.error('❌ Error en saveAllFormData:', error);
      setSaving(false);
      return false;
    }
  }, [formData, updateFormData]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    formData,
    activeModal,
    modalData,
    lastSaved,
    saving,
    openModal,
    closeModal,
    saveFieldEvaluation,
    saveAllFormData,
    updateField
  };
};