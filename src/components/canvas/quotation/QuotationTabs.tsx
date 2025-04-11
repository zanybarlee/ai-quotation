
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Printer } from "lucide-react";
import KimYewQuotationFormat from "./KimYewQuotationFormat";
import { QuotationResultType } from "./quotationUtils";
import PrintViewActions from "./PrintViewActions";
import QuotationDetails from "./QuotationDetails";

interface QuotationTabsProps {
  quotation: QuotationResultType;
  activeView: "standard" | "print";
  setActiveView: (view: "standard" | "print") => void;
  resetQuotation: () => void;
  userRole: string;
  onQuotationUpdated?: (quotation: QuotationResultType) => void;
  handlePrint: () => void;
}

const QuotationTabs: React.FC<QuotationTabsProps> = ({
  quotation,
  activeView,
  setActiveView,
  resetQuotation,
  userRole,
  onQuotationUpdated,
  handlePrint
}) => {
  return (
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
          <PrintViewActions onPrint={handlePrint} />
        )}
      </div>
      
      <TabsContent value="standard">
        <QuotationDetails 
          quotation={quotation}
          resetQuotation={resetQuotation}
          userRole={userRole}
          onQuotationUpdated={onQuotationUpdated}
        />
      </TabsContent>
      
      <TabsContent value="print" className="print:block">
        <KimYewQuotationFormat quotation={quotation} />
      </TabsContent>
    </Tabs>
  );
};

export default QuotationTabs;
