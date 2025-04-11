
import { useState } from "react";
import { QuotationResultType } from "./types";
import { CanvasAction } from "@/utils/canvasInteraction";
import { useSORItems } from "./hooks/useSORItems";
import { useQuotationGeneration } from "./hooks/useQuotationGeneration";
import { useQuotationViews } from "./hooks/useQuotationViews";

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
  // State for requirements and selected items
  const [userRequirements, setUserRequirements] = useState(initialRequirements);
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSorItems);
  
  // Use our new custom hooks
  const { 
    retrievedSORItems, 
    isSearchingSOR, 
    handleSORItemSelectionChange, 
    handleSORItemQuantityChange,
    handleSearchSOR 
  } = useSORItems();
  
  const {
    currentView,
    generatedQuotation,
    resetQuotation,
    handleSelectQuotation,
    handleQuotationGenerated,
    handleQuotationUpdated,
    handleCreateNew,
    handleBackToList
  } = useQuotationViews({ userRole });
  
  const { 
    isGenerating, 
    handleGenerateQuotation: generateQuotation 
  } = useQuotationGeneration({
    userRequirements,
    selectedItems,
    retrievedSORItems,
    userRole,
    onCanvasAction,
    onQuotationGenerated: handleQuotationGenerated
  });
  
  const toggleSORItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Wrapper for SOR search to use current requirements
  const handleSearchSORWrapper = async () => {
    await handleSearchSOR(userRequirements);
  };

  // Wrapper for generate quotation
  const handleGenerateQuotation = async () => {
    await generateQuotation();
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
    userRole,
    
    // Setters
    setUserRequirements,
    
    // Handlers
    toggleSORItem,
    handleGenerateQuotation,
    handleSearchSOR: handleSearchSORWrapper,
    handleSORItemSelectionChange,
    handleSORItemQuantityChange,
    resetQuotation,
    handleSelectQuotation,
    handleQuotationUpdated,
    handleCreateNew,
    handleBackToList
  };
}
