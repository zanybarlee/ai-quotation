
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatusProgressBarProps {
  status?: "draft" | "pending" | "approved" | "rejected";
}

const StatusProgressBar: React.FC<StatusProgressBarProps> = ({ status }) => {
  // Get progress value based on status
  const getProgressValue = () => {
    switch (status) {
      case "draft": return 25;
      case "pending": return 50;
      case "approved": return 100;
      case "rejected": return 100;
      default: return 0;
    }
  };

  // Get progress color based on status
  const getProgressColor = () => {
    switch (status) {
      case "draft": return "bg-gray-400";
      case "pending": return "bg-amber-500";
      case "approved": return "bg-green-600";
      case "rejected": return "bg-red-600";
      default: "";
    }
    return "";
  };

  const progressValue = getProgressValue();

  return (
    <div className="mb-6 mt-3">
      <div className="flex justify-between text-sm mb-1">
        <span>Status: <span className="font-medium">{status?.charAt(0).toUpperCase() + status?.slice(1) || 'New'}</span></span>
        <span>{progressValue}% Complete</span>
      </div>
      <Progress 
        value={progressValue} 
        className="h-2" 
        // Apply the color using className and cn utility instead of the non-existent indicatorClassName prop
        // We're using style attribute for the indicator directly
        style={{ 
          "--progress-background": getProgressColor() 
        } as React.CSSProperties}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Draft</span>
        <span>Under Review</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

export default StatusProgressBar;
