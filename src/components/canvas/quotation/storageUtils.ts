
import { QuotationResultType } from "./types";

// Shared quotation state
let savedQuotations: QuotationResultType[] = [];

// Load quotations from localStorage
export const loadQuotationsFromStorage = (): QuotationResultType[] => {
  const savedData = localStorage.getItem('savedQuotations');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      savedQuotations = parsed.map((q: any) => ({
        ...q,
        createdAt: q.createdAt ? new Date(q.createdAt) : undefined
      }));
      return savedQuotations;
    } catch (e) {
      console.error('Error loading quotations from localStorage:', e);
      return [];
    }
  }
  return [];
};

// Save quotations to localStorage
export const saveQuotationsToStorage = (quotations: QuotationResultType[]) => {
  try {
    localStorage.setItem('savedQuotations', JSON.stringify(quotations));
  } catch (e) {
    console.error('Error saving quotations to localStorage:', e);
  }
};

// Initialize by loading from storage when the module is first imported
loadQuotationsFromStorage();

// Export the shared state for other modules to use
export const getQuotationsState = (): QuotationResultType[] => savedQuotations;

export const setQuotationsState = (quotations: QuotationResultType[]) => {
  savedQuotations = quotations;
  saveQuotationsToStorage(savedQuotations);
};
