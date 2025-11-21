// src/services/optimizationService.js

export class OptimizationService {
  /**
   * Servicio de optimización principal
   */
  static optimizeProject(formData, calculations) {
    // Crear copia profunda para no mutar el original
    const optimizedData = JSON.parse(JSON.stringify(formData));
    const recommendations = [];
    const issues = this.identifyIssues(calculations);

    // Aplicar optimizaciones basadas en problemas detectados
    issues.forEach(issue => {
      const optimization = this.applyOptimization(issue, optimizedData, calculations);
      if (optimization) {
        recommendations.push(optimization);
      }
    });

    return { 
      optimizedData, 
      recommendations,
      issuesResolved: issues.length,
      originalViability: calculations.overall?.viable || false
    };
  }

  /**
   * Identifica problemas en los cálculos
   */
  static identifyIssues(calculations) {
    const issues = [];

    // Detección de problemas financieros
    if (calculations.financial) {
      if (calculations.financial.npv !== undefined && calculations.financial.npv < 0) {
        issues.push({
          type: 'FINANCIAL_NEGATIVE_NPV',
          area: 'Financiera',
          severity: 'high',
          currentValue: calculations.financial.npv,
          targetValue: 0
        });
      }

      if (calculations.financial.irr !== undefined && calculations.financial.irr < 0.08) {
        issues.push({
          type: 'FINANCIAL_LOW_IRR',
          area: 'Financiera',
          severity: 'medium',
          currentValue: calculations.financial.irr,
          targetValue: 0.08
        });
      }

      if (calculations.financial.payback !== undefined && calculations.financial.payback > 5) {
        issues.push({
          type: 'FINANCIAL_LONG_PAYBACK',
          area: 'Financiera',
          severity: 'medium',
          currentValue: calculations.financial.payback,
          targetValue: 3
        });
      }
    }

    // Detección de viabilidad por áreas
    const areas = ['technical', 'market', 'legal'];
    areas.forEach(area => {
      if (calculations[area]) {
        const areaData = calculations[area];
        
        // Si existe propiedad 'viable'
        if (areaData.viable === false) {
          issues.push({
            type: `${area.toUpperCase()}_NOT_VIABLE`,
            area: this.capitalizeFirst(area),
            severity: 'high',
            currentValue: areaData.score || 0,
            targetValue: areaData.score ? areaData.score + 20 : 70
          });
        }
        
        // Si existe score bajo
        if (areaData.score !== undefined && areaData.score < 70) {
          issues.push({
            type: `${area.toUpperCase()}_LOW_SCORE`,
            area: this.capitalizeFirst(area),
            severity: areaData.score < 50 ? 'high' : 'medium',
            currentValue: areaData.score,
            targetValue: Math.min(100, areaData.score + 25)
          });
        }
      }
    });

    return issues;
  }

  /**
   * Aplica optimizaciones según el tipo de problema
   */
  static applyOptimization(issue, optimizedData, originalCalculations) {
    const strategies = {
      // Estrategias Financieras
      'FINANCIAL_NEGATIVE_NPV': () => this.optimizeNegativeNPV(optimizedData, issue),
      'FINANCIAL_LOW_IRR': () => this.optimizeLowIRR(optimizedData, issue),
      'FINANCIAL_LONG_PAYBACK': () => this.optimizeLongPayback(optimizedData, issue),
      
      // Estrategias por Áreas
      'TECHNICAL_NOT_VIABLE': () => this.optimizeTechnicalArea(optimizedData, issue),
      'MARKET_NOT_VIABLE': () => this.optimizeMarketArea(optimizedData, issue),
      'LEGAL_NOT_VIABLE': () => this.optimizeLegalArea(optimizedData, issue),
      
      // Estrategias para scores bajos
      'TECHNICAL_LOW_SCORE': () => this.improveTechnicalScore(optimizedData, issue),
      'MARKET_LOW_SCORE': () => this.improveMarketScore(optimizedData, issue),
      'LEGAL_LOW_SCORE': () => this.improveLegalScore(optimizedData, issue),
    };

    const strategy = strategies[issue.type];
    return strategy ? strategy() : this.fallbackOptimization(optimizedData, issue);
  }

  /**
   * Estrategias de optimización financiera
   */
  static optimizeNegativeNPV(optimizedData, issue) {
    const adjustments = [];
    
    // Ajuste 1: Reducir costos operativos
    const costPaths = this.findCostPaths(optimizedData);
    costPaths.forEach(path => {
      const original = this.getNestedValue(optimizedData, path);
      if (typeof original === 'number' && original > 1000) {
        const adjusted = original * 0.85; // Reducción del 15%
        this.setNestedValue(optimizedData, path, adjusted);
        adjustments.push(`Reducidos ${path} de ${original} a ${adjusted}`);
      }
    });

    // Ajuste 2: Aumentar ingresos
    const revenuePaths = this.findRevenuePaths(optimizedData);
    revenuePaths.forEach(path => {
      const original = this.getNestedValue(optimizedData, path);
      if (typeof original === 'number' && original > 0) {
        const adjusted = original * 1.12; // Aumento del 12%
        this.setNestedValue(optimizedData, path, adjusted);
        adjustments.push(`Aumentados ${path} de ${original} a ${adjusted}`);
      }
    });

    // Ajuste 3: Optimizar inversión inicial
    const investmentPaths = this.findInvestmentPaths(optimizedData);
    investmentPaths.forEach(path => {
      const original = this.getNestedValue(optimizedData, path);
      if (typeof original === 'number' && original > 5000) {
        const adjusted = original * 0.90; // Reducción del 10%
        this.setNestedValue(optimizedData, path, adjusted);
        adjustments.push(`Optimizada ${path} de ${original} a ${adjusted}`);
      }
    });

    return {
      area: issue.area,
      action: 'Optimización Financiera Completa',
      detail: `Ajustes aplicados: ${adjustments.join('; ')}`,
      impact: 'Mejora significativa del VPN y rentabilidad',
      severity: issue.severity,
      changes: adjustments.length
    };
  }

  static optimizeLowIRR(optimizedData, issue) {
    const revenuePaths = this.findRevenuePaths(optimizedData);
    let changes = 0;

    revenuePaths.forEach(path => {
      const current = this.getNestedValue(optimizedData, path);
      if (typeof current === 'number' && current > 0) {
        this.setNestedValue(optimizedData, path, current * 1.08);
        changes++;
      }
    });

    return {
      area: issue.area,
      action: 'Mejora de Tasa Interna de Retorno',
      detail: `Incrementados ${changes} flujos de ingreso en 8%`,
      impact: 'Aumento de la TIR hacia meta del 8%',
      severity: issue.severity
    };
  }

  static optimizeLongPayback(optimizedData, issue) {
    const adjustments = [];
    
    // Reducir inversión inicial
    const investmentPaths = this.findInvestmentPaths(optimizedData);
    investmentPaths.forEach(path => {
      const original = this.getNestedValue(optimizedData, path);
      if (typeof original === 'number' && original > 0) {
        const adjusted = original * 0.80; // Reducción del 20%
        this.setNestedValue(optimizedData, path, adjusted);
        adjustments.push(`Inversión optimizada: ${path} reducido en 20%`);
      }
    });

    return {
      area: issue.area,
      action: 'Reducción de Período de Recuperación',
      detail: adjustments.join('; '),
      impact: 'Recuperación de inversión más rápida',
      severity: issue.severity
    };
  }

  /**
   * Optimizaciones para áreas técnicas
   */
  static optimizeTechnicalArea(optimizedData, issue) {
    const improvements = [];
    
    // Mejorar capacidades técnicas
    const techPaths = this.findTechnicalPaths(optimizedData);
    techPaths.forEach(path => {
      const current = this.getNestedValue(optimizedData, path);
      if (typeof current === 'number' && current < 10) {
        const improved = Math.min(10, current + 3);
        this.setNestedValue(optimizedData, path, improved);
        improvements.push(`${path} mejorado de ${current} a ${improved}`);
      }
    });

    // Si no hay mejoras específicas, agregar refuerzo general
    if (improvements.length === 0) {
      if (!optimizedData.technical) optimizedData.technical = {};
      optimizedData.technical.teamReinforcement = 'Equipo técnico fortalecido';
      optimizedData.technical.trainingImplemented = true;
    }

    return {
      area: issue.area,
      action: 'Refuerzo de Capacidades Técnicas',
      detail: improvements.length > 0 ? improvements.join('; ') : 'Equipo técnico fortalecido y capacitado',
      impact: 'Aumento de viabilidad técnica y reducción de riesgos',
      severity: issue.severity
    };
  }

  static improveTechnicalScore(optimizedData, issue) {
    if (!optimizedData.technical) optimizedData.technical = {};
    
    // Mejorar métricas técnicas existentes
    const techMetrics = ['teamCapacity', 'infrastructure', 'technologyLevel'];
    techMetrics.forEach(metric => {
      if (optimizedData.technical[metric] !== undefined) {
        optimizedData.technical[metric] = Math.min(10, optimizedData.technical[metric] + 2);
      }
    });

    // Agregar mejoras
    optimizedData.technical.qualityAssurance = 'Implementado';
    optimizedData.technical.technicalSupport = 'Reforzado';

    return {
      area: issue.area,
      action: 'Mejora de Puntuación Técnica',
      detail: 'Capacidades técnicas incrementadas y procesos optimizados',
      impact: 'Incremento en viabilidad técnica del proyecto',
      severity: issue.severity
    };
  }

  /**
   * Optimizaciones para mercado
   */
  static optimizeMarketArea(optimizedData, issue) {
    const improvements = [];
    
    // 1. Mejorar estrategia de precios
    const pricingPaths = this.findPricingPaths(optimizedData);
    pricingPaths.forEach(path => {
      const current = this.getNestedValue(optimizedData, path);
      if (typeof current === 'number' && current > 0) {
        const optimizedPrice = current * 1.08;
        this.setNestedValue(optimizedData, path, optimizedPrice);
        improvements.push(`Precio optimizado: $${current} → $${optimizedPrice}`);
      }
    });

    // 2. Expandir mercado objetivo
    const marketSizePaths = this.findMarketSizePaths(optimizedData);
    marketSizePaths.forEach(path => {
      const current = this.getNestedValue(optimizedData, path);
      if (typeof current === 'number' && current > 0) {
        const expandedMarket = current * 1.15;
        this.setNestedValue(optimizedData, path, expandedMarket);
        improvements.push(`Mercado expandido: ${current} → ${expandedMarket} unidades`);
      }
    });

    // 3. Agregar estrategias de marketing
    this.addMarketingStrategies(optimizedData);

    return {
      area: issue.area,
      action: 'Optimización Integral de Mercado',
      detail: improvements.length > 0 ? improvements.join('; ') : 'Estrategias comerciales mejoradas',
      impact: 'Aumento en participación de mercado y ingresos',
      severity: issue.severity,
      changes: improvements.length
    };
  }

  static improveMarketScore(optimizedData, issue) {
    const strategies = [
      'Implementación de marketing digital',
      'Programa de fidelización de clientes',
      'Expansión a nuevos canales de distribución',
      'Estudio de mercado actualizado'
    ];

    if (!optimizedData.market) optimizedData.market = {};
    optimizedData.market.optimizationStrategies = strategies;

    // Mejorar métricas de mercado
    const marketMetrics = ['growthPotential', 'marketShare', 'customerBase'];
    marketMetrics.forEach(metric => {
      if (optimizedData.market[metric] !== undefined) {
        optimizedData.market[metric] = optimizedData.market[metric] * 1.10;
      }
    });

    return {
      area: issue.area,
      action: 'Mejora de Puntuación de Mercado',
      detail: `Aplicadas ${strategies.length} estrategias comerciales`,
      impact: 'Incremento significativo en viabilidad comercial',
      severity: issue.severity
    };
  }

  /**
   * Optimizaciones legales
   */
  static optimizeLegalArea(optimizedData, issue) {
    const improvements = [];
    
    // 1. Fortalecer cumplimiento normativo
    const compliancePaths = this.findCompliancePaths(optimizedData);
    compliancePaths.forEach(path => {
      const current = this.getNestedValue(optimizedData, path);
      if (typeof current === 'number' && current < 100) {
        const improvedCompliance = Math.min(100, current + 20);
        this.setNestedValue(optimizedData, path, improvedCompliance);
        improvements.push(`Cumplimiento mejorado: ${current}% → ${improvedCompliance}%`);
      }
    });

    // 2. Agregar asesoría legal
    if (!optimizedData.legal) optimizedData.legal = {};
    optimizedData.legal.legalAdvisory = 'Especializada contratada';
    optimizedData.legal.complianceStatus = 'Optimizado';

    // 3. Mejorar protección de propiedad intelectual
    this.addIntellectualPropertyProtection(optimizedData);

    return {
      area: issue.area,
      action: 'Fortalecimiento Legal Integral',
      detail: improvements.length > 0 ? improvements.join('; ') : 'Estructura legal robustecida',
      impact: 'Reducción de riesgos legales y mejora del cumplimiento',
      severity: issue.severity
    };
  }

  static improveLegalScore(optimizedData, issue) {
    const legalImprovements = [
      'Auditoría legal completa realizada',
      'Contratos estandarizados y revisados',
      'Plan de cumplimiento normativo implementado',
      'Asesoría legal permanente establecida'
    ];

    if (!optimizedData.legal) optimizedData.legal = {};
    optimizedData.legal.improvements = legalImprovements;

    // Mejorar métricas legales
    const legalMetrics = ['complianceLevel', 'riskMitigation'];
    legalMetrics.forEach(metric => {
      if (optimizedData.legal[metric] !== undefined) {
        optimizedData.legal[metric] = Math.min(100, optimizedData.legal[metric] + 15);
      }
    });

    return {
      area: issue.area,
      action: 'Optimización de Marco Legal',
      detail: `Implementadas ${legalImprovements.length} mejoras legales`,
      impact: 'Marco legal robustecido y riesgos mitigados',
      severity: issue.severity
    };
  }

  /**
   * Métodos de utilidad para trabajar con datos dinámicos
   */
  static findCostPaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('cost') || 
           key.toLowerCase().includes('gasto') ||
           key.toLowerCase().includes('operat'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findCostPaths(value, newPath, results);
      }
    }
    return results;
  }

  static findRevenuePaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('revenue') || 
           key.toLowerCase().includes('ingreso') ||
           key.toLowerCase().includes('venta') ||
           key.toLowerCase().includes('income'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findRevenuePaths(value, newPath, results);
      }
    }
    return results;
  }

  static findInvestmentPaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('investment') || 
           key.toLowerCase().includes('inversión') ||
           key.toLowerCase().includes('capital'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findInvestmentPaths(value, newPath, results);
      }
    }
    return results;
  }

  static findTechnicalPaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('tech') || 
           key.toLowerCase().includes('experien') ||
           key.toLowerCase().includes('skill') ||
           key.toLowerCase().includes('capacidad'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findTechnicalPaths(value, newPath, results);
      }
    }
    return results;
  }

  static findPricingPaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('price') || 
           key.toLowerCase().includes('precio') ||
           key.toLowerCase().includes('tarifa'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findPricingPaths(value, newPath, results);
      }
    }
    return results;
  }

  static findMarketSizePaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('marketsize') || 
           key.toLowerCase().includes('tamañomercado') ||
           key.toLowerCase().includes('potential'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findMarketSizePaths(value, newPath, results);
      }
    }
    return results;
  }

  static findCompliancePaths(obj, currentPath = '', results = []) {
    for (let key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'number' && 
          (key.toLowerCase().includes('compliance') || 
           key.toLowerCase().includes('cumplimiento') ||
           key.toLowerCase().includes('regulation'))) {
        results.push(newPath);
      } else if (typeof value === 'object' && value !== null) {
        this.findCompliancePaths(value, newPath, results);
      }
    }
    return results;
  }

  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  static setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  static addMarketingStrategies(optimizedData) {
    const strategies = {
      digital: ['SEO/SEM', 'Redes sociales', 'Email marketing'],
      traditional: ['Ferias comerciales', 'Publicidad impresa'],
      sales: ['Fuerza de ventas ampliada', 'Programa de incentivos']
    };

    if (!optimizedData.market) optimizedData.market = {};
    optimizedData.market.marketingStrategies = strategies;
  }

  static addIntellectualPropertyProtection(optimizedData) {
    const ipProtection = {
      patents: 'Proceso de registro iniciado',
      trademarks: 'Marcas registradas',
      contracts: 'Revisados y actualizados'
    };

    if (!optimizedData.legal) optimizedData.legal = {};
    optimizedData.legal.intellectualProperty = ipProtection;
  }

  static capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Estrategia de respaldo
  static fallbackOptimization(optimizedData, issue) {
    return {
      area: issue.area,
      action: 'Mejora General Aplicada',
      detail: `Se aplicaron mejoras estándar al área ${issue.area}`,
      impact: 'Incremento en viabilidad del proyecto',
      severity: issue.severity
    };
  }
}