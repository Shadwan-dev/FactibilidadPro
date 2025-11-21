// TechnicalDataForm.jsx - CON BOTÓN PARA IR A FINANZAS
import React from "react";
import { useTechnicalForm } from "../../hooks/useTechnicalForm";
import { TechnicalResults } from "./TechnicalResults";
import { TechnicalModalManager } from "./modals/TechnicalModalManager";
import '../../styles/components/forms/technical-base.css';
import '../../styles/components/forms/technical-cards.css';
import '../../styles/components/forms/technical-buttons.css';

export const TechnicalDataForm = React.memo(({ 
  data, 
  onChange, 
  onBack, 
  onNavigateToFinancial 
}) => {  
  const {
    formData,
    activeModal,
    modalData,
    lastSaved,
    saving,
    openModal,
    closeModal,
    saveFieldEvaluation,
    saveAllFormData
  } = useTechnicalForm(data);
  
  // Sincronización optimizada con el componente padre
  const previousDataRef = React.useRef();
  
  React.useEffect(() => {
    if (previousDataRef.current === undefined) {
      previousDataRef.current = formData;
      return;
    }
    
    if (JSON.stringify(previousDataRef.current) !== JSON.stringify(formData)) {
      onChange("technical", formData);
      previousDataRef.current = formData;
    }
  }, [formData, onChange]);

  const handleSaveAll = () => {
    const allData = saveAllFormData();
    
    // Feedback visual
    alert('✅ Todos los datos técnicos han sido guardados exitosamente');
  };

  // Contar campos completados
  const completedFields = Object.keys(formData).filter(key => {
    if (key.includes('Rating')) {
      return formData[key] && formData[key] !== '';
    }
    if (key.includes('Details') || key.includes('Factors')) {
      return formData[key] && formData[key].length > 0;
    }
    return false;
  }).length;

  const totalFields = 20;

  return (
    <div className="technical-form">
      {/* Header con navegación */}
      <div className="form-header">
        <div className="technical-header-content">
          <div>
            <h3 className="form-title">🔧 Análisis Técnico</h3>
            <p className="form-subtitle">
              Evaluación cualitativa de los aspectos técnicos del proyecto
            </p>
          </div>
          <div className="technical-header-actions">
            {lastSaved && (
              <div className="technical-last-saved">
                Último guardado:{" "}
                {lastSaved.field === "all"
                  ? "Formulario completo"
                  : lastSaved.field}
                a las {lastSaved.timestamp}
              </div>
            )}

            {/* Botón para ir a Finanzas */}
            <button
              onClick={onNavigateToFinancial}
              className="technical-navigate-btn technical-navigate-btn--financial"
            >
              💰 Ir a Análisis Financiero
            </button>

            <button
              onClick={handleSaveAll}
              className="technical-save-all-btn"
              disabled={completedFields === 0}
            >
              💾 Guardar Todo el Formulario
            </button>
          </div>
        </div>

        {/* Progress bar de completado */}
        <div
          className={`technical-completion-progress ${
            completedFields === totalFields ? "completed" : ""
          }`}
        >
          <div className="technical-progress-info">
            <span>
              Progreso: {completedFields}/{totalFields} campos
            </span>
            <span>
              {Math.round((completedFields / totalFields) * 100)}% completado
            </span>
          </div>
          <div className="technical-progress-bar">
            <div
              className="technical-progress-fill"
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sección de alerta si hay campos críticos pendientes */}
      {completedFields < 5 && (
        <div className="technical-alert technical-alert--warning">
          <div className="technical-alert-icon">⚠️</div>
          <div className="technical-alert-content">
            <h4>Revisión Recomendada</h4>
            <p>
              Tienes{" "}
              <strong>
                {completedFields} de {totalFields} campos completados
              </strong>
              . Te recomendamos completar los campos críticos antes de
              continuar:
            </p>
            <ul className="technical-critical-fields">
              <li>📍 Localización del Proyecto</li>
              <li>📊 Tamaño y Capacidad</li>
              <li>⚙️ Ingeniería del Proyecto</li>
            </ul>
            <div className="technical-alert-actions">
              <button
                onClick={() => {
                  // Scroll a la primera sección
                  document.querySelector(".form-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="technical-alert-btn technical-alert-btn--primary"
              >
                🔧 Completar Campos Críticos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sección 1: Localización */}
      <div className="form-section">
        <h4 className="section-title-technical-form">
          📍 Localización del Proyecto
        </h4>
        <div className="section-grid">
          <TechnicalCard
            title="Macrolocalización"
            description="Región, ciudad, zona"
            rating={formData.macrolocationRating}
            items={formData.macrolocationDetails}
            onOpenModal={() =>
              openModal("macrolocation", formData.macrolocationDetails)
            }
          />
          <TechnicalCard
            title="Microlocalización"
            description="Ubicación específica, terreno"
            rating={formData.microlocationRating}
            items={formData.microlocationDetails}
            onOpenModal={() =>
              openModal("microlocation", formData.microlocationDetails)
            }
          />
          <TechnicalCard
            title="Factores de Localización"
            description="Acceso a recursos, mercado, transporte"
            rating={formData.locationFactorsRating}
            items={formData.locationFactors}
            onOpenModal={() =>
              openModal("locationFactors", formData.locationFactors)
            }
          />
        </div>
      </div>

      {/* Sección 2: Tamaño y Capacidad */}
      <div className="form-section">
        <h4 className="section-title-technical-form">📊 Tamaño y Capacidad</h4>
        <div className="section-grid">
          <TechnicalCard
            title="Capacidad Instalada"
            description="Capacidad máxima de producción"
            rating={formData.capacityRating}
            items={formData.capacityDetails}
            onOpenModal={() => openModal("capacity", formData.capacityDetails)}
          />
          <TechnicalCard
            title="Volumen de Producción"
            description="Niveles de producción proyectados"
            rating={formData.productionRating}
            items={formData.productionDetails}
            onOpenModal={() =>
              openModal("production", formData.productionDetails)
            }
          />
          <TechnicalCard
            title="Factores Limitantes"
            description="Restricciones de capacidad"
            rating={formData.limitingFactorsRating}
            items={formData.limitingFactors}
            onOpenModal={() =>
              openModal("limitingFactors", formData.limitingFactors)
            }
          />
        </div>
      </div>

      {/* Sección 3: Ingeniería del Proyecto */}
      <div className="form-section">
        <h4 className="section-title-technical-form">
          ⚙️ Ingeniería del Proyecto
        </h4>
        <div className="section-grid">
          <TechnicalCard
            title="Descripción del Producto/Servicio"
            description="Características técnicas principales"
            rating={formData.productDescriptionRating}
            items={formData.productDescription}
            onOpenModal={() =>
              openModal("productDescription", formData.productDescription)
            }
          />
          <TechnicalCard
            title="Proceso Productivo"
            description="Diagrama de flujo y etapas"
            rating={formData.productionProcessRating}
            items={formData.productionProcess}
            onOpenModal={() =>
              openModal("productionProcess", formData.productionProcess)
            }
          />
          <TechnicalCard
            title="Tecnología y Maquinaria"
            description="Equipos y tecnología requerida"
            rating={formData.technologyRating}
            items={formData.technologyDetails}
            onOpenModal={() =>
              openModal("technology", formData.technologyDetails)
            }
          />
          <TechnicalCard
            title="Distribución de Planta"
            description="Layout y organización física"
            rating={formData.layoutRating}
            items={formData.layoutDetails}
            onOpenModal={() => openModal("layout", formData.layoutDetails)}
          />
        </div>
      </div>

      {/* Sección 4: Recursos Necesarios */}
      <div className="form-section">
        <h4 className="section-title-technical-form">🛠️ Recursos Necesarios</h4>
        <div className="section-grid">
          <TechnicalCard
            title="Materias Primas e Insumos"
            description="Materiales requeridos"
            rating={formData.rawMaterialsRating}
            items={formData.rawMaterials}
            onOpenModal={() => openModal("rawMaterials", formData.rawMaterials)}
          />
          <TechnicalCard
            title="Mano de Obra"
            description="Personal y calificaciones"
            rating={formData.laborRating}
            items={formData.laborDetails}
            onOpenModal={() => openModal("labor", formData.laborDetails)}
          />
          <TechnicalCard
            title="Servicios Básicos"
            description="Agua, electricidad, gas, etc."
            rating={formData.servicesRating}
            items={formData.servicesDetails}
            onOpenModal={() => openModal("services", formData.servicesDetails)}
          />
        </div>
      </div>

      {/* Sección 5: Infraestructura Física */}
      <div className="form-section">
        <h4 className="section-title-technical-form">
          🏗️ Infraestructura Física
        </h4>
        <div className="section-grid">
          <TechnicalCard
            title="Edificaciones y Construcciones"
            description="Estructuras físicas requeridas"
            rating={formData.buildingsRating}
            items={formData.buildingsDetails}
            onOpenModal={() =>
              openModal("buildings", formData.buildingsDetails)
            }
          />
          <TechnicalCard
            title="Equipos y Maquinaria"
            description="Equipamiento técnico"
            rating={formData.equipmentRating}
            items={formData.equipmentDetails}
            onOpenModal={() =>
              openModal("equipment", formData.equipmentDetails)
            }
          />
          <TechnicalCard
            title="Mobiliario e Instalaciones"
            description="Mobiliario y acabados"
            rating={formData.furnitureRating}
            items={formData.furnitureDetails}
            onOpenModal={() =>
              openModal("furniture", formData.furnitureDetails)
            }
          />
        </div>
      </div>

      {/* Sección 6: Cronograma de Implementación */}
      <div className="form-section">
        <h4 className="section-title-technical-form">
          📅 Cronograma de Implementación
        </h4>
        <div className="section-grid">
          <TechnicalCard
            title="Fases del Proyecto"
            description="Etapas de implementación"
            rating={formData.phasesRating}
            items={formData.projectPhases}
            onOpenModal={() => openModal("phases", formData.projectPhases)}
          />
          <TechnicalCard
            title="Tiempos de Ejecución"
            description="Duración estimada por fase"
            rating={formData.timelineRating}
            items={formData.timelineDetails}
            onOpenModal={() => openModal("timeline", formData.timelineDetails)}
          />
        </div>
      </div>

      {/* Resultados Técnicos */}
      <TechnicalResults formData={formData} />
      {/* Footer con navegación */}
      <div className="technical-form-footer">
        <div className="technical-footer-actions">
          {onBack && (
            <button
              onClick={onBack}
              className="technical-navigate-btn technical-navigate-btn--back"
            >
              ← Volver
            </button>
          )}

          <button
            onClick={onNavigateToFinancial}
            className="technical-navigate-btn technical-navigate-btn--financial technical-navigate-btn--large"
          >
            💰 Ir a Análisis Financiero →
          </button>
        </div>

        <div className="technical-save-footer">
          <button
            onClick={saveAllFormData}
            className="technical-save-all-btn technical-save-all-btn--large"
            disabled={saving || completedFields === 0}
          >
            {saving ? "💾 Guardando..." : "💾 Guardar Todo el Análisis Técnico"}
          </button>
          <div className="technical-save-hint">
            {saving
              ? "Guardando en la base de datos..."
              : completedFields === 0
              ? "Completa al menos un campo para poder guardar"
              : `✅ ${completedFields} campos listos para guardar`}
          </div>
        </div>
      </div>

      {/* Gestor de Modales */}
      <TechnicalModalManager
        activeModal={activeModal}
        modalData={modalData}
        onClose={closeModal}
        onSave={saveFieldEvaluation}
      />
    </div>
  );
});


// Componente de Tarjeta Técnica - ACTUALIZADO
const TechnicalCard = ({ title, description, rating, items, onOpenModal }) => {
  const getRatingText = (rating) => {
    switch(rating) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'regular': return 'Regular';
      case 'poor': return 'Mala';
      default: return 'No evaluado';
    }
  };

  const getRatingColor = (rating) => {
    switch(rating) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'regular': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="technical-card">
      <div className="card-header">
        <div>
          <label className="card-label">{title}</label>
          <div className="card-description">{description}</div>
        </div>
        <button 
          className="btn-modal"
          onClick={onOpenModal}
        >
          {items?.length ? '✏️ Editar' : '➕ Agregar'}
        </button>
      </div>
      
      <div className="card-rating">
        <span 
          className="rating-badge"
          style={{ backgroundColor: getRatingColor(rating) }}
        >
          {getRatingText(rating)}
        </span>
      </div>
      
      <div className="card-items">
        {items?.slice(0, 3).map((item, index) => (
          <div key={index} className="card-item">
            <span className="item-name">{item.description || item.name}</span>
          </div>
        ))}
        {items?.length > 3 && (
          <div className="card-more">+{items.length - 3} elementos más</div>
        )}
        {(!items || items.length === 0) && (
          <div className="card-empty">No hay información agregada</div>
        )}
      </div>
    </div>
  );
};