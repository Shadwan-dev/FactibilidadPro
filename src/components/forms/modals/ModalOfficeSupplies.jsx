// src/components/forms/modals/ModalOfficeSupplies.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalOfficeSupplies.module.css';

export const ModalOfficeSupplies = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    category: '', 
    description: '',
    amount: '',
    frequency: 'monthly',
    priority: 'medium'
  });

  const officeCategories = [
    'Papelería',
    'Electrónicos',
    'Mobiliario',
    'Software',
    'Consumibles',
    'Otro'
  ];

  const addItem = () => {
    if (newItem.category && newItem.description && newItem.amount) {
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
        category: '', 
        description: '',
        amount: '',
        frequency: 'monthly',
        priority: 'medium'
      });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('officeSupplies', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualAmount || 0), 0);
    const totalProjected = items.reduce((sum, item) => sum + (item.totalProjected || 0), 0);
    
    return { totalAnnual, totalProjected };
  }, [items]);

  const itemsByCategory = useMemo(() => {
    return items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [items]);

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'low': return styles.modalOfficeSuppliesPriorityLow;
      case 'medium': return styles.modalOfficeSuppliesPriorityMedium;
      case 'high': return styles.modalOfficeSuppliesPriorityHigh;
      case 'critical': return styles.modalOfficeSuppliesPriorityCritical;
      default: return styles.modalOfficeSuppliesPriorityMedium;
    }
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'critical': return 'Crítica';
      default: return 'Media';
    }
  };

  return (
    <div className={styles.modalOfficeSuppliesContent}>
      <div className={styles.modalOfficeSuppliesHeader}>
        <h3>📦 Suministros de Oficina y Equipos</h3>
        <button className={styles.modalOfficeSuppliesCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalOfficeSuppliesBody}>
        <div className={styles.modalOfficeSuppliesForm}>
          <div className={styles.modalOfficeSuppliesFormGrid}>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              className={styles.modalOfficeSuppliesSelect}
            >
              <option value="">Seleccionar Categoría</option>
              {officeCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Descripción del Artículo"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className={styles.modalOfficeSuppliesInput}
            />
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalOfficeSuppliesInput}
            />
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
              className={styles.modalOfficeSuppliesSelect}
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
              <option value="one-time">Una vez</option>
            </select>
            <select
              value={newItem.priority}
              onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value }))}
              className={styles.modalOfficeSuppliesSelect}
            >
              <option value="low">Baja Prioridad</option>
              <option value="medium">Prioridad Media</option>
              <option value="high">Alta Prioridad</option>
              <option value="critical">Crítico</option>
            </select>
            <button onClick={addItem} className={styles.modalOfficeSuppliesBtnPrimary}>
              ➕ Agregar Artículo
            </button>
          </div>
        </div>

        {/* Items grouped by category */}
        {Object.keys(itemsByCategory).length > 0 ? (
          Object.keys(itemsByCategory).map(category => (
            <div key={category} className={styles.modalOfficeSuppliesCategorySection}>
              <h4 className={styles.modalOfficeSuppliesCategoryTitle}>{category}</h4>
              <div className={styles.modalOfficeSuppliesItemsList}>
                <div className={styles.modalOfficeSuppliesListHeader}>
                  <span>Descripción</span>
                  <span>Frecuencia</span>
                  <span>Prioridad</span>
                  <span>Costo Anual</span>
                  <span>Acciones</span>
                </div>
                {itemsByCategory[category].map((item) => (
                  <div key={item.id} className={styles.modalOfficeSuppliesItemRow}>
                    <span className={styles.modalOfficeSuppliesItemName}>{item.description}</span>
                    <span className={styles.modalOfficeSuppliesItemFrequency}>{item.frequency}</span>
                    <span className={`${styles.modalOfficeSuppliesPriorityBadge} ${getPriorityClass(item.priority)}`}>
                      {getPriorityText(item.priority)}
                    </span>
                    <span className={styles.modalOfficeSuppliesItemAmount}>${item.annualAmount?.toLocaleString()}</span>
                    <button onClick={() => deleteItem(item.id)} className={styles.modalOfficeSuppliesBtnDelete}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.modalOfficeSuppliesEmptyState}>
            <div className={styles.modalOfficeSuppliesEmptyStateIcon}>📦</div>
            <p>No hay suministros de oficina agregados</p>
            <p>Comienza agregando el primer artículo usando el formulario superior</p>
          </div>
        )}

        {items.length > 0 && (
          <div className={styles.modalOfficeSuppliesTotals}>
            <div className={styles.modalOfficeSuppliesTotalRow}>
              <strong>Total Anual Suministros de Oficina:</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalOfficeSuppliesTotalRow} ${styles.modalOfficeSuppliesTotalHighlight}`}>
              <strong>Total Proyectado ({analysisYears} años):</strong>
              <strong>${totals.totalProjected.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalOfficeSuppliesFooter}>
        <button onClick={onClose} className={styles.modalOfficeSuppliesBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalOfficeSuppliesBtnPrimary}>Guardar Suministros</button>
      </div>
    </div>
  );
};