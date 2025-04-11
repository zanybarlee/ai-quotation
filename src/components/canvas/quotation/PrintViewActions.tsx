
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface PrintViewActionsProps {
  onPrint: () => void;
}

const PrintViewActions: React.FC<PrintViewActionsProps> = ({ onPrint }) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button size="sm" variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
    </div>
  );
};

export default PrintViewActions;
