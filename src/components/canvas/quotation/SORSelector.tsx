
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, PlusCircle } from "lucide-react";
import { SORItem } from "./sorApiUtils";
import SORItemsTable from "./SORItemsTable";

interface SORSelectorProps {
  selectedItems: string[];
  toggleSORItem: (item: string) => void;
  retrievedSORItems: SORItem[];
  onSORItemSelectionChange: (index: number, selected: boolean) => void;
}

const SORSelector: React.FC<SORSelectorProps> = ({
  selectedItems,
  toggleSORItem,
  retrievedSORItems,
  onSORItemSelectionChange
}) => {
  const facilityManagementItems = [
    "Maintenance & Inspection",
    "Fire Safety Checks",
    "Façade Inspections",
    "Renovation & Repairs",
    "General Building Repairs",
    "Cleaning Services",
    "Deep Cleaning",
    "Pest Control",
    "Energy Audits",
    "Green Initiatives",
    "Security Services",
    "Equipment Maintenance"
  ];

  return (
    <div className="space-y-4">
      {retrievedSORItems.length > 0 && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Retrieved SOR Items</Label>
          <Card className="p-3 bg-slate-50">
            <p className="text-sm mb-2">Select items to include in your quotation:</p>
            <SORItemsTable 
              items={retrievedSORItems} 
              onItemSelectionChange={onSORItemSelectionChange}
            />
          </Card>
        </div>
      )}
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Facility Management Services</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {facilityManagementItems.map((item) => (
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
    </div>
  );
};

export default SORSelector;
