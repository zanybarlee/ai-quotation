
// Export all quotation-related functionality from the modularized files
// This file serves as the main entry point for quotation utilities

// Re-export types
export * from './types';

// Re-export constants
export * from './baseData';

// Re-export storage utilities
export {
  loadQuotationsFromStorage,
  saveQuotationsToStorage,
} from './storageUtils';

// Re-export quotation generator
export { generateQuotation } from './quotationGenerator';

// Re-export quotation actions
export {
  saveQuotation,
  submitForApproval,
  approveQuotation,
  rejectQuotation,
  archiveQuotation,
  clearAllQuotations,
  deleteQuotation,
} from './quotationActions';

// Re-export quotation queries
export {
  getPendingQuotations,
  getArchivedQuotations,
  getNonArchivedQuotations,
  getDraftQuotations,
  getAllQuotations,
  getQuotationById,
} from './quotationQueries';
