
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
    activeTab: "data",
    visualizationType: "bar",
    dataType: "revenue",
  });
  const { toast } = useToast();

  // Handle canvas actions
  const handleCanvasAction = useCallback((action: CanvasAction) => {
    // Update canvas state based on the action
    if (action.type === 'visualization') {
      setCanvasState(prev => ({
        ...prev,
        activeTab: 'data',
        visualizationType: action.payload.type,
        dataType: action.payload.dataType || prev.dataType
      }));
    } else if (action.type === 'position_change') {
      setCanvasState(prev => ({
        ...prev,
        activeTab: 'map',
        selectedLocation: action.payload
      }));
    } else if (action.type === 'date_selection') {
      setCanvasState(prev => ({
        ...prev,
        activeTab: 'calendar',
        selectedDate: action.payload.date
      }));
    } else if (action.type === 'data_update') {
      setCanvasState(prev => ({
        ...prev,
        dataFilters: {
          ...(prev.dataFilters || {}),
          [action.payload.filter]: action.payload.value
        },
        // Update dataType if the action includes it
        ...(action.payload.dataType ? { dataType: action.payload.dataType } : {})
      }));
    }

    // Only add action to the chat if it was explicitly called from the chat
    // or if it's a critically important one that requires user attention
    const isFromChatInteraction = action.source === 'chat';
    
    // For all other actions, just show a toast
    if (isFromChatInteraction) {
      const messageContent = canvasActionToMessage(action);
      
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          content: messageContent,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
    
    // Always show a toast notification for visual feedback
    toast({
      title: "Canvas updated",
      description: canvasActionToMessage(action),
    });
  }, [setMessages, canvasActionToMessage, toast]);

  return { canvasState, setCanvasState, handleCanvasAction };
}
