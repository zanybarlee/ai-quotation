
export interface QuotationResultType {
  title: string;
  description: string;
  estimatedHours: number;
  totalCost: number;
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

export const generateQuotation = (requirements: string, selectedItems: string[]): QuotationResultType => {
  // Generate line items based on selected SOR items
  const lineItems = selectedItems.map(item => {
    // Calculate random but reasonable hours based on the complexity implied by requirements
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

  // Calculate totals
  const totalHours = lineItems.reduce((sum, item) => sum + item.hours, 0);
  const totalCost = lineItems.reduce((sum, item) => sum + item.cost, 0);

  // Create a title based on the requirements
  let title = "Facility Management Quotation";
  if (requirements.length > 10) {
    // Extract a reasonable title from the first sentence of requirements
    const firstSentence = requirements.split('.')[0].trim();
    if (firstSentence.length > 5 && firstSentence.length < 50) {
      title = firstSentence;
    }
  }

  return {
    title,
    description: requirements,
    estimatedHours: totalHours,
    totalCost,
    lineItems
  };
};
