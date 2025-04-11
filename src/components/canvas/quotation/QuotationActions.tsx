
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, Archive } from "lucide-react";
import { QuotationResultType } from "./types";

interface QuotationActionsProps {
  quotation: QuotationResultType;
  userRole: string;
  onSave: () => void;
  onSubmitForApproval: () => void;
  onApprove: (notes: string) => void;
  onReject: (notes: string) => void;
  onArchive?: () => void;
}

const QuotationActions: React.FC<QuotationActionsProps> = ({
  quotation,
  userRole,
  onSave,
  onSubmitForApproval,
  onApprove,
  onReject,
  onArchive
}) => {
  const [approverNotes, setApproverNotes] = useState("");
  const isRequestor = userRole === "requestor";
  const isApprover = userRole === "approver";
  const isITAdmin = userRole === "itAdmin";

  const isArchivable = (quotation.status === "approved" || quotation.status === "rejected") && isITAdmin;

  return (
    <div className="mt-6 space-y-4">
      {isApprover && quotation.status === "pending" && (
        <div className="space-y-3">
          <Label htmlFor="approverNotes">Review Notes</Label>
          <Textarea 
            id="approverNotes" 
            value={approverNotes} 
            onChange={(e) => setApproverNotes(e.target.value)}
            placeholder="Add your review notes here..."
            className="min-h-[80px]"
          />
          <div className="flex gap-3">
            <Button 
              onClick={() => onApprove(approverNotes)} 
              className="w-1/2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Approve
            </Button>
            <Button 
              onClick={() => onReject(approverNotes)} 
              className="w-1/2 bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" /> Reject
            </Button>
          </div>
        </div>
      )}
      
      {isRequestor && (
        <>
          {quotation.status === "draft" && (
            <div className="flex gap-3">
              <Button onClick={onSave} variant="outline" className="w-1/2">
                Save as Draft
              </Button>
              <Button 
                onClick={onSubmitForApproval} 
                className="w-1/2"
                disabled={!quotation.id} // Disable if no ID exists
              >
                Submit for Approval
              </Button>
            </div>
          )}
          
          {quotation.status === "pending" && (
            <Button disabled className="w-full bg-amber-500 hover:bg-amber-500">
              <Clock className="h-4 w-4 mr-2" /> Waiting for Approval
            </Button>
          )}
          
          {quotation.status === "approved" && (
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" /> Proceed with Approved Quote
            </Button>
          )}
          
          {quotation.status === "rejected" && (
            <Button onClick={() => window.location.reload()} className="w-full">
              Create New Quotation
            </Button>
          )}
        </>
      )}
      
      {isArchivable && onArchive && (
        <Button 
          onClick={onArchive}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Archive className="h-4 w-4 mr-2" /> Archive Quotation
        </Button>
      )}
      
      {!isRequestor && !isApprover && !isITAdmin && (
        <Button className="w-full" onClick={onSave}>Save Quotation</Button>
      )}
    </div>
  );
};

export default QuotationActions;
