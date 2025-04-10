
import React from "react";
import ChatThread from "@/components/ChatThread";
import ChatInput from "@/components/ChatInput";
import InterruptContainer from "@/components/InterruptContainer";
import { MessageType } from "@/components/ChatMessage";
import { InterruptType } from "@/components/InterruptHandler";
import { CanvasAction } from "@/utils/canvasInteraction";

interface ChatContainerProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  isLoading: boolean;
  handleSendMessage: (message: string) => void;
  interruptVisible: boolean;
  setInterruptVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentInterrupt: InterruptType | null;
  setCurrentInterrupt: React.Dispatch<React.SetStateAction<InterruptType | null>>;
  handleCanvasAction: (action: CanvasAction) => void;
  userRole?: string; // Add userRole prop
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  setMessages,
  isLoading,
  handleSendMessage,
  interruptVisible,
  setInterruptVisible,
  currentInterrupt,
  setCurrentInterrupt,
  handleCanvasAction,
  userRole,
}) => {
  return (
    <div className="flex flex-col h-full">
      <ChatThread messages={messages} userRole={userRole} />
      
      {interruptVisible && currentInterrupt && (
        <InterruptContainer
          messages={messages}
          setMessages={setMessages}
          interruptVisible={interruptVisible}
          setInterruptVisible={setInterruptVisible}
          currentInterrupt={currentInterrupt}
          setCurrentInterrupt={setCurrentInterrupt}
          handleCanvasAction={handleCanvasAction}
        />
      )}
      
      <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
    </div>
  );
};

export default ChatContainer;
