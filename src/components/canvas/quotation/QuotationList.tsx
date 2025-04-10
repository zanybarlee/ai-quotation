
import React, { useEffect, useState } from "react";
import { 
  getAllQuotations, 
  getPendingQuotations,
  getNonArchivedQuotations,
  getArchivedQuotations,
  QuotationResultType 
} from "./quotationUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, FileEdit, Archive } from "lucide-react";

interface QuotationListProps {
  userRole: string;
  onSelectQuotation: (quotation: QuotationResultType) => void;
  showArchived?: boolean;
}

const QuotationList: React.FC<QuotationListProps> = ({ userRole, onSelectQuotation, showArchived = false }) => {
  // Use state to store quotations and force update when component loads
  const [quotations, setQuotations] = useState<QuotationResultType[]>([]);
  
  useEffect(() => {
    // Get the appropriate list of quotations based on user role
    let loadedQuotations: QuotationResultType[] = [];
    
    if (userRole === "approver") {
      loadedQuotations = getPendingQuotations();
    } else if (userRole === "itAdmin" && showArchived) {
      loadedQuotations = getArchivedQuotations();
    } else if (userRole === "itAdmin" && !showArchived) {
      loadedQuotations = getAllQuotations(); // IT Admin can see all, including archived
    } else {
      loadedQuotations = getNonArchivedQuotations(); // Other roles see only non-archived
    }
    
    setQuotations(loadedQuotations);
  }, [userRole, showArchived]);

  if (quotations.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">
          {userRole === "approver" 
            ? "There are no pending quotations to review."
            : userRole === "itAdmin" && showArchived
            ? "There are no archived quotations."
            : "No quotations have been created yet."}
        </p>
      </Card>
    );
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-gray-100"><FileEdit className="h-3 w-3 mr-1" /> Draft</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200"><Archive className="h-3 w-3 mr-1" /> Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">
        {userRole === "approver" 
          ? "Pending Quotations" 
          : userRole === "itAdmin" && showArchived
          ? "Archived Quotations"
          : "Your Quotations"}
      </h3>
      
      {quotations.map((quotation) => (
        <Card key={quotation.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{quotation.title}</h4>
                {getStatusBadge(quotation.status)}
              </div>
              <div className="text-sm text-gray-500">
                ID: {quotation.id} • ${quotation.totalCost.toLocaleString()} • {quotation.estimatedHours} hrs
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {quotation.createdAt?.toLocaleDateString()}
                {quotation.createdBy && ` • Created by: ${quotation.createdBy}`}
              </div>
            </div>
            <Button size="sm" onClick={() => onSelectQuotation(quotation)}>
              {userRole === "approver" ? "Review" : userRole === "itAdmin" ? "Manage" : "View"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuotationList;
