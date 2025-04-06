
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanvasAction, CanvasState } from "@/utils/canvasInteraction";
import QuotationTab from "@/components/canvas/QuotationTab";

interface CanvasExampleProps {
  interruptType?: string;
  onInterrupt?: (type: string, data?: any) => void;
  onCanvasAction?: (action: CanvasAction) => void;
  canvasState?: CanvasState;
}

const CanvasExample: React.FC<CanvasExampleProps> = ({ 
  interruptType, 
  onInterrupt, 
  onCanvasAction,
  canvasState
}) => {
  const [activeTab, setActiveTab] = useState("quotation");
  
  useEffect(() => {
    // If canvasState changes from parent, update local state
    if (canvasState) {
      if (canvasState.activeTab && canvasState.activeTab !== "quotation") {
        // Force quotation to be the only tab
        if (onCanvasAction) {
          onCanvasAction({
            type: 'selection',
            payload: { 
              item: 'Quotation',
              tabId: 'quotation'
            },
            source: 'canvas'
          });
        }
      }
    }
  }, [canvasState, onCanvasAction]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="quotation" value="quotation">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="quotation" className="w-full">Quotation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotation" className="space-y-4">
          <QuotationTab 
            requirements={canvasState?.quotationData?.requirements}
            sorItems={canvasState?.quotationData?.sorItems}
            previousQuotes={canvasState?.quotationData?.previousQuotes}
            onCanvasAction={onCanvasAction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanvasExample;
