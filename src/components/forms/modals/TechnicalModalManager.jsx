// TechnicalModalManager.jsx - VERSIÓN ACTUALIZADA CON CLASES TÉCNICAS
import React from 'react';
import { TechnicalRatingModal } from './TechnicalRatingModal';
import '../../../styles/components/forms/technical-modals.css';

const modalConfig = {
  macrolocation: {
    title: 'Macrolocalización',
    description: 'Evaluación de la región, ciudad y zona donde se ubicará el proyecto'
  },
  microlocation: {
    title: 'Microlocalización', 
    description: 'Evaluación de la ubicación específica y terreno'
  },
  locationFactors: {
    title: 'Factores de Localización',
    description: 'Acceso a recursos, mercado, transporte y otros factores'
  },
  capacity: {
    title: 'Capacidad Instalada',
    description: 'Evaluación de la capacidad máxima de producción'
  },
  production: {
    title: 'Volumen de Producción',
    description: 'Niveles de producción proyectados y su viabilidad'
  },
  limitingFactors: {
    title: 'Factores Limitantes',
    description: 'Identificación de restricciones y limitaciones de capacidad'
  },
  productDescription: {
    title: 'Descripción del Producto/Servicio',
    description: 'Características técnicas principales y especificaciones'
  },
  productionProcess: {
    title: 'Proceso Productivo',
    description: 'Diagrama de flujo, etapas y metodologías de producción'
  },
  technology: {
    title: 'Tecnología y Maquinaria',
    description: 'Equipos, tecnología requerida y nivel de automatización'
  },
  layout: {
    title: 'Distribución de Planta',
    description: 'Layout, organización física y flujos de trabajo'
  },
  rawMaterials: {
    title: 'Materias Primas e Insumos',
    description: 'Materiales requeridos, disponibilidad y proveedores'
  },
  labor: {
    title: 'Mano de Obra',
    description: 'Personal requerido, calificaciones y estructura organizacional'
  },
  services: {
    title: 'Servicios Básicos',
    description: 'Requerimientos de agua, electricidad, gas, telecomunicaciones, etc.'
  },
  buildings: {
    title: 'Edificaciones y Construcciones',
    description: 'Estructuras físicas requeridas y especificaciones técnicas'
  },
  equipment: {
    title: 'Equipos y Maquinaria',
    description: 'Equipamiento técnico, especificaciones y capacidades'
  },
  furniture: {
    title: 'Mobiliario e Instalaciones',
    description: 'Mobiliario, acabados y equipamiento complementario'
  },
  phases: {
    title: 'Fases del Proyecto',
    description: 'Etapas de implementación y hitos principales'
  },
  timeline: {
    title: 'Tiempos de Ejecución',
    description: 'Duración estimada por fase y cronograma detallado'
  }
};

export const TechnicalModalManager = ({ activeModal, modalData, onClose, onSave }) => {
  // ✅ Si no hay modal activa, no renderizar nada
  if (!activeModal) {
    return null;
  }

  const config = modalConfig[activeModal];
  
  if (!config) {
    console.warn(`Modal configuration not found for: ${activeModal}`);
    return null;
  }

  return (
    <TechnicalRatingModal
      title={config.title}
      description={config.description}
      existingData={modalData || []}
      onSave={onSave}
      onClose={onClose}
      field={activeModal}
    />
  );
};