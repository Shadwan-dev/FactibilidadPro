// src/components/forms/modals/ModalManager.jsx
import React from "react";
import { ModalCapital } from "./ModalCapital";
import { ModalBankCredit } from "./ModalCreditBank";
import { ModalOtherFinancing } from "./ModalOtherFinancing";
import { ModalSalesServices } from "./ModalSalesServices";
import { ModalFinancialIncome } from "./ModalFinancialIncome";
import { ModalOtherIncome } from "./ModalOtherIncome";
import { ModalRawMaterials } from "./ModalRawMaterials";
import { ModalOfficeSupplies } from "./ModalOfficeSupplies";
import { ModalBuildings } from "./ModalBuildings";
import { ModalSalaries } from "./ModalSalaries";
import { ModalTaxes } from "./ModalTaxes";
import { ModalGeneric } from "./ModalGeneric";
import styles from '../../../styles/components/forms/modals/ModalManager.module.css'; // ✅ Corrección aquí

// Componente de overlay para prevenir herencia
const ModalOverlay = ({ children, onClose }) => (
  <div 
    className={styles.overlay} // ✅ Usando CSS Module
    onClick={onClose}
  >
    {children}
  </div>
);

// Componente container para prevenir herencia
const ModalContainer = ({ children }) => (
  <div 
    className={styles.container} // ✅ Usando CSS Module
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

export const ModalManager = ({ 
  activeModal, 
  modalData, 
  onClose, 
  onSave, 
  calculateTotal, 
  analysisYears 
}) => {
  const modals = {
    // Financiamiento
    capital: ModalCapital,
    bankCredit: ModalBankCredit,
    otherFinancing: ModalOtherFinancing,
    
    // Ingresos
    salesServices: ModalSalesServices,
    financialIncome: ModalFinancialIncome,
    otherIncome: ModalOtherIncome,
    
    // Costos
    rawMaterials: ModalRawMaterials,
    officeSupplies: ModalOfficeSupplies,
    buildings: ModalBuildings,
    
    // Gastos
    salaries: ModalSalaries,
    taxes: ModalTaxes,
    
    // Gastos genéricos
    supplies: (props) => <ModalGeneric {...props} title="Insumos" />,
    fuel: (props) => <ModalGeneric {...props} title="Combustible y Lubricantes" />,
    transport: (props) => <ModalGeneric {...props} title="Transporte" />,
    energy: (props) => <ModalGeneric {...props} title="Energía" />,
    travel: (props) => <ModalGeneric {...props} title="Gastos de Viaje" />,
    services: (props) => <ModalGeneric {...props} title="Servicios Contratados" />,
    financialExpenses: (props) => <ModalGeneric {...props} title="Gastos Financieros" />,
    otherExpenses: (props) => <ModalGeneric {...props} title="Otros Gastos" />,
  };

  const ModalComponent = modals[activeModal];

  if (!ModalComponent) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContainer>
        <ModalComponent
          existingData={modalData}
          onSave={onSave}
          onClose={onClose}
          calculateTotal={calculateTotal}
          analysisYears={analysisYears}
        />
      </ModalContainer>
    </ModalOverlay>
  );
};