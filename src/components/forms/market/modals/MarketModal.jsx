// src/components/forms/market/modals/MarketModal.jsx
import React, { useState, useEffect } from 'react';

export const MarketModal = ({
  isOpen,
  onClose,
  onSave,
  field,
  initialData = [],
  title,
  description,
  fields,
  allowMultiple = true
}) => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (isOpen) {
      setItems(initialData);
      setCurrentItem({});
      setRating('');
    }
  }, [isOpen, initialData]);

  const handleAddItem = () => {
    if (Object.values(currentItem).some(value => value && value.toString().trim() !== '')) {
      setItems(prev => [...prev, { ...currentItem, id: Date.now() }]);
      setCurrentItem({});
    }
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (items.length > 0 || !allowMultiple) {
      const dataToSave = allowMultiple ? items : [currentItem].filter(item => 
        Object.values(item).some(value => value && value.toString().trim() !== '')
      );
      onSave(field, dataToSave, rating);
    } else {
      onClose();
    }
  };

  const updateCurrentItem = (fieldName, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="market-form-modal-overlay">
      <div className="market-form-modal">
        <div className="market-form-modal-header">
          <h3 className="market-form-modal-title">{title}</h3>
          <p className="market-form-modal-description">{description}</p>
          <button 
            className="market-form-modal-close" 
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="market-form-modal-content">
          {/* Campos de entrada */}
          <div className="market-form-modal-fields">
            {fields.map((fieldName) => (
              <div key={fieldName} className="market-form-modal-field">
                <label className="market-form-modal-label">
                  {fieldName.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </label>
                <input
                  type="text"
                  value={currentItem[fieldName] || ''}
                  onChange={(e) => updateCurrentItem(fieldName, e.target.value)}
                  placeholder={`Ingrese ${fieldName.replace('_', ' ')}`}
                  className="market-form-modal-input"
                />
              </div>
            ))}
          </div>

          {allowMultiple && (
            <button 
              className="market-form-modal-add-btn"
              onClick={handleAddItem}
              disabled={!Object.values(currentItem).some(value => value && value.toString().trim() !== '')}
            >
              ➕ Agregar Item
            </button>
          )}

          {/* Lista de items agregados */}
          {items.length > 0 && (
            <div className="market-form-modal-items">
              <h4 className="market-form-modal-items-title">Items Agregados:</h4>
              {items.map((item, index) => (
                <div key={item.id || index} className="market-form-modal-item">
                  <span className="market-form-modal-item-text">
                    {Object.values(item).filter(val => val !== item.id).join(' - ')}
                  </span>
                  <button 
                    onClick={() => handleRemoveItem(index)}
                    className="market-form-modal-remove-btn"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Selección de rating */}
          <div className="market-form-modal-rating">
            <label className="market-form-modal-rating-label">Evaluación:</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              className="market-form-modal-rating-select"
            >
              <option value="">Seleccionar evaluación</option>
              <option value="excellent">Excelente</option>
              <option value="good">Buena</option>
              <option value="regular">Regular</option>
              <option value="poor">Mala</option>
            </select>
          </div>
        </div>

        <div className="market-form-modal-actions">
          <button 
            className="market-form-modal-cancel" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="market-form-modal-save"
            onClick={handleSave}
            disabled={!rating && items.length === 0}
          >
            💾 Guardar Evaluación
          </button>
        </div>
      </div>
    </div>
  );
};