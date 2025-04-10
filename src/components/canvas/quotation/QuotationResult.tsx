
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  QuotationResultType, 
  saveQuotation, 
  submitForApproval,
  approveQuotation,
  rejectQuotation,
  archiveQuotation
} from "./quotationUtils";
import { useToast } from "@/hooks/use-toast";
import QuotationHeader from "./QuotationHeader";
import StatusProgressBar from "./StatusProgressBar";
import LineItemsTable from "./LineItemsTable";
import QuotationActions from "./QuotationActions";

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
  const { toast } = useToast();
  
  const handleSaveQuotation = () => {
    const savedQuote = saveQuotation(quotation);
    toast({
      title: "Quotation Saved",
      description: `Quotation ${savedQuote.id} has been saved successfully.`
    });
    if (onQuotationUpdated) onQuotationUpdated(savedQuote);
  };
  
  const handleSubmitForApproval = () => {
    if (!quotation.id) return;
    
    const updatedQuote = submitForApproval(quotation.id);
    if (updatedQuote) {
      toast({
        title: "Quotation Submitted",
        description: `Quotation ${updatedQuote.id} has been submitted for approval.`
      });
      if (onQuotationUpdated) onQuotationUpdated(updatedQuote);
    }
  };
  
  const handleApproveQuotation = (approverNotes: string) => {
    if (!quotation.id) return;
    
    const updatedQuote = approveQuotation(quotation.id, approverNotes);
    if (updatedQuote) {
      toast({
        title: "Quotation Approved",
        description: `Quotation ${updatedQuote.id} has been approved.`
      });
      if (onQuotationUpdated) onQuotationUpdated(updatedQuote);
    }
  };
  
  const handleRejectQuotation = (approverNotes: string) => {
    if (!quotation.id) return;
    
    const updatedQuote = rejectQuotation(quotation.id, approverNotes);
    if (updatedQuote) {
      toast({
        title: "Quotation Rejected",
        description: `Quotation ${updatedQuote.id} has been rejected.`
      });
      if (onQuotationUpdated) onQuotationUpdated(updatedQuote);
    }
  };

  const handleArchiveQuotation = () => {
    if (!quotation.id) return;
    
    const updatedQuote = archiveQuotation(quotation.id);
    if (updatedQuote) {
      toast({
        title: "Quotation Archived",
        description: `Quotation ${updatedQuote.id} has been archived.`
      });
      if (onQuotationUpdated) onQuotationUpdated(updatedQuote);
    }
  };

  return (
    <div>
      <QuotationHeader quotation={quotation} resetQuotation={resetQuotation} />
      <StatusProgressBar status={quotation.status} />
      
      <div className="mb-4">
        <Label className="text-sm font-medium">Requirements</Label>
        <p className="text-sm text-gray-700 mt-1">{quotation.description}</p>
      </div>
      
      {quotation.approverNotes && (
        <div className="mb-4 p-3 bg-gray-50 border rounded-md">
          <Label className="text-sm font-medium">Approver Notes</Label>
          <p className="text-sm text-gray-700 mt-1">{quotation.approverNotes}</p>
        </div>
      )}
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h4 className="font-medium">Line Items</h4>
        <LineItemsTable quotation={quotation} />
        
        <QuotationActions 
          quotation={quotation}
          userRole={userRole}
          onSave={handleSaveQuotation}
          onSubmitForApproval={handleSubmitForApproval}
          onApprove={handleApproveQuotation}
          onReject={handleRejectQuotation}
          onArchive={handleArchiveQuotation}
        />
      </div>
    </div>
  );
};

export default QuotationResult;
