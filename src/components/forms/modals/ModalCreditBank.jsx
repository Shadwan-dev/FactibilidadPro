// src/components/forms/modals/ModalBankCredit.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalBankCredit.module.css';

export const ModalBankCredit = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    bankName: '', 
    amount: '',
    annualRate: '',
    term: '5',
    description: ''
  });

  const addItem = () => {
    if (newItem.bankName && newItem.amount && newItem.annualRate) {
      const amount = parseFloat(newItem.amount) || 0;
      const annualRate = parseFloat(newItem.annualRate) || 0;
      const term = parseInt(newItem.term) || 5;
      
      const annualInterest = amount * (annualRate / 100);
      const totalInterest = annualInterest * term;
      
      setItems(prev => [...prev, {
        ...newItem,
        amount,
        annualRate,
        term,
        annualInterest,
        totalInterest,
        id: Date.now() + Math.random()
      }]);
      setNewItem({ bankName: '', amount: '', annualRate: '', term: '5', description: '' });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('bankCredit', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalAnnualInterest = items.reduce((sum, item) => sum + (item.annualInterest || 0), 0);
    const totalInterest = items.reduce((sum, item) => sum + (item.totalInterest || 0), 0);
    
    return { totalAmount, totalAnnualInterest, totalInterest };
  }, [items]);

  return (
    <div className={styles.modalBankCreditContent}>
      <div className={styles.modalBankCreditHeader}>
        <h3>🏦 Créditos Bancarios y Préstamos</h3>
        <button className={styles.modalBankCreditCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalBankCreditBody}>
        <div className={styles.modalBankCreditForm}>
          <div className={styles.modalBankCreditFormGrid}>
            <input
              type="text"
              placeholder="Nombre del Banco"
              value={newItem.bankName}
              onChange={(e) => setNewItem(prev => ({ ...prev, bankName: e.target.value }))}
              className={styles.modalBankCreditInput}
            />
            <input
              type="number"
              placeholder="Monto del Préstamo $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalBankCreditInput}
            />
            <input
              type="number"
              placeholder="Tasa Anual %"
              value={newItem.annualRate}
              onChange={(e) => setNewItem(prev => ({ ...prev, annualRate: e.target.value }))}
              className={styles.modalBankCreditInput}
              step="0.1"
            />
            <select
              value={newItem.term}
              onChange={(e) => setNewItem(prev => ({ ...prev, term: e.target.value }))}
              className={styles.modalBankCreditSelect}
            >
              <option value="1">1 año</option>
              <option value="3">3 años</option>
              <option value="5">5 años</option>
              <option value="7">7 años</option>
              <option value="10">10 años</option>
              <option value="15">15 años</option>
            </select>
            <button onClick={addItem} className={styles.modalBankCreditBtnPrimary}>
              ➕ Agregar Crédito
            </button>
          </div>
        </div>

        <div className={styles.modalBankCreditItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalBankCreditListHeader}>
                <span>Banco</span>
                <span>Monto</span>
                <span>Tasa</span>
                <span>Plazo</span>
                <span>Interés Anual</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalBankCreditItemRow}>
                  <span className={styles.modalBankCreditItemName}>{item.bankName}</span>
                  <span className={styles.modalBankCreditItemAmount}>${item.amount?.toLocaleString()}</span>
                  <span className={styles.modalBankCreditItemRate}>{item.annualRate}%</span>
                  <span className={styles.modalBankCreditItemTerm}>{item.term} años</span>
                  <span className={styles.modalBankCreditItemAmount}>${item.annualInterest?.toLocaleString()}</span>
                  <button onClick={() => deleteItem(item.id)} className={styles.modalBankCreditBtnDelete}>
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalBankCreditEmptyState}>
              <div className={styles.modalBankCreditEmptyStateIcon}>🏦</div>
              <p>No hay créditos bancarios agregados</p>
              <p>Comienza agregando el primer crédito usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalBankCreditTotals}>
            <div className={styles.modalBankCreditTotalRow}>
              <strong>Total Monto de Crédito:</strong>
              <strong>${totals.totalAmount.toLocaleString()}</strong>
            </div>
            <div className={styles.modalBankCreditTotalRow}>
              <strong>Total Interés Anual:</strong>
              <strong>${totals.totalAnnualInterest.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalBankCreditTotalRow} ${styles.modalBankCreditTotalHighlight}`}>
              <strong>Total Interés ({analysisYears} años):</strong>
              <strong>${totals.totalInterest.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalBankCreditFooter}>
        <button onClick={onClose} className={styles.modalBankCreditBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalBankCreditBtnPrimary}>Guardar Créditos</button>
      </div>
    </div>
  );
};