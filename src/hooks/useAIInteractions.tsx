
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "@/components/ChatMessage";
import { CanvasAction } from "@/utils/canvasInteraction";
import { InterruptType } from "@/components/InterruptHandler";

export function useAIInteractions(
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  setIsCanvasOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleCanvasAction: (action: CanvasAction) => void,
  setCanvasState: React.Dispatch<React.SetStateAction<any>>,
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
      userMessage.toLowerCase().includes("schedule");
    
    // If we got a canvas action, open the canvas and update its state
    if (canvasAction) {
      setIsCanvasOpen(true);
      handleCanvasAction(canvasAction);
    }
    
    // Choose response based on message content
    let responseContent = "";
    if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
      responseContent = "Hello! I'm ready to assist you with data analysis, location planning, or scheduling. What would you like to explore today?";
    } else if (userMessage.toLowerCase().includes("data") || userMessage.toLowerCase().includes("analysis") || userMessage.toLowerCase().includes("chart")) {
      responseContent = "I can help with your data analysis. Let me show you some visualizations in the canvas. What specific metrics are you interested in?";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "data"
      }));
      
      setTimeout(() => {
        triggerInterrupt({
          type: "choice",
          title: "Select Analysis Focus",
          description: "What aspect of the data would you like to focus on?",
          options: ["Revenue trends", "User growth", "Performance metrics", "Conversion rates"]
        });
      }, 2000);
    } else if (userMessage.toLowerCase().includes("map") || userMessage.toLowerCase().includes("location")) {
      responseContent = "I can help you with location planning. I've opened the map view in the canvas. You can select specific locations for more information.";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "map"
      }));
    } else if (userMessage.toLowerCase().includes("calendar") || userMessage.toLowerCase().includes("schedule") || userMessage.toLowerCase().includes("date")) {
      responseContent = "Let's work on your schedule. I've opened the calendar view where you can select dates for your activities.";
      setIsCanvasOpen(true);
      setCanvasState(prev => ({
        ...prev,
        activeTab: "calendar"
      }));
    } else if (!shouldInterrupt) {
      responseContent = "I'm here to help you analyze data, plan locations, or manage schedules. Would you like to explore any of these options? You can open the canvas to see interactive tools.";
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
