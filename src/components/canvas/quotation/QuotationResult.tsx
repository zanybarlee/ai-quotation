
import React, { useState } from "react";
import { QuotationResultType } from "./quotationUtils";
import QuotationTabs from "./QuotationTabs";

interface QuotationResultProps {
  quotation: QuotationResultType;
  resetQuotation: () => void;
  userRole: string;
  onQuotationUpdated?: (quotation: QuotationResultType) => void;
}

const QuotationResult: React.FC<QuotationResultProps> = ({ 
  quotation, 
  resetQuotation, 
  userRole,
  onQuotationUpdated 
}) => {
  const [activeView, setActiveView] = useState<"standard" | "print">("standard");
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <QuotationTabs 
        quotation={quotation}
        activeView={activeView}
        setActiveView={setActiveView}
        resetQuotation={resetQuotation}
        userRole={userRole}
        onQuotationUpdated={onQuotationUpdated}
        handlePrint={handlePrint}
      />
    </div>
  );
};

export default QuotationResult;
