
import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export type InterruptType = 
  | { type: "choice"; options: string[]; title: string; description?: string }
  | { type: "confirmation"; title: string; description?: string }
  | { type: "custom"; component: React.ReactNode };

interface InterruptHandlerProps {
  interrupt: InterruptType;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

const InterruptHandler: React.FC<InterruptHandlerProps> = ({
  interrupt,
  onSubmit,
  onCancel,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string>("");

  const handleSubmit = () => {
    if (interrupt.type === "choice") {
      if (!selectedOption) return;
      onSubmit(selectedOption);
    } else if (interrupt.type === "confirmation") {
      onSubmit(true);
    }
  };

  return (
    <div className="p-4">
      {interrupt.type === "choice" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{interrupt.title}</h3>
            {interrupt.description && (
              <p className="text-sm text-gray-500 mt-1">{interrupt.description}</p>
            )}
          </div>
          <Separator />
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {interrupt.options.map((option) => (
              <div key={option} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedOption}>
              Submit
            </Button>
          </div>
        </div>
      )}

      {interrupt.type === "confirmation" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{interrupt.title}</h3>
            {interrupt.description && (
              <p className="text-sm text-gray-500 mt-1">{interrupt.description}</p>
            )}
          </div>
          <Separator />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Confirm</Button>
          </div>
        </div>
      )}

      {interrupt.type === "custom" && (
        <div>{interrupt.component}</div>
      )}
    </div>
  );
};

export default InterruptHandler;
