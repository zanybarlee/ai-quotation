
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import KimYewQuotationFormat from "./KimYewQuotationFormat";
import { FileText, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [activeView, setActiveView] = useState<"standard" | "print">("standard");
  
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "standard" | "print")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="standard">
              <FileText className="h-4 w-4 mr-2" />
              Standard View
            </TabsTrigger>
            <TabsTrigger value="print">
              <Printer className="h-4 w-4 mr-2" />
              Print Format
            </TabsTrigger>
          </TabsList>
          
          {activeView === "print" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="standard">
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
        </TabsContent>
        
        <TabsContent value="print" className="print:block">
          <KimYewQuotationFormat quotation={quotation} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuotationResult;
