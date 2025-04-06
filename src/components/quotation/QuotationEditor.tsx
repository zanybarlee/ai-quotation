
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

interface QuotationEditorProps {
  content: string;
  onChange: (content: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const QuotationEditor: React.FC<QuotationEditorProps> = ({
  content,
  onChange,
  onGenerate,
  isGenerating,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Project Requirements</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">RFP Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize how your RFP will be generated
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="reading-level">Reading Level</Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger id="reading-level" className="col-span-2">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="tone">Tone</Label>
                    <Select defaultValue="formal">
                      <SelectTrigger id="tone" className="col-span-2">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="length">Length</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="length" className="col-span-2">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="requirements">
            Describe your project requirements in detail
          </Label>
          <Textarea
            id="requirements"
            placeholder="Enter a plain language description of your project requirements..."
            className="min-h-[300px] resize-y"
            value={content}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {content.length === 0
            ? "Enter your requirements to generate an RFP"
            : `${content.length} characters`}
        </p>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || !content.trim()}
        >
          {isGenerating ? "Generating..." : "Generate RFP"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuotationEditor;
