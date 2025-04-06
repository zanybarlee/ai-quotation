
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, User } from "lucide-react";

export interface MessageType {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserMessage = message.sender === "user";
  
  // Check if the message is related to a quotation
  const isQuotationRelated = 
    message.content.toLowerCase().includes("quotation") || 
    message.content.toLowerCase().includes("quote") ||
    message.content.toLowerCase().includes("rfp") ||
    message.content.toLowerCase().includes("proposal");

  return (
    <div className={`flex gap-2 mb-4 ${isUserMessage ? "justify-end" : "justify-start"}`}>
      {!isUserMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <Card className={`max-w-[85%] ${isUserMessage ? "bg-primary text-primary-foreground" : ""}`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            {isQuotationRelated && !isUserMessage && (
              <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
            )}
            <div>
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isUserMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
