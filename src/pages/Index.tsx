
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Canvas from "@/components/Canvas";
import ChatInput from "@/components/ChatInput";
import ChatThread from "@/components/ChatThread";
import CanvasToggle from "@/components/CanvasToggle";
import InterruptHandler, { InterruptType } from "@/components/InterruptHandler";
import CanvasExample from "@/components/CanvasExample";
import { Button } from "@/components/ui/button";
import { MessageType } from "@/components/ChatMessage";
import { useToast } from "@/components/ui/use-toast";
import { PanelRightOpen, ArrowRightCircle } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { CanvasAction, CanvasState, canvasActionToMessage, messageToCanvasAction } from "@/utils/canvasInteraction";

const Index = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      content: "Welcome to Canvas-UX! I'm your AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInterrupt, setCurrentInterrupt] = useState<InterruptType | null>(null);
  const [interruptVisible, setInterruptVisible] = useState(false);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    activeTab: "data",
  });
  const { toast } = useToast();

  // Handle canvas actions
  const handleCanvasAction = (action: CanvasAction) => {
    // Update canvas state based on the action
    if (action.type === 'visualization') {
      setCanvasState(prev => ({
        ...prev,
        activeTab: 'data',
        visualizationType: action.payload.type
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
        }
      }));
    }

    // Add a message to the chat if the action came from the canvas
    if (action.source === 'canvas') {
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
      
      // Show a toast notification
      toast({
        title: "Canvas update",
        description: messageContent,
      });
    }
  };

  // Simulate AI response with loading
  const simulateResponse = (userMessage: string) => {
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
  };

  const handleSendMessage = (message: string) => {
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
  };

  const triggerInterrupt = (interrupt: InterruptType) => {
    setCurrentInterrupt(interrupt);
    setInterruptVisible(true);
  };

  const handleInterruptSubmit = (value: any) => {
    // Add system message about the user's choice
    let responseMessage = "";
    
    if (currentInterrupt?.type === "choice") {
      responseMessage = `You selected: ${value}`;
      
      // Update canvas state based on selection
      if (value.toLowerCase().includes("revenue")) {
        handleCanvasAction({
          type: 'visualization',
          payload: { 
            type: 'bar',
            description: 'Revenue visualization'
          },
          source: 'chat'
        });
      } else if (value.toLowerCase().includes("user")) {
        handleCanvasAction({
          type: 'visualization',
          payload: { 
            type: 'line',
            description: 'User growth visualization'
          },
          source: 'chat'
        });
      } else if (value.toLowerCase().includes("performance")) {
        handleCanvasAction({
          type: 'visualization',
          payload: { 
            type: 'area',
            description: 'Performance metrics visualization'
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
    } else if (currentInterrupt?.type === "confirmation") {
      responseMessage = "Confirmation received";
      
      // If it's a date confirmation, update the canvas state
      if (currentInterrupt.title.includes("Date")) {
        // Update the canvas with the confirmed date
        handleCanvasAction({
          type: 'date_selection',
          payload: { 
            date: new Date(),
            confirmed: true
          },
          source: 'chat'
        });
      }
    }
    
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        content: responseMessage,
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    
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

  const handleCanvasInterrupt = (type: string, data?: any) => {
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
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PanelRightOpen className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl font-bold text-slate-800">Canvas-UX Demo</h1>
          </div>
          <CanvasToggle isOpen={isCanvasOpen} onClick={() => setIsCanvasOpen(!isCanvasOpen)} />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {isCanvasOpen ? (
          <ResizablePanelGroup 
            direction="horizontal" 
            className="w-full"
          >
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex flex-col h-full">
                <ChatThread messages={messages} />
                
                {interruptVisible && currentInterrupt && (
                  <div className="p-4 border-t bg-slate-50">
                    <div className="max-w-md mx-auto">
                      <InterruptHandler
                        interrupt={currentInterrupt}
                        onSubmit={handleInterruptSubmit}
                        onCancel={handleInterruptCancel}
                      />
                    </div>
                  </div>
                )}
                
                <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={40} minSize={20}>
              <Canvas 
                isOpen={isCanvasOpen} 
                onClose={() => setIsCanvasOpen(false)}
                title="Interactive Workspace"
              >
                <CanvasExample 
                  onInterrupt={handleCanvasInterrupt} 
                  onCanvasAction={handleCanvasAction}
                  canvasState={canvasState}
                />
              </Canvas>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-col flex-1">
            <ChatThread messages={messages} />
            
            {interruptVisible && currentInterrupt && (
              <div className="p-4 border-t bg-slate-50">
                <div className="max-w-md mx-auto">
                  <InterruptHandler
                    interrupt={currentInterrupt}
                    onSubmit={handleInterruptSubmit}
                    onCancel={handleInterruptCancel}
                  />
                </div>
              </div>
            )}
            
            <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
          </div>
        )}
      </main>

      {!isCanvasOpen && (
        <div className="fixed bottom-20 right-6">
          <Button 
            onClick={() => setIsCanvasOpen(true)}
            className="rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg p-3 h-auto"
          >
            <ArrowRightCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
