
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const QuotationHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">Quotation Module</h1>
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </div>
      </div>
    </header>
  );
};

export default QuotationHeader;
