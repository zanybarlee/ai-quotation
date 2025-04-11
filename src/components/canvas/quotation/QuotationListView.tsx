
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Archive, Inbox, FileText } from "lucide-react";
import QuotationList from "./QuotationList";
import { QuotationResultType, getAllQuotations } from "./quotationUtils";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  // Add a state to track whether to show archived quotations (for IT Admin)
  const [showArchived, setShowArchived] = useState<boolean>(false);
  // Add a state to track whether to show draft quotations (for Requestor)
  const [showDraftsOnly, setShowDraftsOnly] = useState<boolean>(false);
  
  useEffect(() => {
    // Load quotations when component mounts
    setQuotations(getAllQuotations());
  }, []);
  
  const hasQuotations = quotations.length > 0;
  const canSeeArchived = userRole === "itAdmin" || userRole === "seniorManagement";
  const canManageDrafts = userRole === "requestor";
  const canCreateQuotation = userRole === "requestor" || userRole === "approver" || userRole === "seniorManagement";

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Facility Management Quotations</h2>
        {canCreateQuotation && (
          <Button onClick={onCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" /> Create New
          </Button>
        )}
      </div>

      {canSeeArchived && (
        <Tabs defaultValue="active" className="mb-4" onValueChange={(value) => {
          setShowArchived(value === "archived");
          setShowDraftsOnly(false);
        }}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">
              <Inbox className="h-4 w-4 mr-2" /> Active
            </TabsTrigger>
            <TabsTrigger value="archived">
              <Archive className="h-4 w-4 mr-2" /> Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {canManageDrafts && (
        <Tabs defaultValue={showDraftsOnly ? "drafts" : "all"} className="mb-4" onValueChange={(value) => {
          setShowDraftsOnly(value === "drafts");
          setShowArchived(false);
        }}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">
              <Inbox className="h-4 w-4 mr-2" /> All Quotations
            </TabsTrigger>
            <TabsTrigger value="drafts">
              <FileText className="h-4 w-4 mr-2" /> Drafts
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {!hasQuotations && canCreateQuotation ? (
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
          showArchived={showArchived}
          showDraftsOnly={showDraftsOnly}
        />
      )}
    </>
  );
};

export default QuotationListView;
