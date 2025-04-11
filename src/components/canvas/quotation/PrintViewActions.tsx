
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { generateAndDownloadPDF } from "./pdfUtils";

interface PrintViewActionsProps {
  onPrint: () => void;
}

const PrintViewActions: React.FC<PrintViewActionsProps> = ({ onPrint }) => {
  const handleDownloadPDF = () => {
    generateAndDownloadPDF('quotation-print-view', 'quotation');
  };
  
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
    </div>
  );
};

export default PrintViewActions;
