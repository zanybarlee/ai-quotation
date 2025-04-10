
import React, { useState } from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightCircle, Copy, MessageSquare, User, CheckCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MessageType {
  id: string;
  content: string;
  sender: "user" | "assistant" | "system"; // Added "system" type
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface ChatMessageProps {
  message: MessageType;
  isVisible?: boolean;
  onActionTrigger?: (action: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isVisible = true,
  onActionTrigger,
}) => {
  const { sender, content, actions } = message;
  const isUser = sender === "user";
  const isSystem = sender === "system"; // Check if message is a system message
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  // Special rendering for system messages
  if (isSystem) {
    return (
      <div className="flex justify-center my-2 px-4">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {content}
        </div>
      </div>
    );
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
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-70">
            {isUser ? "You" : "AI Assistant"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-5 w-5 p-0 opacity-50 hover:opacity-100",
              isUser ? "text-white" : "text-gray-500"
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <div className="mt-1 text-sm whitespace-pre-wrap markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            className={cn(
              "prose max-w-none",
              isUser ? "prose-invert" : "prose-gray"
            )}
            components={{
              a: ({ node, ...props }) => <a {...props} className="text-kimyew-blue hover:underline" target="_blank" rel="noopener noreferrer" />,
              code: ({ node, className, children, ...props }) => (
                <code className={cn("bg-gray-200 rounded px-1 py-0.5", isUser ? "bg-opacity-20" : "", className)} {...props}>
                  {children}
                </code>
              ),
              pre: ({ node, children, ...props }) => (
                <pre className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-auto my-2" {...props}>
                  {children}
                </pre>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        {actions && actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="bg-white text-kimyew-blue border-kimyew-blue/30"
                onClick={action.action}
              >
                {action.label}
                <ArrowRightCircle className="ml-1 h-3 w-3" />
              </Button>
            ))}
          </div>
        )}
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
