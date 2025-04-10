
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import QuotationList from "./QuotationList";
import { QuotationResultType } from "./quotationUtils";

interface QuotationListViewProps {
  userRole: string;
  onSelectQuotation: (quotation: QuotationResultType) => void;
  onCreateNew: () => void;
}

const QuotationListView: React.FC<QuotationListViewProps> = ({ 
  userRole, 
  onSelectQuotation, 
  onCreateNew 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Facility Management Quotations</h2>
        {userRole === "requestor" && (
          <Button onClick={onCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" /> Create New
          </Button>
        )}
      </div>
      <QuotationList 
        userRole={userRole} 
        onSelectQuotation={onSelectQuotation} 
      />
    </>
  );
};

export default QuotationListView;
