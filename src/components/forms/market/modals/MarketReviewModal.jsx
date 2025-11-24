// src/components/forms/market/MarketReviewModal.jsx
import React, { useState } from 'react';

export const MarketReviewModal = ({ 
  isOpen, 
  onClose, 
  onConfirmReview,
  isReviewInProgress 
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmitReview = () => {
    setIsConfirmed(true);
    // Esperar un momento para mostrar la confirmación antes de cerrar
    setTimeout(() => {
      onConfirmReview();
      onClose();
      setIsConfirmed(false); // Resetear para la próxima vez
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="market-form-review-modal-overlay">
      <div className="market-form-review-modal">
        <div className="market-form-review-modal-header">
          <h3 className="market-form-review-modal-title">
            {isConfirmed ? '✅ ¡Enviado Exitosamente!' : '🔍 Solicitar Revisión del Proyecto'}
          </h3>
          <p className="market-form-review-modal-subtitle">
            {isConfirmed 
              ? 'Tu proyecto ha sido enviado para revisión' 
              : 'Envía tu análisis de mercado para evaluación'
            }
          </p>
          <button 
            className="market-form-review-modal-close" 
            onClick={onClose}
            disabled={isConfirmed}
          >
            ×
          </button>
        </div>

        <div className="market-form-review-modal-content">
          {!isConfirmed ? (
            <>
              <div className="market-form-review-modal-icon">📊</div>
              <p className="market-form-review-modal-text">
                ¿Estás seguro de que quieres enviar tu <strong>Análisis de Mercado</strong> para revisión?
              </p>
              
              <div className="market-form-review-checklist">
                <div className="market-form-review-checklist-item">
                  <span className="market-form-review-checklist-icon">✅</span>
                  <span>Tu información será revisada por nuestro equipo</span>
                </div>
                <div className="market-form-review-checklist-item">
                  <span className="market-form-review-checklist-icon">✅</span>
                  <span>Recibirás comentarios y recomendaciones</span>
                </div>
                <div className="market-form-review-checklist-item">
                  <span className="market-form-review-checklist-icon">✅</span>
                  <span>El estado cambiará a "En Revisión"</span>
                </div>
              </div>

              <button 
                className="market-form-review-submit-btn"
                onClick={handleSubmitReview}
              >
                🚀 Enviar para Revisión
              </button>
            </>
          ) : (
            <div className="market-form-review-confirmation">
              <div className="market-form-review-success-icon">🎉</div>
              <h4 className="market-form-review-success-text">
                ¡Proyecto Enviado!
              </h4>
              <p className="market-form-review-success-subtext">
                Tu análisis de mercado está siendo revisado por nuestro equipo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};