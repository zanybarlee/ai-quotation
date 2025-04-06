
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, PlusCircle } from "lucide-react";

interface SORSelectorProps {
  selectedItems: string[];
  toggleSORItem: (item: string) => void;
}

const SORSelector: React.FC<SORSelectorProps> = ({
  selectedItems,
  toggleSORItem
}) => {
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

  return (
    <div>
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
  );
};

export default SORSelector;
