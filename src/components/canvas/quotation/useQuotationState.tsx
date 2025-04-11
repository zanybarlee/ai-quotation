
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
  const [isSearchingSOR, setIsSearchingSOR] = useState(false);
  const [retrievedSORItems, setRetrievedSORItems] = useState<SORItem[]>([]);
  
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

  const handleSORItemSelectionChange = (index: number, selected: boolean) => {
    const updatedItems = [...retrievedSORItems];
    updatedItems[index].selected = selected;
    setRetrievedSORItems(updatedItems);
  };

  const handleSearchSOR = async () => {
    if (userRequirements.trim() === '') {
      toast({
        title: "Requirements needed",
        description: "Please enter your query before searching the Schedule of Rates.",
        variant: "destructive"
      });
      return;
    }

    setIsSearchingSOR(true);
    
    try {
      // Call the Chat API to get SOR data based on requirements
      toast({
        title: "Searching SOR database",
        description: "Looking for matching items in the Schedule of Rates...",
      });
      
      const sorItems = await fetchSORItems(userRequirements);
      setRetrievedSORItems(sorItems);
      
      if (sorItems.length > 0) {
        toast({
          title: "SOR data retrieved",
          description: `Found ${sorItems.length} relevant service items.`,
        });
      } else {
        toast({
          title: "No relevant SOR items found",
          description: "Try refining your search query or use the category selections below.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching SOR data:", error);
      toast({
        title: "Error",
        description: "Failed to search SOR database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearchingSOR(false);
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
      setGeneratedQuotation(savedQuotation);
      
      toast({
        title: "Quotation Generated",
        description: "Your quotation has been successfully generated and saved as a draft.",
      });
      
      // Switch to detail view to see the generated quotation
      setCurrentView("detail");
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
    setRetrievedSORItems([]);
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
    isSearchingSOR,
    currentView,
    generatedQuotation,
    retrievedSORItems,
    
    // Setters
    setUserRequirements,
    
    // Handlers
    toggleSORItem,
    handleGenerateQuotation,
    handleSearchSOR,
    handleSORItemSelectionChange,
    resetQuotation,
    handleSelectQuotation,
    handleQuotationUpdated,
    handleCreateNew,
    handleBackToList
  };
}
