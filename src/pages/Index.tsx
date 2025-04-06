
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Canvas from "@/components/Canvas";
import CanvasToggle from "@/components/CanvasToggle";
import CanvasExample from "@/components/CanvasExample";
import ChatContainer from "@/components/ChatContainer";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, ArrowRightCircle } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { canvasActionToMessage, messageToCanvasAction } from "@/utils/canvasInteraction";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useInterrupts } from "@/hooks/useInterrupts";
import { useAIInteractions } from "@/hooks/useAIInteractions";

const Index = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      content: "Welcome to Canvas-UX! I'm your AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  
  // Initialize hooks
  const { 
    canvasState, 
    handleCanvasAction 
  } = useCanvasState(setMessages, canvasActionToMessage);
  
  const {
    currentInterrupt,
    setCurrentInterrupt,
    interruptVisible,
    setInterruptVisible,
    triggerInterrupt,
    handleCanvasInterrupt
  } = useInterrupts();
  
  const {
    isLoading,
    handleSendMessage
  } = useAIInteractions(
    setMessages,
    setIsCanvasOpen,
    handleCanvasAction,
    (value) => setCanvasState(value),
    triggerInterrupt,
    messageToCanvasAction
  );

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
              <ChatContainer 
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                handleSendMessage={handleSendMessage}
                interruptVisible={interruptVisible}
                setInterruptVisible={setInterruptVisible}
                currentInterrupt={currentInterrupt}
                setCurrentInterrupt={setCurrentInterrupt}
                handleCanvasAction={handleCanvasAction}
              />
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
            <ChatContainer 
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              handleSendMessage={handleSendMessage}
              interruptVisible={interruptVisible}
              setInterruptVisible={setInterruptVisible}
              currentInterrupt={currentInterrupt}
              setCurrentInterrupt={setCurrentInterrupt}
              handleCanvasAction={handleCanvasAction}
            />
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
