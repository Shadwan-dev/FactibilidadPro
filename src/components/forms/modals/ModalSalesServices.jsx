// src/components/forms/modals/ModalSalesServices.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalSalesServices.module.css';

export const ModalSalesServices = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    description: '', 
    amount: '',
    frequency: 'monthly',
    growthRate: '0'
  });

  const addItem = () => {
    if (newItem.description && newItem.amount) {
      const baseAmount = parseFloat(newItem.amount) || 0;
      const growthRate = parseFloat(newItem.growthRate) || 0;
      
      // Calcular ingresos proyectados
      const annualAmount = newItem.frequency === 'monthly' ? baseAmount * 12 : baseAmount;
      const projectedAmounts = Array.from({ length: analysisYears }, (_, i) => 
        annualAmount * Math.pow(1 + growthRate / 100, i)
      );
      
      setItems(prev => [...prev, {
        ...newItem,
        amount: baseAmount,
        growthRate,
        annualAmount,
        projectedAmounts,
        totalProjected: projectedAmounts.reduce((sum, amount) => sum + amount, 0),
        id: Date.now() + Math.random()
      }]);
      setNewItem({ description: '', amount: '', frequency: 'monthly', growthRate: '0' });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('salesServices', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualAmount || 0), 0);
    const totalProjected = items.reduce((sum, item) => sum + (item.totalProjected || 0), 0);
    
    return { totalAnnual, totalProjected };
  }, [items]);

  const getGrowthClass = (growthRate) => {
    const rate = parseFloat(growthRate);
    if (rate > 0) return styles.modalSalesServicesGrowthPositive;
    if (rate < 0) return styles.modalSalesServicesGrowthNegative;
    return styles.modalSalesServicesGrowthNeutral;
  };

  const getGrowthSymbol = (growthRate) => {
    const rate = parseFloat(growthRate);
    if (rate > 0) return '↗';
    if (rate < 0) return '↘';
    return '→';
  };

  const getFrequencyText = (frequency) => {
    return frequency === 'monthly' ? 'Mensual' : 'Anual';
  };

  return (
    <div className={styles.modalSalesServicesContent}>
      <div className={styles.modalSalesServicesHeader}>
        <h3>💰 Ingresos por Ventas y Servicios</h3>
        <button className={styles.modalSalesServicesCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalSalesServicesBody}>
        <div className={styles.modalSalesServicesForm}>
          <div className={styles.modalSalesServicesFormGrid}>
            <input
              type="text"
              placeholder="Descripción (ej: Ventas de Productos, Consultoría)"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className={styles.modalSalesServicesInput}
            />
            <input
              type="number"
              placeholder="Monto $"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalSalesServicesInput}
            />
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
              className={styles.modalSalesServicesSelect}
            >
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
            </select>
            <input
              type="number"
              placeholder="Tasa de Crecimiento %"
              value={newItem.growthRate}
              onChange={(e) => setNewItem(prev => ({ ...prev, growthRate: e.target.value }))}
              className={styles.modalSalesServicesInput}
              step="0.1"
            />
            <button onClick={addItem} className={styles.modalSalesServicesBtnPrimary}>
              ➕ Agregar Ingreso
            </button>
          </div>
        </div>

        <div className={styles.modalSalesServicesItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalSalesServicesListHeader}>
                <span>Descripción</span>
                <span>Anual</span>
                <span>Crecimiento</span>
                <span>Total Proyectado</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalSalesServicesItemRow}>
                  <span className={styles.modalSalesServicesItemName}>
                    {item.description}
                    <div className={styles.modalSalesServicesGrowthInfo}>
                      {getFrequencyText(item.frequency)} • Base: ${item.amount?.toLocaleString()}
                    </div>
                    {item.projectedAmounts && (
                      <div className={styles.modalSalesServicesProjection}>
                        <div className={styles.modalSalesServicesProjectionTitle}>
                          Proyección anual:
                        </div>
                        <div className={styles.modalSalesServicesProjectionYears}>
                          {item.projectedAmounts.slice(0, 5).map((amount, index) => (
                            <span key={index} className={styles.modalSalesServicesProjectionYear}>
                              Año {index + 1}: ${amount.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </span>
                  <span className={styles.modalSalesServicesItemAmount}>
                    ${item.annualAmount?.toLocaleString()}
                  </span>
                  <span className={`${styles.modalSalesServicesGrowthBadge} ${getGrowthClass(item.growthRate)}`}>
                    {getGrowthSymbol(item.growthRate)} {item.growthRate}%
                  </span>
                  <span className={styles.modalSalesServicesItemAmount}>
                    ${item.totalProjected?.toLocaleString()}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className={styles.modalSalesServicesBtnDelete}>
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalSalesServicesEmptyState}>
              <div className={styles.modalSalesServicesEmptyStateIcon}>💰</div>
              <p>No hay ingresos por ventas y servicios agregados</p>
              <p>Comienza agregando el primer ingreso usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalSalesServicesTotals}>
            <div className={styles.modalSalesServicesTotalRow}>
              <strong>Total Ingresos Anuales:</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalSalesServicesTotalRow} ${styles.modalSalesServicesTotalHighlight}`}>
              <strong>Total Proyectado ({analysisYears} años):</strong>
              <strong>${totals.totalProjected.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalSalesServicesFooter}>
        <button onClick={onClose} className={styles.modalSalesServicesBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalSalesServicesBtnPrimary}>Guardar Ingresos</button>
      </div>
    </div>
  );
};