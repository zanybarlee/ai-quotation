
import { QuotationResultType } from "./types";
import { getQuotationsState, setQuotationsState } from "./storageUtils";

// Save or update a quotation
export const saveQuotation = (quotation: QuotationResultType): QuotationResultType => {
  const quotations = getQuotationsState();
  
  if (quotation.id && quotations.some(q => q.id === quotation.id)) {
    // Update existing quotation
    const updatedQuotations = quotations.map(q => 
      q.id === quotation.id ? { ...quotation } : q
    );
    setQuotationsState(updatedQuotations);
  } else {
    // Add new quotation
    setQuotationsState([...quotations, { ...quotation }]);
  }
  
  return quotation;
};

// Submit a quotation for approval
export const submitForApproval = (quotationId: string): QuotationResultType | undefined => {
  const quotations = getQuotationsState();
  const index = quotations.findIndex(q => q.id === quotationId);
  
  if (index >= 0) {
    const updatedQuotation = {
      ...quotations[index],
      status: "pending" as const
    };
    
    quotations[index] = updatedQuotation;
    setQuotationsState(quotations);
    
    return updatedQuotation;
  }
  return undefined;
};

// Approve a quotation
export const approveQuotation = (quotationId: string, notes?: string): QuotationResultType | undefined => {
  const quotations = getQuotationsState();
  const index = quotations.findIndex(q => q.id === quotationId);
  
  if (index >= 0) {
    const updatedQuotation = {
      ...quotations[index],
      status: "approved" as const,
      approverNotes: notes
    };
    
    quotations[index] = updatedQuotation;
    setQuotationsState(quotations);
    
    return updatedQuotation;
  }
  return undefined;
};

// Reject a quotation
export const rejectQuotation = (quotationId: string, notes?: string): QuotationResultType | undefined => {
  const quotations = getQuotationsState();
  const index = quotations.findIndex(q => q.id === quotationId);
  
  if (index >= 0) {
    const updatedQuotation = {
      ...quotations[index],
      status: "rejected" as const,
      approverNotes: notes
    };
    
    quotations[index] = updatedQuotation;
    setQuotationsState(quotations);
    
    return updatedQuotation;
  }
  return undefined;
};

// Archive a quotation
export const archiveQuotation = (quotationId: string): QuotationResultType | undefined => {
  const quotations = getQuotationsState();
  const index = quotations.findIndex(q => q.id === quotationId);
  
  if (index >= 0) {
    const updatedQuotation = {
      ...quotations[index],
      status: "archived" as const
    };
    
    quotations[index] = updatedQuotation;
    setQuotationsState(quotations);
    
    return updatedQuotation;
  }
  return undefined;
};

// Clear all quotations (for testing/development purposes)
export const clearAllQuotations = (): void => {
  setQuotationsState([]);
  localStorage.removeItem('savedQuotations');
};
