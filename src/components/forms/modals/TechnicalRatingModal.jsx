// TechnicalRatingModal.jsx - CON BOTÓN DE GUARDAR EVALUACIÓN
import React, { useState, useEffect } from 'react';
import '../../../styles/components/forms/technical-modals.css';
import '../../../styles/components/forms/technical-modal-forms.css';

export const TechnicalRatingModal = ({ 
  title, 
  description, 
  existingData, 
  onSave, 
  onClose, 
  field 
}) => {
  const [items, setItems] = useState([]);
  const [rating, setRating] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Inicializar con los datos existentes
  useEffect(() => {
    if (existingData) {
      setItems(existingData);
    }
  }, [existingData]);

  const ratingOptions = [
    { value: 'excellent', label: 'Excelente', color: '#10b981', description: 'Cumple ampliamente con los requisitos' },
    { value: 'good', label: 'Buena', color: '#3b82f6', description: 'Cumple adecuadamente con los requisitos' },
    { value: 'regular', label: 'Regular', color: '#f59e0b', description: 'Cumple parcialmente con los requisitos' },
    { value: 'poor', label: 'Mala', color: '#ef4444', description: 'No cumple adecuadamente con los requisitos' }
  ];

  const [newItem, setNewItem] = useState({ description: '' });

  const addItem = () => {
    if (newItem.description.trim()) {
      setItems(prev => [...prev, {
        ...newItem,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString()
      }]);
      setNewItem({ description: '' });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveEvaluation = async () => {
    if (!rating) {
      alert('Por favor selecciona una evaluación general antes de guardar.');
      return;
    }

    setIsSaving(true);
    
    try {
      // ✅ Llamar onSave con los datos de la evaluación
      if (onSave) {
        await onSave(field, items, rating);
      }
      
      // Pequeño delay para mostrar feedback visual
      setTimeout(() => {
        setIsSaving(false);
        // El cierre lo maneja el hook ahora
      }, 500);
      
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      setIsSaving(false);
      alert('Error al guardar la evaluación. Por favor intenta nuevamente.');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // ✅ Manejar tecla Escape para cerrar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ✅ Prevenir scroll del body cuando la modal está abierta
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="technical-modal-overlay" onClick={handleClose}>
      <div className="technical-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="technical-modal-header">
          <h3>{title}</h3>
          <button className="technical-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="technical-modal-body">
          {description && (
            <div className="technical-modal-description">
              <p>{description}</p>
            </div>
          )}

          {/* Selección de Rating */}
          <div className="technical-rating-section">
            <h4>Evaluación General *</h4>
            <div className="technical-rating-options">
              {ratingOptions.map(option => (
                <label key={option.value} className="technical-rating-option">
                  <input
                    type="radio"
                    name="technicalRating"
                    value={option.value}
                    checked={rating === option.value}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <div 
                    className="technical-rating-card"
                    style={{ borderColor: rating === option.value ? option.color : '#e5e7eb' }}
                  >
                    <div 
                      className="technical-rating-indicator"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <div className="technical-rating-info">
                      <div className="technical-rating-label">{option.label}</div>
                      <div className="technical-rating-description">{option.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {!rating && (
              <div className="technical-rating-warning">
                ⚠️ Debes seleccionar una evaluación general
              </div>
            )}
          </div>

          {/* Detalles específicos */}
          <div className="technical-details-section">
            <h4>Detalles Específicos</h4>
            <div className="technical-modal-form">
              <div className="technical-form-row">
                <input
                  type="text"
                  placeholder="Agregar detalle específico..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ description: e.target.value })}
                  className="technical-input-field"
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                />
                <button onClick={addItem} className="technical-btn technical-btn--primary">
                  ➕ Agregar
                </button>
              </div>
            </div>

            <div className="technical-items-list">
              {items.map((item) => (
                <div key={item.id} className="technical-item-row">
                  <span className="technical-item-name">{item.description}</span>
                  <button 
                    onClick={() => deleteItem(item.id)} 
                    className="technical-btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="technical-item-row">
                  <span className="technical-item-name" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No hay detalles agregados
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="technical-modal-footer">
          <button 
            onClick={handleClose} 
            className="technical-btn technical-btn--secondary"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveEvaluation} 
            className="technical-btn technical-btn--primary"
            disabled={isSaving || !rating}
          >
            {isSaving ? (
              <>
                <span className="technical-saving-spinner">⏳</span>
                Guardando...
              </>
            ) : (
              '💾 Guardar Evaluación'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};