
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CanvasAction } from "@/utils/canvasInteraction";
import { useToast } from "@/hooks/use-toast";

// Import new component files
import RequirementsInput from "./quotation/RequirementsInput";
import SORSelector from "./quotation/SORSelector";
import QuotationResult from "./quotation/QuotationResult";
import PreviousQuotes from "./quotation/PreviousQuotes";
import { generateQuotation, QuotationResultType } from "./quotation/quotationUtils";

interface QuotationTabProps {
  requirements?: string;
  sorItems?: string[];
  previousQuotes?: string[];
  onCanvasAction?: (action: CanvasAction) => void;
}

const QuotationTab: React.FC<QuotationTabProps> = ({
  requirements = "",
  sorItems = [],
  previousQuotes = [],
  onCanvasAction
}) => {
  const [userRequirements, setUserRequirements] = useState(requirements);
  const [selectedItems, setSelectedItems] = useState<string[]>(sorItems);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuotation, setGeneratedQuotation] = useState<QuotationResultType | null>(null);
  const { toast } = useToast();

  const toggleSORItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleGenerateQuotation = () => {
    if (userRequirements.trim() === '') {
      toast({
        title: "Requirements needed",
        description: "Please enter your project requirements before generating a quotation.",
        variant: "destructive"
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item from Schedule of Rates.",
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
    
    // Generate a quotation based on requirements and selected items
    setTimeout(() => {
      const quotation = generateQuotation(userRequirements, selectedItems);
      setGeneratedQuotation(quotation);
      setIsGenerating(false);
      
      toast({
        title: "Quotation Generated",
        description: "Your quotation has been successfully generated.",
      });
    }, 2000);
  };

  const resetQuotation = () => {
    setGeneratedQuotation(null);
  };

  return (
    <div className="space-y-4">
      {!generatedQuotation ? (
        <Card className="p-4">
          <RequirementsInput 
            userRequirements={userRequirements}
            setUserRequirements={setUserRequirements}
          />
          
          <div className="mb-4">
            <SORSelector 
              selectedItems={selectedItems}
              toggleSORItem={toggleSORItem}
            />
          </div>
          
          <Button 
            onClick={handleGenerateQuotation} 
            className="w-full"
            disabled={isGenerating || userRequirements.trim() === ''}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Quotation"
            )}
          </Button>
        </Card>
      ) : (
        <Card className="p-4">
          <QuotationResult 
            quotation={generatedQuotation}
            resetQuotation={resetQuotation}
          />
        </Card>
      )}
      
      <PreviousQuotes previousQuotes={previousQuotes || []} />
    </div>
  );
};

export default QuotationTab;
