// src/utils/ProjectSummary.js (ACTUALIZADO)
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useFeasibility } from '../context/FeasibilityContext';
import { useFeasibilityCalculations } from '../hooks/useFeasibilityCalculations';
import {ProjectDetails} from './ProjectDetails'
import {ValidationPanel} from './ValidationPanel'

export const ProjectSummary = ({ currentUser }) => {
  const { formData, setProyectoActual, setMostrarValidacion } = useFeasibility();
  const calculations = useFeasibilityCalculations(formData); // <- HOOK IMPORTANTE
  const [showValidation, setShowValidation] = useState(false);
  const [savedProject, setSavedProject] = useState(null);

  const handleSaveProject = async () => {
    try {
      // Crear el objeto proyecto completo con cálculos
      const projectData = {
        ...formData,
        calculations: calculations, // <- INCLUIR CÁLCULOS
        name: `Project_${Date.now()}`,
        creationDate: new Date(),
        status: "pending",
        user: currentUser?.displayName || 'User',
        userId: currentUser?.uid
      };

      // Guardar en Firebase
      const docRef = await addDoc(collection(db, "projects"), projectData);
      
      // Guardar el proyecto con ID
      const projectWithId = {
        id: docRef.id,
        ...projectData
      };
      
      setSavedProject(projectWithId);
      setProyectoActual(projectWithId);
      setMostrarValidacion(true);
      setShowValidation(true);
      
      console.log("✅ Project saved successfully:", projectWithId);
      
    } catch (error) {
      console.error("❌ Error saving project:", error);
      alert('Error saving project. Please try again.');
    }
  };

  const isFormValid = formData.financial && Object.keys(formData.financial).length > 0;

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
      <h2>📋 Project Summary</h2>
      
      {/* Resumen de evaluación en tiempo real */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '5px' }}>
        <h3>📊 Real-time Evaluation</h3>
        
        {calculations.financial.npv !== 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '10px', background: '#e8f4fd', borderRadius: '5px' }}>
              <strong>NPV</strong>
              <div style={{ 
                color: calculations.financial.npv > 0 ? '#27ae60' : '#e74c3c',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                ${calculations.financial.npv.toLocaleString()}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '10px', background: '#e8f4fd', borderRadius: '5px' }}>
              <strong>IRR</strong>
              <div style={{ 
                color: calculations.financial.irr > 0.08 ? '#27ae60' : '#e74c3c',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {(calculations.financial.irr * 100).toFixed(2)}%
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '10px', background: '#e8f4fd', borderRadius: '5px' }}>
              <strong>Payback</strong>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {calculations.financial.payback.toFixed(1)} years
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '10px', background: '#e8f4fd', borderRadius: '5px' }}>
              <strong>Overall</strong>
              <div style={{ 
                color: calculations.overall.color === 'green' ? '#27ae60' : 
                       calculations.overall.color === 'orange' ? '#f39c12' : '#e74c3c',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {calculations.overall.viable ? 'VIABLE' : 'NOT VIABLE'}
              </div>
            </div>
          </div>
        )}
        
        {!isFormValid && (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            Complete the financial form to see calculations...
          </p>
        )}
      </div>

      {/* Botón de guardar */}
      <button 
        onClick={handleSaveProject} 
        style={{
          padding: '12px 24px',
          background: isFormValid ? '#28a745' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
        disabled={!isFormValid}
      >
        {isFormValid ? '💾 Save Complete Project' : '⚠️ Complete Financial Data First'}
      </button>

      {/* Panel de validación que aparece después de guardar */}
      {showValidation && savedProject && (
        <div style={{ marginTop: '2rem' }}>
          <ValidationPanel 
            project={savedProject} // <- Pasar proyecto con cálculos
            suggestions={calculations.suggestions}
            isMasterUser={currentUser?.uid?.includes('master')}
          />
        </div>
      )}

      {/* ProjectDetails siempre renderizado pero oculto - para PDF */}
      {savedProject && (
        <div style={{ display: 'none' }}>
          <ProjectDetails project={savedProject} /> {/* <- Pasar proyecto con cálculos */}
        </div>
      )}

      {/* Debug info (opcional) */}
      <details style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1rem', borderRadius: '5px' }}>
        <summary>Debug Information</summary>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4>Form Data:</h4>
            <pre style={{ fontSize: '10px', background: '#e9ecef', padding: '10px', borderRadius: '3px' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
          <div>
            <h4>Calculations:</h4>
            <pre style={{ fontSize: '10px', background: '#e9ecef', padding: '10px', borderRadius: '3px' }}>
              {JSON.stringify(calculations, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
};
