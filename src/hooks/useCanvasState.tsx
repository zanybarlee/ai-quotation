
import { useState, useCallback } from "react";
import { CanvasAction, CanvasState } from "@/utils/canvasInteraction";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/components/ChatMessage";

export function useCanvasState(
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  canvasActionToMessage: (action: CanvasAction) => string
) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    activeTab: "quotation",
    quotationData: {
      requirements: "",
      sorItems: [],
      previousQuotes: ["Annual Maintenance Contract", "Office Building Cleaning", "Energy Efficiency Audit"],
    }
  });
  const { toast } = useToast();

  // Handle canvas actions
  const handleCanvasAction = useCallback((action: CanvasAction) => {
    // Update canvas state based on the action
    if (action.type === 'quotation_generation') {
      setCanvasState(prev => ({
        ...prev,
        activeTab: 'quotation',
        quotationData: {
          requirements: action.payload.requirements,
          sorItems: action.payload.sorItems || prev.quotationData?.sorItems || [],
          previousQuotes: prev.quotationData?.previousQuotes || ["Annual Maintenance Contract", "Office Building Cleaning", "Energy Efficiency Audit"],
          // Add any new quotation data from the payload
          ...(action.payload.quoteType ? { quoteType: action.payload.quoteType } : {})
        }
      }));
    }

    // Only add action to the chat if it was explicitly called from the chat
    // AND it's not a silent action
    const isFromChatInteraction = action.source === 'chat';
    const isSilent = action.payload?.silent === true;
    
    // Add to chat if specific conditions are met
    if (isFromChatInteraction && !isSilent && action.type === 'quotation_generation') {
      const messageContent = canvasActionToMessage(action);
      
      // For quotation_generation, add some additional helpful text
      let enhancedMessage = messageContent;
      enhancedMessage += "\n\nI've opened the facility management quotation module in the canvas. You can now customize the requirements and select services for your facility.";
      
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          content: enhancedMessage,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
    
    // Always show a toast notification for visual feedback
    toast({
      title: "Facility quotation updated",
      description: canvasActionToMessage(action),
    });
  }, [setMessages, canvasActionToMessage, toast]);

  return { canvasState, setCanvasState, handleCanvasAction };
}
