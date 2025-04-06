
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

interface PreviousQuotesProps {
  previousQuotes: string[];
}

const PreviousQuotes: React.FC<PreviousQuotesProps> = ({ previousQuotes }) => {
  if (previousQuotes.length === 0) return null;
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Previous Quotations</h3>
      <Separator className="my-2" />
      <div className="space-y-2">
        {previousQuotes.map((quote, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-500" />
              <span>{quote}</span>
            </div>
            <Button variant="ghost" size="sm">View</Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PreviousQuotes;
