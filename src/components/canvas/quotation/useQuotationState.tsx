
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuotationResultType } from "./types";
import { generateQuotation } from "./quotationGenerator";
import { saveQuotation } from "./quotationActions";
import { fetchSORItems, SORItem } from "./sorApiUtils";
import { CanvasAction } from "@/utils/canvasInteraction";

export interface UseQuotationStateProps {
  initialRequirements?: string;
  initialSorItems?: string[];
  userRole?: string;
  onCanvasAction?: (action: CanvasAction) => void;
}

export function useQuotationState({
  initialRequirements = "",
  initialSorItems = [],
  userRole = "requestor",
  onCanvasAction
}: UseQuotationStateProps) {
  // Quote creation state
  const [userRequirements, setUserRequirements] = useState(initialRequirements);
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSorItems);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // View management
  const [currentView, setCurrentView] = useState<"list" | "create" | "detail" | "welcome">("list");
  const [generatedQuotation, setGeneratedQuotation] = useState<QuotationResultType | null>(null);
  
  const { toast } = useToast();

  // Set initial view based on user role - only once when component mounts
  useEffect(() => {
    // Start directly with the list view for everyone
    setCurrentView("list");
  }, [userRole]);
  
  const toggleSORItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleGenerateQuotation = async () => {
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
    
    let sorItems: SORItem[] = [];
    
    try {
      // Call the Chat API to get SOR data based on requirements
      toast({
        title: "Retrieving SOR data",
        description: "Searching for relevant facility management services...",
      });
      
      sorItems = await fetchSORItems(userRequirements);
      
      if (sorItems.length > 0) {
        toast({
          title: "SOR data retrieved",
          description: `Found ${sorItems.length} relevant service items.`,
        });
      }
    } catch (error) {
      console.error("Error fetching SOR data:", error);
      toast({
        title: "SOR data retrieval failed",
        description: "Using default values instead.",
        variant: "destructive"
      });
    }
    
    try {
      // Generate a quotation based on requirements, selected items, and SOR data
      const userDisplayName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
      const quotation = await generateQuotation(userRequirements, selectedItems, sorItems, userDisplayName);
      
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
    } catch (error) {
      console.error("Error generating quotation:", error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate quotation. Please try again.",
        variant: "destructive"
      });
    }
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
  
  return {
    // State
    userRequirements,
    selectedItems,
    isGenerating,
    currentView,
    generatedQuotation,
    
    // Setters
    setUserRequirements,
    
    // Handlers
    toggleSORItem,
    handleGenerateQuotation,
    resetQuotation,
    handleSelectQuotation,
    handleQuotationUpdated,
    handleCreateNew,
    handleBackToList
  };
}
