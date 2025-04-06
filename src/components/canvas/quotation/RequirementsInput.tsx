
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RequirementsInputProps {
  userRequirements: string;
  setUserRequirements: (value: string) => void;
}

const RequirementsInput: React.FC<RequirementsInputProps> = ({
  userRequirements,
  setUserRequirements
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Requirements</h3>
      <Textarea 
        value={userRequirements} 
        onChange={(e) => setUserRequirements(e.target.value)}
        placeholder="Describe your project requirements here..."
        className="min-h-[120px] mb-4"
      />
    </div>
  );
};

export default RequirementsInput;
