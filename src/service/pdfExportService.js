// src/services/pdfExportService.js (VERSIÓN ACTUALIZADA)
import jsPDF from 'jspdf';

export const PDFExportService = {
  async exportProjectToPDF(projectData, formData, calculations) {
    console.log('📊 Iniciando exportación PDF con datos:', {
      projectData,
      formDataKeys: Object.keys(formData),
      calculationsKeys: Object.keys(calculations)
    });

    try {
      // ✅ CREAR DOCUMENTO PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // ✅ CONFIGURACIÓN DE ESTILOS
      const styles = {
        title: { size: 16, style: 'bold' },
        subtitle: { size: 14, style: 'bold' },
        section: { size: 12, style: 'bold' },
        normal: { size: 10, style: 'normal' },
        small: { size: 8, style: 'normal' }
      };

      // ✅ FUNCIÓN PARA AGREGAR PÁGINAS
      const addNewPage = () => {
        doc.addPage();
        yPosition = 20;
      };

      // ✅ FUNCIÓN PARA AGREGAR TEXTO
      const addText = (text, style, x = 20, lineHeight = 7) => {
        doc.setFontSize(style.size);
        doc.setFont('helvetica', style.style);
        doc.text(text, x, yPosition);
        yPosition += lineHeight;
      };

      // ✅ FUNCIÓN PARA VERIFICAR ESPACIO
      const checkSpace = (neededSpace = 50) => {
        if (yPosition > doc.internal.pageSize.getHeight() - neededSpace) {
          addNewPage();
          return true;
        }
        return false;
      };

      // ========== PORTADA ==========
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('INFORME DE FACTIBILIDAD', pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text(projectData.name || 'Proyecto Sin Nombre', pageWidth / 2, 45, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, pageWidth / 2, 55, { align: 'center' });

      yPosition = 80;
      doc.setTextColor(0, 0, 0);

      // ========== RESUMEN EJECUTIVO ==========
      addText('RESUMEN EJECUTIVO', styles.title);
      yPosition += 5;

      const viabilityStatus = calculations.overall?.viable ? 'VIABLE' : 'NO VIABLE';
      const viabilityColor = calculations.overall?.viable ? [46, 204, 113] : [231, 76, 60];
      
      addText(`Estado del Proyecto: ${viabilityStatus}`, styles.subtitle);
      addText(`Puntuación General: ${calculations.overall?.score?.toFixed(1) || 0}%`, styles.normal);
      addText(`Fecha de Análisis: ${new Date().toLocaleDateString()}`, styles.normal);
      
      yPosition += 10;

      // ========== INDICADORES CLAVE ==========
      if (checkSpace(30)) addNewPage();
      
      addText('INDICADORES CLAVE', styles.subtitle);
      yPosition += 5;

      const keyIndicators = [
        ['💰 VPN', `$${this.formatCurrency(calculations.financial?.npv || 0)}`],
        ['📊 TIR', `${calculations.financial?.irr?.toFixed(1) || 0}%`],
        ['⏱️ Payback', `${calculations.financial?.paybackPeriod || 0} meses`],
        ['🎯 Rentabilidad', `${calculations.financial?.profitabilityIndex?.toFixed(2) || 0}`],
        ['⚡ Viabilidad Técnica', calculations.technical?.viable ? '✅' : '❌'],
        ['📈 Viabilidad Mercado', calculations.market?.viable ? '✅' : '❌']
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Indicador', 'Valor']],
        body: keyIndicators,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // ========== ANÁLISIS FINANCIERO ==========
      if (checkSpace(100)) addNewPage();
      
      addText('ANÁLISIS FINANCIERO', styles.title);
      yPosition += 10;

      if (formData.financial) {
        // Inversión inicial
        addText('Inversión Requerida', styles.section);
        const investmentData = [
          ['Concepto', 'Monto'],
          ['Inversión Fija', this.formatCurrency(formData.financial.fixedInvestment || 0)],
          ['Capital de Trabajo', this.formatCurrency(formData.financial.workingCapital || 0)],
          ['Gastos Preoperativos', this.formatCurrency(formData.financial.preOperatingExpenses || 0)],
          ['TOTAL', this.formatCurrency(
            (formData.financial.fixedInvestment || 0) +
            (formData.financial.workingCapital || 0) +
            (formData.financial.preOperatingExpenses || 0)
          )]
        ];

        doc.autoTable({
          startY: yPosition,
          body: investmentData,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [52, 152, 219] },
          margin: { left: 20, right: 20 }
        });

        yPosition = doc.lastAutoTable.finalY + 10;

        // Proyecciones de ingresos
        if (formData.financial.monthlyRevenue) {
          addText('Proyección de Ingresos Mensuales', styles.section);
          const revenueData = [
            ['Mes', 'Ingresos Estimados'],
            ...Array.from({ length: 12 }, (_, i) => [
              `Mes ${i + 1}`,
              this.formatCurrency(formData.financial.monthlyRevenue * (1 + (formData.financial.monthlyGrowthRate || 0)) ** i)
            ])
          ];

          doc.autoTable({
            startY: yPosition,
            body: revenueData,
            styles: { fontSize: 8 },
            margin: { left: 20, right: 20 }
          });

          yPosition = doc.lastAutoTable.finalY + 15;
        }
      }

      // ========== ANÁLISIS TÉCNICO ==========
      if (checkSpace(50)) addNewPage();
      
      addText('ANÁLISIS TÉCNICO', styles.title);
      yPosition += 10;

      if (formData.technical) {
        const technicalPoints = [
          ['📍 Localización', formData.technical.location || 'No especificada'],
          ['🏭 Capacidad', formData.technical.capacity || 'No especificada'],
          ['🔧 Tecnología', formData.technical.technologyLevel || 'No especificada'],
          ['⏱️ Tiempo Implementación', `${formData.technical.implementationTime || 0} meses`],
          ['👥 Recursos Humanos', formData.technical.requiredStaff || 'No especificado']
        ].filter(([_, value]) => value && value !== 'No especificada');

        if (technicalPoints.length > 0) {
          doc.autoTable({
            startY: yPosition,
            head: [['Aspecto', 'Detalle']],
            body: technicalPoints,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [52, 152, 219] },
            margin: { left: 20, right: 20 }
          });

          yPosition = doc.lastAutoTable.finalY + 15;
        }
      }

      // ========== ANÁLISIS DE MERCADO ==========
      if (checkSpace(50)) addNewPage();
      
      addText('ANÁLISIS DE MERCADO', styles.title);
      yPosition += 10;

      if (formData.market) {
        const marketData = [
          ['Mercado Objetivo', formData.market.targetMarket || 'No especificado'],
          ['Tamaño del Mercado', formData.market.marketSize || 'No especificado'],
          ['Crecimiento Anual', `${formData.market.growthRate || 0}%`],
          ['Competencia Directa', formData.market.directCompetitors || 'No especificada'],
          ['Ventaja Competitiva', formData.market.competitiveAdvantage || 'No especificada']
        ].filter(([_, value]) => value && value !== 'No especificado');

        if (marketData.length > 0) {
          doc.autoTable({
            startY: yPosition,
            head: [['Factor', 'Valor']],
            body: marketData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [52, 152, 219] },
            margin: { left: 20, right: 20 }
          });

          yPosition = doc.lastAutoTable.finalY + 15;
        }
      }

      // ========== RECOMENDACIONES ==========
      if (checkSpace(50)) addNewPage();
      
      addText('RECOMENDACIONES Y CONCLUSIONES', styles.title);
      yPosition += 10;

      const recommendations = this.generateRecommendations(calculations, formData);
      
      recommendations.forEach((rec, index) => {
        if (checkSpace(20)) addNewPage();
        
        addText(`${index + 1}. ${rec.title}`, styles.section);
        addText(rec.description, styles.normal);
        addText(`Impacto: ${rec.impact}`, { ...styles.small, style: 'italic' });
        yPosition += 5;
      });

      // ========== FIRMA ==========
      if (checkSpace(30)) addNewPage();
      
      yPosition += 20;
      addText('_________________________', styles.normal, pageWidth / 2 - 40);
      addText('Firma del Analista', styles.normal, pageWidth / 2 - 30);

      // ✅ GUARDAR PDF
      const fileName = `Informe_Factibilidad_${projectData.name || 'Proyecto'}_${new Date().getTime()}.pdf`;
      doc.save(fileName);

      console.log('✅ PDF exportado exitosamente:', fileName);
      return true;

    } catch (error) {
      console.error('❌ Error en exportación PDF:', error);
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  },

  // ✅ FUNCIÓN PARA FORMATEAR MONEDA
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  // ✅ FUNCIÓN PARA GENERAR RECOMENDACIONES
  generateRecommendations(calculations, formData) {
    const recommendations = [];

    // Recomendaciones financieras
    if (calculations.financial) {
      if (calculations.financial.npv < 0) {
        recommendations.push({
          title: 'Optimizar Estructura de Costos',
          description: 'El VPN negativo indica que los costos superan los beneficios esperados. Considere reducir costos fijos o incrementar ingresos.',
          impact: 'ALTO'
        });
      }

      if (calculations.financial.paybackPeriod > 36) {
        recommendations.push({
          title: 'Reducir Período de Recuperación',
          description: 'El período de recuperación es mayor a 3 años. Evalúe estrategias para acelerar el retorno de la inversión.',
          impact: 'MEDIO'
        });
      }
    }

    // Recomendaciones técnicas
    if (calculations.technical && !calculations.technical.viable) {
      recommendations.push({
        title: 'Fortalecer Capacidad Técnica',
        description: 'Se identificaron limitaciones técnicas. Considere alianzas estratégicas o inversión en capacitación.',
        impact: 'ALTO'
      });
    }

    // Recomendaciones de mercado
    if (calculations.market) {
      if (calculations.market.competitionLevel === 'high') {
        recommendations.push({
          title: 'Diferenciación en el Mercado',
          description: 'Alta competencia detectada. Desarrolle una propuesta de valor única y estrategias de diferenciación.',
          impact: 'MEDIO'
        });
      }
    }

    // Recomendación general basada en viabilidad
    if (!calculations.overall?.viable) {
      recommendations.push({
        title: 'Revisión Integral del Proyecto',
        description: 'El proyecto no cumple con los criterios mínimos de viabilidad. Se recomienda una revisión profunda antes de continuar.',
        impact: 'CRÍTICO'
      });
    } else {
      recommendations.push({
        title: 'Proceder con Implementación',
        description: 'El proyecto muestra viabilidad en todas las áreas evaluadas. Puede proceder con la fase de implementación.',
        impact: 'POSITIVO'
      });
    }

    return recommendations;
  }
};

export default PDFExportService;