
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Canvas from "@/components/Canvas";
import CanvasToggle from "@/components/CanvasToggle";
import CanvasExample from "@/components/CanvasExample";
import ChatContainer from "@/components/ChatContainer";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { canvasActionToMessage, messageToCanvasAction } from "@/utils/canvasInteraction";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useInterrupts } from "@/hooks/useInterrupts";
import { useAIInteractions } from "@/hooks/useAIInteractions";
import { MessageType } from "@/components/ChatMessage";

const Index = () => {
  const [messages, setMessages] = useState<MessageType[]>([{
    id: "welcome",
    content: "Welcome to Kim Yew Integrated! I'm your AI assistant for facility management quotations. How can I help you today?",
    sender: "assistant",
    timestamp: new Date()
  }]);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  // Initialize hooks
  const {
    canvasState,
    setCanvasState,
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
  } = useAIInteractions(setMessages, setIsCanvasOpen, handleCanvasAction, setCanvasState, triggerInterrupt, messageToCanvasAction);
  
  return <div className="flex flex-col h-screen bg-gray-50">
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/49e2a6ff-414f-472d-b350-750831078cc0.png" alt="Kim Yew Integrated Logo" className="h-10" />
            <h1 className="text-xl font-bold text-slate-800">GenAI for Facility Management</h1>
          </div>
          <CanvasToggle isOpen={isCanvasOpen} onClick={() => setIsCanvasOpen(!isCanvasOpen)} />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {isCanvasOpen ? <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={60} minSize={30}>
              <ChatContainer messages={messages} setMessages={setMessages} isLoading={isLoading} handleSendMessage={handleSendMessage} interruptVisible={interruptVisible} setInterruptVisible={setInterruptVisible} currentInterrupt={currentInterrupt} setCurrentInterrupt={setCurrentInterrupt} handleCanvasAction={handleCanvasAction} />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={40} minSize={20}>
              <Canvas isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} title="Kim Yew Facility Management Quotation Tool">
                <CanvasExample onInterrupt={handleCanvasInterrupt} onCanvasAction={handleCanvasAction} canvasState={canvasState} />
              </Canvas>
            </ResizablePanel>
          </ResizablePanelGroup> : <div className="flex flex-col flex-1">
            <ChatContainer messages={messages} setMessages={setMessages} isLoading={isLoading} handleSendMessage={handleSendMessage} interruptVisible={interruptVisible} setInterruptVisible={setInterruptVisible} currentInterrupt={currentInterrupt} setCurrentInterrupt={setCurrentInterrupt} handleCanvasAction={handleCanvasAction} />
          </div>}
      </main>

      {!isCanvasOpen && <div className="fixed bottom-20 right-6">
          <Button onClick={() => setIsCanvasOpen(true)} className="rounded-full bg-kimyew-blue hover:bg-secondary shadow-lg p-3 h-auto">
            <ArrowRightCircle className="h-6 w-6" />
          </Button>
        </div>}
    </div>;
};

export default Index;
