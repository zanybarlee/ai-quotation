
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle, PlusCircle } from "lucide-react";
import { CanvasAction } from "@/utils/canvasInteraction";

interface QuotationTabProps {
  requirements?: string;
  sorItems?: string[];
  previousQuotes?: string[];
  onCanvasAction?: (action: CanvasAction) => void;
}

const QuotationTab: React.FC<QuotationTabProps> = ({
  requirements = "",
  sorItems = [],
  previousQuotes = [],
  onCanvasAction
}) => {
  const [userRequirements, setUserRequirements] = useState(requirements);
  const [selectedItems, setSelectedItems] = useState<string[]>(sorItems);
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultSORItems = [
    "Web Development",
    "API Integration",
    "Database Design",
    "UI/UX Design",
    "Testing",
    "Deployment",
    "Maintenance",
    "Training",
    "Documentation"
  ];

  const handleGenerateQuotation = () => {
    setIsGenerating(true);
    
    // Notify canvas about quotation generation
    if (onCanvasAction) {
      onCanvasAction({
        type: 'quotation_generation',
        payload: { 
          requirements: userRequirements,
          sorItems: selectedItems,
          summary: "Generating quotation based on requirements and SOR items"
        },
        source: 'canvas'
      });
    }
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const toggleSORItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">Requirements</h3>
        <Textarea 
          value={userRequirements} 
          onChange={(e) => setUserRequirements(e.target.value)}
          placeholder="Describe your project requirements here..."
          className="min-h-[120px] mb-4"
        />
        
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Schedule of Rates Items</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {defaultSORItems.map((item) => (
              <Badge 
                key={item}
                variant={selectedItems.includes(item) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSORItem(item)}
              >
                {selectedItems.includes(item) ? <CheckCircle className="h-3 w-3 mr-1" /> : <PlusCircle className="h-3 w-3 mr-1" />}
                {item}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateQuotation} 
          className="w-full"
          disabled={isGenerating || userRequirements.trim() === ''}
        >
          {isGenerating ? "Generating..." : "Generate Quotation"}
        </Button>
      </Card>
      
      {previousQuotes.length > 0 && (
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
      )}
    </div>
  );
};

export default QuotationTab;
