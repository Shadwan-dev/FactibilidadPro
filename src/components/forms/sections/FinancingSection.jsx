// src/components/forms/sections/FinancingSection.jsx - VERSIÓN COMPLETA CON ESTILOS ÚNICOS
import React from "react";
import { useFinancialTranslations } from "../../../hooks/useFinancialTranslations";
import '../../../styles/components/forms/sections/financing-section.css'; // ✅ Import correcto

export const FinancingSection = React.memo(({ data, onOpenModal, calculateTotal, onUpdateField }) => {
  const t = useFinancialTranslations();

  const financingSources = [
    { 
      key: 'capital', 
      label: t.capitalEquity,
      modal: 'capital',
      description: t.ownerInvestments
    },
    { 
      key: 'bankCredit', 
      label: t.bankCredit,
      modal: 'bankCredit', 
      description: t.loansCredit
    },
    { 
      key: 'otherFinancing', 
      label: t.otherFinancing,
      modal: 'otherFinancing',
      description: t.grantsInvestors
    }
  ];

  const totalFinancing = financingSources.reduce(
    (total, source) => total + calculateTotal(data[source.key]), 0
  );

  // ✅ Si necesitas actualizar campos directos
  const handleDirectFieldUpdate = (field, value) => {
    if (onUpdateField) {
      onUpdateField(field, value);
    }
  };

  return (
    <div className="financing-section-container">
      <h4 className="financing-section-title">💰 {t.financingSources}</h4>
      
      <div className="financing-cards-grid">
        {financingSources.map(source => (
          <FinancingCard 
            key={source.key}
            source={source}
            data={data[source.key]}
            onOpenModal={onOpenModal}
            calculateTotal={calculateTotal}
            onUpdateField={onUpdateField}
            t={t}
          />
        ))}
      </div>

      <div className="financing-section-total">
        <div className="financing-total-card">
          <h5>{t.totalFinancing}</h5>
          <div className="financing-total-amount">
            ${totalFinancing.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
});

const FinancingCard = ({ source, data, onOpenModal, calculateTotal, onUpdateField, t }) => {
  const total = calculateTotal(data);
  
  return (
    <div className="financing-input-card">
      <div className="financing-card-header">
        <div>
          <label className="financing-card-label">{source.label}</label>
          <div className="financing-card-description">{source.description}</div>
        </div>
        <button 
          className="financing-btn-modal"
          onClick={() => onOpenModal(source.modal, data || [])}
        >
          {data?.length ? `✏️ ${t.edit}` : `➕ ${t.add}`}
        </button>
      </div>
      
      <div className="financing-card-total">
        {t.total}: ${total.toLocaleString()}
      </div>
      
      <div className="financing-card-items">
        {data?.slice(0, 3).map((item, index) => (
          <div key={index} className="financing-card-item">
            <span className="financing-item-name">{item.name || item.description}</span>
            <span className="financing-item-amount">${item.amount?.toLocaleString()}</span>
          </div>
        ))}
        {data?.length > 3 && (
          <div className="financing-card-more">+{data.length - 3} {t.moreItems}</div>
        )}
        {(!data || data.length === 0) && (
          <div className="financing-card-empty">{t.noItems}</div>
        )}
      </div>
    </div>
  );
};