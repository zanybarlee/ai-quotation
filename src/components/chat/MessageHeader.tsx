
import React from "react";
import { Button } from "../ui/button";
import { Copy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageHeaderProps {
  isUserMessage: boolean;
  userDisplayName: string;
  copied: boolean;
  onCopy: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  isUserMessage, 
  userDisplayName, 
  copied, 
  onCopy 
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs opacity-70">
        {isUserMessage ? userDisplayName : "AI Assistant"}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-5 w-5 p-0 opacity-50 hover:opacity-100",
          isUserMessage ? "text-white" : "text-gray-500"
        )}
        onClick={onCopy}
      >
        {copied ? (
          <CheckCheck className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export default MessageHeader;
