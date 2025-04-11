
import React from "react";
import { CanvasAction } from "@/utils/canvasInteraction";
import { QuotationResultType } from "./quotation/quotationUtils";

// Import view components
import QuotationListView from "./quotation/QuotationListView";
import QuotationCreationView from "./quotation/QuotationCreationView";
import QuotationDetailView from "./quotation/QuotationDetailView";
import QuotationWelcomeMessage from "./quotation/QuotationWelcomeMessage";
import { useQuotationState } from "./quotation/useQuotationState";

interface QuotationTabProps {
  requirements?: string;
  sorItems?: string[];
  previousQuotes?: string[];
  userRole?: string;
  onCanvasAction?: (action: CanvasAction) => void;
}

const QuotationTab: React.FC<QuotationTabProps> = ({
  requirements = "",
  sorItems = [],
  previousQuotes = [],
  userRole = "requestor",
  onCanvasAction
}) => {
  const {
    userRequirements,
    selectedItems,
    isGenerating,
    isSearchingSOR,
    currentView,
    generatedQuotation,
    retrievedSORItems,
    
    setUserRequirements,
    
    toggleSORItem,
    handleGenerateQuotation,
    handleSearchSOR,
    handleSORItemSelectionChange,
    resetQuotation,
    handleSelectQuotation,
    handleQuotationUpdated,
    handleCreateNew,
    handleBackToList
  } = useQuotationState({
    initialRequirements: requirements,
    initialSorItems: sorItems,
    userRole,
    onCanvasAction
  });

  return (
    <div className="space-y-4">
      <QuotationWelcomeMessage userRole={userRole} />

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
          retrievedSORItems={retrievedSORItems}
          onSORItemSelectionChange={handleSORItemSelectionChange}
          isSearchingSOR={isSearchingSOR}
          handleSearchSOR={handleSearchSOR}
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
