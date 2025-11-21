// src/components/forms/sections/IncomeSection.jsx - VERSIÓN COMPLETA
import React from "react";
import '../../../styles/components/forms/sections/income-section.css';

export const IncomeSection = React.memo(({ data, onOpenModal, calculateTotal, onUpdateField }) => {
  const incomeCategories = [
    { 
      key: 'salesServices', 
      label: 'Ventas y Servicios', 
      modal: 'salesServices',
      description: 'Ingresos de actividades principales del negocio'
    },
    { 
      key: 'financialIncome', 
      label: 'Ingresos Financieros', 
      modal: 'financialIncome',
      description: 'Inversiones, intereses, dividendos'
    },
    { 
      key: 'otherIncome', 
      label: 'Otros Ingresos', 
      modal: 'otherIncome',
      description: 'Fuentes de ingresos adicionales'
    }
  ];

  const totalIncome = incomeCategories.reduce(
    (total, category) => total + calculateTotal(data[category.key]), 0
  );

  return (
    <div className="income-section-container">
      <h4 className="income-section-title">💵 Ingresos Proyectados</h4>
      
      <div className="income-cards-grid">
        {incomeCategories.map(category => (
          <IncomeCard 
            key={category.key}
            category={category}
            data={data[category.key]}
            onOpenModal={onOpenModal}
            calculateTotal={calculateTotal}
            onUpdateField={onUpdateField}
          />
        ))}
      </div>

      <div className="income-section-total">
        <div className="income-total-card">
          <h5>Total de Ingresos Proyectados</h5>
          <div className="income-total-amount">
            ${totalIncome.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
});

const IncomeCard = ({ category, data, onOpenModal, calculateTotal, onUpdateField }) => {
  const total = calculateTotal(data);
  
  return (
    <div className="income-input-card">
      <div className="income-card-header">
        <div>
          <label className="income-card-label">{category.label}</label>
          <div className="income-card-description">{category.description}</div>
        </div>
        <button 
          className="income-btn-modal"
          onClick={() => onOpenModal(category.modal, data || [])}
        >
          {data?.length ? '✏️ Editar' : '➕ Agregar'}
        </button>
      </div>
      
      <div className="income-card-total">
        Total: ${total.toLocaleString()}
      </div>
      
      <div className="income-card-items">
        {data?.slice(0, 3).map((item, index) => (
          <div key={index} className="income-card-item">
            <span className="income-item-name">{item.description}</span>
            <span className="income-item-amount">${item.amount?.toLocaleString()}</span>
          </div>
        ))}
        {data?.length > 3 && (
          <div className="income-card-more">+{data.length - 3} elementos más</div>
        )}
        {(!data || data.length === 0) && (
          <div className="income-card-empty">No se agregaron fuentes de ingresos</div>
        )}
      </div>
    </div>
  );
};