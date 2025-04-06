
import { useState, useCallback } from "react";
import { InterruptType } from "@/components/InterruptHandler";

export function useInterrupts() {
  const [currentInterrupt, setCurrentInterrupt] = useState<InterruptType | null>(null);
  const [interruptVisible, setInterruptVisible] = useState(false);

  const triggerInterrupt = useCallback((interrupt: InterruptType) => {
    setCurrentInterrupt(interrupt);
    setInterruptVisible(true);
  }, []);

  const handleCanvasInterrupt = useCallback((type: string, data?: any) => {
    let interruptData: InterruptType;
    
    switch (type) {
      case "preference":
        interruptData = {
          type: "choice",
          title: "Set Your Preferences",
          description: "Choose your preferred visualization setting",
          options: ["Minimal view", "Detailed view", "Compact view", "Extended view"]
        };
        break;
      case "analysis":
        interruptData = {
          type: "choice",
          title: "Analysis Parameters",
          description: "Select the type of analysis to perform",
          options: ["Trend analysis", "Outlier detection", "Comparative analysis", "Predictive modeling"]
        };
        break;
      case "location":
        interruptData = {
          type: "confirmation",
          title: "Confirm Location Selection",
          description: "Do you want to use the selected location for your plan?"
        };
        break;
      case "date":
        interruptData = {
          type: "confirmation",
          title: "Confirm Date Selection",
          description: `Do you want to use ${data?.selected?.toLocaleDateString() || "the selected date"} for your schedule?`
        };
        break;
      default:
        interruptData = {
          type: "confirmation",
          title: "Confirm Action",
          description: "Do you want to proceed with this action?"
        };
    }
    
    triggerInterrupt(interruptData);
  }, [triggerInterrupt]);

  return {
    currentInterrupt,
    setCurrentInterrupt,
    interruptVisible,
    setInterruptVisible,
    triggerInterrupt,
    handleCanvasInterrupt
  };
}
