
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Canvas from "@/components/Canvas";
import CanvasToggle from "@/components/CanvasToggle";
import CanvasExample from "@/components/CanvasExample";
import ChatContainer from "@/components/ChatContainer";
import RoleSelector, { UserRole } from "@/components/RoleSelector";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { canvasActionToMessage, messageToCanvasAction } from "@/utils/canvasInteraction";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useInterrupts } from "@/hooks/useInterrupts";
import { useAIInteractions } from "@/hooks/useAIInteractions";
import { MessageType } from "@/components/ChatMessage";

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>("requestor");
  const [messages, setMessages] = useState<MessageType[]>([{
    id: "welcome",
    content: getWelcomeMessageForRole("requestor"),
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
  } = useAIInteractions(
    setMessages, 
    setIsCanvasOpen, 
    handleCanvasAction, 
    setCanvasState, 
    triggerInterrupt, 
    messageToCanvasAction,
    userRole
  );
  
  function getWelcomeMessageForRole(role: UserRole): string {
    switch (role) {
      case "requestor":
        return "Welcome to Kim Yew Integrated! I'm your AI assistant for facility management quotations. As a Requestor, you can create and submit quotations for approval. How can I help you today?";
      case "approver":
        return "Welcome, Approver. You can review and approve facility management quotation requests here. You can open the canvas to see pending quotations for review.";
      case "itAdmin":
        return "Hello IT Admin. You can manage IT-related facility requests and configurations. How can I assist you?";
      case "erpAdmin":
        return "Welcome, ERP Administrator. You have access to system configurations and data management. What would you like to do?";
      case "seniorManagement":
        return "Welcome, Senior Management. You can view reports, approve high-value requests, and access analytics. How can I assist you today?";
      default:
        return "Welcome to Kim Yew Integrated! I'm your AI assistant for facility management quotations. How can I help you today?";
    }
  }

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    // Add a system message indicating the role change
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: uuidv4(),
        content: `You are now viewing as: ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
        sender: "system",
        timestamp: new Date()
      },
      {
        id: uuidv4(),
        content: getWelcomeMessageForRole(newRole),
        sender: "assistant",
        timestamp: new Date()
      }
    ]);
  };
  
  return <div className="flex flex-col h-screen bg-gray-50">
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/49e2a6ff-414f-472d-b350-750831078cc0.png" alt="Kim Yew Integrated Logo" className="h-10" />
            <h1 className="text-xl font-bold text-slate-800">GenAI for Facility Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <RoleSelector currentRole={userRole} onRoleChange={handleRoleChange} />
            <CanvasToggle isOpen={isCanvasOpen} onClick={() => setIsCanvasOpen(!isCanvasOpen)} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {isCanvasOpen ? <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={33} minSize={30}>
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
                userRole={userRole} 
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={67} minSize={20}>
              <Canvas isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} title="Kim Yew Facility Management Quotation Tool">
                <CanvasExample 
                  onInterrupt={handleCanvasInterrupt} 
                  onCanvasAction={handleCanvasAction} 
                  canvasState={canvasState}
                  userRole={userRole}
                />
              </Canvas>
            </ResizablePanel>
          </ResizablePanelGroup> : <div className="flex flex-col flex-1">
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
              userRole={userRole}
            />
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
