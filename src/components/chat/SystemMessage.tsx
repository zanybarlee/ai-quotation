
import React from "react";

interface SystemMessageProps {
  content: string;
}

const SystemMessage: React.FC<SystemMessageProps> = ({ content }) => {
  return (
    <div className="flex justify-center my-3 px-4">
      <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full font-medium border border-gray-200 shadow-sm">
        {content}
      </div>
    </div>
  );
};

export default SystemMessage;
