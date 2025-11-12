// src/components/forms/DetailedFinancialForm.jsx (VERSIÓN AISLADA)
import React, { useState, useCallback } from 'react';

export const DetailedFinancialForm = React.memo(({ data, onChange, calculations }) => {
  // ✅ ESTADO COMPLETAMENTE AISLADO - no se sincroniza con data
  const [localData, setLocalData] = useState({
    investment: data.investment || 0,
    discountRate: data.discountRate || 0.1,
    period: data.period || 5,
    // NO incluir operationalCosts y projectedRevenue aquí inicialmente
  });
  
  const [showResults, setShowResults] = useState(false);
  const [costItems, setCostItems] = useState([]);
  const [revenueItems, setRevenueItems] = useState([]);
  const [newCost, setNewCost] = useState({ name: '', amount: '' });
  const [newRevenue, setNewRevenue] = useState({ name: '', amount: '' });

  // ✅ CALCULAR TOTALES LOCALMENTE
  const totalOperationalCosts = costItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalProjectedRevenue = revenueItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // ✅ SOLO campos básicos - PERO con debounce para evitar updates frecuentes
  const handleBasicInputChange = useCallback((field, value) => {
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;
    
    const newLocalData = {
      ...localData,
      [field]: numericValue
    };
    
    setLocalData(newLocalData);
    
    // ✅ DEBOUNCE: Esperar un poco antes de actualizar el estado global
    setTimeout(() => {
      onChange('financial', {
        ...newLocalData,
        // NO incluir operationalCosts y projectedRevenue aquí
        operationalCosts: 0,
        projectedRevenue: 0
      });
    }, 500);
  }, [localData, onChange]);

  // ✅ Manejar costos detallados - SOLO estado local
  const addCostItem = (e) => {
    e.preventDefault(); // ✅ Prevenir cualquier comportamiento por defecto
    if (newCost.name && newCost.amount) {
      setCostItems(prev => [...prev, { 
        ...newCost, 
        amount: parseFloat(newCost.amount) 
      }]);
      setNewCost({ name: '', amount: '' });
    }
  };

  const removeCostItem = (index) => {
    setCostItems(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ Manejar ingresos detallados - SOLO estado local
  const addRevenueItem = (e) => {
    e.preventDefault(); // ✅ Prevenir cualquier comportamiento por defecto
    if (newRevenue.name && newRevenue.amount) {
      setRevenueItems(prev => [...prev, { 
        ...newRevenue, 
        amount: parseFloat(newRevenue.amount) 
      }]);
      setNewRevenue({ name: '', amount: '' });
    }
  };

  const removeRevenueItem = (index) => {
    setRevenueItems(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ SOLO aquí se aplican los totales al estado global
  const applyCalculatedTotals = (e) => {
    e.preventDefault(); // ✅ Prevenir cualquier comportamiento por defecto
    
    const finalData = {
      ...localData,
      operationalCosts: totalOperationalCosts,
      projectedRevenue: totalProjectedRevenue
    };
    
    setLocalData(finalData);
    onChange('financial', finalData);
    
    // ✅ Mostrar mensaje de confirmación
    alert(`✅ Totales aplicados:\n- Costos Operativos: $${totalOperationalCosts.toLocaleString()}\n- Ingresos Proyectados: $${totalProjectedRevenue.toLocaleString()}`);
  };

  // ✅ ELIMINAR el useEffect que sincroniza con data para evitar loops

  const hasValidData = localData.investment > 0 && totalProjectedRevenue > 0;

  return (
    <div className="form-section detailed-financial-form">
      <div className="detailed-financial-form__header">
        <h3>💰 Datos Financieros - Modo Detallado</h3>
        <div className="detailed-financial-form__subtitle">
          <p>💡 <strong>Agrega items individualmente y aplica los totales cuando termines</strong></p>
          <p>Los cambios en costos e ingresos no se guardarán hasta que hagas clic en "Aplicar Totales"</p>
        </div>
      </div>

      {/* Sección 1: Inversión Inicial */}
      <div className="detailed-financial-form__section">
        <h4>🏗️ Inversión Inicial</h4>
        <div className="detailed-financial-form__input-group">
          <label>Inversión Total Requerida ($)</label>
          <input
            type="number"
            value={localData.investment || ''}
            onChange={(e) => handleBasicInputChange('investment', e.target.value)}
            placeholder="Ej: 100000"
          />
        </div>
      </div>

      {/* Sección 2: Costos Operativos Detallados */}
      <div className="detailed-financial-form__section">
        <h4>📋 Costos Operativos Anuales</h4>
        <p className="detailed-financial-form__description">
          <strong>Los cambios aquí no se guardan hasta que apliques los totales</strong>
        </p>

        {/* Formulario para agregar costo - CON FORM */}
        <form onSubmit={addCostItem} className="detailed-financial-form__add-item">
          <h5>➕ Agregar Nuevo Costo</h5>
          <div className="detailed-financial-form__add-form">
            <input
              type="text"
              placeholder="Nombre del costo (ej: Salarios, Alquiler, etc.)"
              value={newCost.name}
              onChange={(e) => setNewCost(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Monto anual ($)"
              value={newCost.amount}
              onChange={(e) => setNewCost(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
            <button type="submit" className="detailed-financial-form__add-btn">
              Agregar Costo
            </button>
          </div>
        </form>

        {/* Lista de costos - PREVIEW LOCAL */}
        <div className="detailed-financial-form__items-list">
          <h5>Costos Agregados (Vista Previa):</h5>
          {costItems.length === 0 ? (
            <p className="detailed-financial-form__empty-state">No hay costos agregados aún</p>
          ) : (
            costItems.map((item, index) => (
              <div key={index} className="detailed-financial-form__item">
                <span className="detailed-financial-form__item-name">{item.name}</span>
                <span className="detailed-financial-form__item-amount">
                  ${item.amount.toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => removeCostItem(index)}
                  className="detailed-financial-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total de costos - PREVIEW LOCAL */}
        <div className="detailed-financial-form__total-preview">
          <strong>Total Costos Anuales (Vista Previa): ${totalOperationalCosts.toLocaleString()}</strong>
        </div>
      </div>

      {/* Sección 3: Ingresos Proyectados Detallados */}
      <div className="detailed-financial-form__section">
        <h4>💰 Ingresos Proyectados Anuales</h4>
        <p className="detailed-financial-form__description">
          <strong>Los cambios aquí no se guardan hasta que apliques los totales</strong>
        </p>

        {/* Formulario para agregar ingreso - CON FORM */}
        <form onSubmit={addRevenueItem} className="detailed-financial-form__add-item">
          <h5>➕ Agregar Nueva Fuente de Ingreso</h5>
          <div className="detailed-financial-form__add-form">
            <input
              type="text"
              placeholder="Fuente de ingreso (ej: Ventas Producto A, Servicios, etc.)"
              value={newRevenue.name}
              onChange={(e) => setNewRevenue(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Monto anual ($)"
              value={newRevenue.amount}
              onChange={(e) => setNewRevenue(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
            <button type="submit" className="detailed-financial-form__add-btn">
              Agregar Ingreso
            </button>
          </div>
        </form>

        {/* Lista de ingresos - PREVIEW LOCAL */}
        <div className="detailed-financial-form__items-list">
          <h5>Fuentes de Ingreso (Vista Previa):</h5>
          {revenueItems.length === 0 ? (
            <p className="detailed-financial-form__empty-state">No hay fuentes de ingreso agregadas</p>
          ) : (
            revenueItems.map((item, index) => (
              <div key={index} className="detailed-financial-form__item">
                <span className="detailed-financial-form__item-name">{item.name}</span>
                <span className="detailed-financial-form__item-amount">
                  ${item.amount.toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => removeRevenueItem(index)}
                  className="detailed-financial-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total de ingresos - PREVIEW LOCAL */}
        <div className="detailed-financial-form__total-preview">
          <strong>Total Ingresos Anuales (Vista Previa): ${totalProjectedRevenue.toLocaleString()}</strong>
        </div>
      </div>

      {/* Sección 4: Parámetros del Análisis */}
      <div className="detailed-financial-form__section">
        <h4>⚙️ Parámetros del Análisis</h4>
        
        <div className="detailed-financial-form__input-group">
          <label>Tasa de Descuento (%)</label>
          <input
            type="number"
            step="0.1"
            value={localData.discountRate || ''}
            onChange={(e) => handleBasicInputChange('discountRate', e.target.value)}
            placeholder="Ej: 10"
          />
        </div>

        <div className="detailed-financial-form__input-group">
          <label>Período de Análisis (años)</label>
          <input
            type="number"
            value={localData.period || ''}
            onChange={(e) => handleBasicInputChange('period', e.target.value)}
            placeholder="Ej: 5"
          />
        </div>
      </div>

      {/* ✅ BOTÓN PARA APLICAR TOTALES - CON FORM */}
      <form onSubmit={applyCalculatedTotals} className="detailed-financial-form__actions">
        <button 
          type="submit"
          className="detailed-financial-form__apply-btn"
          disabled={costItems.length === 0 && revenueItems.length === 0}
        >
          🧮 Aplicar Totales Calculados
        </button>
        <div className="detailed-financial-form__totals-preview">
          <p><strong>Totales a aplicar:</strong></p>
          <p>• Costos Operativos: <strong>${totalOperationalCosts.toLocaleString()}</strong></p>
          <p>• Ingresos Proyectados: <strong>${totalProjectedRevenue.toLocaleString()}</strong></p>
        </div>
      </form>

      {/* Resultados en Tiempo Real (igual que el formulario original) */}
      {showResults && calculations && (
        <div className="detailed-financial-form__results">
          <h4>📊 Resultados Financieros</h4>
          <div className="detailed-financial-form__results-grid">
            <div className="detailed-financial-form__result-item">
              <span className="detailed-financial-form__result-label">VAN (Valor Actual Neto):</span>
              <span className={`detailed-financial-form__result-value ${calculations.financial?.npv > 0 ? 'detailed-financial-form__result-positive' : 'detailed-financial-form__result-negative'}`}>
                ${calculations.financial?.npv?.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) || '0'}
              </span>
              <small>{calculations.financial?.npv > 0 ? '✅ Proyecto viable' : '❌ No viable'}</small>
            </div>

            <div className="detailed-financial-form__result-item">
              <span className="detailed-financial-form__result-label">TIR (Tasa Interna de Retorno):</span>
              <span className={`detailed-financial-form__result-value ${calculations.financial?.irr > 0.08 ? 'detailed-financial-form__result-positive' : 'detailed-financial-form__result-negative'}`}>
                {calculations.financial?.irr ? (calculations.financial.irr * 100).toFixed(2) : '0'}%
              </span>
              <small>Mínimo requerido: 8%</small>
            </div>
          </div>
        </div>
      )}

      {/* Toggle para resultados */}
      {hasValidData && (
        <div className="detailed-financial-form__toggle-results">
          <button 
            onClick={() => setShowResults(!showResults)}
            className="detailed-financial-form__toggle-btn"
          >
            {showResults ? '📊 Ocultar Resultados' : '📈 Ver Resultados Financieros'}
          </button>
        </div>
      )}
    </div>
  );
});