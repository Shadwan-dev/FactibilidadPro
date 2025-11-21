// src/components/forms/modals/ModalCapital.jsx
import React, { useState } from 'react';
import styles from '../../../styles/components/forms/modals/ModalCapital.module.css';

export const ModalCapital = ({ existingData, onSave, onClose }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    amount: '',
    type: 'equity',
    description: ''
  });

  const addItem = () => {
    if (newItem.name && newItem.amount) {
      setItems(prev => [...prev, {
        ...newItem,
        amount: parseFloat(newItem.amount) || 0,
        id: Date.now() + Math.random()
      }]);
      setNewItem({ name: '', amount: '', type: 'equity', description: '' });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('capital', items);
    onClose();
  };

  const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className={styles.modalCapitalContent}>
      <div className={styles.modalCapitalHeader}>
        <h3>💼 Capital y Patrimonio</h3>
        <button className={styles.modalCapitalCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalCapitalBody}>
        <div className={styles.modalCapitalForm}>
          <div className={styles.modalCapitalFormGrid}>
            <input
              type="text"
              placeholder="Nombre de la fuente (ej: Ahorros Personales, Inversor)"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className={styles.modalCapitalInput}
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              className={styles.modalCapitalSelect}
            >
              <option value="equity">Patrimonio</option>
              <option value="savings">Ahorros Personales</option>
              <option value="investor">Inversor</option>
              <option value="other">Otro</option>
            </select>
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalCapitalInput}
            />
            <button onClick={addItem} className={styles.modalCapitalBtnPrimary}>
              ➕ Agregar
            </button>
          </div>
        </div>

        <div className={styles.modalCapitalItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalCapitalListHeader}>
                <span>Fuente</span>
                <span>Tipo</span>
                <span>Monto</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalCapitalItemRow}>
                  <span className={styles.modalCapitalItemName}>{item.name}</span>
                  <span className={styles.modalCapitalItemType}>{item.type}</span>
                  <span className={styles.modalCapitalItemAmount}>${item.amount?.toLocaleString()}</span>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className={styles.modalCapitalBtnDelete}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalCapitalEmptyState}>
              <div className={styles.modalCapitalEmptyStateIcon}>💼</div>
              <p>No hay fuentes de capital agregadas</p>
              <p>Comienza agregando la primera fuente usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalCapitalTotals}>
            <div className={`${styles.modalCapitalTotalRow} ${styles.modalCapitalTotalHighlight}`}>
              <strong>Capital Total:</strong>
              <strong>${total.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalCapitalFooter}>
        <button onClick={onClose} className={styles.modalCapitalBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalCapitalBtnPrimary}>Guardar Capital</button>
      </div>
    </div>
  );
};