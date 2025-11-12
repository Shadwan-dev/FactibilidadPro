// src/components/ValidationPanel.js
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {ProjectDetails} from './ProjectDetails'

export const ValidationPanel = ({ project, suggestions, isMasterUser }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // PDF Export function
  const exportToPDF = async () => {
    try {
      const pdfElement = document.createElement('div');
      pdfElement.style.position = 'absolute';
      pdfElement.style.left = '-9999px';
      pdfElement.innerHTML = document.getElementById('project-details').innerHTML;
      document.body.appendChild(pdfElement);

      const canvas = await html2canvas(pdfElement);
      const imgData = canvas.toDataURL('image/png');
      
      document.body.removeChild(pdfElement);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const pdfImgWidth = pdfWidth - 20;
      const pdfImgHeight = pdfImgWidth / ratio;
      
      pdf.addImage(imgData, 'PNG', 10, 10, pdfImgWidth, pdfImgHeight);
      
      // Add suggestions page for master users
      if (isMasterUser && suggestions.length > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Improvement Suggestions', 10, 20);
        
        let yPosition = 40;
        pdf.setFontSize(12);
        
        suggestions.forEach((suggestion, index) => {
          pdf.setTextColor(30, 30, 30);
          pdf.text(`${index + 1}. ${suggestion.mensaje}`, 10, yPosition);
          yPosition += 10;
          
          pdf.setTextColor(80, 80, 80);
          suggestion.sugerencias.forEach((item) => {
            if (yPosition > 270) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`   • ${item}`, 15, yPosition);
            yPosition += 8;
          });
          yPosition += 5;
        });
      }
      
      pdf.save(`feasibility-${project.name || 'project'}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };
  
  const viewDetails = () => {
    // You can implement a modal or navigation here
    alert(`Showing details for project: ${project.name}`);
  };
  
  const renameProject = async () => {
    const newName = prompt("New project name:", project.name);
    if (newName && newName.trim() !== '') {
      try {
        await updateDoc(doc(db, "projects", project.id), {
          name: newName.trim()
        });
        alert("✅ Project renamed successfully");
      } catch (error) {
        console.error("Error renaming:", error);
        alert("❌ Error renaming project");
      }
    }
  };

  return (
    <div className="validation-panel" style={{ 
      marginTop: '2rem', 
      padding: '1.5rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      background: '#f8f9fa' 
    }}>
      {/* Hidden element for PDF */}
      <div style={{ display: 'none' }}>
        <ProjectDetails project={project} />
      </div>
      
      <div style={{ 
        padding: '1rem', 
        background: '#d4edda', 
        color: '#155724', 
        borderRadius: '5px',
        marginBottom: '1rem'
      }}>
        ✅ Project saved successfully in database
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
              {showSuggestions ? "👁️ Hide" : "💡 Show"} Suggestions
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
              ✏️ Rename
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
          📊 View Details
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
          📄 Export PDF
        </button>
      </div>
      
      {/* Show suggestions for master users */}
      {showSuggestions && isMasterUser && suggestions.length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'white', 
          borderRadius: '6px',
          borderLeft: '4px solid #007bff'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>📋 Improvement Suggestions</h4>
          {suggestions.map((suggestion, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🔍 {suggestion.mensaje}</h5>
              <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                {suggestion.sugerencias.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

