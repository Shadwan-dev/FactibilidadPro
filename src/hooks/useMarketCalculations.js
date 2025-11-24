// src/hooks/useMarketCalculations.js
import { useMemo } from 'react';

// ✅ CONSTANTES PARA ANÁLISIS DE MERCADO
const MARKET_PARAMETERS = {
  minMarketShare: 0.05,           // 5% participación mínima viable
  growthThreshold: 0.10,          // 10% crecimiento anual mínimo
  acceptablePaybackPeriod: 24,     // 24 meses máximo para recuperar inversión en marketing
  targetROI: 1.5,                 // ROI mínimo de 1.5x
  customerLTVThreshold: 3,        // LTV/CAC ratio mínimo de 3:1
  marketSizeThreshold: 1000000,   // Mercado mínimo de $1M
};

// ✅ CÁLCULO DE PARTICIPACIÓN DE MERCADO ESTIMADA
const calculateMarketShare = (targetMarketData, totalMarketData) => {
  if (!targetMarketData?.length || !totalMarketData?.length) return 0;
  
  const targetMarket = targetMarketData.reduce((sum, item) => 
    sum + (item.value || item.amount || 0), 0);
  const totalMarket = totalMarketData.reduce((sum, item) => 
    sum + (item.value || item.amount || 0), 0);
  
  return totalMarket > 0 ? (targetMarket / totalMarket) : 0;
};

// ✅ CÁLCULO DE TASA DE CRECIMIENTO ANUAL
const calculateGrowthRate = (historicalData, projectedData) => {
  if (!historicalData?.length || !projectedData?.length) return 0;
  
  const historicalValues = historicalData.map(item => item.value || item.amount || 0);
  const projectedValues = projectedData.map(item => item.value || item.amount || 0);
  
  if (historicalValues.length < 2) return 0;
  
  const startValue = historicalValues[0];
  const endValue = projectedValues[projectedValues.length - 1] || historicalValues[historicalValues.length - 1];
  
  return startValue > 0 ? (endValue - startValue) / startValue : 0;
};

// ✅ ANÁLISIS DE COMPETENCIA
const analyzeCompetition = (competitorsData, marketShareData) => {
  if (!competitorsData?.length) return { intensity: 'low', concentration: 'low' };
  
  const totalCompetitors = competitorsData.length;
  const marketShares = marketShareData?.map(item => item.percentage || 0) || [];
  
  // Calcular índice de concentración (CR4)
  const sortedShares = marketShares.sort((a, b) => b - a);
  const cr4 = sortedShares.slice(0, 4).reduce((sum, share) => sum + share, 0);
  
  let intensity = 'medium';
  if (totalCompetitors <= 3) intensity = 'high';
  if (totalCompetitors >= 10) intensity = 'low';
  
  let concentration = 'medium';
  if (cr4 > 60) concentration = 'high';
  if (cr4 < 30) concentration = 'low';
  
  return { intensity, concentration, cr4, totalCompetitors };
};

// ✅ ANÁLISIS DE PRECIOS Y MÁRGENES
const analyzePricing = (pricingData, marginData) => {
  if (!pricingData?.length) return { competitiveness: 'medium', marginPotential: 'medium' };
  
  const prices = pricingData.map(item => item.price || item.value || 0).filter(p => p > 0);
  const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b) / prices.length : 0;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  const margins = marginData?.map(item => item.margin || item.percentage || 0) || [];
  const averageMargin = margins.length > 0 ? margins.reduce((a, b) => a + b) / margins.length : 0;
  
  let competitiveness = 'medium';
  if (maxPrice - minPrice > averagePrice * 0.5) competitiveness = 'low';
  if (maxPrice - minPrice < averagePrice * 0.2) competitiveness = 'high';
  
  let marginPotential = 'medium';
  if (averageMargin > 40) marginPotential = 'high';
  if (averageMargin < 15) marginPotential = 'low';
  
  return { competitiveness, marginPotential, averagePrice, averageMargin, priceRange: { min: minPrice, max: maxPrice } };
};

// ✅ ANÁLISIS DE DEMANDA
const analyzeDemand = (currentDemand, projectedDemand, unsatisfiedDemand) => {
  const current = currentDemand?.reduce((sum, item) => sum + (item.value || item.amount || 0), 0) || 0;
  const projected = projectedDemand?.reduce((sum, item) => sum + (item.value || item.amount || 0), 0) || 0;
  const unsatisfied = unsatisfiedDemand?.reduce((sum, item) => sum + (item.value || item.amount || 0), 0) || 0;
  
  const growthPotential = current > 0 ? (projected - current) / current : 0;
  const unmetNeedRatio = current > 0 ? unsatisfied / current : 0;
  
  let strength = 'medium';
  if (growthPotential > 0.15 && unmetNeedRatio > 0.2) strength = 'high';
  if (growthPotential < 0.05 || unmetNeedRatio < 0.05) strength = 'low';
  
  return { strength, growthPotential, unmetNeedRatio, current, projected, unsatisfied };
};

// ✅ EVALUACIÓN DE OPORTUNIDADES Y AMENAZAS
const analyzeOpportunitiesThreats = (opportunitiesData, threatsData) => {
  const opportunityScore = opportunitiesData?.length * 10 || 0;
  const threatScore = threatsData?.length * 8 || 0; // Las amenazas pesan más
  
  const netScore = opportunityScore - threatScore;
  
  let outlook = 'neutral';
  if (netScore > 20) outlook = 'positive';
  if (netScore < -15) outlook = 'negative';
  
  return { outlook, opportunityScore, threatScore, netScore };
};

// ✅ FUNCIÓN PRINCIPAL DE EVALUACIÓN DE MERCADO
export const evaluateMarket = (marketData) => {
  if (!marketData) {
    return {
      score: 0,
      viable: false,
      level: 'low',
      detailedAnalysis: {
        marketShare: 0,
        growthRate: 0,
        competition: { intensity: 'low', concentration: 'low' },
        pricing: { competitiveness: 'medium', marginPotential: 'medium' },
        demand: { strength: 'medium', growthPotential: 0 },
        outlook: 'neutral',
        strengths: [],
        weaknesses: [],
        recommendations: []
      }
    };
  }

  let totalScore = 0;
  let completedAreas = 0;
  const maxPossibleScore = 100;

  // 1. ANÁLISIS DE TAMAÑO Y CRECIMIENTO (30 puntos)
  const marketShare = calculateMarketShare(marketData.targetMarketData, marketData.totalMarketData);
  const growthRate = calculateGrowthRate(marketData.historicalDemandData, marketData.projectedDemandData);
  
  let sizeScore = 0;
  if (marketShare > MARKET_PARAMETERS.minMarketShare) sizeScore += 15;
  if (growthRate > MARKET_PARAMETERS.growthThreshold) sizeScore += 15;
  
  totalScore += sizeScore;
  if (marketData.totalMarketData?.length > 0) completedAreas++;

  // 2. ANÁLISIS DE COMPETENCIA (25 puntos)
  const competition = analyzeCompetition(marketData.directCompetitorsData, marketData.marketShareData);
  let competitionScore = 0;
  
  if (competition.intensity === 'low') competitionScore += 15;
  else if (competition.intensity === 'medium') competitionScore += 10;
  
  if (competition.concentration === 'low') competitionScore += 10;
  else if (competition.concentration === 'medium') competitionScore += 7;
  
  totalScore += competitionScore;
  if (marketData.directCompetitorsData?.length > 0) completedAreas++;

  // 3. ANÁLISIS DE PRECIOS Y RENTABILIDAD (20 puntos)
  const pricing = analyzePricing(marketData.marketPricingData, marketData.profitMarginsData);
  let pricingScore = 0;
  
  if (pricing.competitiveness === 'high') pricingScore += 10;
  else if (pricing.competitiveness === 'medium') pricingScore += 7;
  
  if (pricing.marginPotential === 'high') pricingScore += 10;
  else if (pricing.marginPotential === 'medium') pricingScore += 7;
  
  totalScore += pricingScore;
  if (marketData.marketPricingData?.length > 0) completedAreas++;

  // 4. ANÁLISIS DE DEMANDA (15 puntos)
  const demand = analyzeDemand(marketData.currentDemandData, marketData.projectedDemandData, marketData.unsatisfiedDemandData);
  let demandScore = 0;
  
  if (demand.strength === 'high') demandScore += 15;
  else if (demand.strength === 'medium') demandScore += 10;
  else demandScore += 5;
  
  totalScore += demandScore;
  if (marketData.currentDemandData?.length > 0) completedAreas++;

  // 5. OPORTUNIDADES Y AMENAZAS (10 puntos)
  const outlook = analyzeOpportunitiesThreats(marketData.opportunitiesAnalysis, marketData.threatsAnalysis);
  let outlookScore = 0;
  
  if (outlook.outlook === 'positive') outlookScore += 10;
  else if (outlook.outlook === 'neutral') outlookScore += 7;
  else outlookScore += 3;
  
  totalScore += outlookScore;

  // GENERAR FORTALEZAS Y DEBILIDADES
  const strengths = generateMarketStrengths(marketData, { marketShare, growthRate, competition, pricing, demand, outlook });
  const weaknesses = generateMarketWeaknesses(marketData, { marketShare, growthRate, competition, pricing, demand, outlook });
  const recommendations = generateMarketRecommendations(marketData, { marketShare, growthRate, competition, pricing, demand, outlook });

  const score = Math.min(Math.round(totalScore), 100);
  const viable = score >= 70;
  const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';

  return {
    score,
    viable,
    level,
    detailedAnalysis: {
      marketShare: Math.round(marketShare * 10000) / 100, // Convertir a porcentaje
      growthRate: Math.round(growthRate * 10000) / 100,
      competition,
      pricing,
      demand,
      outlook,
      strengths,
      weaknesses,
      recommendations,
      completedAreas,
      totalAreas: 4 // Áreas críticas evaluadas
    }
  };
};

// ✅ GENERAR FORTALEZAS DEL MERCADO
const generateMarketStrengths = (marketData, metrics) => {
  const strengths = [];
  
  if (metrics.marketShare > MARKET_PARAMETERS.minMarketShare) {
    strengths.push(`Participación de mercado viable (${metrics.marketShare}%)`);
  }
  
  if (metrics.growthRate > MARKET_PARAMETERS.growthThreshold) {
    strengths.push(`Alto potencial de crecimiento (${metrics.growthRate}% anual)`);
  }
  
  if (metrics.competition.intensity === 'low') {
    strengths.push('Baja intensidad competitiva');
  }
  
  if (metrics.pricing.marginPotential === 'high') {
    strengths.push('Altos márgenes de rentabilidad potencial');
  }
  
  if (metrics.demand.strength === 'high') {
    strengths.push('Demanda sólida con crecimiento proyectado');
  }
  
  if (metrics.outlook.outlook === 'positive') {
    strengths.push('Balance positivo de oportunidades vs amenazas');
  }
  
  if (marketData.unsatisfiedDemandData?.length > 0) {
    strengths.push('Demanda insatisfecha identificada');
  }
  
  return strengths;
};

// ✅ GENERAR DEBILIDADES DEL MERCADO
const generateMarketWeaknesses = (marketData, metrics) => {
  const weaknesses = [];
  
  if (metrics.marketShare < MARKET_PARAMETERS.minMarketShare) {
    weaknesses.push(`Baja participación de mercado (${metrics.marketShare}%)`);
  }
  
  if (metrics.growthRate < MARKET_PARAMETERS.growthThreshold) {
    weaknesses.push(`Crecimiento limitado del mercado (${metrics.growthRate}% anual)`);
  }
  
  if (metrics.competition.intensity === 'high') {
    weaknesses.push('Alta intensidad competitiva');
  }
  
  if (metrics.pricing.marginPotential === 'low') {
    weaknesses.push('Márgenes de rentabilidad limitados');
  }
  
  if (metrics.demand.strength === 'low') {
    weaknesses.push('Demanda débil o estancada');
  }
  
  if (metrics.outlook.outlook === 'negative') {
    weaknesses.push('Amenazas superan a las oportunidades');
  }
  
  if (!marketData.targetMarketData?.length) {
    weaknesses.push('Segmentación de mercado no definida');
  }
  
  return weaknesses;
};

// ✅ GENERAR RECOMENDACIONES ESTRATÉGICAS
const generateMarketRecommendations = (marketData, metrics) => {
  const recommendations = [];
  
  if (metrics.marketShare < MARKET_PARAMETERS.minMarketShare) {
    recommendations.push('Enfocarse en nichos de mercado específicos para ganar participación');
  }
  
  if (metrics.competition.intensity === 'high') {
    recommendations.push('Desarrollar propuesta de valor diferenciada frente a competidores');
  }
  
  if (metrics.pricing.competitiveness === 'low') {
    recommendations.push('Implementar estrategia de precios basada en valor en lugar de competencia');
  }
  
  if (metrics.demand.unmetNeedRatio > 0.2) {
    recommendations.push('Capitalizar demanda insatisfecha con soluciones específicas');
  }
  
  if (metrics.growthRate > MARKET_PARAMETERS.growthThreshold) {
    recommendations.push('Alinear recursos con crecimiento del mercado para capturar valor');
  }
  
  return recommendations;
};