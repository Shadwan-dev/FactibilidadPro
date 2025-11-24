// src/components/forms/market/MarketDataForm.jsx (UNIFICADO)
import React, {useState, useEffect} from "react";
import { useMarketForm } from "../../../hooks/useMarketForm";
import { MarketModalManager } from "./modals/MarketModalManager";
import { MarketReviewModal } from './modals/MarketReviewModal';
import { useProjects } from "../../../hooks/useProjects";
import { useAuth } from "../../../hooks/useAuth";
import '../../../styles/components/forms/market-review-modal.css';
import '../../../styles/components/forms/market-base.css';
import '../../../styles/components/forms/market-cards.css';
import '../../../styles/components/forms/market-modals.css';
import '../../../styles/components/results/MarketResultsProfessional.css';
import '../../../styles/components/forms/market-header-footer.css'
import '../../../styles/components/forms/market-alerts.css'
import '../../../styles/components/forms/market-modals-unique.css'

export const MarketDataForm = React.memo(
  ({
    data,
    onChange,
    onBack,
    onNavigateToTechnical,
    onNavigateToFinancial,
    projectId, // ✅ NUEVO PROP
    userId, // ✅ NUEVO PROP
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
      saveAllFormData,
    } = useMarketForm(data);
    const { submitForReview } = useProjects();
    const { currentUser } = useAuth();

    // Sincronización con el componente padre
    const previousDataRef = React.useRef();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isReviewInProgress, setIsReviewInProgress] = useState(false);

    // ✅ ACTUALIZAR handleConfirmReview para recibir parámetros
    // ✅ HANDLER ACTUALIZADO CON PARÁMETROS
    const handleConfirmReview = async () => {
      try {
        setIsReviewInProgress(true);

        if (!projectId || !userId) {
          alert("❌ No se puede enviar el proyecto: información faltante");
          setIsReviewInProgress(false);
          return;
        }

        const result = await submitForReview(projectId, userId);

        if (result?.success) {
          console.log("📤 Proyecto enviado para revisión a Yurkel");
          setIsReviewInProgress(true);
          alert(
            "✅ Proyecto enviado para revisión. Recibirás una notificación cuando esté analizado."
          );
        } else {
          alert(`❌ ${result?.message || "Error al enviar proyecto"}`);
          setIsReviewInProgress(false);
        }
      } catch (error) {
        console.error("Error enviando proyecto:", error);
        alert("❌ Error al enviar proyecto para revisión");
        setIsReviewInProgress(false);
      }
    };

    React.useEffect(() => {
      if (previousDataRef.current === undefined) {
        previousDataRef.current = formData;
        return;
      }

      if (
        JSON.stringify(previousDataRef.current) !== JSON.stringify(formData)
      ) {
        onChange("market", formData);
        previousDataRef.current = formData;
      }
    }, [formData, onChange]);

    const handleSaveAll = async () => {
      const success = await saveAllFormData();
      if (success) {
        alert("✅ Todos los datos de mercado han sido guardados exitosamente");
      }
    };

    // Contar campos completados
    const completedFields = Object.keys(formData).filter((key) => {
      if (key.includes("Rating")) {
        return formData[key] && formData[key] !== "";
      }
      if (
        key.includes("Details") ||
        key.includes("Data") ||
        key.includes("Analysis")
      ) {
        return formData[key] && formData[key].length > 0;
      }
      return false;
    }).length;

    const totalFields = 35; // Ajustar según campos reales

    return (
      <div className="market-form">
        {/* Header con navegación - CLASS NAMES ÚNICOS */}
        <div className="market-form-header">
          <div className="market-form-header-content">
            <div>
              <h3 className="market-form-main-title">📊 Análisis de Mercado</h3>
              <p className="market-form-main-subtitle">
                Evaluación cuantitativa y cualitativa del mercado objetivo
              </p>
            </div>
          </div>
          <div className="market-form-header-actions">
            {lastSaved && (
              <div className="market-form-last-saved">
                Último guardado:{" "}
                {lastSaved.field === "all"
                  ? "Formulario completo"
                  : lastSaved.field}
                a las {lastSaved.timestamp}
              </div>
            )}

            {/* Botones de navegación */}
            <div className="market-form-nav-buttons">
              <button
                onClick={onNavigateToTechnical}
                className="market-form-nav-btn market-form-nav-btn--technical"
              >
                🔧 Ir a Análisis Técnico
              </button>

              <button
                onClick={onNavigateToFinancial}
                className="market-form-nav-btn market-form-nav-btn--financial"
              >
                💰 Ir a Análisis Financiero
              </button>
            </div>

            <button
              onClick={handleSaveAll}
              className="market-form-save-btn"
              disabled={saving || completedFields === 0}
            >
              {saving ? "💾 Guardando..." : "💾 Guardar Todo"}
            </button>
          </div>
        </div>

        {/* Progress bar - CLASS NAMES ÚNICOS */}
        <div
          className={`market-form-progress ${
            completedFields === totalFields ? "completed" : ""
          }`}
        >
          <div className="market-form-progress-info">
            <span className="market-form-progress-text">
              Progreso: {completedFields}/{totalFields} campos
            </span>
            <span className="market-form-progress-percent">
              {Math.round((completedFields / totalFields) * 100)}% completado
            </span>
          </div>
          <div className="market-form-progress-bar">
            <div
              className="market-form-progress-fill"
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Alerta de revisión recomendada */}
        {completedFields < 8 && (
          <div className="market-form-review-alert market-form-review-alert--warning">
            <div className="market-form-review-icon">⚠️</div>
            <div className="market-form-review-content">
              <h4 className="market-form-review-title">Revisión Recomendada</h4>
              <p className="market-form-review-text">
                Tienes{" "}
                <strong>
                  {completedFields} de {totalFields} campos completados
                </strong>
                . Te recomendamos completar los campos críticos antes de
                continuar:
              </p>
              <ul className="market-form-critical-fields">
                <li className="market-form-critical-item">
                  📈 Tamaño y Dimensión del Mercado
                </li>
                <li className="market-form-critical-item">
                  🎯 Segmentación del Mercado
                </li>
                <li className="market-form-critical-item">
                  📊 Análisis de Competencia
                </li>
                <li className="market-form-critical-item">
                  💰 Estrategia de Precios
                </li>
              </ul>
              <div className="market-form-review-actions">
                <button
                  onClick={onNavigateToTechnical}
                  className="market-form-review-btn market-form-review-btn--secondary"
                >
                  🔧 Primero revisar Técnico
                </button>
                <button
                  onClick={() => {
                    document.querySelector(".market-section")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="market-form-review-btn market-form-review-btn--primary"
                >
                  📊 Completar Campos Críticos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: DATOS CUANTITATIVOS */}
        <div className="market-section">
          <h4 className="section-title-market-form">📈 Datos Cuantitativos</h4>

          {/* 1.1 Tamaño y Dimensión del Mercado */}
          <div className="market-subsection">
            <h5>Tamaño y Dimensión del Mercado</h5>
            <div className="section-grid">
              <MarketCard
                title="Mercado Potencial Total"
                description="Número total de consumidores/empresas potenciales"
                rating={formData.totalMarketRating}
                items={formData.totalMarketData}
                onOpenModal={() =>
                  openModal("totalMarket", formData.totalMarketData)
                }
              />
              <MarketCard
                title="Mercado Disponible"
                description="Segmento que cumple requisitos de acceso"
                rating={formData.availableMarketRating}
                items={formData.availableMarketData}
                onOpenModal={() =>
                  openModal("availableMarket", formData.availableMarketData)
                }
              />
              <MarketCard
                title="Mercado Objetivo"
                description="Porción específica que planeas captar"
                rating={formData.targetMarketRating}
                items={formData.targetMarketData}
                onOpenModal={() =>
                  openModal("targetMarket", formData.targetMarketData)
                }
              />
              <MarketCard
                title="Valor del Mercado"
                description="Facturación total anual del sector"
                rating={formData.marketValueRating}
                items={formData.marketValueData}
                onOpenModal={() =>
                  openModal("marketValue", formData.marketValueData)
                }
              />
              <MarketCard
                title="Tasas de Crecimiento"
                description="Crecimiento histórico y proyectado"
                rating={formData.growthRatesRating}
                items={formData.growthRatesData}
                onOpenModal={() =>
                  openModal("growthRates", formData.growthRatesData)
                }
              />
            </div>
          </div>

          {/* 1.2 Segmentación del Mercado */}
          <div className="market-subsection">
            <h5>Segmentación del Mercado</h5>
            <div className="section-grid">
              <MarketCard
                title="Segmentación Demográfica"
                description="Edad, género, ingresos, educación"
                rating={formData.demographicSegmentationRating}
                items={formData.demographicSegmentation}
                onOpenModal={() =>
                  openModal(
                    "demographicSegmentation",
                    formData.demographicSegmentation
                  )
                }
              />
              <MarketCard
                title="Segmentación Geográfica"
                description="Ubicación, densidad, región"
                rating={formData.geographicSegmentationRating}
                items={formData.geographicSegmentation}
                onOpenModal={() =>
                  openModal(
                    "geographicSegmentation",
                    formData.geographicSegmentation
                  )
                }
              />
              <MarketCard
                title="Segmentación Psicográfica"
                description="Estilo de vida, valores, personalidad"
                rating={formData.psychographicSegmentationRating}
                items={formData.psychographicSegmentation}
                onOpenModal={() =>
                  openModal(
                    "psychographicSegmentation",
                    formData.psychographicSegmentation
                  )
                }
              />
              <MarketCard
                title="Segmentación Conductual"
                description="Frecuencia, lealtad, beneficios buscados"
                rating={formData.behavioralSegmentationRating}
                items={formData.behavioralSegmentation}
                onOpenModal={() =>
                  openModal(
                    "behavioralSegmentation",
                    formData.behavioralSegmentation
                  )
                }
              />
            </div>
          </div>

          {/* 1.3 Demanda */}
          <div className="market-subsection">
            <h5>Análisis de Demanda</h5>
            <div className="section-grid">
              <MarketCard
                title="Demanda Actual"
                description="Unidades/servicios consumidos anualmente"
                rating={formData.currentDemandRating}
                items={formData.currentDemandData}
                onOpenModal={() =>
                  openModal("currentDemand", formData.currentDemandData)
                }
              />
              <MarketCard
                title="Demanda Histórica"
                description="Evolución últimos 3-5 años"
                rating={formData.historicalDemandRating}
                items={formData.historicalDemandData}
                onOpenModal={() =>
                  openModal("historicalDemand", formData.historicalDemandData)
                }
              />
              <MarketCard
                title="Demanda Proyectada"
                description="Estimación próximos 5-10 años"
                rating={formData.projectedDemandRating}
                items={formData.projectedDemandData}
                onOpenModal={() =>
                  openModal("projectedDemand", formData.projectedDemandData)
                }
              />
              <MarketCard
                title="Estacionalidad"
                description="Variaciones mensuales/trimestrales"
                rating={formData.seasonalityRating}
                items={formData.seasonalityData}
                onOpenModal={() =>
                  openModal("seasonality", formData.seasonalityData)
                }
              />
              <MarketCard
                title="Elasticidad Precio-Demanda"
                description="Sensibilidad a cambios de precio"
                rating={formData.priceElasticityRating}
                items={formData.priceElasticityData}
                onOpenModal={() =>
                  openModal("priceElasticity", formData.priceElasticityData)
                }
              />
              <MarketCard
                title="Demanda Insatisfecha"
                description="Gap entre oferta y demanda actual"
                rating={formData.unsatisfiedDemandRating}
                items={formData.unsatisfiedDemandData}
                onOpenModal={() =>
                  openModal("unsatisfiedDemand", formData.unsatisfiedDemandData)
                }
              />
            </div>
          </div>

          {/* 1.4 Competencia */}
          <div className="market-subsection">
            <h5>Análisis de Competencia</h5>
            <div className="section-grid">
              <MarketCard
                title="Competidores Directos"
                description="Número y características principales"
                rating={formData.directCompetitorsRating}
                items={formData.directCompetitorsData}
                onOpenModal={() =>
                  openModal("directCompetitors", formData.directCompetitorsData)
                }
              />
              <MarketCard
                title="Participación de Mercado"
                description="% que controla cada competidor"
                rating={formData.marketShareRating}
                items={formData.marketShareData}
                onOpenModal={() =>
                  openModal("marketShare", formData.marketShareData)
                }
              />
              <MarketCard
                title="Precios de Competidores"
                description="Rango de precios del mercado"
                rating={formData.competitorPricingRating}
                items={formData.competitorPricingData}
                onOpenModal={() =>
                  openModal("competitorPricing", formData.competitorPricingData)
                }
              />
              <MarketCard
                title="Ubicación y Cobertura"
                description="Dónde operan los competidores"
                rating={formData.competitorLocationRating}
                items={formData.competitorLocationData}
                onOpenModal={() =>
                  openModal(
                    "competitorLocation",
                    formData.competitorLocationData
                  )
                }
              />
            </div>
          </div>

          {/* 1.5 Precios */}
          <div className="market-subsection">
            <h5>Estrategia de Precios</h5>
            <div className="section-grid">
              <MarketCard
                title="Precios del Mercado"
                description="Promedio y rangos del sector"
                rating={formData.marketPricingRating}
                items={formData.marketPricingData}
                onOpenModal={() =>
                  openModal("marketPricing", formData.marketPricingData)
                }
              />
              <MarketCard
                title="Evolución de Precios"
                description="Histórico últimos 3-5 años"
                rating={formData.priceEvolutionRating}
                items={formData.priceEvolutionData}
                onOpenModal={() =>
                  openModal("priceEvolution", formData.priceEvolutionData)
                }
              />
              <MarketCard
                title="Márgenes del Sector"
                description="% de ganancia promedio"
                rating={formData.profitMarginsRating}
                items={formData.profitMarginsData}
                onOpenModal={() =>
                  openModal("profitMargins", formData.profitMarginsData)
                }
              />
            </div>
          </div>

          {/* 1.6 Canales de Distribución */}
          <div className="market-subsection">
            <h5>Canales de Distribución</h5>
            <div className="section-grid">
              <MarketCard
                title="Tipos de Canales"
                description="Directo, mayorista, minorista, online"
                rating={formData.distributionChannelsRating}
                items={formData.distributionChannelsData}
                onOpenModal={() =>
                  openModal(
                    "distributionChannels",
                    formData.distributionChannelsData
                  )
                }
              />
              <MarketCard
                title="Cobertura Geográfica"
                description="% de penetración por región"
                rating={formData.geographicCoverageRating}
                items={formData.geographicCoverageData}
                onOpenModal={() =>
                  openModal(
                    "geographicCoverage",
                    formData.geographicCoverageData
                  )
                }
              />
              <MarketCard
                title="Costos de Distribución"
                description="% sobre precio final"
                rating={formData.distributionCostsRating}
                items={formData.distributionCostsData}
                onOpenModal={() =>
                  openModal("distributionCosts", formData.distributionCostsData)
                }
              />
            </div>
          </div>

          {/* 1.7 Consumidor/Cliente */}
          <div className="market-subsection">
            <h5>Perfil del Consumidor</h5>
            <div className="section-grid">
              <MarketCard
                title="Comportamiento de Compra"
                description="Frecuencia, ticket promedio, retención"
                rating={formData.purchaseBehaviorRating}
                items={formData.purchaseBehaviorData}
                onOpenModal={() =>
                  openModal("purchaseBehavior", formData.purchaseBehaviorData)
                }
              />
              <MarketCard
                title="Capacidad de Pago"
                description="Ingresos disponibles del segmento"
                rating={formData.paymentCapacityRating}
                items={formData.paymentCapacityData}
                onOpenModal={() =>
                  openModal("paymentCapacity", formData.paymentCapacityData)
                }
              />
              <MarketCard
                title="Costo de Adquisición"
                description="Inversión para captar un cliente"
                rating={formData.customerAcquisitionRating}
                items={formData.customerAcquisitionData}
                onOpenModal={() =>
                  openModal(
                    "customerAcquisition",
                    formData.customerAcquisitionData
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: DATOS CUALITATIVOS */}
        <div className="market-section">
          <h4 className="section-title-market-form">🎯 Datos Cualitativos</h4>

          {/* 2.1 Necesidades y Problemas */}
          <div className="market-subsection">
            <h5>Necesidades y Problemas del Mercado</h5>
            <div className="section-grid">
              <MarketCard
                title="Pain Points Principales"
                description="Qué frustra a los consumidores"
                rating={formData.painPointsRating}
                items={formData.painPointsAnalysis}
                onOpenModal={() =>
                  openModal("painPoints", formData.painPointsAnalysis)
                }
              />
              <MarketCard
                title="Necesidades No Cubiertas"
                description="Qué falta en el mercado actual"
                rating={formData.unmetNeedsRating}
                items={formData.unmetNeedsAnalysis}
                onOpenModal={() =>
                  openModal("unmetNeeds", formData.unmetNeedsAnalysis)
                }
              />
              <MarketCard
                title="Motivaciones de Compra"
                description="Por qué compran los consumidores"
                rating={formData.purchaseMotivationsRating}
                items={formData.purchaseMotivationsAnalysis}
                onOpenModal={() =>
                  openModal(
                    "purchaseMotivations",
                    formData.purchaseMotivationsAnalysis
                  )
                }
              />
            </div>
          </div>

          {/* 2.2 Comportamiento del Consumidor */}
          <div className="market-subsection">
            <h5>Comportamiento del Consumidor</h5>
            <div className="section-grid">
              <MarketCard
                title="Proceso de Decisión"
                description="Etapas de compra del consumidor"
                rating={formData.decisionProcessRating}
                items={formData.decisionProcessAnalysis}
                onOpenModal={() =>
                  openModal("decisionProcess", formData.decisionProcessAnalysis)
                }
              />
              <MarketCard
                title="Influenciadores"
                description="Quién influye en la decisión"
                rating={formData.influencersRating}
                items={formData.influencersAnalysis}
                onOpenModal={() =>
                  openModal("influencers", formData.influencersAnalysis)
                }
              />
              <MarketCard
                title="Criterios de Selección"
                description="Qué valoran más al comprar"
                rating={formData.selectionCriteriaRating}
                items={formData.selectionCriteriaAnalysis}
                onOpenModal={() =>
                  openModal(
                    "selectionCriteria",
                    formData.selectionCriteriaAnalysis
                  )
                }
              />
            </div>
          </div>

          {/* 2.3 Percepción y Preferencias */}
          <div className="market-subsection">
            <h5>Percepción y Preferencias</h5>
            <div className="section-grid">
              <MarketCard
                title="Atributos Valorados"
                description="Características más importantes"
                rating={formData.valuedAttributesRating}
                items={formData.valuedAttributesAnalysis}
                onOpenModal={() =>
                  openModal(
                    "valuedAttributes",
                    formData.valuedAttributesAnalysis
                  )
                }
              />
              <MarketCard
                title="Sensibilidad al Precio"
                description="Importancia del precio vs. calidad"
                rating={formData.priceSensitivityRating}
                items={formData.priceSensitivityAnalysis}
                onOpenModal={() =>
                  openModal(
                    "priceSensitivity",
                    formData.priceSensitivityAnalysis
                  )
                }
              />
              <MarketCard
                title="Preferencias de Marca"
                description="Marcas preferidas y por qué"
                rating={formData.brandPreferencesRating}
                items={formData.brandPreferencesAnalysis}
                onOpenModal={() =>
                  openModal(
                    "brandPreferences",
                    formData.brandPreferencesAnalysis
                  )
                }
              />
            </div>
          </div>

          {/* 2.4 Análisis de Competencia (Cualitativo) */}
          <div className="market-subsection">
            <h5>Análisis Cualitativo de Competencia</h5>
            <div className="section-grid">
              <MarketCard
                title="Fortalezas de Competidores"
                description="Qué hacen bien los competidores"
                rating={formData.competitorStrengthsRating}
                items={formData.competitorStrengthsAnalysis}
                onOpenModal={() =>
                  openModal(
                    "competitorStrengths",
                    formData.competitorStrengthsAnalysis
                  )
                }
              />
              <MarketCard
                title="Debilidades de Competidores"
                description="Dónde fallan los competidores"
                rating={formData.competitorWeaknessesRating}
                items={formData.competitorWeaknessesAnalysis}
                onOpenModal={() =>
                  openModal(
                    "competitorWeaknesses",
                    formData.competitorWeaknessesAnalysis
                  )
                }
              />
              <MarketCard
                title="Estrategias de Marketing"
                description="Cómo se promocionan los competidores"
                rating={formData.competitorMarketingRating}
                items={formData.competitorMarketingAnalysis}
                onOpenModal={() =>
                  openModal(
                    "competitorMarketing",
                    formData.competitorMarketingAnalysis
                  )
                }
              />
            </div>
          </div>

          {/* 2.5 Tendencias del Mercado */}
          <div className="market-subsection">
            <h5>Tendencias del Mercado</h5>
            <div className="section-grid">
              <MarketCard
                title="Tendencias Emergentes"
                description="Nuevos comportamientos o tecnologías"
                rating={formData.emergingTrendsRating}
                items={formData.emergingTrendsAnalysis}
                onOpenModal={() =>
                  openModal("emergingTrends", formData.emergingTrendsAnalysis)
                }
              />
              <MarketCard
                title="Cambios Regulatorios"
                description="Nuevas leyes que afectan el sector"
                rating={formData.regulatoryChangesRating}
                items={formData.regulatoryChangesAnalysis}
                onOpenModal={() =>
                  openModal(
                    "regulatoryChanges",
                    formData.regulatoryChangesAnalysis
                  )
                }
              />
              <MarketCard
                title="Innovaciones del Sector"
                description="Nuevos productos/servicios"
                rating={formData.sectorInnovationsRating}
                items={formData.sectorInnovationsAnalysis}
                onOpenModal={() =>
                  openModal(
                    "sectorInnovations",
                    formData.sectorInnovationsAnalysis
                  )
                }
              />
            </div>
          </div>

          {/* 2.6 Factores Externos (PESTEL) */}
          <div className="market-subsection">
            <h5>Factores Externos (PESTEL)</h5>
            <div className="section-grid">
              <MarketCard
                title="Factores Políticos y Económicos"
                description="Estabilidad, políticas, inflación"
                rating={formData.politicalEconomicRating}
                items={formData.politicalEconomicAnalysis}
                onOpenModal={() =>
                  openModal(
                    "politicalEconomic",
                    formData.politicalEconomicAnalysis
                  )
                }
              />
              <MarketCard
                title="Factores Sociales y Tecnológicos"
                description="Demografía, cultura, digitalización"
                rating={formData.socialTechnologicalRating}
                items={formData.socialTechnologicalAnalysis}
                onOpenModal={() =>
                  openModal(
                    "socialTechnological",
                    formData.socialTechnologicalAnalysis
                  )
                }
              />
              <MarketCard
                title="Factores Ecológicos y Legales"
                description="Sostenibilidad, normativas"
                rating={formData.environmentalLegalRating}
                items={formData.environmentalLegalAnalysis}
                onOpenModal={() =>
                  openModal(
                    "environmentalLegal",
                    formData.environmentalLegalAnalysis
                  )
                }
              />
            </div>
          </div>

          {/* 2.7 Oportunidades y Amenazas */}
          <div className="market-subsection">
            <h5>Oportunidades y Amenazas</h5>
            <div className="section-grid">
              <MarketCard
                title="Oportunidades Identificadas"
                description="Nichos, ventanas de oportunidad"
                rating={formData.opportunitiesRating}
                items={formData.opportunitiesAnalysis}
                onOpenModal={() =>
                  openModal("opportunities", formData.opportunitiesAnalysis)
                }
              />
              <MarketCard
                title="Amenazas del Mercado"
                description="Riesgos, barreras de entrada"
                rating={formData.threatsRating}
                items={formData.threatsAnalysis}
                onOpenModal={() =>
                  openModal("threats", formData.threatsAnalysis)
                }
              />
            </div>
          </div>
        </div>
        
        {/* Footer con navegación - ACTUALIZADO */}
        <div className="market-form-main-footer">
          <div className="market-form-footer-actions">
            <div className="market-form-nav-buttons">
              <button
                onClick={onNavigateToTechnical}
                className="market-form-nav-btn market-form-nav-btn--technical market-form-nav-btn--large"
              >
                ← 🔧 Volver a Análisis Técnico
              </button>

              {/* ✅ BOTÓN DE REVISIÓN REEMPLAZA AL BOTÓN FINANCIERO */}
              {isReviewInProgress ? (
                <button className="market-form-review-in-progress-btn" disabled>
                  🔍 En Revisión
                </button>
              ) : (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="market-form-review-request-btn market-form-nav-btn--large"
                >
                  🔍 Solicitar Revisión del Proyecto
                </button>
              )}
            </div>

            <div className="market-form-footer-info">
              <p className="market-form-footer-text">
                <strong>💡 ¿Listo para la revisión?</strong>
                <br />
                {isReviewInProgress
                  ? "Tu proyecto está siendo revisado por nuestro equipo de expertos."
                  : "Envía tu análisis para recibir feedback y recomendaciones personalizadas."}
              </p>
            </div>
          </div>

          <div className="market-form-save-section">
            <button
              onClick={handleSaveAll}
              className="market-form-save-btn market-form-save-btn--large"
              disabled={saving || completedFields === 0}
            >
              {saving
                ? "💾 Guardando..."
                : "💾 Guardar Todo el Análisis de Mercado"}
            </button>
            <div className="market-form-save-hint">
              {saving
                ? "Guardando en la base de datos..."
                : completedFields === 0
                ? "Completa al menos un campo para poder guardar"
                : `✅ ${completedFields} campos listos para guardar`}
            </div>
          </div>
        </div>

        {/* ✅ MODAL DE SOLICITUD DE REVISIÓN */}
        <MarketReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onConfirmReview={handleConfirmReview} // ✅ Ya tiene los datos internamente
          isReviewInProgress={isReviewInProgress}
        />

        {/* Gestor de Modales */}
        <MarketReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onConfirmReview={handleConfirmReview}
          isReviewInProgress={isReviewInProgress}
          projectId={projectId} // ✅ Usar la prop que SÍ existe
          userId={userId}
        />
      </div>
    );
  }
);

// Componente de Tarjeta de Mercado
const MarketCard = ({ title, description, rating, items, onOpenModal }) => {
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
    <div className="market-card">
      <div className="market-card-header">
        <div>
          <label className="market-card-label">{title}</label>
          <div className="market-card-description">{description}</div>
        </div>
        <button 
          className="market-btn-modal"
          onClick={onOpenModal}
        >
          {items?.length ? '✏️ Editar' : '➕ Agregar'}
        </button>
      </div>
      
      <div className="market-card-rating">
        <span 
          className="market-rating-badge"
          style={{ backgroundColor: getRatingColor(rating) }}
        >
          {getRatingText(rating)}
        </span>
      </div>
      
      <div className="market-card-items">
        {items?.slice(0, 3).map((item, index) => (
          <div key={index} className="market-card-item">
            <span className="market-item-name">{item.description || item.name}</span>
          </div>
        ))}
        {items?.length > 3 && (
          <div className="market-card-more">+{items.length - 3} elementos más</div>
        )}
        {(!items || items.length === 0) && (
          <div className="market-card-empty">No hay información agregada</div>
        )}
      </div>
    </div>
  );
};