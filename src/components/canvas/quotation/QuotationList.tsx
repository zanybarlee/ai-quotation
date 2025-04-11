
import React, { useEffect, useState } from "react";
import { 
  getAllQuotations, 
  getPendingQuotations,
  getNonArchivedQuotations,
  getArchivedQuotations,
  getDraftQuotations,
  QuotationResultType 
} from "./quotationUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, FileEdit, Archive, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteQuotation } from "./quotationActions";
import { useToast } from "@/hooks/use-toast";

interface QuotationListProps {
  userRole: string;
  onSelectQuotation: (quotation: QuotationResultType) => void;
  showArchived?: boolean;
  showDraftsOnly?: boolean;
}

const QuotationList: React.FC<QuotationListProps> = ({ 
  userRole, 
  onSelectQuotation, 
  showArchived = false,
  showDraftsOnly = false
}) => {
  // Use state to store quotations and force update when component loads
  const [quotations, setQuotations] = useState<QuotationResultType[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get the appropriate list of quotations based on user role
    let loadedQuotations: QuotationResultType[] = [];
    
    if (showDraftsOnly) {
      // When showing drafts, only show those created by the current user role
      loadedQuotations = getDraftQuotations(userRole, `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`);
    } else if (userRole === "approver") {
      loadedQuotations = getPendingQuotations();
    } else if ((userRole === "itAdmin" || userRole === "seniorManagement") && showArchived) {
      loadedQuotations = getArchivedQuotations();
    } else if (userRole === "itAdmin" || userRole === "seniorManagement") {
      loadedQuotations = getAllQuotations(); // IT Admin and Senior Management see all EXCEPT drafts
    } else {
      // For regular users (requestor), show non-archived quotations excluding other users' drafts
      loadedQuotations = getNonArchivedQuotations().filter(q => 
        q.status !== "draft" || 
        q.createdBy === `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`
      );
    }
    
    setQuotations(loadedQuotations);
  }, [userRole, showArchived, showDraftsOnly]);

  const handleDeleteQuotation = (quotationId: string) => {
    if (!quotationId) return;
    
    deleteQuotation(quotationId);
    // Update the list of quotations
    setQuotations(quotations.filter(q => q.id !== quotationId));
    
    toast({
      title: "Quotation Deleted",
      description: "The draft quotation has been deleted successfully."
    });
  };

  if (quotations.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">
          {showDraftsOnly 
            ? "You don't have any draft quotations."
            : userRole === "approver" 
              ? "There are no pending quotations to review."
              : (userRole === "itAdmin" || userRole === "seniorManagement") && showArchived
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
        {showDraftsOnly
          ? "Your Draft Quotations"
          : userRole === "approver" 
            ? "Pending Quotations" 
            : (userRole === "itAdmin" || userRole === "seniorManagement") && showArchived
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
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onSelectQuotation(quotation)}>
                {userRole === "approver" ? "Review" : quotation.status === "draft" && userRole === "requestor" ? "Edit" : (userRole === "itAdmin" || userRole === "seniorManagement") ? "Manage" : "View"}
              </Button>
              
              {quotation.status === "draft" && userRole === "requestor" && quotation.id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Draft Quotation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this draft quotation? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteQuotation(quotation.id!)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuotationList;
