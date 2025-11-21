// src/components/forms/modals/ModalSalaries.jsx
import React, { useState, useMemo } from 'react';
import styles from '../../../styles/components/forms/modals/ModalSalaries.module.css';

export const ModalSalaries = ({ existingData, onSave, onClose, analysisYears }) => {
  const [items, setItems] = useState(existingData || []);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    position: '', 
    participation: '', 
    monthlySalary: '' 
  });

  const addItem = () => {
    if (newItem.name && newItem.monthlySalary) {
      const monthlySalary = parseFloat(newItem.monthlySalary) || 0;
      const participation = parseFloat(newItem.participation) || 100;
      const annualSalary = monthlySalary * 11; // 11 meses de salario
      const participationAmount = annualSalary * (participation / 100);
      
      setItems(prev => [...prev, {
        ...newItem,
        monthlySalary,
        participation,
        annualSalary,
        participationAmount,
        id: Date.now() + Math.random()
      }]);
      setNewItem({ name: '', position: '', participation: '', monthlySalary: '' });
    }
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    onSave('salaries', items);
    onClose();
  };

  // Cálculos en tiempo real
  const totals = useMemo(() => {
    const totalMonthly = items.reduce((sum, item) => sum + (item.monthlySalary || 0), 0);
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualSalary || 0), 0);
    const totalAnalysisPeriod = totalAnnual * (analysisYears || 5);
    
    return { totalMonthly, totalAnnual, totalAnalysisPeriod };
  }, [items, analysisYears]);

  return (
    <div className={styles.modalSalariesContent}>
      <div className={styles.modalSalariesHeader}>
        <h3>💼 Gestión de Salarios</h3>
        <button className={styles.modalSalariesCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalSalariesBody}>
        {/* Formulario para nuevo empleado */}
        <div className={styles.modalSalariesForm}>
          <div className={styles.modalSalariesFormGrid}>
            <input
              type="text"
              placeholder="Nombre del Empleado"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className={styles.modalSalariesInput}
            />
            <input
              type="text"
              placeholder="Cargo"
              value={newItem.position}
              onChange={(e) => setNewItem(prev => ({ ...prev, position: e.target.value }))}
              className={styles.modalSalariesInput}
            />
            <input
              type="number"
              placeholder="Participación %"
              value={newItem.participation}
              onChange={(e) => setNewItem(prev => ({ ...prev, participation: e.target.value }))}
              className={styles.modalSalariesInput}
              min="0"
              max="100"
            />
            <input
              type="number"
              placeholder="Salario Mensual $"
              value={newItem.monthlySalary}
              onChange={(e) => setNewItem(prev => ({ ...prev, monthlySalary: e.target.value }))}
              className={styles.modalSalariesInput}
            />
            <button onClick={addItem} className={styles.modalSalariesBtnPrimary}>
              ➕ Agregar Empleado
            </button>
          </div>
        </div>

        {/* Lista de empleados */}
        <div className={styles.modalSalariesItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalSalariesListHeader}>
                <span>Nombre</span>
                <span>Cargo</span>
                <span>Participación</span>
                <span>Mensual</span>
                <span>Anual</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={styles.modalSalariesItemRow}>
                  <span className={styles.modalSalariesItemName}>
                    {item.name}
                    <div className={styles.modalSalariesInfo}>
                      {item.participationAmount && `$${item.participationAmount.toLocaleString()} (${item.participation}%)`}
                    </div>
                  </span>
                  <span className={styles.modalSalariesItemPosition}>{item.position}</span>
                  <span className={styles.modalSalariesParticipationBadge}>
                    {item.participation}%
                  </span>
                  <span className={styles.modalSalariesItemAmount}>${item.monthlySalary?.toLocaleString()}</span>
                  <span className={styles.modalSalariesItemAmount}>${item.annualSalary?.toLocaleString()}</span>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className={styles.modalSalariesBtnDelete}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalSalariesEmptyState}>
              <div className={styles.modalSalariesEmptyStateIcon}>💼</div>
              <p>No hay empleados agregados</p>
              <p>Comienza agregando el primer empleado usando el formulario superior</p>
            </div>
          )}
        </div>

        {/* Totales */}
        {items.length > 0 && (
          <div className={styles.modalSalariesTotals}>
            <div className={styles.modalSalariesTotalRow}>
              <strong>Total Mensual:</strong>
              <strong>${totals.totalMonthly.toLocaleString()}</strong>
            </div>
            <div className={styles.modalSalariesTotalRow}>
              <strong>Total Anual (11 meses):</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalSalariesTotalRow} ${styles.modalSalariesTotalHighlight}`}>
              <strong>Total para {analysisYears} años:</strong>
              <strong>${totals.totalAnalysisPeriod.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalSalariesFooter}>
        <button onClick={onClose} className={styles.modalSalariesBtnSecondary}>Cancelar</button>
        <button onClick={save} className={styles.modalSalariesBtnPrimary}>Guardar Salarios</button>
      </div>
    </div>
  );
};