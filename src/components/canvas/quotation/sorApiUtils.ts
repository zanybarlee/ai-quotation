
import { query } from "@/utils/chatApi";

export interface SORItem {
  itemCode: string;
  description: string;
  unit: string;
  rate: number;
}

/**
 * Parse SOR data from the API response text
 * @param responseText - The raw text response from the API
 * @returns Array of parsed SOR items
 */
export function parseSORResponse(responseText: string): SORItem[] {
  const items: SORItem[] = [];
  
  // Look for patterns like:
  // - Item Code: SME-1-1-5
  // - Description: One fan point controlled by one switch
  // - Unit: No
  // - Rate: SGD 132.00
  
  // Split by item sections (often separated by double newlines or headers)
  const sections = responseText.split(/\n\n|\n###|\n\*\*/).filter(Boolean);
  
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
        rate: isNaN(rate) ? 0 : rate
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
    // Craft a prompt that asks for SOR items based on the requirements
    const prompt = `Search the Schedule of Rates (SOR) database and return the most relevant item(s) based on the following requirements:

${requirements}

Instruction: Retrieve the item code, description of works, unit, and rate (in SGD) that best matches these requirements.
Match based on work type, location (if given), and specific conditions.

Return:
- Item Code
- Description of Works
- Unit
- Rate (SGD)`;

    // Call the chat API with this prompt, using 'requestor' as the session ID
    const response = await query(prompt, "requestor");
    
    // Parse the response to extract SOR items
    const sorItems = parseSORResponse(response);
    
    return sorItems;
  } catch (error) {
    console.error("Error fetching SOR data:", error);
    return [];
  }
}
