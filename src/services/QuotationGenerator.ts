
import { QuotationVersion } from "@/types/quotation";

export const generateRfp = (input: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API call to generate RFP (will be replaced with actual API)
    setTimeout(() => {
      resolve(simulateRfpGeneration(input));
    }, 2000);
  });
};

// This simulates what the AI would generate, will be replaced with actual AI integration
const simulateRfpGeneration = (input: string): string => {
  return `
    <h1>Request for Proposal</h1>
    <h2>Introduction</h2>
    <p>This RFP is generated based on your requirements: ${input.substring(0, 50)}...</p>
    
    <h2>Project Background</h2>
    <p>The client is seeking professional services to address specific needs related to their business operations.</p>
    
    <h2>Scope of Work</h2>
    <ul>
      <li>Requirement analysis and documentation</li>
      <li>System design and implementation</li>
      <li>Testing and validation</li>
      <li>Deployment and maintenance</li>
    </ul>
    
    <h2>Proposal Requirements</h2>
    <p>Vendors should provide a comprehensive description of their approach, timeline, budget, and team composition.</p>
    
    <h2>Evaluation Criteria</h2>
    <p>Proposals will be evaluated based on technical merit, cost-effectiveness, expertise, and alignment with project goals.</p>
    
    <h2>Timeline & Deliverables</h2>
    <p>The project is expected to commence within 30 days of vendor selection and be completed within 6 months.</p>
  `;
};

export const createNewVersion = (
  generatedContent: string, 
  inputContent: string, 
  versions: QuotationVersion[]
): QuotationVersion => {
  return {
    id: Date.now().toString(),
    name: `Version ${versions.length + 1}`,
    timestamp: new Date(),
    content: generatedContent,
    inputContent,
  };
};

export const createEditedVersion = (
  editedContent: string, 
  inputContent: string, 
  versions: QuotationVersion[]
): QuotationVersion => {
  return {
    id: Date.now().toString(),
    name: `Version ${versions.length + 1} (Edited)`,
    timestamp: new Date(),
    content: editedContent,
    inputContent,
  };
};
