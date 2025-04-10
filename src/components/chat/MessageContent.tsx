
import React from "react";
import { cn } from "@/lib/utils";
import { formatMarkdown } from "@/utils/messageFormatting";

interface MessageContentProps {
  content: string;
  isUserMessage: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ content, isUserMessage }) => {
  // Format the content with our custom markdown functions
  const formattedContent = formatMarkdown(content, isUserMessage);

  return (
    <div 
      className={cn(
        "mt-1 text-sm whitespace-pre-wrap markdown-content",
        isUserMessage ? "text-white" : "text-gray-800" 
      )}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default MessageContent;
