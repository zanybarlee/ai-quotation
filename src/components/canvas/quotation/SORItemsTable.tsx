
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { SORItem } from "./sorApiUtils";

interface SORItemsTableProps {
  items: SORItem[];
  onItemSelectionChange: (index: number, selected: boolean) => void;
}

const SORItemsTable: React.FC<SORItemsTableProps> = ({ items, onItemSelectionChange }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border overflow-hidden mt-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12 text-center">Select</TableHead>
            <TableHead>SOR Code</TableHead>
            <TableHead className="w-full">Description</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Rate (SGD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} className={item.selected ? "bg-slate-100" : ""}>
              <TableCell className="text-center">
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={(checked) => onItemSelectionChange(index, checked === true)}
                  className="mx-auto"
                />
              </TableCell>
              <TableCell className="font-medium">{item.itemCode}</TableCell>
              <TableCell className="text-sm">{item.description}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SORItemsTable;
