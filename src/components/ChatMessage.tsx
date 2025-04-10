
import React, { useState } from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightCircle, Copy, MessageSquare, User, CheckCheck } from "lucide-react";

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
  userRole?: string; // Add userRole prop
}

// Helper function to format links in text
const formatLinks = (text: string) => {
  // Regex for markdown links - [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(
    linkRegex,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
  );
};

// Helper function to format code blocks
const formatCodeBlocks = (text: string) => {
  // Regex for code blocks - ```code```
  const codeBlockRegex = /```([^`]+)```/g;
  let formattedText = text;
  
  // Replace code blocks with styled pre elements
  formattedText = formattedText.replace(
    codeBlockRegex,
    '<pre class="bg-gray-800 text-gray-100 p-3 rounded-md overflow-auto my-2">$1</pre>'
  );
  
  // Regex for inline code - `code`
  const inlineCodeRegex = /`([^`]+)`/g;
  formattedText = formattedText.replace(
    inlineCodeRegex,
    '<code class="bg-gray-200 rounded px-1 py-0.5">$1</code>'
  );
  
  return formattedText;
};

// Helper function to format basic markdown
const formatMarkdown = (text: string, isUserMessage: boolean) => {
  // Start with code blocks to avoid interference with other formatting
  let formattedText = formatCodeBlocks(text);
  
  // Format links
  formattedText = formatLinks(formattedText);
  
  // Format bold text - **text**
  formattedText = formattedText.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong>$1</strong>'
  );
  
  // Format italic text - *text*
  formattedText = formattedText.replace(
    /\*([^*]+)\*/g,
    '<em>$1</em>'
  );
  
  // Format headings - # Heading
  formattedText = formattedText.replace(
    /^# (.+)$/gm,
    '<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>'
  );
  
  formattedText = formattedText.replace(
    /^## (.+)$/gm,
    '<h2 class="text-lg font-bold mt-2 mb-1">$1</h2>'
  );
  
  formattedText = formattedText.replace(
    /^### (.+)$/gm,
    '<h3 class="text-md font-bold mt-2 mb-1">$1</h3>'
  );
  
  // Format lists - simple unordered lists
  formattedText = formattedText.replace(
    /^- (.+)$/gm,
    '<li class="ml-4">$1</li>'
  );

  // Wrap paragraphs that aren't already wrapped in HTML tags
  const lines = formattedText.split('\n');
  formattedText = lines.map(line => {
    // Skip lines that are already HTML elements
    if (line.trim().startsWith('<') && line.trim().endsWith('>')) return line;
    // Skip empty lines
    if (line.trim() === '') return line;
    // Wrap other lines in paragraph tags
    return `<p>${line}</p>`;
  }).join('\n');
  
  return formattedText;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isVisible = true,
  onActionTrigger,
  userRole = "User", // Default to "User" if no role is provided
}) => {
  const { sender, content, actions } = message;
  const isUser = sender === "user";
  const isSystem = sender === "system"; // Check if message is a system message
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
    return (
      <div className="flex justify-center my-2 px-4">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {content}
        </div>
      </div>
    );
  }

  // Format the content with our custom markdown functions
  const formattedContent = formatMarkdown(content, isUser);

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
            {isUser ? userDisplayName : "AI Assistant"}
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
        <div 
          className={cn(
            "mt-1 text-sm whitespace-pre-wrap markdown-content",
            isUser ? "text-white" : "text-gray-800" 
          )}
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
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
