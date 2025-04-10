
import React from "react";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";

export interface MessageAction {
  label: string;
  action: () => void;
}

interface MessageActionsProps {
  actions: MessageAction[];
}

const MessageActions: React.FC<MessageActionsProps> = ({ actions }) => {
  if (!actions || actions.length === 0) return null;
  
  return (
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
  );
};

export default MessageActions;
