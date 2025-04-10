
import React from "react";

interface SystemMessageProps {
  content: string;
}

const SystemMessage: React.FC<SystemMessageProps> = ({ content }) => {
  return (
    <div className="flex justify-center my-2 px-4">
      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
        {content}
      </div>
    </div>
  );
};

export default SystemMessage;
