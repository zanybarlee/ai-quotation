
export interface QuotationVersion {
  id: string;
  name: string;
  timestamp: Date;
  content: string;
  inputContent: string;
}

export interface QuotationSettings {
  readingLevel: 'simple' | 'moderate' | 'advanced';
  tone: 'formal' | 'casual' | 'technical';
  length: 'concise' | 'standard' | 'detailed';
}
