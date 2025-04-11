
import React from "react";
import { QuotationResultType } from "./types";

interface LineItemsTableProps {
  quotation: QuotationResultType;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ quotation }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-left">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-sm font-medium">S/No.</th>
            <th className="px-4 py-2 text-sm font-medium">SOR</th>
            <th className="px-4 py-2 text-sm font-medium">Description</th>
            <th className="px-4 py-2 text-sm font-medium">Unit</th>
            <th className="px-4 py-2 text-sm font-medium text-right">Quantity</th>
            <th className="px-4 py-2 text-sm font-medium text-right">Rate</th>
            <th className="px-4 py-2 text-sm font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {quotation.lineItems.map((item, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.sor || ""}</td>
              <td className="px-4 py-2">{item.item}</td>
              <td className="px-4 py-2">{item.unit || "No"}</td>
              <td className="px-4 py-2 text-right">{item.quantity?.toFixed(2) || "1.00"}</td>
              <td className="px-4 py-2 text-right">${item.rate.toFixed(2)}</td>
              <td className="px-4 py-2 text-right font-medium">${item.cost.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 font-medium">
          <tr>
            <td colSpan={6} className="px-4 py-2 text-right">Total</td>
            <td className="px-4 py-2 text-right">${quotation.totalCost.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LineItemsTable;
