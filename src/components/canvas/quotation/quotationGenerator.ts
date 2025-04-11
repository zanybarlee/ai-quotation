
import { QuotationResultType } from "./types";
import { baseHourRates, clientOptions } from "./baseData";
import { SORItem } from "./sorApiUtils";

// Generate a new quotation based on requirements, selected items, and SOR data
export const generateQuotation = async (
  requirements: string, 
  selectedItems: string[], 
  sorItems: SORItem[] = [],
  createdBy?: string
): Promise<QuotationResultType> => {
  // Select a random client for demonstration purposes
  const randomClient = clientOptions[Math.floor(Math.random() * clientOptions.length)];
  
  // Create line items from the SOR data
  const lineItems = sorItems
    .filter(sorItem => sorItem.selected)
    .map(sorItem => {
      // Use the user-specified quantity or default to a random one
      const quantity = sorItem.quantity || parseFloat((Math.random() * 2 + 0.5).toFixed(2));
      const cost = Math.round(sorItem.rate * quantity);
      
      return {
        sor: sorItem.itemCode,
        item: sorItem.description,
        unit: sorItem.unit,
        quantity: quantity,
        rate: sorItem.rate,
        cost: cost,
        hours: Math.round(quantity) // Simplistic estimation of hours based on quantity
      };
    });
  
  // If no SOR items were found, create line items from the selected service categories
  if (lineItems.length === 0) {
    selectedItems.forEach(item => {
      const complexity = requirements.length / 100;
      const baseRate = baseHourRates[item] || 75;
      const rate = Math.round(baseRate);
      const quantity = parseFloat((Math.random() * 2 + 0.5).toFixed(2));
      const cost = Math.round(rate * quantity);
      const hours = Math.round(complexity * (Math.random() * 5 + 1)); // Generate some hours

      lineItems.push({
        sor: `SOR-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`,
        item: item,
        unit: "No",
        quantity: quantity,
        rate: rate,
        cost: cost,
        hours: hours // Include hours in the line item
      });
    });
  }

  const totalCost = lineItems.reduce((sum, item) => sum + item.cost, 0);
  const totalHours = lineItems.reduce((sum, item) => sum + (item.hours || 0), 0);

  let title = "Facility Management Services";
  if (requirements.length > 10) {
    const firstSentence = requirements.split('.')[0].trim();
    if (firstSentence.length > 5 && firstSentence.length < 100) {
      title = firstSentence;
    }
  }

  // Generate ID in the format QT-YYYY-XXXX
  const today = new Date();
  const year = today.getFullYear();
  const id = `QT-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return {
    id,
    title,
    description: requirements,
    estimatedHours: totalHours || 0,
    totalCost,
    status: "draft",
    createdBy,
    createdAt: new Date(),
    clientName: randomClient.name,
    clientAddress: randomClient.address,
    lineItems
  };
};
