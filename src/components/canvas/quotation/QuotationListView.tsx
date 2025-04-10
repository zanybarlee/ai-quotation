
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import QuotationList from "./QuotationList";
import { QuotationResultType, getAllQuotations } from "./quotationUtils";
import { Card } from "@/components/ui/card";

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
  // Use state to force refresh when component loads
  const [quotations, setQuotations] = useState<QuotationResultType[]>([]);
  
  useEffect(() => {
    // Load quotations when component mounts
    setQuotations(getAllQuotations());
  }, []);
  
  const hasQuotations = quotations.length > 0;

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

      {!hasQuotations && userRole === "requestor" ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You haven't created any quotations yet</p>
          <Button onClick={onCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" /> Create Your First Quotation
          </Button>
        </Card>
      ) : !hasQuotations && userRole === "approver" ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">There are no quotations waiting for your approval</p>
        </Card>
      ) : (
        <QuotationList 
          userRole={userRole} 
          onSelectQuotation={onSelectQuotation} 
        />
      )}
    </>
  );
};

export default QuotationListView;
