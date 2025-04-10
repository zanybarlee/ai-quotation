
import React from "react";
import { QuotationResultType } from "./quotationUtils";

interface LineItemsTableProps {
  quotation: QuotationResultType;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ quotation }) => {
  return (
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
  );
};

export default LineItemsTable;
