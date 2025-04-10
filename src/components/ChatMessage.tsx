
import React, { useState } from "react";
import { Avatar } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, User } from "lucide-react";
import SystemMessage from "./chat/SystemMessage";
import MessageHeader from "./chat/MessageHeader";
import MessageContent from "./chat/MessageContent";
import MessageActions from "./chat/MessageActions";
import { MessageAction } from "./chat/MessageActions";

export interface MessageType {
  id: string;
  content: string;
  sender: "user" | "assistant" | "system";
  timestamp: Date;
  actions?: MessageAction[];
}

export interface ChatMessageProps {
  message: MessageType;
  isVisible?: boolean;
  onActionTrigger?: (action: string) => void;
  userRole?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isVisible = true,
  onActionTrigger,
  userRole = "User",
}) => {
  const { sender, content, actions } = message;
  const isUser = sender === "user";
  const isSystem = sender === "system";
  const [copied, setCopied] = useState(false);

  // Format the user display name - capitalize the first letter of the role
  const userDisplayName = isUser && userRole ? 
    userRole.charAt(0).toUpperCase() + userRole.slice(1) : 
    "User";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  // Special rendering for system messages
  if (isSystem) {
    return <SystemMessage content={content} />;
  }

  return (
    <div
      className={cn(
        "p-4 flex gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-kimyew-blue flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-white" />
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser
            ? "bg-kimyew-blue text-white rounded-tr-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}
      >
        <MessageHeader 
          isUserMessage={isUser} 
          userDisplayName={userDisplayName} 
          copied={copied} 
          onCopy={handleCopy} 
        />
        <MessageContent content={content} isUserMessage={isUser} />
        {actions && actions.length > 0 && <MessageActions actions={actions} />}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 bg-kimyew-blue flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
