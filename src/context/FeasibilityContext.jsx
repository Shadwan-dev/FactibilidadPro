// src/context/FeasibilityContext.jsx (ACTUALIZADO)
import React, { createContext, useContext, useState } from 'react';

const FeasibilityContext = createContext();

export const FeasibilityProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    financial: {},
    technical: {},
    market: {},
    legal: {}
  });
  
  const [proyectoActual, setProyectoActual] = useState(null);
  const [mostrarValidacion, setMostrarValidacion] = useState(false);
  const [esUsuarioMaster, setEsUsuarioMaster] = useState(false);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const resetFormData = () => {
    setFormData({
      financial: {},
      technical: {},
      market: {},
      legal: {}
    });
    setProyectoActual(null);
    setMostrarValidacion(false);
  };

  const value = {
    formData,
    proyectoActual,
    mostrarValidacion,
    esUsuarioMaster,
    updateFormData,
    setProyectoActual,
    setMostrarValidacion,
    setEsUsuarioMaster,
    resetFormData
  };

  return (
    <FeasibilityContext.Provider value={value}>
      {children}
    </FeasibilityContext.Provider>
  );
};

export const useFeasibility = () => {
  const context = useContext(FeasibilityContext);
  if (!context) {
    throw new Error('useFeasibility debe usarse dentro de FeasibilityProvider');
  }
  return context;
};