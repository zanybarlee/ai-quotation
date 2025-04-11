
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

// Get draft quotations for a specific user role
export const getDraftQuotations = (userRole?: string, username?: string): QuotationResultType[] => {
  return getQuotationsState().filter(q => {
    // Only return drafts that belong to the current user role
    return q.status === "draft" && 
      // If we have a username, match the creator
      (username ? q.createdBy === username : true) &&
      // Filter by role-specific drafts (can be expanded for other roles)
      (userRole === "approver" ? q.createdBy?.includes("Approver") : 
       userRole === "requestor" ? q.createdBy?.includes("Requestor") : true);
  });
};

// Get all quotations
export const getAllQuotations = (): QuotationResultType[] => {
  return getQuotationsState().filter(q => q.status !== "draft"); // Exclude drafts for IT Admin and Senior Management
};

// Get a specific quotation by ID
export const getQuotationById = (id: string): QuotationResultType | undefined => {
  return getQuotationsState().find(q => q.id === id);
};
