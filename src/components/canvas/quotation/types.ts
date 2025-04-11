
// Type definitions for quotation management
export interface LineItemType {
  item: string;
  hours?: number;
  rate: number;
  cost: number;
  description?: string;
  sor?: string;
  unit?: string;
  quantity?: number;
}

export interface QuotationResultType {
  id?: string;
  title: string;
  description: string;
  estimatedHours: number;
  totalCost: number;
  status?: "draft" | "pending" | "approved" | "rejected" | "archived";
  approverNotes?: string;
  createdBy?: string;
  createdAt?: Date;
  clientName?: string;
  clientAddress?: string;
  lineItems: LineItemType[];
}

export type QuotationStatus = "draft" | "pending" | "approved" | "rejected" | "archived";
