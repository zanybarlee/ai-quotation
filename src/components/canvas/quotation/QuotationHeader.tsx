
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileEdit } from "lucide-react";
import { QuotationResultType } from "./quotationUtils";

interface QuotationHeaderProps {
  quotation: QuotationResultType;
  resetQuotation: () => void;
}

const QuotationHeader: React.FC<QuotationHeaderProps> = ({ quotation, resetQuotation }) => {
  
  const getStatusBadge = () => {
    switch (quotation.status) {
      case "draft":
        return <Badge variant="outline" className="ml-2 bg-gray-100"><FileEdit className="h-3 w-3 mr-1" /> Draft</Badge>;
      case "pending":
        return <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending Approval</Badge>;
      case "approved":
        return <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-xl font-medium">{quotation.title}</h3>
          {getStatusBadge()}
        </div>
        <Button variant="outline" size="sm" onClick={resetQuotation}>New Quote</Button>
      </div>
      
      {quotation.id && (
        <div className="text-sm text-gray-500 mb-2">
          Quotation ID: {quotation.id}
          {quotation.createdBy && ` • Created by: ${quotation.createdBy}`}
          {quotation.createdAt && ` • ${quotation.createdAt.toLocaleDateString()}`}
        </div>
      )}
    </>
  );
};

export default QuotationHeader;
