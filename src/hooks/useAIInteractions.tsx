import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/components/ChatMessage";
import { CanvasAction, CanvasState, extractSORItems } from "@/utils/canvasInteraction";
import { InterruptType } from "@/components/InterruptHandler";
import { query } from "@/utils/chatApi";
import { UserRole } from "@/components/RoleSelector";

export function useAIInteractions(
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  setIsCanvasOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleCanvasAction: (action: CanvasAction) => void,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  triggerInterrupt: (interrupt: InterruptType) => void,
  messageToCanvasAction: (message: string) => CanvasAction | null,
  currentRole: UserRole
) {
  const [isLoading, setIsLoading] = useState(false);

  // Get response from API and process it
  const simulateResponse = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    // Convert the message to a canvas action if applicable
    const canvasAction = messageToCanvasAction(userMessage);
    
    // Determine if we should trigger an interrupt based on keywords
    const shouldInterrupt = 
      userMessage.toLowerCase().includes("data") || 
      userMessage.toLowerCase().includes("analysis") ||
      userMessage.toLowerCase().includes("chart") ||
      userMessage.toLowerCase().includes("map") ||
      userMessage.toLowerCase().includes("location") ||
      userMessage.toLowerCase().includes("calendar") ||
      userMessage.toLowerCase().includes("schedule") ||
      userMessage.toLowerCase().includes("quotation") ||
      userMessage.toLowerCase().includes("facility") ||
      userMessage.toLowerCase().includes("maintenance");
    
    // If we got a canvas action, open the canvas and update its state
    if (canvasAction) {
      setIsCanvasOpen(true);
      handleCanvasAction(canvasAction);
      
      // If it's a quotation action, let's handle it specifically
      if (canvasAction.type === 'quotation_generation') {
        // Extract facility services from the message
        const sorItems = extractSORItems(userMessage);
        
        // Update the canvas state with the quotation data
        setCanvasState(prev => ({
          ...prev,
          activeTab: "quotation",
          quotationData: {
            requirements: canvasAction.payload.requirements,
            sorItems: sorItems,
            previousQuotes: ["Annual Maintenance Contract", "Office Building Cleaning", "Energy Efficiency Audit"]
          }
        }));
        
        setTimeout(() => {
          triggerInterrupt({
            type: "choice",
            title: "Facility Management Quotation",
            description: "What type of facility service would you like to prioritize?",
            options: ["Maintenance & Inspection", "Renovation & Repairs", "Cleaning & Pest Control", "Energy & Sustainability"]
          });
        }, 1500);
      }
    }
    
    try {
      // Get response from API using the current role as sessionId
      const responseContent = await query(userMessage, currentRole);
      
      // Add the response to the messages
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: responseContent,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
      
      // Check if we need to show interrupts based on the response
      if (shouldInterrupt) {
        setTimeout(() => {
          triggerInterrupt({
            type: "choice",
            title: "Select Analysis Focus",
            description: "What aspect of facility data would you like to focus on?",
            options: ["Maintenance costs", "Energy consumption", "Space utilization", "Service response times"]
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error getting response:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: "Sorry, I encountered an error processing your request. Please try again later.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading, 
    messageToCanvasAction, 
    setIsCanvasOpen, 
    handleCanvasAction, 
    setCanvasState, 
    triggerInterrupt, 
    setMessages, 
    currentRole
  ]);

  const handleSendMessage = useCallback((message: string) => {
    // Add user message
    const newMessage: MessageType = {
      id: uuidv4(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Process the message to update canvas if needed
    const canvasAction = messageToCanvasAction(message);
    if (canvasAction) {
      handleCanvasAction(canvasAction);
    }
    
    // Get API response
    simulateResponse(message);
  }, [setMessages, messageToCanvasAction, handleCanvasAction, simulateResponse]);

  return { isLoading, simulateResponse, handleSendMessage };
}
