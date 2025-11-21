// src/components/forms/sections/ExpensesSection.jsx - VERSIÓN CORREGIDA
import React from "react";
import '../../../styles/components/forms/sections/expenses-sections.css';

export const ExpensesSection = React.memo(({ data, onOpenModal, calculateTotal, onUpdateField }) => {
  const expenseCategories = [
    { key: 'supplies', label: 'Insumos', modal: 'supplies', amountField: 'amount' },
    { key: 'fuel', label: 'Combustible y Lubricantes', modal: 'fuel', amountField: 'amount' },
    { key: 'transport', label: 'Transporte', modal: 'transport', amountField: 'amount' },
    { key: 'energy', label: 'Energía', modal: 'energy', amountField: 'amount' },
    { key: 'salaries', label: 'Salarios', modal: 'salaries', amountField: 'annualAmount' }, // ✅ Salarios suelen ser anuales
    { key: 'travel', label: 'Gastos de Viaje', modal: 'travel', amountField: 'amount' },
    { key: 'services', label: 'Servicios Contratados', modal: 'services', amountField: 'annualAmount' }, // ✅ Servicios pueden ser anuales
    { key: 'taxes', label: 'Impuestos y Contribuciones', modal: 'taxes', amountField: 'annualAmount' }, // ✅ Impuestos son anuales
    { key: 'financialExpenses', label: 'Gastos Financieros', modal: 'financialExpenses', amountField: 'amount' },
    { key: 'otherExpenses', label: 'Otros Gastos', modal: 'otherExpenses', amountField: 'amount' }
  ];

  // ✅ FUNCIÓN MEJORADA: Calcular total considerando campos específicos
  const calculateCategoryTotal = (items, amountField = 'amount') => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const amount = item[amountField] || item.amount || item.annualAmount || 0;
      return total + (parseFloat(amount) || 0);
    }, 0);
  };

  const totalExpenses = expenseCategories.reduce(
    (total, category) => total + calculateCategoryTotal(data[category.key], category.amountField), 0
  );

  // ✅ DEBUG: Verificar datos
  console.log('🔍 ExpensesSection - Datos:', {
    data,
    totalExpenses,
    categoryTotals: expenseCategories.map(cat => ({
      category: cat.key,
      total: calculateCategoryTotal(data[cat.key], cat.amountField),
      items: data[cat.key]
    }))
  });

  return (
    <div className="expenses-section-container">
      <h4 className="expenses-section-title">💸 Gastos Operativos</h4>
      
      <div className="expenses-cards-grid">
        {expenseCategories.map(category => (
          <ExpenseCard 
            key={category.key}
            category={category}
            data={data[category.key]}
            onOpenModal={onOpenModal}
            calculateTotal={calculateCategoryTotal}
            amountField={category.amountField} // ✅ Pasar campo específico
          />
        ))}
      </div>

      <div className="expenses-section-total">
        <div className="expenses-total-card">
          <h5>Total de Gastos</h5>
          <div className="expenses-total-amount">
            ${totalExpenses.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
});

const ExpenseCard = ({ category, data, onOpenModal, calculateTotal, amountField }) => {
  const total = calculateTotal(data, amountField);
  
  // ✅ FUNCIÓN PARA OBTENER EL NOMBRE DEL ITEM
  const getItemName = (item) => {
    return item.description || item.name || 'Sin nombre';
  };

  // ✅ FUNCIÓN PARA OBTENER EL MONTO DEL ITEM
  const getItemAmount = (item) => {
    return item[amountField] || item.amount || item.annualAmount || 0;
  };

  // ✅ FUNCIÓN PARA OBTENER DETALLES ADICIONALES
  const getItemDetails = (item) => {
    const details = [];
    
    if (item.frequency) {
      details.push(`Frecuencia: ${item.frequency === 'monthly' ? 'Mensual' : 'Anual'}`);
    }
    
    if (item.amount && item.annualAmount && item.frequency === 'monthly') {
      details.push(`Mensual: $${item.amount?.toLocaleString()}`);
    }
    
    return details.length > 0 ? details.join(' • ') : null;
  };

  return (
    <div className="expenses-input-card">
      <div className="expenses-card-header">
        <label className="expenses-card-label">{category.label}</label>
        <button 
          className="expenses-btn-modal"
          onClick={() => onOpenModal(category.modal, data || [])}
        >
          {data?.length ? '✏️ Editar' : '➕ Agregar'}
        </button>
      </div>
      
      <div className="expenses-card-total">
        Total: ${total.toLocaleString()}
      </div>
      
      <div className="expenses-card-items">
        {data?.slice(0, 3).map((item, index) => {
          const itemDetails = getItemDetails(item);
          
          return (
            <div key={index} className="expenses-card-item">
              <span className="expenses-item-name">
                <strong>{getItemName(item)}</strong>
                {itemDetails && (
                  <div className="expenses-item-detail">
                    {itemDetails}
                  </div>
                )}
              </span>
              <span className="expenses-item-amount">
                ${getItemAmount(item)?.toLocaleString()}
              </span>
            </div>
          );
        })}
        
        {data?.length > 3 && (
          <div className="expenses-card-more">+{data.length - 3} elementos más</div>
        )}
        
        {(!data || data.length === 0) && (
          <div className="expenses-card-empty">No hay elementos</div>
        )}
      </div>
    </div>
  );
};