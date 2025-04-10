
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, ArrowLeft } from "lucide-react";
import { CanvasAction } from "@/utils/canvasInteraction";
import { useToast } from "@/hooks/use-toast";

// Import new component files
import RequirementsInput from "./quotation/RequirementsInput";
import SORSelector from "./quotation/SORSelector";
import QuotationResult from "./quotation/QuotationResult";
import PreviousQuotes from "./quotation/PreviousQuotes";
import QuotationList from "./quotation/QuotationList";
import { generateQuotation, QuotationResultType } from "./quotation/quotationUtils";

interface QuotationTabProps {
  requirements?: string;
  sorItems?: string[];
  previousQuotes?: string[];
  userRole?: string;
  onCanvasAction?: (action: CanvasAction) => void;
}

// Define the type explicitly to ensure TypeScript knows it's a union of specific string literals
type QuotationView = "list" | "create" | "detail";

const QuotationTab: React.FC<QuotationTabProps> = ({
  requirements = "",
  sorItems = [],
  previousQuotes = [],
  userRole = "requestor",
  onCanvasAction
}) => {
  // Quote creation state
  const [userRequirements, setUserRequirements] = useState(requirements);
  const [selectedItems, setSelectedItems] = useState<string[]>(sorItems);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // View management - explicitly typed as QuotationView to ensure type safety
  const [currentView, setCurrentView] = useState<QuotationView>(userRole === "approver" ? "list" : "create");
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
      const userDisplayName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
      const quotation = generateQuotation(userRequirements, selectedItems, userDisplayName);
      setGeneratedQuotation(quotation);
      setIsGenerating(false);
      
      toast({
        title: "Quotation Generated",
        description: "Your quotation has been successfully generated.",
      });
    }, 1500);
  };

  const resetQuotation = () => {
    setGeneratedQuotation(null);
    setCurrentView("create");
  };
  
  const handleSelectQuotation = (quotation: QuotationResultType) => {
    setGeneratedQuotation(quotation);
    setCurrentView("detail");
  };
  
  const handleQuotationUpdated = (updatedQuotation: QuotationResultType) => {
    setGeneratedQuotation(updatedQuotation);
  };

  return (
    <div className="space-y-4">
      {currentView === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Facility Management Quotations</h2>
            {userRole === "requestor" && (
              <Button onClick={() => setCurrentView("create")}>
                <PlusCircle className="h-4 w-4 mr-2" /> Create New
              </Button>
            )}
          </div>
          <QuotationList 
            userRole={userRole} 
            onSelectQuotation={handleSelectQuotation} 
          />
        </>
      )}

      {currentView === "create" && !generatedQuotation && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            {userRole !== "requestor" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="p-2 h-8 w-8" 
                onClick={() => setCurrentView("list")}
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
            {userRole === "approver" && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("list")}
                className="w-1/3"
              >
                Cancel
              </Button>
            )}
            
            <Button 
              onClick={handleGenerateQuotation} 
              className={userRole === "approver" ? "w-2/3" : "w-full"}
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
      )}

      {currentView === "detail" && generatedQuotation && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="p-2 h-8 w-8" 
              onClick={() => setCurrentView("list")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Quotation Details</h2>
          </div>
          
          <QuotationResult 
            quotation={generatedQuotation}
            resetQuotation={resetQuotation}
            userRole={userRole}
            onQuotationUpdated={handleQuotationUpdated}
          />
        </Card>
      )}
      
      {currentView === "create" && !generatedQuotation && (
        <PreviousQuotes previousQuotes={previousQuotes || []} />
      )}
    </div>
  );
};

export default QuotationTab;
