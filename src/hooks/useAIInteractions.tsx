
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/components/ChatMessage";
import { CanvasAction, CanvasState, extractSORItems } from "@/utils/canvasInteraction";
import { InterruptType } from "@/components/InterruptHandler";

export function useAIInteractions(
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  setIsCanvasOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleCanvasAction: (action: CanvasAction) => void,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  triggerInterrupt: (interrupt: InterruptType) => void,
  messageToCanvasAction: (message: string) => CanvasAction | null
) {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate AI response with loading
  const simulateResponse = useCallback((userMessage: string) => {
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
    
    // Choose response based on message content
    let responseContent = "";
    if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
      responseContent = "Hello! I'm ready to assist you with facility management quotes, including maintenance schedules, building repairs, cleaning services, or energy management. How can I help your facility today?";
    } else if (userMessage.toLowerCase().includes("data") || userMessage.toLowerCase().includes("analysis") || userMessage.toLowerCase().includes("chart")) {
      responseContent = "I can help analyze your facility's data. Let me show you some visualizations in the canvas. What specific metrics are you interested in?";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "data"
      }));
      
      setTimeout(() => {
        triggerInterrupt({
          type: "choice",
          title: "Select Analysis Focus",
          description: "What aspect of facility data would you like to focus on?",
          options: ["Maintenance costs", "Energy consumption", "Space utilization", "Service response times"]
        });
      }, 2000);
    } else if (userMessage.toLowerCase().includes("map") || userMessage.toLowerCase().includes("location")) {
      responseContent = "I can help you with facility locations. I've opened the map view in the canvas. You can select specific buildings or areas for more information.";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "map"
      }));
    } else if (userMessage.toLowerCase().includes("calendar") || userMessage.toLowerCase().includes("schedule") || userMessage.toLowerCase().includes("date")) {
      responseContent = "Let's work on your maintenance schedule. I've opened the calendar view where you can select dates for inspections, repairs, or regular maintenance.";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "calendar"
      }));
    } else if (userMessage.toLowerCase().includes("quotation") || 
               userMessage.toLowerCase().includes("quote") || 
               userMessage.toLowerCase().includes("proposal") || 
               userMessage.toLowerCase().includes("maintenance") ||
               userMessage.toLowerCase().includes("facility") ||
               userMessage.toLowerCase().includes("cleaning")) {
      responseContent = "I can help you generate a quotation based on your facility management requirements. I've opened the quotation module in the canvas.";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "quotation"
      }));
    } else if (!shouldInterrupt) {
      responseContent = "I'm here to help with your facility management needs including maintenance schedules, repairs, cleaning services, and energy management. What would you like a quotation for today?";
    }

    // Simulate a delay before adding the response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: responseContent,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, [
    setIsLoading, 
    messageToCanvasAction, 
    setIsCanvasOpen, 
    handleCanvasAction, 
    setCanvasState, 
    triggerInterrupt, 
    setMessages
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
    
    // Simulate AI response
    simulateResponse(message);
  }, [setMessages, messageToCanvasAction, handleCanvasAction, simulateResponse]);

  return { isLoading, simulateResponse, handleSendMessage };
}
