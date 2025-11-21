// src/components/results/Charts.jsx (VERSIÓN CORREGIDA)
import React, { useState } from 'react'; // ✅ AÑADIR useState aquí
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { OptimizeButton } from '../actions/OptimizeButton';
import { OptimizationModal } from '../actions/OptimizationModal';
import '../../styles/components/results/charts.css'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Charts = ({ calculations, formData }) => {
  const [showFormData, setShowFormData] = useState(true); // ✅ Ahora funciona
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([]);
  const generateOptimizationRecommendations = () => {
    const recommendations = [];
    
    // Recomendaciones financieras
    if (!calculations.financial?.viable) {
      recommendations.push({
        area: 'Financiera',
        title: 'Mejorar rentabilidad del proyecto',
        description: 'Optimiza la estructura de costos e ingresos para aumentar el VPN',
        impact: 'Alta - Aumenta viabilidad financiera',
        effort: 'Medio',
        priority: 'Alta',
        specifics: [
          'Reducir costos operativos en un 15-20%',
          'Aumentar ingresos proyectados mediante estrategias de marketing',
          'Revisar estructura de inversión inicial'
        ]
      });
    }

    // Recomendaciones técnicas
    if (!calculations.technical?.viable) {
      recommendations.push({
        area: 'Técnica',
        title: 'Fortalecer capacidades técnicas',
        description: 'Mejora la infraestructura y capacidad del equipo',
        impact: 'Media - Mejora ejecución',
        effort: 'Bajo',
        priority: 'Media',
        specifics: [
          'Capacitar al equipo en tecnologías requeridas',
          'Adquirir herramientas de desarrollo esenciales',
          'Establecer procesos de desarrollo ágiles'
        ]
      });
    }

    // Agrega más recomendaciones según sea necesario...
    
    return recommendations;
  };

  const handleOptimize = async () => {
    const recommendations = generateOptimizationRecommendations();
    setOptimizationRecommendations(recommendations);
    setShowOptimizationModal(true);
  };

  const handleApplyOptimizations = (selectedRecommendations) => {
    // Aquí implementarías la lógica para aplicar las optimizaciones
    console.log('Aplicando optimizaciones:', selectedRecommendations);
    setShowOptimizationModal(false);
    // Aquí podrías llamar a una función para actualizar los formularios
  };

  if (!calculations) {
    return (
      <div className="charts-section">
        <h3>Gráficos de Análisis</h3>
        <div className="empty-state">
          Complete los datos para ver los análisis visuales
        </div>
      </div>
    );
  }

  // Configuración de colores
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#6366f1',
    financial: '#8b5cf6',
    technical: '#06b6d4',
    market: '#84cc16',
    legal: '#f97316'
  };

  // 1. GRÁFICO DE VIABILIDAD POR ÁREAS (Doughnut)
  const viabilityChartData = {
    labels: ['Financiera', 'Técnica', 'Mercado', 'Legal'],
    datasets: [
      {
        data: [
          calculations.financial?.npv > 0 ? 100 : 0,
          calculations.technical?.score || 0,
          calculations.market?.score || 0,
          calculations.legal?.score || 0
        ],
        backgroundColor: [
          calculations.financial?.npv > 0 ? colors.success : colors.danger,
          (calculations.technical?.score || 0) >= 70 ? colors.success : colors.danger,
          (calculations.market?.score || 0) >= 65 ? colors.success : colors.danger,
          (calculations.legal?.score || 0) >= 80 ? colors.success : colors.danger
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  const viabilityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Viabilidad por Área',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
    cutout: '60%'
  };

  // 2. GRÁFICO DE BARRAS - COMPARATIVA DE PUNTUACIONES
  const scoresChartData = {
    labels: ['Financiera', 'Técnica', 'Mercado', 'Legal'],
    datasets: [
      {
        label: 'Puntuación Actual',
        data: [
          calculations.financial?.npv > 0 ? 100 : 0,
          calculations.technical?.score || 0,
          calculations.market?.score || 0,
          calculations.legal?.score || 0
        ],
        backgroundColor: [
          colors.financial,
          colors.technical,
          colors.market,
          colors.legal
        ],
        borderColor: [
          colors.financial,
          colors.technical,
          colors.market,
          colors.legal
        ],
        borderWidth: 1
      },
      {
        label: 'Meta Mínima',
        data: [100, 70, 65, 80],
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        borderColor: 'rgba(107, 114, 128, 0.8)',
        borderWidth: 1,
        type: 'line',
        fill: false,
        pointStyle: 'dash'
      }
    ]
  };

  const scoresChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Puntuación vs Meta por Área',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Puntuación (%)'
        }
      }
    }
  };

  // 3. GRÁFICO DE PROYECCIÓN FINANCIERA (Line Chart)
  const calculateFinancialProjection = () => {
    if (!formData?.financial) return { labels: [], data: [] };
    
    const { investment = 0, operationalCosts = 0, projectedRevenue = 0, period = 5 } = formData.financial;
    const annualCashFlow = projectedRevenue - operationalCosts;
    
    const labels = ['Inversión'];
    const data = [-investment];
    let accumulated = -investment;
    
    for (let i = 1; i <= period; i++) {
      labels.push(`Año ${i}`);
      accumulated += annualCashFlow;
      data.push(accumulated);
    }
    
    return { labels, data };
  };

  const financialProjection = calculateFinancialProjection();
  
  const financialChartData = {
    labels: financialProjection.labels,
    datasets: [
      {
        label: 'Flujo de Caja Acumulado',
        data: financialProjection.data,
        borderColor: colors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const financialChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Proyección de Flujo de Caja',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Flujo Acumulado ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Período'
        }
      }
    }
  };

  // 4. GRÁFICO DE DISTRIBUCIÓN DE VIABILIDAD (Pie Chart)
  const viableAreasCount = [
    calculations.financial?.npv > 0 ? 1 : 0,
    calculations.technical?.viable ? 1 : 0,
    calculations.market?.viable ? 1 : 0,
    calculations.legal?.viable ? 1 : 0
  ].filter(Boolean).length;

  const nonViableAreasCount = 4 - viableAreasCount;

  const distributionChartData = {
    labels: ['Áreas Viables', 'Áreas No Viables'],
    datasets: [
      {
        data: [viableAreasCount, nonViableAreasCount],
        backgroundColor: [colors.success, colors.danger],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  const distributionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Distribución de Viabilidad',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.parsed / total) * 100);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // 5. GRÁFICO DE MÉTRICAS FINANCIERAS COMPARATIVAS (Bar Chart)
  const financialMetricsData = {
    labels: ['VPN', 'TIR', 'Período Recup.'],
    datasets: [
      {
        label: 'Valor Actual',
        data: [
          calculations.financial?.npv || 0,
          (calculations.financial?.irr || 0) * 100,
          calculations.financial?.payback || 0
        ],
        backgroundColor: [
          (calculations.financial?.npv || 0) >= 0 ? colors.success : colors.danger,
          (calculations.financial?.irr || 0) >= 0.08 ? colors.success : colors.warning,
          colors.info
        ]
      },
      {
        label: 'Meta',
        data: [0, 8, 3],
        backgroundColor: 'rgba(107, 114, 128, 0.3)',
        borderColor: 'rgba(107, 114, 128, 0.8)',
        borderWidth: 1
      }
    ]
  };

  const financialMetricsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Métricas Financieras vs Metas',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  };
// Componente para mostrar datos de formularios
const FormDataDisplay = () => (
  <div className="chart-container form-data-container">
    <div className="section-header-with-toggle">
      <h4>📝 Datos Ingresados en Formularios</h4>
      <button 
        className="toggle-btn"
        onClick={() => setShowFormData(!showFormData)}
      >
        {showFormData ? '▲ Ocultar' : '▼ Mostrar'} Datos
      </button>
    </div>
    
    {showFormData && (
      <div className="form-data-grid">
        
        {/* Datos Financieros */}
        <div className="form-data-section">
          <h5>💰 Datos Financieros</h5>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Inversión Inicial:</span>
              <span className="data-value">${formData.financial?.investment?.toLocaleString() || 0}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Costos Operativos Anuales:</span>
              <span className="data-value">${formData.financial?.operationalCosts?.toLocaleString() || 0}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Ingresos Proyectados Anuales:</span>
              <span className="data-value">${formData.financial?.projectedRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Tasa de Descuento:</span>
              <span className="data-value">{((formData.financial?.discountRate || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="data-item">
              <span className="data-label">Período de Análisis:</span>
              <span className="data-value">{formData.financial?.period || 5} años</span>
            </div>
          </div>
        </div>

        {/* Datos Técnicos */}
        <div className="form-data-section">
          <h5>⚙️ Datos Técnicos</h5>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Capacidad del Equipo:</span>
              <span className="data-value">{formData.technical?.teamCapacity || 0}/10</span>
            </div>
            <div className="data-item">
              <span className="data-label">Infraestructura:</span>
              <span className="data-value">{formData.technical?.infrastructure || 0}/10</span>
            </div>
            <div className="data-item">
              <span className="data-label">Tecnología Disponible:</span>
              <span className="data-value">
                {formData.technical?.technologyAvailable ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Tiempo de Implementación:</span>
              <span className="data-value">{formData.technical?.implementationTime || 0} meses</span>
            </div>
            <div className="data-item">
              <span className="data-label">Complejidad:</span>
              <span className="data-value">{formData.technical?.complexity || 0}/10</span>
            </div>
            <div className="data-item">
              <span className="data-label">Personal Requerido:</span>
              <span className="data-value">{formData.technical?.requiredStaff || 0} personas</span>
            </div>
          </div>
        </div>

        {/* Datos de Mercado */}
        <div className="form-data-section">
          <h5>📈 Datos de Mercado</h5>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Tamaño del Mercado:</span>
              <span className="data-value">${formData.market?.marketSize?.toLocaleString() || 0}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Crecimiento del Mercado:</span>
              <span className="data-value">{formData.market?.marketGrowth || 0}% anual</span>
            </div>
            <div className="data-item">
              <span className="data-label">Participación de Mercado:</span>
              <span className="data-value">{formData.market?.marketShare || 0}%</span>
            </div>
            <div className="data-item">
              <span className="data-label">Número de Competidores:</span>
              <span className="data-value">{formData.market?.competitors || 0}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Precio Promedio:</span>
              <span className="data-value">${formData.market?.averagePrice || 0}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Estacionalidad:</span>
              <span className="data-value">{formData.market?.seasonality || 0}/10</span>
            </div>
          </div>
        </div>

        {/* Datos Legales */}
        <div className="form-data-section">
          <h5>⚖️ Datos Legales</h5>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Permisos Obtenidos:</span>
              <span className="data-value">
                {formData.legal?.permits ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Cumplimiento Regulatorio:</span>
              <span className="data-value">
                {formData.legal?.regulatoryCompliance ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Riesgos Legales:</span>
              <span className="data-value">{formData.legal?.legalRisks || 0}/10</span>
            </div>
            <div className="data-item">
              <span className="data-label">Propiedad Intelectual:</span>
              <span className="data-value">
                {formData.legal?.intellectualProperty ? '✅ Protegida' : '❌ No protegida'}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Tiempo de Procesamiento:</span>
              <span className="data-value">{formData.legal?.processingTime || 0} días</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

return (
  <div className="charts-section">
    <h3>📊 Análisis Visual del Proyecto</h3>
    <div className="optimization-section">
        <OptimizeButton 
          onOptimize={handleOptimize}
          calculations={calculations}
          formData={formData}
          showDetails={true}
        />
      </div>
    
    <div className="charts-grid">
      
      {/* SECCIÓN DE DATOS DE FORMULARIOS - AL INICIO */}
      <FormDataDisplay />

      {/* GRÁFICO 1: Viabilidad por áreas (Doughnut) */}
      <div className="chart-container">
        <h4>🎯 Viabilidad por Área</h4>
        <div className="chart-wrapper">
          <Doughnut data={viabilityChartData} options={viabilityChartOptions} />
        </div>
        <div className="chart-legend">
          {viabilityChartData.labels.map((label, index) => (
            <div key={label} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: viabilityChartData.datasets[0].backgroundColor[index] }}
              ></span>
              <span className="legend-label">{label}</span>
              <span className="legend-value">
                {viabilityChartData.datasets[0].data[index]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GRÁFICO 2: Puntuación vs Meta (Bar Chart) */}
      <div className="chart-container">
        <h4>📈 Puntuación vs Metas</h4>
        <div className="chart-wrapper">
          <Bar data={scoresChartData} options={scoresChartOptions} />
        </div>
      </div>

      {/* GRÁFICO 3: Proyección Financiera (Line Chart) */}
      {financialProjection.labels.length > 0 && (
        <div className="chart-container">
          <h4>💰 Proyección Financiera</h4>
          <div className="chart-wrapper">
            <Line data={financialChartData} options={financialChartOptions} />
          </div>
        </div>
      )}

      {/* GRÁFICO 4: Distribución de Viabilidad (Pie Chart) */}
      <div className="chart-container">
        <h4>📊 Distribución General</h4>
        <div className="chart-wrapper">
          <Pie data={distributionChartData} options={distributionChartOptions} />
        </div>
        <div className="viability-summary">
          <div className="viability-item viable">
            <span className="viability-count">{viableAreasCount}</span>
            <span className="viability-label">Áreas Viables</span>
          </div>
          <div className="viability-item non-viable">
            <span className="viability-count">{nonViableAreasCount}</span>
            <span className="viability-label">Áreas por Mejorar</span>
          </div>
        </div>
      </div>

      {/* GRÁFICO 5: Métricas Financieras (Bar Chart) */}
      <div className="chart-container">
        <h4>💹 Métricas Financieras</h4>
        <div className="chart-wrapper">
          <Bar data={financialMetricsData} options={financialMetricsOptions} />
        </div>
        <div className="metrics-explanation">
          <p><strong>VPN:</strong> Valor Presente Neto (meta: ≥ 0)</p>
          <p><strong>TIR:</strong> Tasa Interna de Retorno (meta: ≥ 8%)</p>
          <p><strong>Período Recup.:</strong> Años para recuperar inversión (meta: ≤ 3 años)</p>
        </div>
      </div>
      {/* Modal de optimización */}
      <OptimizationModal 
        isOpen={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
        recommendations={optimizationRecommendations}
        onApply={handleApplyOptimizations}
        currentScore={calculations.overall?.score || 0}
        projectedScore={Math.min(95, (calculations.overall?.score || 0) + 25)}
      />

    </div>
  </div>
);
};