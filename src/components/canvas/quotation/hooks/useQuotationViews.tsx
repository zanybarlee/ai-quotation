
import { useState, useEffect } from "react";
import { QuotationResultType } from "../types";

type QuotationView = "list" | "create" | "detail" | "welcome";

interface UseQuotationViewsProps {
  userRole?: string;
}

export function useQuotationViews({ userRole = "requestor" }: UseQuotationViewsProps) {
  const [currentView, setCurrentView] = useState<QuotationView>("welcome");
  const [generatedQuotation, setGeneratedQuotation] = useState<QuotationResultType | null>(null);

  // Set initial view based on user role - only once when component mounts
  useEffect(() => {
    // Start with welcome screen for first-time visitors
    const hasVisitedBefore = localStorage.getItem("hasVisitedQuotationModule");
    if (hasVisitedBefore) {
      setCurrentView("list");
    } else {
      localStorage.setItem("hasVisitedQuotationModule", "true");
      setCurrentView("welcome");
    }
  }, [userRole]);

  const resetQuotation = () => {
    setGeneratedQuotation(null);
    setCurrentView("create");
  };
  
  const handleSelectQuotation = (quotation: QuotationResultType) => {
    setGeneratedQuotation(quotation);
    setCurrentView("detail");
  };
  
  const handleQuotationGenerated = (quotation: QuotationResultType) => {
    setGeneratedQuotation(quotation);
    setCurrentView("detail");
  };
  
  const handleQuotationUpdated = (updatedQuotation: QuotationResultType) => {
    setGeneratedQuotation(updatedQuotation);
  };
  
  const handleCreateNew = () => {
    setGeneratedQuotation(null);
    setCurrentView("create");
  };
  
  const handleBackToList = () => {
    setCurrentView("list");
  };

  return {
    currentView,
    generatedQuotation,
    resetQuotation,
    handleSelectQuotation,
    handleQuotationGenerated,
    handleQuotationUpdated,
    handleCreateNew,
    handleBackToList
  };
}
