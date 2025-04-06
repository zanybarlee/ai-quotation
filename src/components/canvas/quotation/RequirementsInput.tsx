
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RequirementsInputProps {
  userRequirements: string;
  setUserRequirements: (value: string) => void;
}

const RequirementsInput: React.FC<RequirementsInputProps> = ({
  userRequirements,
  setUserRequirements
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-medium">Requirements</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-kimyew-blue cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Describe your project requirements in detail</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Textarea 
        value={userRequirements} 
        onChange={(e) => setUserRequirements(e.target.value)}
        placeholder="Describe your project requirements here..."
        className="min-h-[120px] mb-4 border-kimyew-blue/20 focus-visible:ring-kimyew-blue/50"
      />
    </div>
  );
};

export default RequirementsInput;
