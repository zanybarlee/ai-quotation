
import React from "react";
import { Button } from "@/components/ui/button";
import { Layout, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const CanvasToggle: React.FC<CanvasToggleProps> = ({ isOpen, onClick, className }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn("gap-2 border-kimyew-blue text-kimyew-blue hover:bg-kimyew-blue hover:text-white", className)}
      aria-label={isOpen ? "Hide canvas" : "Show canvas"}
    >
      {isOpen ? (
        <>
          <Layout className="h-4 w-4" />
          <span>Hide Facility Quotation</span>
        </>
      ) : (
        <>
          <LayoutGrid className="h-4 w-4" />
          <span>Show Facility Quotation</span>
        </>
      )}
    </Button>
  );
};

export default CanvasToggle;
