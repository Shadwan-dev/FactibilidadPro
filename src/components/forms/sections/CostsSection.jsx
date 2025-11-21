// src/components/forms/sections/CostsSection.jsx - VERSIÓN CORREGIDA
import React from "react";
import { useFinancialTranslations } from '../../../hooks/useFinancialTranslations';
import '../../../styles/components/forms/sections/costs-section.css';

export const CostsSection = React.memo(({ data, onOpenModal, calculateTotal, onUpdateField }) => {
  const t = useFinancialTranslations();
  
  const costCategories = [
    { 
      key: 'rawMaterials', 
      label: t.rawMaterials,
      modal: 'rawMaterials',
      description: t.directMaterials,
      amountField: 'annualCost' // ✅ NUEVO: Campo específico para materias primas
    },
    { 
      key: 'officeSupplies', 
      label: t.officeSupplies,
      modal: 'officeSupplies',
      description: t.officeEquipment,
      amountField: 'amount' // ✅ Campo estándar
    },
    { 
      key: 'buildings', 
      label: t.buildings,
      modal: 'buildings',
      description: t.propertyConstruction,
      amountField: 'amount' // ✅ Campo estándar
    }
  ];

  // ✅ FUNCIÓN MEJORADA: Calcular total considerando campos específicos
  const calculateCategoryTotal = (items, amountField = 'amount') => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const amount = item[amountField] || item.amount || 0;
      return total + (parseFloat(amount) || 0);
    }, 0);
  };

  const totalCosts = costCategories.reduce(
    (total, category) => total + calculateCategoryTotal(data[category.key], category.amountField), 0
  );

  return (
    <div className="costs-section-container">
      <h4 className="costs-section-title">🏗️ {t.projectedCosts}</h4>
      
      <div className="costs-cards-grid">
        {costCategories.map(category => (
          <CostCard 
            key={category.key}
            category={category}
            data={data[category.key]}
            onOpenModal={onOpenModal}
            calculateTotal={calculateCategoryTotal}
            amountField={category.amountField} // ✅ Pasar el campo específico
            t={t}
          />
        ))}
      </div>

      <div className="costs-section-total">
        <div className="costs-total-card">
          <h5>{t.total} {t.projectedCosts}</h5>
          <div className="costs-total-amount">
            ${totalCosts.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
});

const CostCard = ({ category, data, onOpenModal, calculateTotal, amountField, t }) => {
  const total = calculateTotal(data, amountField);
  
  // ✅ FUNCIÓN PARA OBTENER EL NOMBRE DEL ITEM
  const getItemName = (item) => {
    // Para materias primas, usar 'material', para otros usar 'description'
    return item.material || item.description || 'Sin nombre';
  };

  // ✅ FUNCIÓN PARA OBTENER EL MONTO DEL ITEM
  const getItemAmount = (item) => {
    return item[amountField] || item.amount || 0;
  };

  return (
    <div className="costs-input-card">
      <div className="costs-card-header">
        <div>
          <label className="costs-card-label">{category.label}</label>
          <div className="costs-card-description">{category.description}</div>
        </div>
        <button 
          className="costs-btn-modal"
          onClick={() => onOpenModal(category.modal, data || [])}
        >
          {data?.length ? `✏️ ${t.edit}` : `➕ ${t.add}`}
        </button>
      </div>
      
      <div className="costs-card-total">
        {t.total}: ${total.toLocaleString()}
      </div>
      
      <div className="costs-card-items">
        {data?.slice(0, 3).map((item, index) => (
          <div key={index} className="costs-card-item">
            <span className="costs-item-name">{getItemName(item)}</span>
            <span className="costs-item-amount">
              ${getItemAmount(item)?.toLocaleString()}
              {/* ✅ MOSTRAR DETALLE PARA MATERIAS PRIMAS */}
              {category.key === 'rawMaterials' && item.quantity && (
                <div className="costs-item-detail">
                  {item.quantity} {item.unit} × ${item.unitCost}
                </div>
              )}
            </span>
          </div>
        ))}
        {data?.length > 3 && (
          <div className="costs-card-more">+{data.length - 3} {t.moreItems}</div> 
        )}
        {(!data || data.length === 0) && (
          <div className="costs-card-empty">{t.noItems}</div> 
        )}
      </div>
    </div>
  );
};