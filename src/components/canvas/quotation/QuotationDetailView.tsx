
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QuotationResult from "./QuotationResult";
import { QuotationResultType } from "./quotationUtils";

interface QuotationDetailViewProps {
  quotation: QuotationResultType;
  resetQuotation: () => void;
  userRole: string;
  onQuotationUpdated: (quotation: QuotationResultType) => void;
  onBackToList: () => void;
}

const QuotationDetailView: React.FC<QuotationDetailViewProps> = ({
  quotation,
  resetQuotation,
  userRole,
  onQuotationUpdated,
  onBackToList
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="p-2 h-8 w-8" 
          onClick={onBackToList}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Quotation Details</h2>
      </div>
      
      <QuotationResult 
        quotation={quotation}
        resetQuotation={resetQuotation}
        userRole={userRole}
        onQuotationUpdated={onQuotationUpdated}
      />
    </Card>
  );
};

export default QuotationDetailView;
