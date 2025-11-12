// src/hooks/useFeasibilityCalculations.js (OPTIMIZADO)
import { useMemo } from 'react';

// Mover funciones helper fuera del hook
const calculateNPV = (investment, operationalCosts, projectedRevenue, discountRate, period) => {
  let npv = -investment;
  const annualCashFlow = projectedRevenue - operationalCosts;
  
  for (let i = 1; i <= period; i++) {
    npv += annualCashFlow / Math.pow(1 + discountRate, i);
  }
  return npv;
};

const calculateIRR = (investment, operationalCosts, projectedRevenue, period) => {
  const annualCashFlow = projectedRevenue - operationalCosts;
  if (annualCashFlow <= 0) return 0;
  
  let irr = 0.1;
  const precision = 0.001;
  
  for (let iter = 0; iter < 1000; iter++) {
    let npv = -investment;
    for (let i = 1; i <= period; i++) {
      npv += annualCashFlow / Math.pow(1 + irr, i);
    }
    
    if (Math.abs(npv) < precision) break;
    irr += (npv > 0) ? 0.001 : -0.001;
  }
  return irr;
};

const calculatePayback = (investment, operationalCosts, projectedRevenue) => {
  const annualCashFlow = projectedRevenue - operationalCosts;
  return annualCashFlow > 0 ? investment / annualCashFlow : 0;
};

// Memoizar las funciones de evaluación
const evaluateTechnical = (technicalData) => {
  if (!technicalData) return { score: 0, viable: false, level: 'low' };
  
  const { teamCapacity = 0, infrastructure = 0, technologyAvailable = false } = technicalData;
  let score = 50;

  if (teamCapacity >= 7) score += 20;
  if (infrastructure >= 7) score += 15;
  if (technologyAvailable) score += 15;

  return {
    score: Math.min(score, 100),
    viable: score >= 70,
    level: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'
  };
};

const evaluateMarket = (marketData) => {
  if (!marketData) return { score: 0, viable: false, level: 'low' };
  
  const { marketSize = 0, marketGrowth = 0, competitors = 0 } = marketData;
  let score = 50;

  if (marketSize > 5000) score += 20;
  if (marketGrowth > 8) score += 15;
  if (competitors <= 5) score += 15;

  return {
    score: Math.min(score, 100),
    viable: score >= 65,
    level: score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low'
  };
};

const evaluateLegal = (legalData) => {
  if (!legalData) return { score: 0, viable: false, level: 'low' };
  
  const { permits = false, regulatoryCompliance = false, legalRisks = 0 } = legalData;
  let score = 50;

  if (permits) score += 25;
  if (regulatoryCompliance) score += 15;
  if (legalRisks <= 3) score += 10;

  return {
    score: Math.min(score, 100),
    viable: score >= 80,
    level: score >= 85 ? 'high' : score >= 70 ? 'medium' : 'low'
  };
};

// NUEVA FUNCIÓN: Generar sugerencias basadas en los cálculos
const generateSuggestions = (calculations, formData) => {
  const suggestions = [];
  const { financial, technical, market, legal, overall } = calculations;

  // Sugerencias financieras
  if (financial.npv <= 0) {
    suggestions.push({
      campo: "npv",
      mensaje: "El Valor Actual Neto (VAN) no es positivo. Recomendaciones:",
      sugerencias: [
        "Reducir la inversión inicial mediante alternativas más económicas",
        "Aumentar los ingresos proyectados con estrategias de mercado más agresivas",
        "Disminuir costos operativos optimizando procesos",
        "Reevaluar la tasa de descuento aplicada"
      ]
    });
  }

  if (financial.irr < 0.08) {
    suggestions.push({
      campo: "irr",
      mensaje: "La Tasa Interna de Retorno (TIR) es baja. Considera:",
      sugerencias: [
        "Buscar financiamiento con tasas de interés más bajas",
        "Implementar el proyecto en fases para reducir riesgo",
        "Explorar subsidios o incentivos fiscales",
        "Revisar los supuestos de crecimiento de ingresos"
      ]
    });
  }

  if (financial.payback > 36) {
    suggestions.push({
      campo: "payback",
      mensaje: "El período de recuperación es extenso. Estrategias:",
      sugerencias: [
        "Incrementar el margen de contribución",
        "Buscar pre-financiamiento de clientes",
        "Implementar modelo de suscripción para ingresos recurrentes",
        "Reducir tiempos de implementación con metodologías ágiles"
      ]
    });
  }

  // Sugerencias técnicas
  if (!technical.viable) {
    suggestions.push({
      campo: "technical",
      mensaje: "Factibilidad técnica requiere mejora. Acciones:",
      sugerencias: [
        "Capacitar al equipo en tecnologías requeridas",
        "Considerar outsourcing para áreas críticas",
        "Realizar prueba de concepto antes de implementación completa",
        "Buscar partners tecnológicos especializados"
      ]
    });
  }

  // Sugerencias de mercado
  if (!market.viable) {
    suggestions.push({
      campo: "market",
      mensaje: "Análisis de mercado indica oportunidades de mejora:",
      sugerencias: [
        "Realizar estudio de mercado más detallado",
        "Identificar nichos de mercado no explotados",
        "Desarrollar estrategias de diferenciación competitiva",
        "Considerar expansión a mercados alternativos"
      ]
    });
  }

  // Sugerencias legales
  if (!legal.viable) {
    suggestions.push({
      campo: "legal",
      mensaje: "Aspectos legales requieren atención. Recomendaciones:",
      sugerencias: [
        "Consultar con especialista en regulaciones del sector",
        "Iniciar trámites de permisos con anticipación",
        "Desarrollar plan de mitigación de riesgos legales",
        "Considerar seguros de responsabilidad civil"
      ]
    });
  }

  // Sugerencia general si el proyecto no es viable
  if (!overall.viable) {
    suggestions.push({
      campo: "overall",
      mensaje: "El proyecto no cumple criterios mínimos de viabilidad. Considera:",
      sugerencias: [
        "Replantear el modelo de negocio completamente",
        "Buscar socios estratégicos que aporten capacidades complementarias",
        "Reducir el alcance inicial y enfocarse en MVP (Producto Mínimo Viable)",
        "Realizar pilotos de mercado antes de inversión completa"
      ]
    });
  }

  return suggestions;
};

export const useFeasibilityCalculations = (formData) => {
  return useMemo(() => {
    // Si no hay datos financieros, retornar estructura por defecto rápidamente
    if (!formData?.financial || Object.keys(formData.financial).length === 0) {
      const defaultResult = {
        financial: { npv: 0, irr: 0, payback: 0, annualCashFlow: 0 },
        technical: { score: 0, viable: false, level: 'low' },
        market: { score: 0, viable: false, level: 'low' },
        legal: { score: 0, viable: false, level: 'low' },
        overall: { score: 0, viable: false, level: 'low', color: 'red' },
        suggestions: [] // NUEVO: sugerencias vacías por defecto
      };
      return defaultResult;
    }

    const { investment = 0, operationalCosts = 0, projectedRevenue = 0, discountRate = 0.1, period = 5 } = formData.financial;

    // Cálculos existentes
    const financial = {
      npv: calculateNPV(investment, operationalCosts, projectedRevenue, discountRate, period),
      irr: calculateIRR(investment, operationalCosts, projectedRevenue, period),
      payback: calculatePayback(investment, operationalCosts, projectedRevenue),
      annualCashFlow: projectedRevenue - operationalCosts
    };

    const technical = evaluateTechnical(formData.technical);
    const market = evaluateMarket(formData.market);
    const legal = evaluateLegal(formData.legal);

    // Evaluación general optimizada
    const financialScore = financial.npv > 0 && financial.irr > 0.08 ? 100 : 0;
    const overallScore = (financialScore + technical.score + market.score + legal.score) / 4;
    
    const isViable = financial.npv > 0 && financial.irr > 0.08 && technical.viable && market.viable && legal.viable;

    const overall = {
      score: overallScore,
      viable: isViable,
      level: isViable ? 'high' : overallScore > 60 ? 'medium' : 'low',
      color: isViable ? 'green' : overallScore > 60 ? 'orange' : 'red'
    };

    // NUEVO: Generar sugerencias automáticamente
    const suggestions = generateSuggestions(
      { financial, technical, market, legal, overall }, 
      formData
    );

    return {
      financial,
      technical,
      market,
      legal,
      overall,
      suggestions // NUEVO: incluimos las sugerencias en el resultado
    };
  }, [formData]);
};