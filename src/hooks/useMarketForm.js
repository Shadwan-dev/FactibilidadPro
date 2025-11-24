// src/hooks/useMarketForm.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

const initialMarketData = {
  // DATOS CUANTITATIVOS
  
  // 1. Tamaño y Dimensión del Mercado
  totalMarketRating: '',
  totalMarketData: [],
  availableMarketRating: '',
  availableMarketData: [],
  targetMarketRating: '',
  targetMarketData: [],
  marketValueRating: '',
  marketValueData: [],
  growthRatesRating: '',
  growthRatesData: [],

  // 2. Segmentación del Mercado
  demographicSegmentationRating: '',
  demographicSegmentation: [],
  geographicSegmentationRating: '',
  geographicSegmentation: [],
  psychographicSegmentationRating: '',
  psychographicSegmentation: [],
  behavioralSegmentationRating: '',
  behavioralSegmentation: [],

  // 3. Demanda
  currentDemandRating: '',
  currentDemandData: [],
  historicalDemandRating: '',
  historicalDemandData: [],
  projectedDemandRating: '',
  projectedDemandData: [],
  seasonalityRating: '',
  seasonalityData: [],
  priceElasticityRating: '',
  priceElasticityData: [],
  unsatisfiedDemandRating: '',
  unsatisfiedDemandData: [],

  // 4. Competencia
  directCompetitorsRating: '',
  directCompetitorsData: [],
  marketShareRating: '',
  marketShareData: [],
  competitorPricingRating: '',
  competitorPricingData: [],
  competitorLocationRating: '',
  competitorLocationData: [],

  // 5. Precios
  marketPricingRating: '',
  marketPricingData: [],
  priceEvolutionRating: '',
  priceEvolutionData: [],
  profitMarginsRating: '',
  profitMarginsData: [],

  // 6. Canales de Distribución
  distributionChannelsRating: '',
  distributionChannelsData: [],
  geographicCoverageRating: '',
  geographicCoverageData: [],
  distributionCostsRating: '',
  distributionCostsData: [],

  // 7. Consumidor/Cliente
  purchaseBehaviorRating: '',
  purchaseBehaviorData: [],
  paymentCapacityRating: '',
  paymentCapacityData: [],
  customerAcquisitionRating: '',
  customerAcquisitionData: [],

  // DATOS CUALITATIVOS
  
  // 1. Necesidades y Problemas
  painPointsRating: '',
  painPointsAnalysis: [],
  unmetNeedsRating: '',
  unmetNeedsAnalysis: [],
  purchaseMotivationsRating: '',
  purchaseMotivationsAnalysis: [],

  // 2. Comportamiento del Consumidor
  decisionProcessRating: '',
  decisionProcessAnalysis: [],
  influencersRating: '',
  influencersAnalysis: [],
  selectionCriteriaRating: '',
  selectionCriteriaAnalysis: [],

  // 3. Percepción y Preferencias
  valuedAttributesRating: '',
  valuedAttributesAnalysis: [],
  priceSensitivityRating: '',
  priceSensitivityAnalysis: [],
  brandPreferencesRating: '',
  brandPreferencesAnalysis: [],

  // 4. Análisis de Competencia (Cualitativo)
  competitorStrengthsRating: '',
  competitorStrengthsAnalysis: [],
  competitorWeaknessesRating: '',
  competitorWeaknessesAnalysis: [],
  competitorMarketingRating: '',
  competitorMarketingAnalysis: [],

  // 5. Tendencias del Mercado
  emergingTrendsRating: '',
  emergingTrendsAnalysis: [],
  regulatoryChangesRating: '',
  regulatoryChangesAnalysis: [],
  sectorInnovationsRating: '',
  sectorInnovationsAnalysis: [],

  // 6. Factores Externos (PESTEL)
  politicalEconomicRating: '',
  politicalEconomicAnalysis: [],
  socialTechnologicalRating: '',
  socialTechnologicalAnalysis: [],
  environmentalLegalRating: '',
  environmentalLegalAnalysis: [],

  // 7. Oportunidades y Amenazas
  opportunitiesRating: '',
  opportunitiesAnalysis: [],
  threatsRating: '',
  threatsAnalysis: []
};

export const useMarketForm = (initialData = {}) => {
  const { updateFormData, formData: contextData } = useProject();
  const initialDataRef = useRef(initialData);
  
  // Sincronizar con datos del contexto
  const [formData, setFormData] = useState(() => ({
    ...initialMarketData,
    ...initialDataRef.current,
    ...(contextData.market || {})
  }));
  
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sincronizar con cambios en el contexto
  useEffect(() => {
    if (contextData.market && JSON.stringify(contextData.market) !== JSON.stringify(formData)) {
      console.log('🔄 Sincronizando datos de mercado desde contexto');
      setFormData(prev => ({
        ...prev,
        ...contextData.market
      }));
    }
  }, [contextData.market]);

  const openModal = useCallback((modalType, data = []) => {
    setActiveModal(modalType);
    setModalData(data || []);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // ✅ FUNCIÓN PARA GUARDAR EVALUACIÓN DE CAMPO
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
      const success = await updateFormData('market', updatedData);
      
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

      const success = await updateFormData('market', formData);
      
      if (success) {
        setLastSaved({
          field: 'all',
          timestamp: new Date().toLocaleTimeString()
        });
        console.log('✅ Todos los datos de mercado guardados en Firebase');
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