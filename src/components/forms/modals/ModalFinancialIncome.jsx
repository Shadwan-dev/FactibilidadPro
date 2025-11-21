// src/components/forms/modals/ModalFinancialIncome.jsx
import React, { useState, useMemo } from 'react';
import styles from'../../../styles/components/forms/modals/ModalFinancialIncome.module.css';

export const ModalFinancialIncome = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    description: '', 
    amount: '',
    type: 'interest',
    frequency: 'annual',
    risk: 'low'
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
        type: 'interest',
        frequency: 'annual',
        risk: 'low'
      });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('financialIncome', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualAmount || 0), 0);
    const totalProjected = items.reduce((sum, item) => sum + (item.totalProjected || 0), 0);
    
    return { totalAnnual, totalProjected };
  }, [items]);

  const getRiskClass = (risk) => {
    switch(risk) {
      case 'low': return styles.modalFinancialIncomeRiskLow;
      case 'medium': return styles.modalFinancialIncomeRiskMedium;
      case 'high': return styles.modalFinancialIncomeRiskHigh;
      default: return styles.modalFinancialIncomeRiskLow;
    }
  };

  return (
    <div className={styles.modalFinancialIncomeContent}>
      <div className={styles.modalFinancialIncomeHeader}>
        <h3>💹 Ingresos Financieros</h3>
        <button className={styles.modalFinancialIncomeCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalFinancialIncomeBody}>
        <div className={styles.modalFinancialIncomeForm}>
          <div className={styles.modalFinancialIncomeFormGrid}>
            <input
              type="text"
              placeholder="Descripción (ej: Intereses Bancarios, Dividendos)"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className={styles.modalFinancialIncomeInput}
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              className={styles.modalFinancialIncomeSelect}
            >
              <option value="interest">Intereses</option>
              <option value="dividends">Dividendos</option>
              <option value="investments">Inversiones</option>
              <option value="other">Otro</option>
            </select>
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalFinancialIncomeInput}
            />
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
              className={styles.modalFinancialIncomeSelect}
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
            </select>
            <select
              value={newItem.risk}
              onChange={(e) => setNewItem(prev => ({ ...prev, risk: e.target.value }))}
              className={styles.modalFinancialIncomeSelect}
            >
              <option value="low">Bajo Riesgo</option>
              <option value="medium">Riesgo Medio</option>
              <option value="high">Alto Riesgo</option>
            </select>
            <button onClick={addItem} className={styles.modalFinancialIncomeBtnPrimary}>
              ➕ Agregar Ingreso
            </button>
          </div>
        </div>

        <div className={styles.modalFinancialIncomeItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalFinancialIncomeListHeader}>
                <span>Descripción</span>
                <span>Tipo</span>
                <span>Anual</span>
                <span>Riesgo</span>
                <span>Proyectado</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalFinancialIncomeItemRow}>
                  <span className={styles.modalFinancialIncomeItemName}>{item.description}</span>
                  <span className={styles.modalFinancialIncomeItemType}>{item.type}</span>
                  <span className={styles.modalFinancialIncomeItemAmount}>${item.annualAmount?.toLocaleString()}</span>
                  <span className={`${styles.modalFinancialIncomeRiskBadge} ${getRiskClass(item.risk)}`}>
                    {item.risk === 'low' ? 'Bajo' : item.risk === 'medium' ? 'Medio' : 'Alto'}
                  </span>
                  <span className={styles.modalFinancialIncomeItemAmount}>${item.totalProjected?.toLocaleString()}</span>
                  <button onClick={() => deleteItem(item.id)} className={styles.modalFinancialIncomeBtnDelete}>
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalFinancialIncomeEmptyState}>
              <div className={styles.modalFinancialIncomeEmptyStateIcon}>💹</div>
              <p>No hay ingresos financieros agregados</p>
              <p>Comienza agregando el primer ingreso usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalFinancialIncomeTotals}>
            <div className={styles.modalFinancialIncomeTotalRow}>
              <strong>Total Ingresos Financieros Anuales:</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalFinancialIncomeTotalRow} ${styles.modalFinancialIncomeTotalHighlight}`}>
              <strong>Total Proyectado ({analysisYears} años):</strong>
              <strong>${totals.totalProjected.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalFinancialIncomeFooter}>
        <button onClick={onClose} className={styles.modalFinancialIncomeBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalFinancialIncomeBtnPrimary}>Guardar Ingresos Financieros</button>
      </div>
    </div>
  );
};