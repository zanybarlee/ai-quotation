
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle, PlusCircle, Loader2 } from "lucide-react";
import { CanvasAction } from "@/utils/canvasInteraction";
import { useToast } from "@/hooks/use-toast";

interface QuotationTabProps {
  requirements?: string;
  sorItems?: string[];
  previousQuotes?: string[];
  onCanvasAction?: (action: CanvasAction) => void;
}

interface QuotationResult {
  title: string;
  description: string;
  estimatedHours: number;
  totalCost: number;
  lineItems: {
    item: string;
    hours: number;
    rate: number;
    cost: number;
  }[];
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
  const [generatedQuotation, setGeneratedQuotation] = useState<QuotationResult | null>(null);
  const { toast } = useToast();

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
    if (userRequirements.trim() === '') {
      toast({
        title: "Requirements needed",
        description: "Please enter your project requirements before generating a quotation.",
        variant: "destructive"
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item from Schedule of Rates.",
        variant: "destructive"
      });
      return;
    }

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
    
    // Generate a quotation based on requirements and selected items
    setTimeout(() => {
      const baseHourRates: Record<string, number> = {
        "Web Development": 85,
        "API Integration": 95,
        "Database Design": 90,
        "UI/UX Design": 80,
        "Testing": 70,
        "Deployment": 75,
        "Maintenance": 65,
        "Training": 60,
        "Documentation": 55
      };

      // Generate line items based on selected SOR items
      const lineItems = selectedItems.map(item => {
        // Calculate random but reasonable hours based on the complexity implied by requirements
        const complexity = userRequirements.length / 100;
        const baseHours = Math.max(4, Math.min(40, Math.floor(8 + Math.random() * 16)));
        const hours = Math.ceil(baseHours * (0.8 + complexity * 0.4));
        const rate = baseHourRates[item] || 75;
        const cost = hours * rate;

        return {
          item,
          hours,
          rate,
          cost
        };
      });

      // Calculate totals
      const totalHours = lineItems.reduce((sum, item) => sum + item.hours, 0);
      const totalCost = lineItems.reduce((sum, item) => sum + item.cost, 0);

      // Create a title based on the requirements
      let title = "Project Quotation";
      if (userRequirements.length > 10) {
        // Extract a reasonable title from the first sentence of requirements
        const firstSentence = userRequirements.split('.')[0].trim();
        if (firstSentence.length > 5 && firstSentence.length < 50) {
          title = firstSentence;
        }
      }

      const quotation: QuotationResult = {
        title,
        description: userRequirements,
        estimatedHours: totalHours,
        totalCost,
        lineItems
      };

      setGeneratedQuotation(quotation);
      setIsGenerating(false);
      
      toast({
        title: "Quotation Generated",
        description: "Your quotation has been successfully generated.",
      });
    }, 2000);
  };

  const toggleSORItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const resetQuotation = () => {
    setGeneratedQuotation(null);
  };

  return (
    <div className="space-y-4">
      {!generatedQuotation ? (
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
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Quotation"
            )}
          </Button>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">{generatedQuotation.title}</h3>
            <Button variant="outline" size="sm" onClick={resetQuotation}>New Quote</Button>
          </div>
          
          <div className="mb-4">
            <Label className="text-sm font-medium">Requirements</Label>
            <p className="text-sm text-gray-700 mt-1">{generatedQuotation.description}</p>
          </div>
          
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
                  {generatedQuotation.lineItems.map((item, index) => (
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
                    <td className="px-4 py-2 text-right">{generatedQuotation.estimatedHours} hrs</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2 text-right">${generatedQuotation.totalCost.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-6">
              <Button className="w-full">Save Quotation</Button>
            </div>
          </div>
        </Card>
      )}
      
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
