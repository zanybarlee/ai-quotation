
import { QuotationResultType } from "./types";
import { baseHourRates, clientOptions } from "./baseData";

// Generate a new quotation based on requirements and selected items
export const generateQuotation = (requirements: string, selectedItems: string[], createdBy?: string): QuotationResultType => {
  // Select a random client for demonstration purposes
  const randomClient = clientOptions[Math.floor(Math.random() * clientOptions.length)];
  
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
      cost,
      description: `${item} - Professional facility management service including installation, maintenance, and quality assurance.`
    };
  });

  const totalHours = lineItems.reduce((sum, item) => sum + item.hours, 0);
  const totalCost = lineItems.reduce((sum, item) => sum + item.cost, 0);

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
    estimatedHours: totalHours,
    totalCost,
    status: "draft",
    createdBy,
    createdAt: new Date(),
    clientName: randomClient.name,
    clientAddress: randomClient.address,
    lineItems
  };
};
