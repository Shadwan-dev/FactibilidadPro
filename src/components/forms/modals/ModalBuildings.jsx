// src/components/forms/modals/ModalBuildings.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalBuildings.module.css';

export const ModalBuildings = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    description: '', 
    type: 'rent',
    amount: '',
    frequency: 'monthly',
    duration: '12',
    maintenance: '0'
  });

  const addItem = () => {
    if (newItem.description && newItem.amount) {
      const amount = parseFloat(newItem.amount) || 0;
      const maintenance = parseFloat(newItem.maintenance) || 0;
      const annualAmount = newItem.frequency === 'monthly' ? amount * 12 : amount;
      const totalMaintenance = maintenance * analysisYears;
      const totalProjected = annualAmount * analysisYears + totalMaintenance;
      
      setItems(prev => [...prev, {
        ...newItem,
        amount,
        maintenance,
        annualAmount,
        totalMaintenance,
        totalProjected,
        id: Date.now() + Math.random()
      }]);
      setNewItem({ 
        description: '', 
        type: 'rent',
        amount: '',
        frequency: 'monthly',
        duration: '12',
        maintenance: '0'
      });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('buildings', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualAmount || 0), 0);
    const totalMaintenance = items.reduce((sum, item) => sum + (item.totalMaintenance || 0), 0);
    const totalProjected = items.reduce((sum, item) => sum + (item.totalProjected || 0), 0);
    
    return { totalAnnual, totalMaintenance, totalProjected };
  }, [items]);

  return (
    <div className={styles.modalBuildingsContent}>
      <div className={styles.modalBuildingsHeader}>
        <h3>🏢 Edificios e Instalaciones</h3>
        <button className={styles.modalBuildingsCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalBuildingsBody}>
        <div className={styles.modalBuildingsForm}>
          <div className={styles.modalBuildingsFormGrid}>
            <input
              type="text"
              placeholder="Descripción (ej: Alquiler Oficina, Bodega)"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className={styles.modalBuildingsInput}
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              className={styles.modalBuildingsSelect}
            >
              <option value="rent">Alquiler</option>
              <option value="mortgage">Hipoteca</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="utilities">Servicios Públicos</option>
              <option value="other">Otro</option>
            </select>
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalBuildingsInput}
            />
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
              className={styles.modalBuildingsSelect}
            >
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
            </select>
            <input
              type="number"
              placeholder="Mantenimiento $/año"
              value={newItem.maintenance}
              onChange={(e) => setNewItem(prev => ({ ...prev, maintenance: e.target.value }))}
              className={styles.modalBuildingsInput}
            />
            <button onClick={addItem} className={styles.modalBuildingsBtnPrimary}>
              ➕ Agregar Instalación
            </button>
          </div>
        </div>

        <div className={styles.modalBuildingsItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalBuildingsListHeader}>
                <span>Descripción</span>
                <span>Tipo</span>
                <span>Costo Anual</span>
                <span>Mantenimiento</span>
                <span>Total Proyectado</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalBuildingsItemRow}>
                  <span className={styles.modalBuildingsItemName}>{item.description}</span>
                  <span className={styles.modalBuildingsItemType}>{item.type}</span>
                  <span className={styles.modalBuildingsItemAmount}>${item.annualAmount?.toLocaleString()}</span>
                  <span className={styles.modalBuildingsItemAmount}>${item.maintenance?.toLocaleString()}/año</span>
                  <span className={styles.modalBuildingsItemAmount}>${item.totalProjected?.toLocaleString()}</span>
                  <button onClick={() => deleteItem(item.id)} className={styles.modalBuildingsBtnDelete}>
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalBuildingsEmptyState}>
              <div className={styles.modalBuildingsEmptyStateIcon}>🏢</div>
              <p>No hay instalaciones agregadas</p>
              <p>Comienza agregando la primera instalación usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalBuildingsTotals}>
            <div className={styles.modalBuildingsTotalRow}>
              <strong>Total Costo Anual Instalaciones:</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={styles.modalBuildingsTotalRow}>
              <strong>Total Mantenimiento ({analysisYears} años):</strong>
              <strong>${totals.totalMaintenance.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalBuildingsTotalRow} ${styles.modalBuildingsTotalHighlight}`}>
              <strong>Total Costo Proyectado:</strong>
              <strong>${totals.totalProjected.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalBuildingsFooter}>
        <button onClick={onClose} className={styles.modalBuildingsBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalBuildingsBtnPrimary}>Guardar Instalaciones</button>
      </div>
    </div>
  );
};