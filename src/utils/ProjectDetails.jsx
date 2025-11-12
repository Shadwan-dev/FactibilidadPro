// src/components/ProjectDetails.js (VERSIÓN EN ESPAÑOL)
import React from 'react';

export const ProjectDetails = ({ project }) => {
  // Función para determinar el color según el score
  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60'; // Verde
    if (score >= 60) return '#f39c12'; // Naranja
    return '#e74c3c'; // Rojo
  };

  // Función para determinar el color de fondo según viabilidad
  const getViabilityColor = (viable) => {
    return viable ? '#d4edda' : '#f8d7da';
  };

  // Función para determinar el color de texto según viabilidad
  const getViabilityTextColor = (viable) => {
    return viable ? '#155724' : '#721c24';
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Función para formatear porcentaje
  const formatPercent = (value) => {
    return `${((value || 0) * 100).toFixed(1)}%`;
  };

  // Función para crear barras de progreso
  const ProgressBar = ({ score, label }) => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '5px',
        fontSize: '12px'
      }}>
        <span style={{ fontWeight: '600' }}>{label}</span>
        <span style={{ 
          fontWeight: 'bold',
          color: getScoreColor(score)
        }}>
          {score}/100
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#ecf0f1',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${score}%`,
          height: '100%',
          backgroundColor: getScoreColor(score),
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }}></div>
      </div>
    </div>
  );

  return (
    <div id="project-details" style={{ 
      padding: '25px', 
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontSize: '13px',
      lineHeight: '1.5',
      color: '#2c3e50',
      backgroundColor: '#ffffff',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      
      {/* Header Mejorado */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        borderBottom: '3px solid #3498db', 
        paddingBottom: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        padding: '25px',
        color: 'white'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '0.5px'
        }}>
          🚀 INFORME DE ESTUDIO DE FACTIBILIDAD
        </h1>
        <h2 style={{ 
          margin: '5px 0', 
          fontSize: '20px', 
          fontWeight: '400',
          opacity: '0.9'
        }}>
          {project.name || 'Proyecto Sin Nombre'}
        </h2>
        <p style={{ 
          margin: '10px 0 0 0', 
          fontSize: '12px',
          opacity: '0.8'
        }}>
          Generado el: {new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Información General Mejorada */}
      <div style={{ 
        marginBottom: '25px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        padding: '20px',
        borderLeft: '4px solid #3498db'
      }}>
        <h3 style={{ 
          color: '#2c3e50', 
          margin: '0 0 15px 0',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 Información General
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '15px'
        }}>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Nombre del Proyecto:</strong>
              <div style={{ color: '#2c3e50', fontWeight: '500' }}>{project.name || 'No especificado'}</div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Descripción:</strong>
              <div style={{ color: '#6c757d' }}>{project.description || 'No proporcionada'}</div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Fecha de Creación:</strong>
              <div style={{ color: '#2c3e50' }}>
                {project.creationDate ? new Date(project.creationDate?.toDate()).toLocaleDateString('es-ES') : 'No especificada'}
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Estado:</strong>
              <div style={{ 
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: project.status === 'analyzed' ? '#d4edda' : '#fff3cd',
                color: project.status === 'analyzed' ? '#155724' : '#856404',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {project.status === 'analyzed' ? 'ANALIZADO' : 
                 project.status === 'pending' ? 'PENDIENTE' : 
                 project.status?.toUpperCase() || 'PENDIENTE'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis Financiero Mejorado */}
      <div style={{ 
        marginBottom: '25px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        padding: '20px',
        borderLeft: '4px solid #27ae60'
      }}>
        <h3 style={{ 
          color: '#2c3e50', 
          margin: '0 0 15px 0',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💰 Análisis Financiero
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px'
        }}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Inversión Inicial:</strong>
              <div style={{ color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
                {formatCurrency(project.financial?.investment)}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Costos Operativos Anuales:</strong>
              <div style={{ color: '#2c3e50', fontWeight: '500' }}>
                {formatCurrency(project.financial?.operationalCosts)}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Ingresos Proyectados:</strong>
              <div style={{ color: '#27ae60', fontWeight: '600', fontSize: '14px' }}>
                {formatCurrency(project.financial?.projectedRevenue)}
              </div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Tasa de Descuento:</strong>
              <div style={{ color: '#2c3e50', fontWeight: '500' }}>
                {formatPercent(project.financial?.discountRate)}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#495057', fontSize: '12px' }}>Período de Análisis:</strong>
              <div style={{ color: '#2c3e50', fontWeight: '500' }}>
                {project.financial?.period || '0'} años
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Calculadas Mejoradas */}
      {project.calculations && (
        <div style={{ 
          marginBottom: '25px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          borderLeft: '4px solid #e74c3c'
        }}>
          <h3 style={{ 
            color: '#2c3e50', 
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📈 Métricas Calculadas
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px'
          }}>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#495057', fontSize: '12px' }}>VAN (Valor Actual Neto):</strong>
                <div style={{ 
                  color: project.calculations.financial?.npv > 0 ? '#27ae60' : '#e74c3c',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {formatCurrency(project.calculations.financial?.npv)}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#495057', fontSize: '12px' }}>TIR (Tasa Interna de Retorno):</strong>
                <div style={{ 
                  color: project.calculations.financial?.irr > 0.08 ? '#27ae60' : '#e74c3c',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {formatPercent(project.calculations.financial?.irr)}
                </div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#495057', fontSize: '12px' }}>Período de Recuperación:</strong>
                <div style={{ color: '#2c3e50', fontWeight: '500' }}>
                  {project.calculations.financial?.payback?.toFixed(1) || '0'} años
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#495057', fontSize: '12px' }}>Flujo de Caja Anual:</strong>
                <div style={{ color: '#2c3e50', fontWeight: '500' }}>
                  {formatCurrency(project.calculations.financial?.annualCashFlow)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Puntuaciones de Factibilidad Mejoradas */}
      {project.calculations && (
        <div style={{ 
          marginBottom: '25px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          borderLeft: '4px solid #9b59b6'
        }}>
          <h3 style={{ 
            color: '#2c3e50', 
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 Puntuaciones de Factibilidad
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <ProgressBar 
              score={project.calculations.technical?.score || 0} 
              label="Factibilidad Técnica" 
            />
            <ProgressBar 
              score={project.calculations.market?.score || 0} 
              label="Factibilidad de Mercado" 
            />
            <ProgressBar 
              score={project.calculations.legal?.score || 0} 
              label="Factibilidad Legal" 
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '15px', 
            textAlign: 'center'
          }}>
            {[
              { key: 'technical', label: '⚙️ Técnica', score: project.calculations.technical?.score },
              { key: 'market', label: '📈 Mercado', score: project.calculations.market?.score },
              { key: 'legal', label: '⚖️ Legal', score: project.calculations.legal?.score }
            ].map((item) => (
              <div key={item.key} style={{ 
                padding: '15px', 
                background: 'white', 
                borderRadius: '8px',
                border: `2px solid ${getScoreColor(item.score)}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>
                  {item.label}
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: getScoreColor(item.score),
                  marginBottom: '5px'
                }}>
                  {item.score || 0}/100
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: getScoreColor(item.score),
                  fontWeight: '600'
                }}>
                  {item.score >= 80 ? 'EXCELENTE' : item.score >= 60 ? 'BUENO' : 'REQUIERE MEJORAS'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluación General Mejorada */}
      {project.calculations && (
        <div style={{ 
          marginBottom: '25px',
          padding: '25px',
          background: `linear-gradient(135deg, ${getViabilityColor(project.calculations.overall?.viable)} 0%, ${getViabilityColor(project.calculations.overall?.viable)}70 100%)`,
          borderRadius: '12px',
          border: `2px solid ${getViabilityTextColor(project.calculations.overall?.viable)}30`,
          textAlign: 'center'
        }}>
          <h3 style={{ 
            color: getViabilityTextColor(project.calculations.overall?.viable), 
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🏆 Evaluación General
          </h3>
          
          <div style={{ 
            fontSize: '32px',
            fontWeight: '700',
            color: getViabilityTextColor(project.calculations.overall?.viable),
            marginBottom: '10px'
          }}>
            {project.calculations.overall?.viable ? 'FACTIBLE ✅' : 'NO FACTIBLE ❌'}
          </div>
          
          <div style={{ 
            display: 'inline-block',
            padding: '8px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            fontWeight: '600',
            color: getViabilityTextColor(project.calculations.overall?.viable),
            fontSize: '14px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Puntuación General: {project.calculations.overall?.score?.toFixed(1) || 0}/100
          </div>
          
          <div style={{ 
            fontSize: '12px',
            color: getViabilityTextColor(project.calculations.overall?.viable),
            opacity: '0.8'
          }}>
            {project.calculations.overall?.viable 
              ? 'Este proyecto muestra un fuerte potencial de éxito' 
              : 'Este proyecto requiere mejoras significativas antes de proceder'
            }
          </div>
        </div>
      )}

      {/* Footer Mejorado */}
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        color: '#6c757d', 
        fontSize: '11px',
        borderTop: '2px solid #ecf0f1',
        paddingTop: '15px'
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>
          Generado por Sistema FactibilidadPro
        </p>
        <p style={{ margin: '0', opacity: '0.7' }}>
          {new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })} • Documento Empresarial Confidencial
        </p>
      </div>
    </div>
  );
};