
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

    // Determine if this is an important action that should be added to the chat
    // Only add actions that are explicit confirmations
    const isImportantAction = 
      action.source === 'chat' || // Actions from chat are always important
      (action.payload.confirmed === true); // Only confirmed actions are important
    
    if (isImportantAction) {
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
      
      // Also show a toast notification
      toast({
        title: "Canvas update",
        description: messageContent,
      });
    } else {
      // For all other updates, just show a toast without adding to chat
      toast({
        title: "Canvas updated",
        description: canvasActionToMessage(action),
      });
    }
  }, [setMessages, canvasActionToMessage, toast]);

  return { canvasState, setCanvasState, handleCanvasAction };
}
