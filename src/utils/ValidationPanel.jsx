// src/components/ValidationPanel.js (CORREGIDO)
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProjectDetails } from './ProjectDetails';

export const ValidationPanel = ({ project, suggestions, isMasterUser }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // ✅ FUNCIÓN SEGURA PARA CONVERTIR FECHAS
  const safeDateConvert = (dateValue) => {
    if (!dateValue) return null;
    
    // Si ya es una fecha de JavaScript
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    // Si es un Timestamp de Firebase (tiene método toDate)
    if (dateValue && typeof dateValue.toDate === 'function') {
      return dateValue.toDate();
    }
    
    // Si es un string de fecha
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Si es un número (timestamp)
    if (typeof dateValue === 'number') {
      return new Date(dateValue);
    }
    
    console.warn('Formato de fecha no reconocido:', dateValue);
    return null;
  };

  // ✅ FUNCIÓN PARA NORMALIZAR EL PROYECTO ANTES DE PASARLO A ProjectDetails
  const normalizeProjectForDisplay = (project) => {
    if (!project) return null;
    
    return {
      ...project,
      // Normalizar todas las fechas
      creationDate: safeDateConvert(project.creationDate),
      updatedAt: safeDateConvert(project.updatedAt),
      analyzedAt: safeDateConvert(project.analyzedAt),
      notificationSentAt: safeDateConvert(project.notificationSentAt),
      
      // Asegurar que existan campos requeridos
      name: project.name || project.projectName || 'Proyecto Sin Nombre',
      description: project.description || '',
      status: project.status || 'pending',
      
      // Asegurar estructura de cálculos
      calculations: project.calculations || {},
      financial: project.financial || {}
    };
  };

  // PDF Export function
  const exportToPDF = async () => {
    try {
      // ✅ NORMALIZAR EL PROYECTO ANTES DE EXPORTAR
      const normalizedProject = normalizeProjectForDisplay(project);
      
      // Crear elemento temporal para el PDF
      const pdfElement = document.createElement('div');
      pdfElement.style.position = 'absolute';
      pdfElement.style.left = '-9999px';
      pdfElement.style.backgroundColor = 'white';
      pdfElement.style.padding = '20px';
      
      // Renderizar ProjectDetails con el proyecto normalizado
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      
      // Usar ReactDOM para renderizar temporalmente (necesitarás importar ReactDOM)
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      root.render(
        React.createElement(ProjectDetails, { project: normalizedProject })
      );
      
      // Esperar a que se renderice
      await new Promise(resolve => setTimeout(resolve, 500));
      
      pdfElement.innerHTML = tempContainer.innerHTML;
      document.body.appendChild(pdfElement);

      const canvas = await html2canvas(pdfElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Limpiar elementos temporales
      document.body.removeChild(pdfElement);
      root.unmount();
      document.body.removeChild(tempContainer);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const pdfImgWidth = pdfWidth - 20; // Margen de 10mm cada lado
      const pdfImgHeight = pdfImgWidth / ratio;
      
      // Verificar si la imagen cabe en una página
      if (pdfImgHeight > pdfHeight - 20) {
        // Si es muy alta, ajustar para que quepa
        const adjustedHeight = pdfHeight - 20;
        const adjustedWidth = adjustedHeight * ratio;
        pdf.addImage(imgData, 'PNG', 10, 10, adjustedWidth, adjustedHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 10, 10, pdfImgWidth, pdfImgHeight);
      }
      
      // Add suggestions page for master users
      if (isMasterUser && suggestions && suggestions.length > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Sugerencias de Mejora', 10, 20);
        
        let yPosition = 40;
        pdf.setFontSize(12);
        
        suggestions.forEach((suggestion, index) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setTextColor(30, 30, 30);
          const message = `${index + 1}. ${suggestion.mensaje}`;
          pdf.text(message, 10, yPosition);
          yPosition += 10;
          
          pdf.setTextColor(80, 80, 80);
          if (suggestion.sugerencias && suggestion.sugerencias.length > 0) {
            suggestion.sugerencias.forEach((item) => {
              if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
              }
              pdf.text(`   • ${item}`, 15, yPosition);
              yPosition += 8;
            });
          }
          yPosition += 5;
        });
      }
      
      pdf.save(`factibilidad-${normalizedProject.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error generando PDF. Por favor, intente nuevamente.');
    }
  };
  
  const viewDetails = () => {
    // ✅ NORMALIZAR PROYECTO ANTES DE MOSTRAR DETALLES
    const normalizedProject = normalizeProjectForDisplay(project);
    
    // Puedes implementar un modal o navegación aquí
    console.log('Mostrando detalles para:', normalizedProject.name);
    alert(`Mostrando detalles para: ${normalizedProject.name}`);
  };
  
  const renameProject = async () => {
    const newName = prompt("Nuevo nombre del proyecto:", project.name || project.projectName);
    if (newName && newName.trim() !== '') {
      try {
        // Para usuarios master, actualizar en localStorage
        if (isMasterUser) {
          const savedProjects = localStorage.getItem('masterProjects');
          if (savedProjects) {
            const projects = JSON.parse(savedProjects);
            const updatedProjects = projects.map(p => 
              p.id === project.id ? { ...p, name: newName.trim(), projectName: newName.trim() } : p
            );
            localStorage.setItem('masterProjects', JSON.stringify(updatedProjects));
            alert("✅ Proyecto renombrado exitosamente");
            window.location.reload(); // Recargar para ver cambios
          }
        } else {
          // Para usuarios normales, actualizar en Firebase
          await updateDoc(doc(db, "projects", project.id), {
            name: newName.trim(),
            projectName: newName.trim()
          });
          alert("✅ Proyecto renombrado exitosamente");
        }
      } catch (error) {
        console.error("Error renombrando:", error);
        alert("❌ Error renombrando proyecto");
      }
    }
  };

  // ✅ RENDERIZAR ProjectDetails CON PROYECTO NORMALIZADO
  const normalizedProject = normalizeProjectForDisplay(project);

  return (
    <div className="validation-panel" style={{ 
      marginTop: '2rem', 
      padding: '1.5rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      background: '#f8f9fa' 
    }}>
      
      {/* Elemento oculto para PDF con proyecto normalizado */}
      <div style={{ display: 'none' }}>
        <ProjectDetails project={normalizedProject} />
      </div>
      
      <div style={{ 
        padding: '1rem', 
        background: '#d4edda', 
        color: '#155724', 
        borderRadius: '5px',
        marginBottom: '1rem'
      }}>
        ✅ Proyecto guardado exitosamente en la base de datos
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        margin: '1rem 0', 
        flexWrap: 'wrap' 
      }}>
        {isMasterUser && (
          <>
            <button 
              style={{
                padding: '10px 15px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              {showSuggestions ? "👁️ Ocultar" : "💡 Mostrar"} Sugerencias
            </button>
            
            <button 
              style={{
                padding: '10px 15px',
                background: '#ffc107',
                color: '#212529',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={renameProject}
            >
              ✏️ Renombrar
            </button>
          </>
        )}
        
        <button 
          style={{
            padding: '10px 15px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={viewDetails}
        >
          📊 Ver Detalles
        </button>
        
        <button 
          style={{
            padding: '10px 15px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={exportToPDF}
        >
          📄 Exportar PDF
        </button>
      </div>
      
      {/* Mostrar sugerencias para usuarios master */}
      {showSuggestions && isMasterUser && suggestions && suggestions.length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'white', 
          borderRadius: '6px',
          borderLeft: '4px solid #007bff'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>📋 Sugerencias de Mejora</h4>
          {suggestions.map((suggestion, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🔍 {suggestion.mensaje}</h5>
              <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                {suggestion.sugerencias && suggestion.sugerencias.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar si no hay sugerencias */}
      {showSuggestions && isMasterUser && (!suggestions || suggestions.length === 0) && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#fff3cd', 
          borderRadius: '6px',
          borderLeft: '4px solid #ffc107'
        }}>
          <p style={{ margin: '0', color: '#856404' }}>
            ℹ️ No hay sugerencias de mejora para este proyecto.
          </p>
        </div>
      )}
    </div>
  );
};