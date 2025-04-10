
import React, { useRef, useEffect } from "react";
import ChatMessage, { MessageType } from "./ChatMessage";

interface ChatThreadProps {
  messages: MessageType[];
  userRole?: string; // Add userRole prop
}

const ChatThread: React.FC<ChatThreadProps> = ({ messages, userRole }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          userRole={userRole} 
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatThread;
