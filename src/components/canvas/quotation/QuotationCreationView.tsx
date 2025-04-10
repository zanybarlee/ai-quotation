
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RequirementsInput from "./RequirementsInput";
import SORSelector from "./SORSelector";
import PreviousQuotes from "./PreviousQuotes";

interface QuotationCreationViewProps {
  userRequirements: string;
  setUserRequirements: (requirements: string) => void;
  selectedItems: string[];
  toggleSORItem: (item: string) => void;
  isGenerating: boolean;
  handleGenerateQuotation: () => void;
  previousQuotes: string[];
  userRole: string;
  onBackToList: () => void;
}

const QuotationCreationView: React.FC<QuotationCreationViewProps> = ({
  userRequirements,
  setUserRequirements,
  selectedItems,
  toggleSORItem,
  isGenerating,
  handleGenerateQuotation,
  previousQuotes,
  userRole,
  onBackToList
}) => {
  const { toast } = useToast();
  const showBackButton = true; // Always show back button for all roles now

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          {showBackButton && (
            <Button 
              variant="outline" 
              size="sm" 
              className="p-2 h-8 w-8" 
              onClick={onBackToList}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-xl font-semibold">Create New Quotation</h2>
        </div>
        
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
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBackToList}
            className="w-1/3"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleGenerateQuotation} 
            className="w-2/3"
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
        </div>
      </Card>
      
      <PreviousQuotes previousQuotes={previousQuotes} />
    </>
  );
};

export default QuotationCreationView;
