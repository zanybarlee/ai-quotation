
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  QuotationResultType, 
  saveQuotation, 
  submitForApproval,
  approveQuotation,
  rejectQuotation
} from "./quotationUtils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [approverNotes, setApproverNotes] = useState("");
  const { toast } = useToast();
  
  const isRequestor = userRole === "requestor";
  const isApprover = userRole === "approver";
  
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
  
  const handleApproveQuotation = () => {
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
  
  const handleRejectQuotation = () => {
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

  // Get progress value based on status
  const getProgressValue = () => {
    switch (quotation.status) {
      case "draft": return 25;
      case "pending": return 50;
      case "approved": return 100;
      case "rejected": return 100;
      default: return 0;
    }
  };

  // Get progress color based on status
  const getProgressColor = () => {
    switch (quotation.status) {
      case "draft": return "bg-gray-400";
      case "pending": return "bg-amber-500";
      case "approved": return "bg-green-600";
      case "rejected": return "bg-red-600";
      default: return "";
    }
  };

  return (
    <div>
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
      
      {/* New status progress indicator */}
      <div className="mb-6 mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Status: <span className="font-medium">{quotation.status?.charAt(0).toUpperCase() + quotation.status?.slice(1) || 'New'}</span></span>
          <span>{getProgressValue()}% Complete</span>
        </div>
        <Progress value={getProgressValue()} className="h-2" indicatorClassName={getProgressColor()} />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Draft</span>
          <span>Under Review</span>
          <span>Complete</span>
        </div>
      </div>
      
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
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-sm font-medium">Item</th>
                <th className="px-4 py-2 text-sm font-medium text-right">Hours</th>
                <th className="px-4 py-2 text-sm font-medium text-right">Rate</th>
                <th className="px-4 py-2 text-sm font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {quotation.lineItems.map((item, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="px-4 py-2">{item.item}</td>
                  <td className="px-4 py-2 text-right">{item.hours}</td>
                  <td className="px-4 py-2 text-right">${item.rate}/hr</td>
                  <td className="px-4 py-2 text-right font-medium">${item.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-medium">
              <tr>
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2 text-right">{quotation.estimatedHours} hrs</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right">${quotation.totalCost.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
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
                  onClick={handleApproveQuotation} 
                  className="w-1/2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve
                </Button>
                <Button 
                  onClick={handleRejectQuotation} 
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
                  <Button onClick={handleSaveQuotation} variant="outline" className="w-1/2">
                    Save as Draft
                  </Button>
                  <Button onClick={handleSubmitForApproval} className="w-1/2">
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
                <Button onClick={resetQuotation} className="w-full">
                  Create New Quotation
                </Button>
              )}
            </>
          )}
          
          {!isRequestor && !isApprover && (
            <Button className="w-full" onClick={handleSaveQuotation}>Save Quotation</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationResult;
