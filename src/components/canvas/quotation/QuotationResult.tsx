
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface QuotationResultType {
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

interface QuotationResultProps {
  quotation: QuotationResultType;
  resetQuotation: () => void;
}

const QuotationResult: React.FC<QuotationResultProps> = ({ quotation, resetQuotation }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">{quotation.title}</h3>
        <Button variant="outline" size="sm" onClick={resetQuotation}>New Quote</Button>
      </div>
      
      <div className="mb-4">
        <Label className="text-sm font-medium">Requirements</Label>
        <p className="text-sm text-gray-700 mt-1">{quotation.description}</p>
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
        
        <div className="mt-6">
          <Button className="w-full">Save Quotation</Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationResult;
