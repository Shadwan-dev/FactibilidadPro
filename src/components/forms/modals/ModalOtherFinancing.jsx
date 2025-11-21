// src/components/forms/modals/ModalOtherFinancing.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalOtherFinancing.module.css';

export const ModalOtherFinancing = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    source: '', 
    amount: '',
    type: 'grant',
    conditions: '',
    repayment: 'none'
  });

  const addItem = () => {
    if (newItem.source && newItem.amount) {
      const amount = parseFloat(newItem.amount) || 0;
      
      setItems(prev => [...prev, {
        ...newItem,
        amount,
        id: Date.now() + Math.random()
      }]);
      setNewItem({ 
        source: '', 
        amount: '',
        type: 'grant',
        conditions: '',
        repayment: 'none'
      });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('otherFinancing', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const grants = items.filter(item => item.type === 'grant').reduce((sum, item) => sum + (item.amount || 0), 0);
    const repayable = items.filter(item => item.repayment !== 'none').reduce((sum, item) => sum + (item.amount || 0), 0);
    
    return { totalAmount, grants, repayable };
  }, [items]);

  const getTypeClass = (type) => {
    switch(type) {
      case 'grant': return styles.modalOtherFinancingTypeGrant;
      case 'investor': return styles.modalOtherFinancingTypeInvestor;
      case 'subsidy': return styles.modalOtherFinancingTypeSubsidy;
      case 'crowdfunding': return styles.modalOtherFinancingTypeCrowdfunding;
      case 'other': return styles.modalOtherFinancingTypeOther;
      default: return styles.modalOtherFinancingTypeOther;
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'grant': return 'Subsidio';
      case 'investor': return 'Inversor';
      case 'subsidy': return 'Subvención';
      case 'crowdfunding': return 'Crowdfunding';
      case 'other': return 'Otro';
      default: return 'Otro';
    }
  };

  const getRepaymentText = (repayment) => {
    switch(repayment) {
      case 'none': return 'Sin Reembolso';
      case 'equity': return 'Intercambio Acciones';
      case 'revenue': return 'Participación Ingresos';
      case 'loan': return 'Términos Préstamo';
      default: return repayment;
    }
  };

  return (
    <div className={styles.modalOtherFinancingContent}>
      <div className={styles.modalOtherFinancingHeader}>
        <h3>🎯 Otras Fuentes de Financiamiento</h3>
        <button className={styles.modalOtherFinancingCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalOtherFinancingBody}>
        <div className={styles.modalOtherFinancingForm}>
          <div className={styles.modalOtherFinancingFormGrid}>
            <input
              type="text"
              placeholder="Fuente (ej: Subsidio Gubernamental, Inversor Ángel)"
              value={newItem.source}
              onChange={(e) => setNewItem(prev => ({ ...prev, source: e.target.value }))}
              className={styles.modalOtherFinancingInput}
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              className={styles.modalOtherFinancingSelect}
            >
              <option value="grant">Subsidio</option>
              <option value="investor">Inversor</option>
              <option value="subsidy">Subvención</option>
              <option value="crowdfunding">Crowdfunding</option>
              <option value="other">Otro</option>
            </select>
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalOtherFinancingInput}
            />
            <select
              value={newItem.repayment}
              onChange={(e) => setNewItem(prev => ({ ...prev, repayment: e.target.value }))}
              className={styles.modalOtherFinancingSelect}
            >
              <option value="none">Sin Reembolso</option>
              <option value="equity">Intercambio de Acciones</option>
              <option value="revenue">Participación en Ingresos</option>
              <option value="loan">Términos de Préstamo</option>
            </select>
            <input
              type="text"
              placeholder="Condiciones (opcional)"
              value={newItem.conditions}
              onChange={(e) => setNewItem(prev => ({ ...prev, conditions: e.target.value }))}
              className={styles.modalOtherFinancingInput}
            />
            <button onClick={addItem} className={styles.modalOtherFinancingBtnPrimary}>
              ➕ Agregar Fuente
            </button>
          </div>
        </div>

        <div className={styles.modalOtherFinancingItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalOtherFinancingListHeader}>
                <span>Fuente</span>
                <span>Tipo</span>
                <span>Monto</span>
                <span>Reembolso</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalOtherFinancingItemRow}>
                  <span className={styles.modalOtherFinancingItemName}>
                    {item.source}
                    {item.conditions && (
                      <div className={styles.modalOtherFinancingConditions}>
                        {item.conditions}
                      </div>
                    )}
                  </span>
                  <span className={`${styles.modalOtherFinancingTypeBadge} ${getTypeClass(item.type)}`}>
                    {getTypeText(item.type)}
                  </span>
                  <span className={styles.modalOtherFinancingItemAmount}>${item.amount?.toLocaleString()}</span>
                  <span className={styles.modalOtherFinancingItemRepayment}>
                    {getRepaymentText(item.repayment)}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className={styles.modalOtherFinancingBtnDelete}>
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalOtherFinancingEmptyState}>
              <div className={styles.modalOtherFinancingEmptyStateIcon}>🎯</div>
              <p>No hay otras fuentes de financiamiento agregadas</p>
              <p>Comienza agregando la primera fuente usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalOtherFinancingTotals}>
            <div className={styles.modalOtherFinancingTotalRow}>
              <strong>Total Otro Financiamiento:</strong>
              <strong>${totals.totalAmount.toLocaleString()}</strong>
            </div>
            <div className={styles.modalOtherFinancingTotalRow}>
              <strong>Subsidios y No Reembolsables:</strong>
              <strong>${totals.grants.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalOtherFinancingTotalRow} ${styles.modalOtherFinancingTotalHighlight}`}>
              <strong>Financiamiento Reembolsable:</strong>
              <strong>${totals.repayable.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalOtherFinancingFooter}>
        <button onClick={onClose} className={styles.modalOtherFinancingBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalOtherFinancingBtnPrimary}>Guardar Financiamiento</button>
      </div>
    </div>
  );
};