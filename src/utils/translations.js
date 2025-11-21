// src/utils/translations.js
export const translations = {
  es: {
    // ===== COMPONENTE PRINCIPAL =====
    completeFinancialForm: "Formulario Financiero Completo",
    analysisPeriod: "Período de Análisis",
    years: "años",

    // ===== SECCIONES =====
    financingSources: "Fuentes de Financiamiento",
    projectedIncome: "Ingresos Proyectados", 
    projectedCosts: "Costos Previstos",
    operatingExpenses: "Gastos Operativos",
    totalFinancing: "Total Financiamiento", // español
    
    // Financing Section
    capitalEquity: "Capital o Patrimonio",
    bankCredit: "Crédito Bancario", 
    otherFinancing: "Otras Fuentes de Financiamiento",
    ownerInvestments: "Inversiones de propietarios y capital",
    loansCredit: "Préstamos y líneas de crédito",
    grantsInvestors: "Subvenciones, inversores, otras fuentes",
    totalFinancing: "Total Financiamiento",
    
    // Income Section
    salesServices: "Ventas y Servicios",
    financialIncome: "Ingresos Financieros",
    otherIncome: "Otros Ingresos", 
    mainBusiness: "Ingresos de actividades principales del negocio",
    investmentsInterests: "Inversiones, intereses, dividendos",
    additionalRevenue: "Fuentes de ingresos adicionales",
    totalIncome: "Total Ingresos",
    
    // Costs Section
    rawMaterials: "Materias Primas y Suministros",
    officeSupplies: "Suministros de Oficina",
    buildings: "Edificios e Instalaciones", 
    directMaterials: "Materiales directos para producción",
    officeEquipment: "Equipos y materiales de oficina",
    propertyConstruction: "Propiedades, construcción, mantenimiento",
    totalCosts: "Total Costos",
    
    // Expenses Section
    supplies: "Insumos",
    fuel: "Combustibles y Lubricantes",
    transport: "Transporte",
    energy: "Energía", 
    salaries: "Salarios",
    travel: "Gastos de Viaje",
    services: "Servicios Contratados",
    taxes: "Impuestos y Contribuciones",
    financialExpenses: "Gastos Financieros",
    otherExpenses: "Otros Gastos",
    totalExpenses: "Total Gastos",

    // ===== MODALES =====
    // Modal Capital
    capitalManagement: "Gestión de Capital",
    sourceName: "Nombre de la fuente",
    sourceType: "Tipo de fuente",
    equity: "Capital",
    personalSavings: "Ahorros Personales", 
    investor: "Inversor",
    otherSource: "Otra",
    amount: "Monto",
    totalCapital: "Total Capital",

    // Modal Bank Credit
    bankCreditManagement: "Gestión de Crédito Bancario",
    bankName: "Nombre del Banco",
    loanAmount: "Monto del Préstamo", 
    annualRate: "Tasa Anual %",
    loanTerm: "Plazo del Préstamo",
    annualInterest: "Interés Anual",
    totalInterest: "Interés Total",
    totalCreditAmount: "Monto Total de Crédito",

    // Modal Sales & Services
    salesServicesIncome: "Ingresos por Ventas y Servicios",
    incomeDescription: "Descripción del ingreso",
    incomeType: "Tipo de ingreso", 
    monthly: "Mensual",
    annual: "Anual",
    growthRate: "Tasa de Crecimiento %",
    projectedTotal: "Total Proyectado",
    totalAnnualIncome: "Ingreso Anual Total",
    
    // Modal Salaries
    salaryManagement: "Gestión de Salarios",
    employeeName: "Nombre del Empleado",
    position: "Cargo", 
    participation: "Participación %",
    monthlySalary: "Salario Mensual",
    annualSalary: "Salario Anual",
    addEmployee: "Agregar Empleado",
    monthlyTotal: "Total Mensual",
    annualTotal: "Total Anual",
    totalForYears: "Total para {years} años",

    // Modal Taxes
    taxesContributions: "Impuestos y Contribuciones",
    standardContributions: "Contribuciones Estándar",
    customTaxes: "Impuestos Personalizados", 
    taxName: "Nombre del Impuesto",
    taxRate: "Tasa del Impuesto %",
    laborUtilizationTax: "Impuesto por Utilización de Fuerza Laboral",
    socialSecurityContribution: "Contribución a la Seguridad Social",
    specialContribution: "Contribución Especial", 
    localDevelopmentContribution: "Contribución al Desarrollo Local",
    selectedTaxes: "Impuestos Seleccionados",
    totalTaxRate: "Tasa de Impuesto Total",
    basedOnSalaries: "Basado en el total de salarios",

    // Modal Raw Materials
    rawMaterialsManagement: "Gestión de Materias Primas",
    materialName: "Nombre del Material", 
    unit: "Unidad",
    quantity: "Cantidad",
    unitCost: "Costo Unitario",
    supplier: "Proveedor",
    periodicCost: "Costo Periódico",
    totalMaterialsCost: "Costo Total de Materiales",

    // Modal Generic
    items: "Elementos",
    description: "Descripción", 
    frequency: "Frecuencia",
    quarterly: "Trimestral",
    oneTime: "Una vez",

    // ===== BOTONES Y ACCIONES =====
    add: "Agregar",
    edit: "Editar",
    save: "Guardar", 
    cancel: "Cancelar",
    delete: "Eliminar",
    calculate: "Calcular",
    close: "Cerrar",

    // ===== ESTADOS Y MENSAJES =====
    noItems: "No hay elementos agregados",
    moreItems: "más elementos", 
    total: "Total",
    loading: "Cargando...",
    pleaseWait: "Por favor espere",

    // ===== RESULTADOS FINANCIEROS =====
    financialResults: "Resultados Financieros",
    npv: "VAN (Valor Actual Neto)",
    irr: "TIR (Tasa Interna de Retorno)", 
    paybackPeriod: "Período de Recuperación",
    annualCashFlow: "Flujo de Caja Anual",
    netMargin: "Margen Neto",
    annualROI: "ROI Anual",
    profitabilityAnalysis: "Análisis de Rentabilidad",
    financialAnalysis: "Análisis Financiero",

    // Estados de viabilidad
    viable: "Viable",
    notViable: "No viable", 
    target: "Meta",
    low: "Baja",
    fast: "Rápido",
    normal: "Normal",
    positive: "Positivo",
    negative: "Negativo",

    // Textos de ayuda
    presentValueFlows: "Valor presente de los flujos futuros",
    minimumRequired: "Mínimo requerido: 8%", 
    timeRecoverInvestment: "Tiempo para recuperar la inversión",
    revenueOperatingCosts: "Ingresos - Costos operativos",
    profitPercentage: "Porcentaje de ganancia sobre ventas",
    returnOnInvestment: "Retorno sobre inversión anual",

    // ===== SUGERENCIAS =====
    suggestions: "Sugerencias",
    recommendations: "Recomendaciones",
    completeFinancialData: "Complete los datos financieros básicos para ver resultados",
  },
  en: {
    // ===== MAIN COMPONENT =====
    completeFinancialForm: "Complete Financial Form",
    analysisPeriod: "Analysis Period", 
    years: "years",

    // ===== SECTIONS =====
    financingSources: "Financing Sources",
    projectedIncome: "Projected Income",
    projectedCosts: "Projected Costs", 
    operatingExpenses: "Operating Expenses",
    
    // Financing Section
    capitalEquity: "Capital or Equity",
    bankCredit: "Bank Credit",
    otherFinancing: "Other Financing Sources", 
    ownerInvestments: "Owner investments and equity",
    loansCredit: "Loans and credit lines",
    grantsInvestors: "Grants, investors, other sources",
    totalFinancing: "Total Financing",
    
    // Income Section
    salesServices: "Sales & Services", 
    financialIncome: "Financial Income",
    otherIncome: "Other Income",
    mainBusiness: "Revenue from main business activities",
    investmentsInterests: "Investments, interests, dividends", 
    additionalRevenue: "Additional revenue sources",
    totalIncome: "Total Income",
    
    // Costs Section
    rawMaterials: "Raw Materials & Supplies",
    officeSupplies: "Office Supplies", 
    buildings: "Buildings & Facilities",
    directMaterials: "Direct materials for production",
    officeEquipment: "Office equipment and materials",
    propertyConstruction: "Property, construction, maintenance", 
    totalCosts: "Total Costs",
    
    // Expenses Section
    supplies: "Supplies",
    fuel: "Fuel & Lubricants",
    transport: "Transport",
    energy: "Energy", 
    salaries: "Salaries",
    travel: "Travel Expenses",
    services: "Contracted Services",
    taxes: "Taxes & Contributions",
    financialExpenses: "Financial Expenses", 
    otherExpenses: "Other Expenses",
    totalExpenses: "Total Expenses",

    // ===== MODALS =====
    // Modal Capital
    capitalManagement: "Capital Management",
    sourceName: "Source name", 
    sourceType: "Source type",
    equity: "Equity",
    personalSavings: "Personal Savings",
    investor: "Investor",
    otherSource: "Other", 
    amount: "Amount",
    totalCapital: "Total Capital",
    
    // Modal Bank Credit
    bankCreditManagement: "Bank Credit Management",
    bankName: "Bank Name",
    loanAmount: "Loan Amount", 
    annualRate: "Annual Rate %",
    loanTerm: "Loan Term",
    annualInterest: "Annual Interest",
    totalInterest: "Total Interest",
    totalCreditAmount: "Total Credit Amount",

    // Modal Sales & Services
    salesServicesIncome: "Sales & Services Income", 
    incomeDescription: "Income description",
    incomeType: "Income type",
    monthly: "Monthly",
    annual: "Annual", 
    growthRate: "Growth Rate %",
    projectedTotal: "Projected Total",
    totalAnnualIncome: "Total Annual Income",

    // Modal Salaries
    salaryManagement: "Salary Management",
    employeeName: "Employee Name", 
    position: "Position",
    participation: "Participation %",
    monthlySalary: "Monthly Salary",
    annualSalary: "Annual Salary", 
    addEmployee: "Add Employee",
    monthlyTotal: "Monthly Total",
    annualTotal: "Annual Total",
    totalForYears: "Total for {years} years",

    // Modal Taxes
    taxesContributions: "Taxes & Contributions", 
    standardContributions: "Standard Contributions",
    customTaxes: "Custom Taxes",
    taxName: "Tax Name",
    taxRate: "Tax Rate %", 
    laborUtilizationTax: "Labor Utilization Tax",
    socialSecurityContribution: "Social Security Contribution",
    specialContribution: "Special Contribution",
    localDevelopmentContribution: "Local Development Contribution", 
    selectedTaxes: "Selected Taxes",
    totalTaxRate: "Total Tax Rate",
    basedOnSalaries: "Based on total salaries",

    // Modal Raw Materials
    rawMaterialsManagement: "Raw Materials Management",
    materialName: "Material Name", 
    unit: "Unit",
    quantity: "Quantity",
    unitCost: "Unit Cost",
    supplier: "Supplier",
    periodicCost: "Periodic Cost", 
    totalMaterialsCost: "Total Materials Cost",

    // Modal Generic
    items: "Items",
    description: "Description",
    frequency: "Frequency", 
    quarterly: "Quarterly",
    oneTime: "One-time",

    // ===== BUTTONS & ACTIONS =====
    add: "Add",
    edit: "Edit",
    save: "Save", 
    cancel: "Cancel",
    delete: "Delete",
    calculate: "Calculate",
    close: "Close",

    // ===== STATES & MESSAGES =====
    noItems: "No items added",
    moreItems: "more items", 
    total: "Total",
    loading: "Loading...",
    pleaseWait: "Please wait",

    // ===== FINANCIAL RESULTS =====
    financialResults: "Financial Results",
    npv: "NPV (Net Present Value)", 
    irr: "IRR (Internal Rate of Return)",
    paybackPeriod: "Payback Period",
    annualCashFlow: "Annual Cash Flow",
    netMargin: "Net Margin", 
    annualROI: "Annual ROI",
    profitabilityAnalysis: "Profitability Analysis",
    financialAnalysis: "Financial Analysis",

    // Viability states
    viable: "Viable",
    notViable: "Not viable", 
    target: "Target",
    low: "Low",
    fast: "Fast",
    normal: "Normal",
    positive: "Positive",
    negative: "Negative",

    // Help texts
    presentValueFlows: "Present value of future cash flows",
    minimumRequired: "Minimum required: 8%", 
    timeRecoverInvestment: "Time to recover investment",
    revenueOperatingCosts: "Revenue - Operating costs",
    profitPercentage: "Profit percentage over sales",
    returnOnInvestment: "Annual return on investment",

    // ===== SUGGESTIONS =====
    suggestions: "Suggestions",
    recommendations: "Recommendations", 
    completeFinancialData: "Complete the basic financial data to see results",
  }
};

// Exportación simple para uso directo
export const financialTranslations = translations.es;