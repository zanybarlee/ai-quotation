
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CanvasAction } from "@/utils/canvasInteraction";
import { generateQuotation, QuotationResultType, saveQuotation } from "./quotation/quotationUtils";

// Import view components
import QuotationListView from "./quotation/QuotationListView";
import QuotationCreationView from "./quotation/QuotationCreationView";
import QuotationDetailView from "./quotation/QuotationDetailView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuotationTabProps {
  requirements?: string;
  sorItems?: string[];
  previousQuotes?: string[];
  userRole?: string;
  onCanvasAction?: (action: CanvasAction) => void;
}

// Define the type explicitly to ensure TypeScript knows it's a union of specific string literals
type QuotationView = "list" | "create" | "detail" | "welcome";

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
  const [currentView, setCurrentView] = useState<QuotationView>("welcome"); // Default to welcome view
  const [generatedQuotation, setGeneratedQuotation] = useState<QuotationResultType | null>(null);
  
  const { toast } = useToast();

  // Set initial view based on user role - only once when component mounts
  useEffect(() => {
    // We'll start with the welcome view for everyone
    setCurrentView("welcome");
  }, [userRole]);

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
      
      // Save the quotation immediately to ensure it has a valid ID
      const savedQuotation = saveQuotation(quotation);
      setGeneratedQuotation(savedQuotation);
      setIsGenerating(false);
      
      toast({
        title: "Quotation Generated",
        description: "Your quotation has been successfully generated and saved as a draft.",
      });
      
      // Switch to detail view to see the generated quotation
      setCurrentView("detail");
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
  
  const handleCreateNew = () => {
    // Reset the form state when creating a new quotation
    setUserRequirements("");
    setSelectedItems([]);
    setGeneratedQuotation(null);
    setCurrentView("create");
  };
  
  const handleBackToList = () => {
    setCurrentView("list");
  };

  const handleDismissWelcome = () => {
    setCurrentView("list");
  };

  // Generate welcome message based on user role
  const getWelcomeMessage = () => {
    switch (userRole) {
      case "requestor":
        return "Welcome to the Quotation Tool! Here you can create and submit quotations for facility management services. Start by browsing existing quotations or create a new one.";
      case "approver":
        return "Welcome to the Quotation Tool! As an Approver, you can review submitted quotations, approve or reject them, and create new quotations if needed.";
      case "itAdmin":
        return "Welcome to the Quotation Tool! As an IT Admin, you have access to all quotations including archived ones. You can manage the system and help other users with technical issues.";
      case "seniorManagement":
        return "Welcome to the Quotation Tool! As a Senior Management user, you can review all quotations, create new ones, and access performance reports and analytics.";
      default:
        return "Welcome to the Kim Yew Facility Management Quotation Tool! Browse existing quotations or create new ones to get started.";
    }
  };

  // Generate welcome title based on user role
  const getWelcomeTitle = () => {
    const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    return `Welcome, ${roleDisplay}!`;
  };

  return (
    <div className="space-y-4">
      {currentView === "welcome" && (
        <Card className="border-l-4 border-l-kimyew-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-kimyew-blue">{getWelcomeTitle()}</CardTitle>
            <CardDescription>Kim Yew Integrated Facility Management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{getWelcomeMessage()}</p>
            <div className="flex justify-end">
              <button 
                onClick={handleDismissWelcome}
                className="px-4 py-2 bg-kimyew-blue text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === "list" && (
        <QuotationListView 
          userRole={userRole} 
          onSelectQuotation={handleSelectQuotation} 
          onCreateNew={handleCreateNew} 
        />
      )}

      {currentView === "create" && (
        <QuotationCreationView
          userRequirements={userRequirements}
          setUserRequirements={setUserRequirements}
          selectedItems={selectedItems}
          toggleSORItem={toggleSORItem}
          isGenerating={isGenerating}
          handleGenerateQuotation={handleGenerateQuotation}
          previousQuotes={previousQuotes || []}
          userRole={userRole}
          onBackToList={handleBackToList}
        />
      )}

      {(currentView === "detail" && generatedQuotation) && (
        <QuotationDetailView
          quotation={generatedQuotation}
          resetQuotation={resetQuotation}
          userRole={userRole}
          onQuotationUpdated={handleQuotationUpdated}
          onBackToList={handleBackToList}
        />
      )}
    </div>
  );
};

export default QuotationTab;
