// src/components/actions/ExportPDFButton.jsx (VERSIÓN ACTUALIZADA)
import React, { useState } from 'react';
import { PDFExportService } from '../../service/pdfExportService';
import '../../styles/components/actions/ExportPDFButton.css';

export const ExportPDFButton = ({ 
  projectData, 
  formData, 
  calculations, 
  disabled = false,
  size = 'medium' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    if (!calculations || isExporting) return;
    
    setIsExporting(true);
    setProgress(0);
    
    try {
      console.log('📤 Iniciando exportación PDF...', {
        project: projectData?.name,
        tieneFormData: !!formData,
        tieneCalculations: !!calculations
      });

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      // ✅ LLAMAR AL SERVICIO ACTUALIZADO
      await PDFExportService.exportProjectToPDF(projectData, formData, calculations);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Feedback de éxito
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 800);
      
    } catch (error) {
      console.error('❌ Error al exportar PDF:', error);
      setIsExporting(false);
      setProgress(0);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  const getButtonText = () => {
    if (isExporting) return `Generando... ${progress}%`;
    if (!calculations) return 'Completa el análisis primero';
    return 'Exportar a PDF';
  };

  return (
    <button
      className={`export-pdf-button ${isExporting ? 'exporting' : ''} ${disabled ? 'disabled' : ''} ${size}`}
      onClick={handleExport}
      disabled={disabled || isExporting || !calculations}
      title={!calculations ? "Complete el análisis para exportar" : "Exportar informe completo a PDF"}
    >
      <span className="export-pdf-button-content">
        <span className="export-pdf-button-icon">
          {isExporting ? '⏳' : '📄'}
        </span>
        <span className="export-pdf-button-text">
          {getButtonText()}
        </span>
      </span>
      
      {isExporting && (
        <div className="export-progress-bar">
          <div 
            className="export-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {!disabled && calculations && !isExporting && (
        <span className="export-pdf-button-badge">
          Informe Completo
        </span>
      )}
    </button>
  );
};