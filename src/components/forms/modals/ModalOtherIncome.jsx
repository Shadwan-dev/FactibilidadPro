// src/components/forms/modals/ModalOtherIncome.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalOtherIncome.module.css';

export const ModalOtherIncome = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    description: '', 
    amount: '',
    frequency: 'annual',
    certainty: 'high',
    notes: ''
  });

  const addItem = () => {
    if (newItem.description && newItem.amount) {
      const amount = parseFloat(newItem.amount) || 0;
      const annualAmount = newItem.frequency === 'monthly' ? amount * 12 : 
                          newItem.frequency === 'quarterly' ? amount * 4 : amount;
      const totalProjected = annualAmount * analysisYears;
      
      setItems(prev => [...prev, {
        ...newItem,
        amount,
        annualAmount,
        totalProjected,
        id: Date.now() + Math.random()
      }]);
      setNewItem({ 
        description: '', 
        amount: '',
        frequency: 'annual',
        certainty: 'high',
        notes: ''
      });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('otherIncome', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualAmount || 0), 0);
    const totalProjected = items.reduce((sum, item) => sum + (item.totalProjected || 0), 0);
    
    return { totalAnnual, totalProjected };
  }, [items]);

  const getCertaintyClass = (certainty) => {
    switch(certainty) {
      case 'high': return styles.modalOtherIncomeCertaintyHigh;
      case 'medium': return styles.modalOtherIncomeCertaintyMedium;
      case 'low': return styles.modalOtherIncomeCertaintyLow;
      case 'speculative': return styles.modalOtherIncomeCertaintySpeculative;
      default: return styles.modalOtherIncomeCertaintyMedium;
    }
  };

  const getCertaintyText = (certainty) => {
    switch(certainty) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      case 'speculative': return 'Especulativo';
      default: return 'Media';
    }
  };

  const getFrequencyText = (frequency) => {
    switch(frequency) {
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      case 'annual': return 'Anual';
      case 'one-time': return 'Una vez';
      default: return frequency;
    }
  };

  return (
    <div className={styles.modalOtherIncomeContent}>
      <div className={styles.modalOtherIncomeHeader}>
        <h3>📝 Otras Fuentes de Ingresos</h3>
        <button className={styles.modalOtherIncomeCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalOtherIncomeBody}>
        <div className={styles.modalOtherIncomeForm}>
          <div className={styles.modalOtherIncomeFormGrid}>
            <input
              type="text"
              placeholder="Descripción (ej: Regalías, Comisiones)"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className={styles.modalOtherIncomeInput}
            />
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalOtherIncomeInput}
            />
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
              className={styles.modalOtherIncomeSelect}
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
              <option value="one-time">Una vez</option>
            </select>
            <select
              value={newItem.certainty}
              onChange={(e) => setNewItem(prev => ({ ...prev, certainty: e.target.value }))}
              className={styles.modalOtherIncomeSelect}
            >
              <option value="high">Alta Certeza</option>
              <option value="medium">Certeza Media</option>
              <option value="low">Baja Certeza</option>
              <option value="speculative">Especulativo</option>
            </select>
            <input
              type="text"
              placeholder="Notas (opcional)"
              value={newItem.notes}
              onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
              className={styles.modalOtherIncomeInput}
            />
            <button onClick={addItem} className={styles.modalOtherIncomeBtnPrimary}>
              ➕ Agregar Ingreso
            </button>
          </div>
        </div>

        <div className={styles.modalOtherIncomeItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalOtherIncomeListHeader}>
                <span>Descripción</span>
                <span>Anual</span>
                <span>Certeza</span>
                <span>Proyectado</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalOtherIncomeItemRow}>
                  <span className={styles.modalOtherIncomeItemName}>
                    {item.description}
                    {item.notes && (
                      <div className={styles.modalOtherIncomeNotes}>
                        {item.notes}
                      </div>
                    )}
                    <div className={styles.modalOtherIncomeFrequency}>
                      {getFrequencyText(item.frequency)}
                    </div>
                  </span>
                  <span className={styles.modalOtherIncomeItemAmount}>${item.annualAmount?.toLocaleString()}</span>
                  <span className={`${styles.modalOtherIncomeCertaintyBadge} ${getCertaintyClass(item.certainty)}`}>
                    {getCertaintyText(item.certainty)}
                  </span>
                  <span className={styles.modalOtherIncomeItemAmount}>${item.totalProjected?.toLocaleString()}</span>
                  <button onClick={() => deleteItem(item.id)} className={styles.modalOtherIncomeBtnDelete}>
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalOtherIncomeEmptyState}>
              <div className={styles.modalOtherIncomeEmptyStateIcon}>📝</div>
              <p>No hay otras fuentes de ingresos agregadas</p>
              <p>Comienza agregando la primera fuente usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalOtherIncomeTotals}>
            <div className={styles.modalOtherIncomeTotalRow}>
              <strong>Total Otros Ingresos Anuales:</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalOtherIncomeTotalRow} ${styles.modalOtherIncomeTotalHighlight}`}>
              <strong>Total Proyectado ({analysisYears} años):</strong>
              <strong>${totals.totalProjected.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalOtherIncomeFooter}>
        <button onClick={onClose} className={styles.modalOtherIncomeBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalOtherIncomeBtnPrimary}>Guardar Otros Ingresos</button>
      </div>
    </div>
  );
};