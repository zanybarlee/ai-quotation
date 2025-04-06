
import { useState, useCallback } from "react";
import { CanvasAction, CanvasState } from "@/utils/canvasInteraction";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/components/ChatMessage";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    } else if (action.type === 'quotation') {
      // For quotation actions, navigate to the quotation page and store the input
      const inputText = action.payload.text || '';
      
      // First add the message to state (can be accessed in the quotation page)
      setCanvasState(prev => ({
        ...prev,
        quotationInput: inputText
      }));
      
      // Then navigate to the quotation page
      if (action.payload.activate) {
        navigate('/quotation', { 
          state: { 
            inputText,
            fromChat: true
          }
        });
      }
    }

    // Only add action to the chat if it was explicitly called from the chat
    // AND it's not a silent action or one of the types we want to exclude
    const isFromChatInteraction = action.source === 'chat';
    const isSilent = action.payload?.silent === true;
    
    // Define which action types should never generate chat messages
    const excludedTypes = ['visualization', 'date_selection', 'position_change'];
    const shouldExclude = excludedTypes.includes(action.type);
    
    // Only add to chat if from chat interaction, not silent, and not excluded
    if (isFromChatInteraction && !isSilent && !shouldExclude) {
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
  }, [setMessages, canvasActionToMessage, toast, navigate]);

  return { canvasState, setCanvasState, handleCanvasAction };
}
