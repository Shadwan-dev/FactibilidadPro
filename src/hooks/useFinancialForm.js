// hooks/useFinancialForm.js (VERSIÓN COMPLETA CORREGIDA)
import { useState, useEffect, useCallback } from 'react';

// ✅ AGREGAR los datos iniciales que faltan
const initialTechnicalData = {
  // Financiamiento
  capital: [],
  bankCredit: [],
  otherFinancing: [],
  
  // Ingresos
  salesServices: [],
  financialIncome: [],
  otherIncome: [],
  
  // Costos
  rawMaterials: [],        // ✅ AÑADIDO: Materias primas
  officeSupplies: [],      // ✅ AÑADIDO: Suministros de oficina
  buildings: [],           // ✅ AÑADIDO: Edificios/Infraestructura
  
  // Gastos (todos los que están en tus modales)
  salaries: [],
  taxes: [],
  supplies: [],            // ✅ AÑADIDO: Insumos
  fuel: [],                // ✅ AÑADIDO: Combustible
  transport: [],           // ✅ AÑADIDO: Transporte
  energy: [],              // ✅ AÑADIDO: Energía
  travel: [],              // ✅ AÑADIDO: Viajes
  services: [],            // ✅ AÑADIDO: Servicios
  financialExpenses: [],   // ✅ AÑADIDO: Gastos financieros
  otherExpenses: [],       // ✅ AÑADIDO: Otros gastos
  
  // Configuración
  analysisYears: 5,
  investment: 0,
  projectedRevenue: 0
};

export const useFinancialForm = (initialData = {}) => {
  const [formData, setFormData] = useState(() => {
    console.log('🔄 Inicializando formulario financiero con:', initialData);
    return {
      ...initialTechnicalData,
      ...initialData
    };
  });

  // ✅ CORRECCIÓN CRÍTICA: Sincronizar cuando initialData cambia
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('🔄 Sincronizando formulario financiero con nuevos datos:', initialData);
      
      // Fusionar datos manteniendo los arrays existentes si no vienen en initialData
      setFormData(prev => {
        const mergedData = { ...prev };
        
        // Actualizar solo los campos que vienen en initialData
        Object.keys(initialData).forEach(key => {
          if (initialData[key] !== undefined && initialData[key] !== null) {
            // Para arrays, reemplazar completamente
            if (Array.isArray(initialData[key])) {
              mergedData[key] = [...initialData[key]];
            } else {
              mergedData[key] = initialData[key];
            }
          }
        });
        
        return mergedData;
      });
    }
  }, [initialData]); // ✅ Dependencia correcta

  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});

  const openModal = useCallback((modalType, existingData = []) => {
    console.log(`📋 Abriendo modal ${modalType} con datos:`, existingData);
    setActiveModal(modalType);
    setModalData(existingData || []);
  }, []);

  const closeModal = useCallback(() => {
    console.log('❌ Cerrando modal');
    setActiveModal(null);
    setModalData({});
  }, []);

  const updateFromModal = useCallback((field, newData) => {
    console.log(`🔄 Actualizando desde modal ${field}:`, newData);
    setFormData(prev => ({
      ...prev,
      [field]: newData
    }));
  }, []);

  const updateField = useCallback((field, value) => {
    console.log(`📝 Actualizando campo ${field}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const calculateTotal = useCallback((array, amountField = 'amount') => {
    if (!array || !Array.isArray(array)) return 0;
    
    const total = array.reduce((total, item) => {
      // ✅ BUSCAR EN TODOS LOS CAMPOS POSIBLES
      const amount = item[amountField] || 
                     item.amount || 
                     item.annualAmount || 
                     item.annualCost || 
                     item.periodicCost || 
                     0;
      return total + (parseFloat(amount) || 0);
    }, 0);
    
    console.log(`🧮 Calculando total para:`, array, 'Campo:', amountField, 'Total:', total);
    return total;
  }, []);

  // ✅ NUEVO: Función para resetear completamente el formulario
  const resetFormData = useCallback((newData) => {
    console.log('🔄 Reseteando formulario financiero con:', newData);
    setFormData({
      ...initialTechnicalData,
      ...newData
    });
  }, []);

  return {
    formData,
    activeModal,
    modalData,
    openModal,
    closeModal,
    updateFromModal,
    updateField,
    calculateTotal,
    resetFormData // ✅ EXPORTAR la nueva función
  };
};