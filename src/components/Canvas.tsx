
import React, { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";

/**
 * Canvas component props
 */
interface CanvasProps {
  /** Whether the canvas is currently open */
  isOpen: boolean;
  /** Function to call when the canvas is closed */
  onClose: () => void;
  /** Optional title for the canvas */
  title?: string;
  /** Canvas content */
  children: ReactNode;
  /** Optional additional class names */
  className?: string;
}

/**
 * Canvas header props
 */
interface CanvasHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}

/**
 * Canvas header component with title and control buttons
 */
const CanvasHeader = ({ 
  title, 
  isExpanded, 
  onToggleExpand, 
  onClose 
}: CanvasHeaderProps) => (
  <div className="flex items-center justify-between border-b p-3 bg-slate-50">
    <h3 className="font-medium text-slate-800">{title}</h3>
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleExpand}
        className="h-8 w-8"
        aria-label={isExpanded ? "Minimize" : "Maximize"}
      >
        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

/**
 * Canvas component that provides a resizable container for content
 */
const Canvas = ({ 
  isOpen, 
  onClose, 
  title = "Canvas", 
  children, 
  className 
}: CanvasProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "flex flex-col border rounded-lg bg-white shadow-lg transition-all duration-300",
        isExpanded ? "fixed inset-4 z-50" : "h-full",
        className
      )}
    >
      <CanvasHeader 
        title={title}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpand}
        onClose={onClose}
      />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
};

export default Canvas;
