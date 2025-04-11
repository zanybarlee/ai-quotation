
import { QuotationResultType } from "./types";
import { getQuotationsState } from "./storageUtils";

// Get all pending quotations
export const getPendingQuotations = (): QuotationResultType[] => {
  return getQuotationsState().filter(q => q.status === "pending");
};

// Get all archived quotations
export const getArchivedQuotations = (): QuotationResultType[] => {
  return getQuotationsState().filter(q => q.status === "archived");
};

// Get all non-archived quotations
export const getNonArchivedQuotations = (): QuotationResultType[] => {
  return getQuotationsState().filter(q => q.status !== "archived");
};

// Get draft quotations
export const getDraftQuotations = (): QuotationResultType[] => {
  return getQuotationsState().filter(q => q.status === "draft");
};

// Get all quotations
export const getAllQuotations = (): QuotationResultType[] => {
  return [...getQuotationsState()];
};

// Get a specific quotation by ID
export const getQuotationById = (id: string): QuotationResultType | undefined => {
  return getQuotationsState().find(q => q.id === id);
};
