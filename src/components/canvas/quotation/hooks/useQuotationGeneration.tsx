
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuotationResultType } from "../types";
import { generateQuotation } from "../quotationGenerator";
import { saveQuotation } from "../quotationActions";
import { CanvasAction } from "@/utils/canvasInteraction";
import { SORItem } from "../sorApiUtils";

interface UseQuotationGenerationProps {
  userRequirements: string;
  selectedItems: string[];
  retrievedSORItems: SORItem[];
  userRole?: string;
  onCanvasAction?: (action: CanvasAction) => void;
  onQuotationGenerated: (quotation: QuotationResultType) => void;
}

export function useQuotationGeneration({
  userRequirements,
  selectedItems,
  retrievedSORItems,
  userRole = "requestor",
  onCanvasAction,
  onQuotationGenerated
}: UseQuotationGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuotation = async () => {
    if (userRequirements.trim() === '') {
      toast({
        title: "Requirements needed",
        description: "Please enter your project requirements before generating a quotation.",
        variant: "destructive"
      });
      return;
    }

    // Check if either SOR items are selected or category items are selected
    const anySORItemSelected = retrievedSORItems.some(item => item.selected);
    
    if (!anySORItemSelected && selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one SOR item or category to include in your quotation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Notify canvas about quotation generation
    if (onCanvasAction) {
      onCanvasAction({
        type: 'quotation_generation',
        payload: { 
          requirements: userRequirements,
          sorItems: selectedItems,
          summary: "Generating quotation based on requirements and SOR items"
        },
        source: 'canvas'
      });
    }
    
    try {
      // Filter only the selected SOR items
      const selectedSORItems = retrievedSORItems.filter(item => item.selected);
      
      // Generate a quotation based on requirements, selected categories, and selected SOR items
      const userDisplayName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
      const quotation = await generateQuotation(
        userRequirements, 
        selectedItems, 
        selectedSORItems, 
        userDisplayName
      );
      
      // Save the quotation immediately to ensure it has a valid ID
      const savedQuotation = saveQuotation(quotation);
      
      toast({
        title: "Quotation Generated",
        description: "Your quotation has been successfully generated and saved as a draft.",
      });
      
      onQuotationGenerated(savedQuotation);
    } catch (error) {
      console.error("Error generating quotation:", error);
      toast({
        title: "Error",
        description: "Failed to generate quotation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleGenerateQuotation
  };
}
