export interface QuotationResultType {
  id?: string;
  title: string;
  description: string;
  estimatedHours: number;
  totalCost: number;
  status?: "draft" | "pending" | "approved" | "rejected";
  approverNotes?: string;
  createdBy?: string;
  createdAt?: Date;
  lineItems: {
    item: string;
    hours: number;
    rate: number;
    cost: number;
  }[];
}

export const baseHourRates: Record<string, number> = {
  "Maintenance & Inspection": 85,
  "Fire Safety Checks": 95,
  "Façade Inspections": 110,
  "Renovation & Repairs": 90,
  "General Building Repairs": 80,
  "Cleaning Services": 60,
  "Deep Cleaning": 75,
  "Pest Control": 70,
  "Energy Audits": 105,
  "Green Initiatives": 90,
  "Security Services": 65,
  "Equipment Maintenance": 85
};

const loadQuotationsFromStorage = (): QuotationResultType[] => {
  const savedData = localStorage.getItem('savedQuotations');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      return parsed.map((q: any) => ({
        ...q,
        createdAt: q.createdAt ? new Date(q.createdAt) : undefined
      }));
    } catch (e) {
      console.error('Error loading quotations from localStorage:', e);
      return [];
    }
  }
  return [];
};

const saveQuotationsToStorage = (quotations: QuotationResultType[]) => {
  try {
    localStorage.setItem('savedQuotations', JSON.stringify(quotations));
  } catch (e) {
    console.error('Error saving quotations to localStorage:', e);
  }
};

export const generateQuotation = (requirements: string, selectedItems: string[], createdBy?: string): QuotationResultType => {
  const lineItems = selectedItems.map(item => {
    const complexity = requirements.length / 100;
    const baseHours = Math.max(4, Math.min(40, Math.floor(8 + Math.random() * 16)));
    const hours = Math.ceil(baseHours * (0.8 + complexity * 0.4));
    const rate = baseHourRates[item] || 75;
    const cost = hours * rate;

    return {
      item,
      hours,
      rate,
      cost
    };
  });

  const totalHours = lineItems.reduce((sum, item) => sum + item.hours, 0);
  const totalCost = lineItems.reduce((sum, item) => sum + item.cost, 0);

  let title = "Facility Management Quotation";
  if (requirements.length > 10) {
    const firstSentence = requirements.split('.')[0].trim();
    if (firstSentence.length > 5 && firstSentence.length < 50) {
      title = firstSentence;
    }
  }

  const id = `QT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return {
    id,
    title,
    description: requirements,
    estimatedHours: totalHours,
    totalCost,
    status: "draft",
    createdBy,
    createdAt: new Date(),
    lineItems
  };
};

let savedQuotations: QuotationResultType[] = loadQuotationsFromStorage();

export const saveQuotation = (quotation: QuotationResultType): QuotationResultType => {
  if (quotation.id && savedQuotations.some(q => q.id === quotation.id)) {
    savedQuotations = savedQuotations.map(q => 
      q.id === quotation.id ? { ...quotation } : q
    );
  } else {
    savedQuotations.push({ ...quotation });
  }
  
  saveQuotationsToStorage(savedQuotations);
  
  return quotation;
};

export const submitForApproval = (quotationId: string): QuotationResultType | undefined => {
  const index = savedQuotations.findIndex(q => q.id === quotationId);
  if (index >= 0) {
    savedQuotations[index] = {
      ...savedQuotations[index],
      status: "pending"
    };
    
    saveQuotationsToStorage(savedQuotations);
    
    return savedQuotations[index];
  }
  return undefined;
};

export const approveQuotation = (quotationId: string, notes?: string): QuotationResultType | undefined => {
  const index = savedQuotations.findIndex(q => q.id === quotationId);
  if (index >= 0) {
    savedQuotations[index] = {
      ...savedQuotations[index],
      status: "approved",
      approverNotes: notes
    };
    
    saveQuotationsToStorage(savedQuotations);
    
    return savedQuotations[index];
  }
  return undefined;
};

export const rejectQuotation = (quotationId: string, notes?: string): QuotationResultType | undefined => {
  const index = savedQuotations.findIndex(q => q.id === quotationId);
  if (index >= 0) {
    savedQuotations[index] = {
      ...savedQuotations[index],
      status: "rejected",
      approverNotes: notes
    };
    
    saveQuotationsToStorage(savedQuotations);
    
    return savedQuotations[index];
  }
  return undefined;
};

export const getPendingQuotations = (): QuotationResultType[] => {
  return savedQuotations.filter(q => q.status === "pending");
};

export const getAllQuotations = (): QuotationResultType[] => {
  return [...savedQuotations];
};

export const getQuotationById = (id: string): QuotationResultType | undefined => {
  return savedQuotations.find(q => q.id === id);
};

export const clearAllQuotations = (): void => {
  savedQuotations = [];
  localStorage.removeItem('savedQuotations');
};
