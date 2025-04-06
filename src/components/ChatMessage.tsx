
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User, FileText } from "lucide-react";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  // Highlight quotation-related terms in the message
  const highlightQuotationTerms = (text: string) => {
    const terms = ["quotation", "quote", "proposal", "rfp", "sor", "schedule of rate"];
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, match => 
        `<span class="font-semibold text-purple-700 dark:text-purple-400 underline">${match}</span>`
      );
    });
    
    return <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  // Check if message is quotation-related
  const isQuotationRelated = () => {
    const lowerContent = message.content.toLowerCase();
    const terms = ["quotation", "quote", "proposal", "rfp", "sor", "schedule of rate"];
    return terms.some(term => lowerContent.includes(term));
  };

  return (
    <div className={cn("flex w-full gap-3 p-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-purple-100 flex items-center justify-center">
          <Bot className="h-4 w-4 text-purple-600" />
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser
            ? "bg-purple-500 text-white rounded-tr-none"
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}
      >
        {isUser ? (
          <div className="flex items-start gap-2">
            <p className="whitespace-pre-wrap">{message.content}</p>
            {isQuotationRelated() && (
              <FileText className="h-4 w-4 text-white mt-1 flex-shrink-0" />
            )}
          </div>
        ) : (
          <div>
            {highlightQuotationTerms(message.content)}
            {isQuotationRelated() && (
              <div className="mt-2 text-xs text-purple-600 italic flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>Quotation features available</span>
              </div>
            )}
          </div>
        )}
        <div className={cn("text-xs mt-1", isUser ? "text-purple-200" : "text-gray-500")}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 bg-purple-500 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
