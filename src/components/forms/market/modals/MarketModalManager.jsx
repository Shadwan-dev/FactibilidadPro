// src/components/forms/market/modals/MarketModalManager.jsx
import React from 'react';
import { MarketModal } from './MarketModal';

const MODAL_CONFIGS = {
  // ===== DATOS CUANTITATIVOS =====
  
  // 1. Tamaño y Dimensión del Mercado
  totalMarket: {
    title: 'Mercado Potencial Total',
    description: 'Número total de consumidores/empresas que podrían necesitar tu producto/servicio',
    fields: ['descripcion', 'cantidad', 'unidad_medida', 'fuente_informacion'],
    allowMultiple: true
  },
  availableMarket: {
    title: 'Mercado Disponible',
    description: 'Segmento que cumple requisitos geográficos, económicos y legales',
    fields: ['segmento', 'tamaño', 'requisitos_acceso', 'porcentaje_total'],
    allowMultiple: true
  },
  targetMarket: {
    title: 'Mercado Objetivo',
    description: 'Porción específica que planeas captar',
    fields: ['segmento_especifico', 'cuota_mercado', 'estrategia_acceso', 'potencial_crecimiento'],
    allowMultiple: true
  },
  marketValue: {
    title: 'Valor del Mercado',
    description: 'Facturación total anual del sector',
    fields: ['valor_anual', 'moneda', 'año_referencia', 'tasa_crecimiento'],
    allowMultiple: false
  },
  growthRates: {
    title: 'Tasas de Crecimiento',
    description: 'Crecimiento histórico y proyectado del mercado',
    fields: ['año', 'crecimiento_historico', 'crecimiento_proyectado', 'factores_influencia'],
    allowMultiple: true
  },

  // 2. Segmentación del Mercado
  demographicSegmentation: {
    title: 'Segmentación Demográfica',
    description: 'Edad, género, nivel educativo, ocupación, ingresos',
    fields: ['criterio', 'descripcion', 'porcentaje', 'tamaño_absoluto'],
    allowMultiple: true
  },
  geographicSegmentation: {
    title: 'Segmentación Geográfica',
    description: 'Ubicación, densidad poblacional, región, clima',
    fields: ['zona_geografica', 'caracteristicas', 'cobertura', 'potencial'],
    allowMultiple: true
  },
  psychographicSegmentation: {
    title: 'Segmentación Psicográfica',
    description: 'Estilo de vida, valores, personalidad, clase social',
    fields: ['perfil', 'caracteristicas', 'comportamiento', 'preferencias'],
    allowMultiple: true
  },
  behavioralSegmentation: {
    title: 'Segmentación Conductual',
    description: 'Frecuencia de compra, lealtad a marcas, beneficios buscados',
    fields: ['tipo_consumidor', 'frecuencia_compra', 'lealtad_marca', 'beneficios_buscados'],
    allowMultiple: true
  },

  // 3. Demanda
  currentDemand: {
    title: 'Demanda Actual',
    description: 'Unidades/servicios consumidos anualmente',
    fields: ['producto_servicio', 'unidades_anuales', 'tendencia', 'factores_demanda'],
    allowMultiple: true
  },
  historicalDemand: {
    title: 'Demanda Histórica',
    description: 'Evolución de la demanda en los últimos años',
    fields: ['año', 'volumen_demanda', 'variacion_anual', 'eventos_relevantes'],
    allowMultiple: true
  },
  projectedDemand: {
    title: 'Demanda Proyectada',
    description: 'Estimación de la demanda para los próximos años',
    fields: ['año', 'demanda_proyectada', 'tasa_crecimiento', 'supuestos'],
    allowMultiple: true
  },
  seasonality: {
    title: 'Estacionalidad',
    description: 'Variaciones mensuales/trimestrales en la demanda',
    fields: ['periodo', 'nivel_demanda', 'variacion', 'causas_estacionalidad'],
    allowMultiple: true
  },
  priceElasticity: {
    title: 'Elasticidad Precio-Demanda',
    description: 'Cómo varía la demanda ante cambios de precio',
    fields: ['producto', 'elasticidad', 'rango_precios', 'implicaciones'],
    allowMultiple: true
  },
  unsatisfiedDemand: {
    title: 'Demanda Insatisfecha',
    description: 'Gap entre oferta y demanda actual',
    fields: ['segmento', 'demanda_insatisfecha', 'causas', 'oportunidad'],
    allowMultiple: true
  },

  // 4. Competencia
  directCompetitors: {
    title: 'Competidores Directos',
    description: 'Empresas que ofrecen productos/servicios similares',
    fields: ['competidor', 'participacion_mercado', 'fortalezas', 'debilidades'],
    allowMultiple: true
  },
  marketShare: {
    title: 'Participación de Mercado',
    description: '% que controla cada competidor principal',
    fields: ['empresa', 'participacion', 'tendencia', 'factores_exito'],
    allowMultiple: true
  },
  competitorPricing: {
    title: 'Precios de Competidores',
    description: 'Rango de precios del mercado',
    fields: ['competidor', 'precio_minimo', 'precio_promedio', 'precio_maximo'],
    allowMultiple: true
  },
  competitorLocation: {
    title: 'Ubicación y Cobertura',
    description: 'Dónde operan los competidores',
    fields: ['competidor', 'ubicaciones', 'cobertura_geografica', 'expansion'],
    allowMultiple: true
  },

  // 5. Precios
  marketPricing: {
    title: 'Precios del Mercado',
    description: 'Promedio y rangos de precios del sector',
    fields: ['categoria', 'precio_minimo', 'precio_promedio', 'precio_maximo'],
    allowMultiple: true
  },
  priceEvolution: {
    title: 'Evolución de Precios',
    description: 'Histórico de precios últimos años',
    fields: ['año', 'precio_promedio', 'inflacion_sector', 'tendencia'],
    allowMultiple: true
  },
  profitMargins: {
    title: 'Márgenes del Sector',
    description: '% de ganancia promedio en el mercado',
    fields: ['segmento', 'margen_bruto', 'margen_neto', 'rentabilidad'],
    allowMultiple: true
  },

  // 6. Canales de Distribución
  distributionChannels: {
    title: 'Tipos de Canales',
    description: 'Directo, mayorista, minorista, online',
    fields: ['canal', 'participacion', 'costos', 'eficiencia'],
    allowMultiple: true
  },
  geographicCoverage: {
    title: 'Cobertura Geográfica',
    description: '% de penetración por región',
    fields: ['region', 'cobertura', 'penetracion', 'potencial'],
    allowMultiple: true
  },
  distributionCosts: {
    title: 'Costos de Distribución',
    description: '% sobre precio final',
    fields: ['canal', 'costo_distribucion', 'impacto_precio', 'optimizacion'],
    allowMultiple: true
  },

  // 7. Consumidor/Cliente
  purchaseBehavior: {
    title: 'Comportamiento de Compra',
    description: 'Frecuencia, ticket promedio, retención',
    fields: ['segmento', 'frecuencia_compra', 'ticket_promedio', 'tasa_retencion'],
    allowMultiple: true
  },
  paymentCapacity: {
    title: 'Capacidad de Pago',
    description: 'Ingresos disponibles del segmento objetivo',
    fields: ['segmento', 'ingreso_promedio', 'capacidad_endeudamiento', 'prioridad_gasto'],
    allowMultiple: true
  },
  customerAcquisition: {
    title: 'Costo de Adquisición',
    description: 'Inversión para captar un cliente',
    fields: ['canal', 'costo_adquisicion', 'lifetime_value', 'rentabilidad'],
    allowMultiple: true
  },

  // ===== DATOS CUALITATIVOS =====
  
  // 1. Necesidades y Problemas
  painPoints: {
    title: 'Pain Points Principales',
    description: 'Qué frustra a los consumidores actuales',
    fields: ['problema', 'impacto', 'frecuencia', 'intensidad'],
    allowMultiple: true
  },
  unmetNeeds: {
    title: 'Necesidades No Cubiertas',
    description: 'Qué falta en el mercado actual',
    fields: ['necesidad', 'segmento', 'urgencia', 'potencial'],
    allowMultiple: true
  },
  purchaseMotivations: {
    title: 'Motivaciones de Compra',
    description: 'Por qué compran los consumidores',
    fields: ['motivacion', 'segmento', 'importancia', 'influencia'],
    allowMultiple: true
  },

  // 2. Comportamiento del Consumidor
  decisionProcess: {
    title: 'Proceso de Decisión',
    description: 'Etapas de compra del consumidor',
    fields: ['etapa', 'duracion', 'influenciadores', 'puntos_contacto'],
    allowMultiple: true
  },
  influencers: {
    title: 'Influenciadores',
    description: 'Quién influye en la decisión de compra',
    fields: ['tipo_influenciador', 'impacto', 'canal', 'credibilidad'],
    allowMultiple: true
  },
  selectionCriteria: {
    title: 'Criterios de Selección',
    description: 'Qué valoran más al comprar',
    fields: ['criterio', 'importancia', 'diferencial', 'expectativas'],
    allowMultiple: true
  },

  // 3. Percepción y Preferencias
  valuedAttributes: {
    title: 'Atributos Valorados',
    description: 'Características más importantes del producto/servicio',
    fields: ['atributo', 'importancia', 'satisfaccion_actual', 'mejora_necesaria'],
    allowMultiple: true
  },
  priceSensitivity: {
    title: 'Sensibilidad al Precio',
    description: 'Importancia del precio vs. otros factores',
    fields: ['segmento', 'sensibilidad_precio', 'factores_alternativos', 'disposicion_pago'],
    allowMultiple: true
  },
  brandPreferences: {
    title: 'Preferencias de Marca',
    description: 'Marcas preferidas y por qué',
    fields: ['marca', 'preferencia', 'razones', 'lealtad'],
    allowMultiple: true
  },

  // 4. Análisis de Competencia (Cualitativo)
  competitorStrengths: {
    title: 'Fortalezas de Competidores',
    description: 'Qué hacen bien los competidores',
    fields: ['competidor', 'fortaleza', 'impacto', 'sostenibilidad'],
    allowMultiple: true
  },
  competitorWeaknesses: {
    title: 'Debilidades de Competidores',
    description: 'Dónde fallan los competidores',
    fields: ['competidor', 'debilidad', 'oportunidad', 'urgencia'],
    allowMultiple: true
  },
  competitorMarketing: {
    title: 'Estrategias de Marketing',
    description: 'Cómo se promocionan los competidores',
    fields: ['competidor', 'estrategia', 'efectividad', 'diferencial'],
    allowMultiple: true
  },

  // 5. Tendencias del Mercado
  emergingTrends: {
    title: 'Tendencias Emergentes',
    description: 'Nuevos comportamientos o tecnologías',
    fields: ['tendencia', 'impacto', 'velocidad_adopcion', 'oportunidad'],
    allowMultiple: true
  },
  regulatoryChanges: {
    title: 'Cambios Regulatorios',
    description: 'Nuevas leyes que afectan el sector',
    fields: ['regulacion', 'impacto', 'fecha_implementacion', 'adaptacion'],
    allowMultiple: true
  },
  sectorInnovations: {
    title: 'Innovaciones del Sector',
    description: 'Nuevos productos/servicios en desarrollo',
    fields: ['innovacion', 'empresa', 'potencial', 'tiempo_lanzamiento'],
    allowMultiple: true
  },

  // 6. Factores Externos (PESTEL)
  politicalEconomic: {
    title: 'Factores Políticos y Económicos',
    description: 'Estabilidad, políticas, inflación, poder adquisitivo',
    fields: ['factor', 'impacto', 'tendencia', 'riesgo'],
    allowMultiple: true
  },
  socialTechnological: {
    title: 'Factores Sociales y Tecnológicos',
    description: 'Demografía, cultura, educación, digitalización',
    fields: ['factor', 'impacto', 'tendencia', 'oportunidad'],
    allowMultiple: true
  },
  environmentalLegal: {
    title: 'Factores Ecológicos y Legales',
    description: 'Sostenibilidad, normativas ambientales, regulaciones',
    fields: ['factor', 'impacto', 'cumplimiento', 'costo_adaptacion'],
    allowMultiple: true
  },

  // 7. Oportunidades y Amenazas
  opportunities: {
    title: 'Oportunidades Identificadas',
    description: 'Nichos desatendidos y ventanas de oportunidad',
    fields: ['oportunidad', 'potencial', 'factibilidad', 'tiempo_ejecucion'],
    allowMultiple: true
  },
  threats: {
    title: 'Amenazas del Mercado',
    description: 'Riesgos, barreras de entrada, competencia',
    fields: ['amenaza', 'impacto', 'probabilidad', 'mitigacion'],
    allowMultiple: true
  }
};

export const MarketModalManager = ({ activeModal, modalData, onClose, onSave }) => {
  if (!activeModal) return null;

  const config = MODAL_CONFIGS[activeModal];

  if (!config) {
    console.warn(`No hay configuración para el modal: ${activeModal}`);
    return null;
  }

  return (
    <MarketModal
      isOpen={!!activeModal}
      onClose={onClose}
      onSave={onSave}
      field={activeModal}
      initialData={modalData}
      title={config.title}
      description={config.description}
      fields={config.fields}
      allowMultiple={config.allowMultiple}
    />
  );
};