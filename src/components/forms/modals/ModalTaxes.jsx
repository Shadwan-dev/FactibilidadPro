// src/components/forms/modals/ModalTaxes.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalTaxes.module.css';

export const ModalTaxes = ({ existingData, onSave, onClose, analysisYears }) => {
  const defaultTaxes = [
    { 
      id: 'labor_tax', 
      name: 'Impuesto Aprovechamiento Mano de Obra', 
      rate: 5, 
      description: 'Impuesto por utilización de mano de obra',
      base: 'salaries',
      mandatory: true
    },
    { 
      id: 'social_security', 
      name: 'Aporte Seguridad Social', 
      rate: 12.5, 
      description: 'Aportes a seguridad social',
      base: 'salaries', 
      mandatory: true
    },
    { 
      id: 'special_contribution', 
      name: 'Aporte Especial', 
      rate: 1.5, 
      description: 'Aporte especial para el desarrollo',
      base: 'salaries',
      mandatory: true
    },
    { 
      id: 'local_development', 
      name: 'Aporte Desarrollo Local', 
      rate: 1, 
      description: 'Impuesto municipal para desarrollo',
      base: 'salaries',
      mandatory: true
    }
  ];

  const [selectedTaxes, setSelectedTaxes] = useState(() => {
    if (existingData && existingData.length > 0) {
      return existingData;
    }
    return defaultTaxes.filter(tax => tax.mandatory);
  });

  const [customTaxes, setCustomTaxes] = useState([]);
  const [newCustomTax, setNewCustomTax] = useState({ name: '', rate: '', description: '' });

  const toggleTax = (tax) => {
    if (tax.mandatory) return; // No se pueden deseleccionar impuestos obligatorios
    
    setSelectedTaxes(prev => 
      prev.find(t => t.id === tax.id) 
        ? prev.filter(t => t.id !== tax.id)
        : [...prev, tax]
    );
  };

  const addCustomTax = () => {
    if (newCustomTax.name && newCustomTax.rate) {
      const customTax = {
        ...newCustomTax,
        id: `custom_${Date.now()}`,
        rate: parseFloat(newCustomTax.rate),
        base: 'custom',
        mandatory: false
      };
      setCustomTaxes(prev => [...prev, customTax]);
      setSelectedTaxes(prev => [...prev, customTax]);
      setNewCustomTax({ name: '', rate: '', description: '' });
    }
  };

  const deleteCustomTax = (id) => {
    setCustomTaxes(prev => prev.filter(tax => tax.id !== id));
    setSelectedTaxes(prev => prev.filter(tax => tax.id !== id));
  };

  const save = () => {
    onSave('taxes', selectedTaxes);
    onClose();
  };

  const totalRate = useMemo(() => {
    return selectedTaxes.reduce((total, tax) => total + (tax.rate || 0), 0);
  }, [selectedTaxes]);

  const isTaxSelected = (taxId) => {
    return selectedTaxes.some(tax => tax.id === taxId);
  };

  return (
    <div className={styles.modalTaxesContent}>
      <div className={styles.modalTaxesHeader}>
        <h3>🏛️ Impuestos y Contribuciones</h3>
        <button className={styles.modalTaxesCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalTaxesBody}>
        {/* Impuestos predefinidos */}
        <div className={styles.modalTaxesSection}>
          <h4>Contribuciones Estándar</h4>
          <div className={styles.modalTaxesGrid}>
            {defaultTaxes.map(tax => (
              <div 
                key={tax.id} 
                className={`${styles.modalTaxesItem} ${tax.mandatory ? styles.modalTaxesItemMandatory : ''}`}
              >
                <label className={styles.modalTaxesCheckbox}>
                  <input
                    type="checkbox"
                    checked={isTaxSelected(tax.id)}
                    onChange={() => toggleTax(tax)}
                    disabled={tax.mandatory}
                  />
                  <div className={styles.modalTaxesInfo}>
                    <div className={styles.modalTaxesName}>
                      {tax.name}
                      {tax.mandatory && (
                        <span className={styles.modalTaxesMandatoryBadge}>
                          Obligatorio
                        </span>
                      )}
                    </div>
                    <div className={styles.modalTaxesDescription}>{tax.description}</div>
                  </div>
                </label>
                <div className={styles.modalTaxesRate}>{tax.rate}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Impuestos personalizados */}
        <div className={styles.modalTaxesSection}>
          <h4>Impuestos Personalizados</h4>
          <div className={styles.modalTaxesForm}>
            <div className={styles.modalTaxesFormGrid}>
              <input
                type="text"
                placeholder="Nombre del Impuesto"
                value={newCustomTax.name}
                onChange={(e) => setNewCustomTax(prev => ({ ...prev, name: e.target.value }))}
                className={styles.modalTaxesInput}
              />
              <input
                type="number"
                placeholder="Tasa %"
                value={newCustomTax.rate}
                onChange={(e) => setNewCustomTax(prev => ({ ...prev, rate: e.target.value }))}
                className={styles.modalTaxesInput}
                step="0.1"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newCustomTax.description}
                onChange={(e) => setNewCustomTax(prev => ({ ...prev, description: e.target.value }))}
                className={styles.modalTaxesInput}
              />
              <button onClick={addCustomTax} className={styles.modalTaxesBtnPrimary}>
                ➕ Agregar Impuesto
              </button>
            </div>
          </div>

          {customTaxes.length > 0 ? (
            <div className={styles.modalTaxesCustomList}>
              {customTaxes.map(tax => (
                <div key={tax.id} className={styles.modalTaxesItem}>
                  <div className={styles.modalTaxesInfo}>
                    <div className={styles.modalTaxesName}>{tax.name}</div>
                    <div className={styles.modalTaxesDescription}>{tax.description}</div>
                  </div>
                  <div className={styles.modalTaxesActions}>
                    <span className={styles.modalTaxesRate}>{tax.rate}%</span>
                    <button 
                      onClick={() => deleteCustomTax(tax.id)}
                      className={styles.modalTaxesBtnDelete}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.modalTaxesEmptyState}>
              <p>No hay impuestos personalizados agregados</p>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className={styles.modalTaxesTotals}>
          <div className={styles.modalTaxesTotalRow}>
            <strong>Impuestos Seleccionados:</strong>
            <strong>{selectedTaxes.length} elementos</strong>
          </div>
          <div className={`${styles.modalTaxesTotalRow} ${styles.modalTaxesTotalHighlight}`}>
            <strong>Tasa de Impuesto Total:</strong>
            <strong>{totalRate.toFixed(1)}%</strong>
          </div>
          <div className={styles.modalTaxesNote}>
            * Basado en el total de salarios: 19% estándar + impuestos personalizados
          </div>
        </div>
      </div>

      <div className={styles.modalTaxesFooter}>
        <button onClick={onClose} className={styles.modalTaxesBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalTaxesBtnPrimary}>Guardar Impuestos</button>
      </div>
    </div>
  );
};