
import React from "react";
import { QuotationResultType } from "./types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";

interface LineItemsTableProps {
  quotation: QuotationResultType;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ quotation }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-sm font-medium">S/No.</TableHead>
            <TableHead className="text-sm font-medium">SOR</TableHead>
            <TableHead className="text-sm font-medium">Description</TableHead>
            <TableHead className="text-sm font-medium">Unit</TableHead>
            <TableHead className="text-sm font-medium text-right">Quantity</TableHead>
            <TableHead className="text-sm font-medium text-right">Rate</TableHead>
            <TableHead className="text-sm font-medium text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotation.lineItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{item.sor || ""}</TableCell>
              <TableCell>{item.description || item.item}</TableCell>
              <TableCell>{item.unit || "No"}</TableCell>
              <TableCell className="text-right">{item.quantity?.toFixed(2) || "1.00"}</TableCell>
              <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
              <TableCell className="text-right font-medium">${item.cost.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-slate-50 font-medium">
            <TableCell colSpan={6} className="text-right">Total</TableCell>
            <TableCell className="text-right">${quotation.totalCost.toLocaleString()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default LineItemsTable;
