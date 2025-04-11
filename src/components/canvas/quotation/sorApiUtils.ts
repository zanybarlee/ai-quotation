
import { query } from "@/utils/chatApi";

export interface SORItem {
  itemCode: string;
  description: string;
  unit: string;
  rate: number;
  selected?: boolean; // Added selected property
}

/**
 * Parse SOR data from the API response text
 * @param responseText - The raw text response from the API
 * @returns Array of parsed SOR items
 */
export function parseSORResponse(responseText: string): SORItem[] {
  // First try parsing as JSON
  try {
    const jsonData = JSON.parse(responseText);
    
    // Check if the response is already an array of items with the expected structure
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => ({
        itemCode: item.itemCode || item.item_code || '',
        description: item.description || item.description_of_works || '',
        unit: item.unit || 'No',
        rate: parseFloat(String(item.rate).replace(/[^0-9.]/g, '')) || 0,
        selected: false
      }));
    }
    
    // Check if it's a nested structure with items inside
    if (jsonData.items && Array.isArray(jsonData.items)) {
      return jsonData.items.map(item => ({
        itemCode: item.itemCode || item.item_code || '',
        description: item.description || item.description_of_works || '',
        unit: item.unit || 'No',
        rate: parseFloat(String(item.rate).replace(/[^0-9.]/g, '')) || 0,
        selected: false
      }));
    }
  } catch (error) {
    console.log("Not valid JSON format, continuing with text parsing");
  }
  
  // Fallback to text parsing if JSON parsing fails
  const items: SORItem[] = [];
  
  // Split by item sections (often separated by descriptions like "Lighting Point", "Fan Point")
  // This handles both numbered items (### Item X) and category headers (Lighting Point, Fan Point)
  const sections = responseText.split(/\n\n|\n###|\n\*\*|\nItem \d+|(?:\n[A-Za-z]+ Point)/i).filter(Boolean);
  
  for (const section of sections) {
    const itemCode = section.match(/(?:Item Code|Code):\s*([A-Za-z0-9-]+)/i)?.[1];
    const description = section.match(/(?:Description(?: of Works)?|Works):\s*([^\n]+)/i)?.[1];
    const unit = section.match(/(?:Unit):\s*([^\n]+)/i)?.[1];
    
    // Extract rate, handling different formats (SGD 132.00, $132.00, or just 132.00)
    let rateMatch = section.match(/(?:Rate):\s*(?:SGD|S\$|\$)?\s*([0-9.]+)/i);
    if (!rateMatch) {
      rateMatch = section.match(/(?:SGD|S\$|\$)\s*([0-9.]+)/i);
    }
    const rateStr = rateMatch?.[1];
    
    // Only add items that have at least item code and rate
    if (itemCode && rateStr) {
      const rate = parseFloat(rateStr);
      items.push({
        itemCode,
        description: description || itemCode,
        unit: unit || "No",
        rate: isNaN(rate) ? 0 : rate,
        selected: false // Default to not selected
      });
    }
  }
  
  return items;
}

/**
 * Fetch SOR data from the chat API based on user requirements
 * @param requirements - The user's requirements for the quotation
 * @returns A promise that resolves to an array of SOR items
 */
export async function fetchSORItems(requirements: string): Promise<SORItem[]> {
  try {
    // Request JSON format response from the API
    const prompt = `Search the Schedule of Rates (SOR) database and return the most relevant item(s) based on the following requirements:

${requirements}

IMPORTANT: Return the results in a structured JSON array format, with each item containing these exact fields:
[
  {
    "itemCode": "SME-1-1-6", 
    "description": "Wiring of 2 x 1.5mm sq. PVC cable to lighting point",
    "unit": "No",
    "rate": 162.00
  },
  {
    "itemCode": "...", 
    "description": "...",
    "unit": "...",
    "rate": ...
  }
]`;

    // Call the chat API with this prompt, using 'requestor' as the session ID
    // Request JSON format if possible, but handle text format as fallback
    const response = await query(prompt, "requestor", "json");
    
    // Parse the response to extract SOR items
    const sorItems = parseSORResponse(response);
    console.log("API returned SOR items:", sorItems);
    
    return sorItems;
  } catch (error) {
    console.error("Error fetching SOR data:", error);
    return [];
  }
}
