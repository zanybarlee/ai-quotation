
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SORItem } from "./sorApiUtils";

interface SORItemsTableProps {
  items: SORItem[];
  onItemSelectionChange: (index: number, selected: boolean) => void;
  onItemQuantityChange?: (index: number, quantity: number) => void;
}

const SORItemsTable: React.FC<SORItemsTableProps> = ({ 
  items, 
  onItemSelectionChange,
  onItemQuantityChange 
}) => {
  if (items.length === 0) {
    return null;
  }

  const handleQuantityChange = (index: number, value: string) => {
    const quantity = parseFloat(value) || 0;
    if (onItemQuantityChange) {
      onItemQuantityChange(index, quantity);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden mt-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12 text-center">Select</TableHead>
            <TableHead>SOR Code</TableHead>
            <TableHead className="w-full">Description</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right w-24">Quantity</TableHead>
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
              <TableCell>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity || ""}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="w-full h-8 text-right"
                  placeholder="1.00"
                  disabled={!item.selected}
                />
              </TableCell>
              <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SORItemsTable;
