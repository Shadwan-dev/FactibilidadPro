// src/components/forms/modals/ModalGeneric.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/components/forms/modals/ModalGeneric.module.css';

export const ModalGeneric = ({ 
  existingData, 
  onSave, 
  onClose, 
  title = "Items",
  showFrequency = false 
}) => {
  // ✅ CORRECCIÓN: Manejar undefined y sincronizar
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ 
    description: '', 
    amount: '',
    frequency: showFrequency ? 'monthly' : 'annual'
  });

  // ✅ CORRECCIÓN CRÍTICA: Sincronizar cuando existingData cambia
  useEffect(() => {
    console.log(`🔄 ModalGeneric (${title}) - existingData recibido:`, existingData);
    
    if (existingData && Array.isArray(existingData)) {
      setItems(existingData);
    } else {
      setItems([]); // Resetear a array vacío si es undefined o no es array
    }
  }, [existingData, title]);

  const addItem = () => {
    if (newItem.description && newItem.amount) {
      const amount = parseFloat(newItem.amount) || 0;
      
      // ✅ CORRECCIÓN: Calcular correctamente el monto anual
      let annualAmount = amount;
      if (showFrequency) {
        annualAmount = newItem.frequency === 'monthly' ? amount * 12 : amount;
      }
      
      const newItemWithId = {
        ...newItem,
        amount,
        annualAmount: showFrequency ? annualAmount : undefined,
        id: Date.now() + Math.random()
      };

      console.log(`➕ Agregando item a ${title}:`, newItemWithId);
      
      setItems(prev => [...prev, newItemWithId]);
      setNewItem({ 
        description: '', 
        amount: '',
        frequency: showFrequency ? 'monthly' : 'annual'
      });
    } else {
      alert('❌ Completa la descripción y el monto');
    }
  };

  const deleteItem = (id) => {
    console.log(`🗑️ Eliminando item de ${title} con ID:`, id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    // ✅ CORRECCIÓN: Generar key correctamente para Firebase
    let key = title.toLowerCase().replace(/\s+/g, '');
    
    // Mapeo de títulos a keys específicas
    const keyMappings = {
      'insumos': 'supplies',
      'combustible y lubricantes': 'fuel',
      'transporte': 'transport',
      'energía': 'energy',
      'gastos de viaje': 'travel',
      'servicios contratados': 'services',
      'gastos financieros': 'financialExpenses',
      'otros gastos': 'otherExpenses'
    };
    
    const finalKey = keyMappings[title.toLowerCase()] || key;
    
    console.log(`💾 Guardando ${title} (key: ${finalKey}):`, items);
    onSave(finalKey, items);
    onClose();
  };

  const total = items.reduce((sum, item) => {
    const amount = showFrequency ? (item.annualAmount || 0) : (item.amount || 0);
    return sum + amount;
  }, 0);

  // Clases dinámicas basadas en showFrequency
  const formGridClass = showFrequency 
    ? `${styles.modalGenericFormGrid} ${styles.modalGenericFormGridWithFrequency}`
    : `${styles.modalGenericFormGrid} ${styles.modalGenericFormGridWithoutFrequency}`;

  const listHeaderClass = showFrequency
    ? `${styles.modalGenericListHeader} ${styles.modalGenericListHeaderWithFrequency}`
    : `${styles.modalGenericListHeader} ${styles.modalGenericListHeaderWithoutFrequency}`;

  const itemRowClass = showFrequency
    ? `${styles.modalGenericItemRow} ${styles.modalGenericItemRowWithFrequency}`
    : `${styles.modalGenericItemRow} ${styles.modalGenericItemRowWithoutFrequency}`;

  // ✅ DEBUG: Verificar estado actual
  console.log(`🔍 ModalGeneric (${title}) - Estado actual:`, {
    items,
    itemsCount: items.length,
    showFrequency,
    existingData
  });

  return (
    <div className={styles.modalGenericContent}>
      <div className={styles.modalGenericHeader}>
        <h3>📝 {title}</h3>
        <button className={styles.modalGenericCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalGenericBody}>
        {/* ✅ INDICADOR DE DATOS CARGADOS */}
        <div className={styles.modalGenericDebug}>
          <small>
            {existingData ? `📊 ${existingData.length} items cargados` : '📊 Sin datos previos'}
          </small>
        </div>

        <div className={styles.modalGenericForm}>
          <div className={formGridClass}>
            <input
              type="text"
              placeholder={`Descripción *`}
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className={styles.modalGenericInput}
            />
            <input
              type="number"
              placeholder="Monto $ *"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              className={styles.modalGenericInput}
              step="0.01"
              min="0"
            />
            {showFrequency && (
              <select
                value={newItem.frequency}
                onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
                className={styles.modalGenericSelect}
              >
                <option value="monthly">Mensual</option>
                <option value="annual">Anual</option>
              </select>
            )}
            <button 
              onClick={addItem} 
              className={styles.modalGenericBtnPrimary}
              disabled={!newItem.description || !newItem.amount}
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <div className={styles.modalGenericItemsList}>
          {items.length > 0 ? (
            <>
              <div className={listHeaderClass}>
                <span>Descripción</span>
                <span>{showFrequency ? 'Monto Anual' : 'Monto'}</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className={itemRowClass}>
                  <span className={styles.modalGenericItemName}>
                    <strong>{item.description}</strong>
                    {showFrequency && item.frequency && (
                      <div className={styles.modalGenericFrequency}>
                        📅 Frecuencia: {item.frequency === 'monthly' ? 'Mensual' : 'Anual'}
                      </div>
                    )}
                  </span>
                  <span className={styles.modalGenericItemAmount}>
                    ${(showFrequency ? item.annualAmount : item.amount)?.toLocaleString()}
                    {showFrequency && item.frequency === 'monthly' && (
                      <div className={styles.modalGenericBreakdown}>
                        (${item.amount?.toLocaleString()} mensual)
                      </div>
                    )}
                  </span>
                  <button 
                    onClick={() => deleteItem(item.id)} 
                    className={styles.modalGenericBtnDelete}
                    title="Eliminar item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalGenericEmptyState}>
              <div className={styles.modalGenericEmptyStateIcon}>📝</div>
              <p>No hay {title.toLowerCase()} agregados</p>
              <p>Comienza agregando el primero usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalGenericTotals}>
            <div className={`${styles.modalGenericTotalRow} ${styles.modalGenericTotalHighlight}`}>
              <strong>Total {showFrequency ? 'Anual' : ''}:</strong>
              <strong>${total.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalGenericFooter}>
        <button onClick={onClose} className={styles.modalGenericBtnSecondary}>
          ❌ Cancelar
        </button>
        <button 
          onClick={save} 
          className={styles.modalGenericBtnPrimary}
          disabled={items.length === 0}
        >
          💾 Guardar {title} ({items.length})
        </button>
      </div>
    </div>
  );
};