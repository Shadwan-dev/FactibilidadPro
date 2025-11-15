// src/hooks/useAssistant.js
import { useState, useCallback, useEffect } from 'react';

export const useAssistant = (formData, calculations) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showAssistant, setShowAssistant] = useState(true);

  // ✅ Análisis de datos de MERCADO
  const analyzeMarket = useCallback((marketData, marketCalculations) => {
    const suggestions = [];
    
    if (marketData.marketSize > 0) {
      // Tamaño de mercado
      if (marketData.marketSize < 1000) {
        suggestions.push({
          type: 'warning',
          field: 'marketSize',
          message: 'Mercado muy pequeño detectado',
          description: `Tu mercado objetivo de ${marketData.marketSize.toLocaleString()} unidades podría ser insuficiente para un negocio sostenible.`,
          suggestions: [
            'Considera expandir tu mercado objetivo',
            'Evalúa nichos de mercado adicionales',
            'Revisa tu propuesta de valor para atraer más clientes'
          ],
          benchmark: 'Mercados viables usualmente superan las 5,000 unidades'
        });
      } else if (marketData.marketSize > 100000) {
        suggestions.push({
          type: 'info',
          field: 'marketSize',
          message: 'Mercado muy grande identificado',
          description: `Un mercado de ${marketData.marketSize.toLocaleString()} unidades ofrece gran potencial pero también mayor competencia.`,
          suggestions: [
            'Considera segmentar tu mercado objetivo',
            'Enfócate en un nicho específico dentro del mercado',
            'Desarrolla una propuesta de valor diferenciada'
          ]
        });
      }

      // Crecimiento del mercado
      if (marketData.marketGrowth < 5) {
        suggestions.push({
          type: 'warning',
          field: 'marketGrowth',
          message: 'Crecimiento de mercado bajo',
          description: `Una tasa de crecimiento del ${marketData.marketGrowth}% anual indica un mercado maduro o en declive.`,
          suggestions: [
            'Busca mercados alternativos con mayor crecimiento',
            'Innovación en productos/servicios para estimular demanda',
            'Estrategias agresivas de captación de mercado'
          ],
          benchmark: 'Mercados atractivos suelen crecer >8% anual'
        });
      } else if (marketData.marketGrowth > 15) {
        suggestions.push({
          type: 'success',
          field: 'marketGrowth',
          message: 'Excelente crecimiento de mercado',
          description: `¡Un crecimiento del ${marketData.marketGrowth}% anual es muy prometedor!`,
          suggestions: [
            'Capitaliza el momentum del mercado',
            'Invierte en expansión temprana',
            'Establece barreras de entrada rápidamente'
          ]
        });
      }

      // Participación de mercado
      if (marketData.marketShare > 20) {
        suggestions.push({
          type: 'warning',
          field: 'marketShare',
          message: 'Participación de mercado muy ambiciosa',
          description: `Capturar el ${marketData.marketShare}% del mercado puede ser difícil de alcanzar.`,
          suggestions: [
            'Considera una participación más realista (5-15%)',
            'Enfócate en segmentos específicos primero',
            'Desarrolla ventajas competitivas sostenibles'
          ],
          benchmark: 'Startups usualmente capturan 1-5% inicialmente'
        });
      }
    }

    // ✅ USAR CÁLCULOS para recomendaciones más inteligentes
    if (marketCalculations) {
      if (!marketCalculations.viable && marketCalculations.score < 50) {
        suggestions.push({
          type: 'warning',
          field: 'market',
          message: 'Baja viabilidad de mercado',
          description: `Tu puntuación de mercado es ${marketCalculations.score}/100. Necesitas mejorar varios aspectos.`,
          suggestions: [
            'Revisa el tamaño y crecimiento de tu mercado',
            'Analiza mejor a tu competencia',
            'Considera ajustar tu propuesta de valor'
          ]
        });
      }

      if (marketCalculations.level === 'Excelente') {
        suggestions.push({
          type: 'success',
          field: 'market',
          message: '¡Excelente potencial de mercado!',
          description: `Con ${marketCalculations.score}/100 puntos, tu mercado tiene gran potencial.`,
          suggestions: [
            'Enfócate en ejecutar tu estrategia de entrada',
            'Capitaliza las oportunidades identificadas',
            'Mantén tu ventaja competitiva'
          ]
        });
      }
    }

    return suggestions;
  }, []);

  // ✅ Análisis de datos FINANCIEROS
  const analyzeFinancial = useCallback((financialData, financialCalculations) => {
    const suggestions = [];
    
    if (financialData.investment > 0) {
      // Inversión vs Ingresos
      const revenue = financialData.projectedRevenue || 0;
      if (revenue > 0 && financialData.investment > revenue * 3) {
        suggestions.push({
          type: 'warning',
          field: 'investment',
          message: 'Inversión muy alta vs ingresos proyectados',
          description: `Tu inversión de $${financialData.investment.toLocaleString()} es ${(financialData.investment / revenue).toFixed(1)}x tus ingresos anuales proyectados.`,
          suggestions: [
            'Considera reducir costos iniciales',
            'Busca formas de incrementar ingresos proyectados',
            'Evalúa financiamiento escalonado'
          ],
          benchmark: 'Inversión ideal: 1-2x ingresos anuales proyectados'
        });
      }

      // Tasa de descuento
      if (financialData.discountRate > 15) {
        suggestions.push({
          type: 'warning',
          field: 'discountRate',
          message: 'Tasa de descuento muy alta',
          description: `Una tasa del ${financialData.discountRate}% indica alto riesgo percibido.`,
          suggestions: [
            'Reevalúa los riesgos del proyecto',
            'Considera estrategias de mitigación de riesgo',
            'Busca tasas de referencia del sector'
          ],
          benchmark: 'Tasas típicas: 8-12% para proyectos estables'
        });
      }
    }

    // ✅ USAR CÁLCULOS FINANCIEROS
    if (financialCalculations) {
      // Análisis de VAN
      if (financialCalculations.npv < 0) {
        suggestions.push({
          type: 'warning',
          field: 'financial',
          message: 'Valor Actual Neto (VAN) negativo',
          description: `Un VAN de $${financialCalculations.npv?.toLocaleString()} indica que el proyecto no es financieramente viable.`,
          suggestions: [
            'Revisa tus proyecciones de ingresos',
            'Considera reducir costos operativos',
            'Evalúa aumentar el precio o volumen de ventas'
          ]
        });
      } else if (financialCalculations.npv > 10000) {
        suggestions.push({
          type: 'success',
          field: 'financial',
          message: '¡Excelente VAN!',
          description: `Un VAN de $${financialCalculations.npv?.toLocaleString()} indica alta rentabilidad.`,
          suggestions: [
            'Considera acelerar la implementación',
            'Evalúa oportunidades de expansión',
            'Mantén un control estricto de costos'
          ]
        });
      }

      // Análisis de TIR
      if (financialCalculations.irr < 0.08) {
        suggestions.push({
          type: 'warning',
          field: 'financial',
          message: 'Tasa Interna de Retorno (TIR) baja',
          description: `Una TIR del ${(financialCalculations.irr * 100).toFixed(1)}% está por debajo del mínimo recomendado.`,
          suggestions: [
            'Mejora la eficiencia operativa',
            'Busca reducir la inversión inicial',
            'Incrementa los márgenes de ganancia'
          ],
          benchmark: 'TIR mínima recomendada: 8%'
        });
      }
    }

    return suggestions;
  }, []);

  // ✅ Análisis de datos TÉCNICOS
  const analyzeTechnical = useCallback((technicalData, technicalCalculations) => {
    const suggestions = [];
    
    // Tiempo de implementación
    if (technicalData.implementationTime > 12) {
      suggestions.push({
        type: 'warning',
        field: 'implementationTime',
        message: 'Tiempo de implementación muy extenso',
        description: `${technicalData.implementationTime} meses puede ser demasiado para mantener el momentum.`,
        suggestions: [
          'Considera un MVP (Producto Mínimo Viable)',
          'Divide el proyecto en fases más cortas',
          'Evalúa outsourcing para acelerar'
        ],
        benchmark: 'Proyectos ágiles: 3-6 meses para MVP'
      });
    }

    // Complejidad técnica
    if (technicalData.complexity > 7) {
      suggestions.push({
        type: 'warning',
        field: 'complexity',
        message: 'Alta complejidad técnica detectada',
        description: `Una complejidad de ${technicalData.complexity}/10 requiere equipo especializado.`,
        suggestions: [
          'Asegura tener el talento técnico necesario',
          'Considera simplificar el producto inicial',
          'Planifica testing exhaustivo'
        ]
      });
    }

    // ✅ USAR CÁLCULOS TÉCNICOS
    if (technicalCalculations) {
      if (!technicalCalculations.viable) {
        suggestions.push({
          type: 'warning',
          field: 'technical',
          message: 'Problemas de viabilidad técnica',
          description: `Tu puntuación técnica es ${technicalCalculations.score}/100. Revisa los recursos necesarios.`,
          suggestions: [
            'Evalúa la capacidad de tu equipo actual',
            'Considera contratar talento especializado',
            'Revisa los tiempos de implementación'
          ]
        });
      }

      if (technicalCalculations.score > 80) {
        suggestions.push({
          type: 'success',
          field: 'technical',
          message: '¡Excelente viabilidad técnica!',
          description: `Con ${technicalCalculations.score}/100 puntos, tienes una base técnica sólida.`,
          suggestions: [
            'Enfócate en la ejecución del plan',
            'Mantén la calidad técnica del producto',
            'Planifica escalabilidad futura'
          ]
        });
      }
    }

    return suggestions;
  }, []);

  // ✅ Análisis de datos LEGALES
  const analyzeLegal = useCallback((legalData, legalCalculations) => {
    const suggestions = [];
    
    // Riesgos legales
    if (legalData.legalRisks > 5) {
      suggestions.push({
        type: 'warning',
        field: 'legalRisks',
        message: 'Alto nivel de riesgo legal identificado',
        description: `Un riesgo de ${legalData.legalRisks}/10 requiere atención inmediata.`,
        suggestions: [
          'Consulta con un abogado especializado',
          'Desarrolla un plan de mitigación de riesgos',
          'Considera seguros de responsabilidad'
        ]
      });
    }

    // Tiempo de trámites
    if (legalData.processingTime > 6) {
      suggestions.push({
        type: 'info',
        field: 'processingTime',
        message: 'Tiempos de trámite extensos',
        description: `${legalData.processingTime} meses para trámites puede retrasar tu lanzamiento.`,
        suggestions: [
          'Inicia trámites con anticipación',
          'Considera asesores especializados en trámites',
          'Planifica financiamiento para este período'
        ]
      });
    }

    // ✅ USAR CÁLCULOS LEGALES
    if (legalCalculations) {
      if (!legalCalculations.viable) {
        suggestions.push({
          type: 'warning',
          field: 'legal',
          message: 'Problemas de viabilidad legal',
          description: `Tu puntuación legal es ${legalCalculations.score}/100. Revisa los requisitos legales.`,
          suggestions: [
            'Verifica todos los permisos necesarios',
            'Consulta con un experto legal',
            'Desarrolla un plan de cumplimiento normativo'
          ]
        });
      }
    }

    return suggestions;
  }, []);

  // ✅ Análisis de VIABILIDAD GENERAL
  const analyzeOverallFeasibility = useCallback((allCalculations) => {
    const suggestions = [];
    
    if (!allCalculations) return suggestions;

    // Calcular puntuación general promedio
    const scores = {
      market: allCalculations.market?.score || 0,
      technical: allCalculations.technical?.score || 0,
      financial: allCalculations.financial?.score || 0,
      legal: allCalculations.legal?.score || 0
    };

    const averageScore = (scores.market + scores.technical + scores.financial + scores.legal) / 4;

    // Recomendaciones basadas en el score general
    if (averageScore < 50) {
      suggestions.push({
        type: 'warning',
        field: 'overall',
        message: 'Viabilidad general baja',
        description: `Puntuación promedio: ${Math.round(averageScore)}/100. El proyecto necesita mejoras significativas.`,
        suggestions: [
          'Enfócate en los aspectos con menor puntuación',
          'Revisa tus suposiciones y datos',
          'Considera pivotar o ajustar el concepto'
        ]
      });
    } else if (averageScore > 75) {
      suggestions.push({
        type: 'success',
        field: 'overall',
        message: '¡Excelente viabilidad general!',
        description: `Puntuación promedio: ${Math.round(averageScore)}/100. El proyecto tiene alto potencial.`,
        suggestions: [
          'Avanza con la planificación detallada',
          'Prepara el plan de implementación',
          'Considera buscar financiamiento o socios'
        ]
      });
    }

    // Identificar áreas débiles
    const weakestArea = Object.entries(scores).reduce((weakest, [area, score]) => 
      score < scores[weakest] ? area : weakest, 'market'
    );

    if (scores[weakestArea] < 60) {
      suggestions.push({
        type: 'info',
        field: weakestArea,
        message: `Área de mejora: ${weakestArea}`,
        description: `Tu ${weakestArea} tiene la puntuación más baja (${scores[weakestArea]}/100).`,
        suggestions: [
          `Enfócate en mejorar el análisis de ${weakestArea}`,
          'Revisa los datos y suposiciones en esta área',
          'Busca asesoría especializada si es necesario'
        ]
      });
    }

    return suggestions;
  }, []);

  // ✅ Análisis principal que se ejecuta cuando cambian los datos
  useEffect(() => {
    const allSuggestions = [
      ...analyzeMarket(formData.market || {}, calculations?.market),
      ...analyzeFinancial(formData.financial || {}, calculations?.financial),
      ...analyzeTechnical(formData.technical || {}, calculations?.technical),
      ...analyzeLegal(formData.legal || {}, calculations?.legal),
      ...analyzeOverallFeasibility(calculations)
    ];

    setSuggestions(allSuggestions);
  }, [formData, calculations, analyzeMarket, analyzeFinancial, analyzeTechnical, analyzeLegal, analyzeOverallFeasibility]);

  const dismissSuggestion = useCallback((index) => {
    setSuggestions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleAssistant = useCallback(() => {
    setShowAssistant(prev => !prev);
  }, []);

  return {
    suggestions,
    showAssistant,
    toggleAssistant,
    dismissSuggestion,
    hasSuggestions: suggestions.length > 0
  };
};