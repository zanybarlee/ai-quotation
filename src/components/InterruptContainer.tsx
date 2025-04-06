
import React from "react";
import InterruptHandler, { InterruptType } from "@/components/InterruptHandler";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/components/ChatMessage";
import { useToast } from "@/components/ui/use-toast";
import { CanvasAction } from "@/utils/canvasInteraction";

interface InterruptContainerProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  interruptVisible: boolean;
  setInterruptVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentInterrupt: InterruptType | null;
  setCurrentInterrupt: React.Dispatch<React.SetStateAction<InterruptType | null>>;
  handleCanvasAction: (action: CanvasAction) => void;
}

const InterruptContainer: React.FC<InterruptContainerProps> = ({
  messages,
  setMessages,
  interruptVisible,
  setInterruptVisible,
  currentInterrupt,
  setCurrentInterrupt,
  handleCanvasAction,
}) => {
  const { toast } = useToast();

  const handleInterruptSubmit = (value: any) => {
    // Remove the redundant system message about the user's choice
    
    if (currentInterrupt?.type === "choice") {
      // Check if this is a quotation-related interrupt
      if (currentInterrupt.title.includes("Quotation")) {
        // Handle quotation-specific choices
        handleCanvasAction({
          type: 'quotation_generation',
          payload: { 
            quoteType: value,
            summary: `Generating ${value} quotation`,
            silent: true
          },
          source: 'chat'
        });
        
        // Add a follow-up message after selection
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: uuidv4(),
              content: `I'll prepare a ${value} quotation based on our schedule of rates. This will include all the standard items for this type of project, as well as any custom requirements you've mentioned.`,
              sender: "assistant",
              timestamp: new Date(),
            },
          ]);
        }, 1000);
      } else {
        // Update canvas state based on selection without adding a chat message
        if (value.toLowerCase().includes("revenue")) {
          handleCanvasAction({
            type: 'visualization',
            payload: { 
              type: 'bar',
              description: 'Revenue visualization',
              dataType: 'revenue',
              silent: true
            },
            source: 'chat'
          });
        } else if (value.toLowerCase().includes("user")) {
          handleCanvasAction({
            type: 'visualization',
            payload: { 
              type: 'line',
              description: 'User growth visualization',
              dataType: 'users',
              silent: true
            },
            source: 'chat'
          });
        } else if (value.toLowerCase().includes("performance")) {
          handleCanvasAction({
            type: 'visualization',
            payload: { 
              type: 'area',
              description: 'Performance metrics visualization',
              dataType: 'conversion',
              silent: true
            },
            source: 'chat'
          });
        }
        
        // Add a follow-up message after selection
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: uuidv4(),
              content: `Great! I'll focus my analysis on ${value}. You can see updated visualizations in the canvas now.`,
              sender: "assistant",
              timestamp: new Date(),
            },
          ]);
        }, 1000);
      }
    } else if (currentInterrupt?.type === "confirmation") {
      // If it's a location or date confirmation, update the canvas state without adding a chat message
      if (currentInterrupt.title.includes("Location")) {
        // Update the canvas with the confirmed location
        handleCanvasAction({
          type: 'position_change',
          payload: { 
            name: 'Confirmed location',
            lat: 34.05, 
            lng: -118.25,
            silent: true // Keep silent to avoid chat message
          },
          source: 'chat'
        });
      } else if (currentInterrupt.title.includes("Date")) {
        // Update the canvas with the confirmed date
        handleCanvasAction({
          type: 'date_selection',
          payload: { 
            date: new Date(),
            silent: true // Keep silent to avoid chat message
          },
          source: 'chat'
        });
      }
    }
    
    setInterruptVisible(false);
    setCurrentInterrupt(null);
    
    toast({
      title: "Input received",
      description: "The AI will continue processing with your input.",
    });
  };

  const handleInterruptCancel = () => {
    setInterruptVisible(false);
    setCurrentInterrupt(null);
    
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: "Interrupt cancelled. Let me know if you need anything else.",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
  };

  if (!interruptVisible || !currentInterrupt) return null;

  return (
    <div className="p-4 border-t bg-slate-50">
      <div className="max-w-md mx-auto">
        <InterruptHandler
          interrupt={currentInterrupt}
          onSubmit={handleInterruptSubmit}
          onCancel={handleInterruptCancel}
        />
      </div>
    </div>
  );
};

export default InterruptContainer;
