// src/components/forms/modals/ModalRawMaterials.jsx - VERSIÓN CORREGIDA
import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../../styles/components/forms/modals/ModalRawMaterials.module.css';

export const ModalRawMaterials = ({ existingData, onSave, onClose, analysisYears }) => {
  // ✅ CORRECCIÓN: Manejar undefined y asegurar que sea array
  const [items, setItems] = useState([]);
  
  const [newItem, setNewItem] = useState({ 
    material: '', 
    unit: '',
    quantity: '',
    unitCost: '',
    frequency: 'monthly',
    supplier: ''
  });

  // ✅ CORRECCIÓN CRÍTICA: Sincronizar cuando existingData cambia
  useEffect(() => {
    console.log('🔄 ModalRawMaterials - existingData recibido:', existingData);
    
    if (existingData && Array.isArray(existingData)) {
      setItems(existingData);
    } else {
      setItems([]); // Resetear a array vacío si es undefined o no es array
    }
  }, [existingData]);

  const addItem = () => {
    if (newItem.material && newItem.quantity && newItem.unitCost) {
      const quantity = parseFloat(newItem.quantity) || 0;
      const unitCost = parseFloat(newItem.unitCost) || 0;
      const periodicCost = quantity * unitCost;
      
      // ✅ CORRECCIÓN: Calcular costos correctamente
      let annualCost = periodicCost;
      switch(newItem.frequency) {
        case 'monthly': 
          annualCost = periodicCost * 12;
          break;
        case 'quarterly': 
          annualCost = periodicCost * 4;
          break;
        case 'annual':
          annualCost = periodicCost;
          break;
        default:
          annualCost = periodicCost;
      }
      
      const totalProjected = annualCost * (analysisYears || 5); // ✅ Fallback para analysisYears
      
      const newItemWithId = {
        ...newItem,
        quantity,
        unitCost,
        periodicCost,
        annualCost,
        totalProjected,
        id: Date.now() + Math.random() // ✅ ID único
      };

      console.log('➕ Agregando nuevo material:', newItemWithId);
      
      setItems(prev => [...prev, newItemWithId]);
      setNewItem({ 
        material: '', 
        unit: '',
        quantity: '',
        unitCost: '',
        frequency: 'monthly',
        supplier: ''
      });
    } else {
      alert('❌ Completa al menos: Material, Cantidad y Costo Unitario');
    }
  };

  const deleteItem = (id) => {
    console.log('🗑️ Eliminando material con ID:', id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const save = () => {
    console.log('💾 Guardando materias primas:', items);
    onSave('rawMaterials', items);
    onClose();
  };

  const totals = useMemo(() => {
    const totalAnnual = items.reduce((sum, item) => sum + (item.annualCost || 0), 0);
    const totalProjected = items.reduce((sum, item) => sum + (item.totalProjected || 0), 0);
    
    console.log('🧮 Totales calculados:', { totalAnnual, totalProjected });
    
    return { totalAnnual, totalProjected };
  }, [items]);

  const getFrequencyText = (frequency) => {
    switch(frequency) {
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      case 'annual': return 'Anual';
      default: return frequency;
    }
  };

  const getCalculationDetails = (item) => {
    const calculation = `${item.quantity} ${item.unit} × $${item.unitCost} = $${item.periodicCost?.toLocaleString()} ${getFrequencyText(item.frequency).toLowerCase()}`;
    return calculation;
  };

  // ✅ DEBUG: Verificar estado actual
  console.log('🔍 ModalRawMaterials - Estado actual:', {
    items,
    itemsCount: items.length,
    analysisYears,
    existingData
  });

  return (
    <div className={styles.modalRawMaterialsContent}>
      <div className={styles.modalRawMaterialsHeader}>
        <h3>🏭 Materias Primas e Insumos</h3>
        <button className={styles.modalRawMaterialsCloseBtn} onClick={onClose}>×</button>
      </div>

      <div className={styles.modalRawMaterialsBody}>
        {/* ✅ INDICADOR DE DATOS CARGADOS */}
        <div className={styles.modalRawMaterialsDebug}>
          <small>
            {existingData ? `📊 ${existingData.length} materiales cargados` : '📊 Sin datos previos'}
          </small>
        </div>

        <div className={styles.modalRawMaterialsForm}>
          <div className={styles.modalRawMaterialsFormGrid}>
            <input
              type="text"
              placeholder="Nombre del Material *"
              value={newItem.material}
              onChange={(e) => setNewItem(prev => ({ ...prev, material: e.target.value }))}
              className={styles.modalRawMaterialsInput}
            />
            <input
              type="text"
              placeholder="Unidad (kg, unidades, etc.)"
              value={newItem.unit}
              onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
              className={styles.modalRawMaterialsInput}
            />
            <input
              type="number"
              placeholder="Cantidad *"
              value={newItem.quantity}
              onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
              className={styles.modalRawMaterialsInput}
              step="0.01"
              min="0"
            />
            <input
              type="number"
              placeholder="Costo Unitario $ *"
              value={newItem.unitCost}
              onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: e.target.value }))}
              className={styles.modalRawMaterialsInput}
              step="0.01"
              min="0"
            />
            <select
              value={newItem.frequency}
              onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))}
              className={styles.modalRawMaterialsSelect}
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
            </select>
            <input
              type="text"
              placeholder="Proveedor (opcional)"
              value={newItem.supplier}
              onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
              className={styles.modalRawMaterialsInput}
            />
            <button 
              onClick={addItem} 
              className={styles.modalRawMaterialsBtnPrimary}
              disabled={!newItem.material || !newItem.quantity || !newItem.unitCost}
            >
              ➕ Agregar Material
            </button>
          </div>
        </div>

        <div className={styles.modalRawMaterialsItemsList}>
          {items.length > 0 ? (
            <>
              <div className={styles.modalRawMaterialsListHeader}>
                <span>Material</span>
                <span>Cantidad</span>
                <span>Costo Unitario</span>
                <span>Frecuencia</span>
                <span>Costo Anual</span>
                <span>Acciones</span>
              </div>
              {items.map((item) => (
                <div key={item.id || item.material} className={styles.modalRawMaterialsItemRow}>
                  <span className={styles.modalRawMaterialsItemName}>
                    <strong>{item.material}</strong>
                    {item.supplier && (
                      <div className={styles.modalRawMaterialsSupplier}>
                        🏢 Proveedor: {item.supplier}
                      </div>
                    )}
                    <div className={styles.modalRawMaterialsCalculation}>
                      🧮 {getCalculationDetails(item)}
                    </div>
                  </span>
                  <span className={styles.modalRawMaterialsItemQuantity}>
                    {item.quantity} {item.unit}
                  </span>
                  <span className={styles.modalRawMaterialsItemAmount}>
                    ${item.unitCost?.toLocaleString()}
                  </span>
                  <span className={styles.modalRawMaterialsFrequencyBadge}>
                    {getFrequencyText(item.frequency)}
                  </span>
                  <span className={styles.modalRawMaterialsItemAmount}>
                    ${item.annualCost?.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => deleteItem(item.id)} 
                    className={styles.modalRawMaterialsBtnDelete}
                    title="Eliminar material"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.modalRawMaterialsEmptyState}>
              <div className={styles.modalRawMaterialsEmptyStateIcon}>🏭</div>
              <p>No hay materias primas agregadas</p>
              <p>Comienza agregando el primer material usando el formulario superior</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.modalRawMaterialsTotals}>
            <div className={styles.modalRawMaterialsTotalRow}>
              <strong>Total Costo Anual Materiales:</strong>
              <strong>${totals.totalAnnual.toLocaleString()}</strong>
            </div>
            <div className={`${styles.modalRawMaterialsTotalRow} ${styles.modalRawMaterialsTotalHighlight}`}>
              <strong>Total Proyectado ({analysisYears || 5} años):</strong>
              <strong>${totals.totalProjected.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className={styles.modalRawMaterialsFooter}>
        <button onClick={onClose} className={styles.modalRawMaterialsBtnSecondary}>
          ❌ Cancelar
        </button>
        <button 
          onClick={save} 
          className={styles.modalRawMaterialsBtnPrimary}
          disabled={items.length === 0}
        >
          💾 Guardar Materiales ({items.length})
        </button>
      </div>
    </div>
  );
};