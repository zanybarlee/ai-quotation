
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapPin } from "lucide-react";
import { CanvasAction } from "@/utils/canvasInteraction";

interface LocationMapProps {
  onInterrupt?: (type: string, data?: any) => void;
  onCanvasAction?: (action: CanvasAction) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ onInterrupt, onCanvasAction }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Selection</CardTitle>
        <CardDescription>Select a destination or point of interest</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative w-full h-[300px] bg-slate-100 rounded-md border overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400">Map View</p>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                onInterrupt?.("location", { action: "select" });
                
                // Also notify about the action
                if (onCanvasAction) {
                  onCanvasAction({
                    type: 'position_change',
                    payload: { 
                      name: 'Selected location',
                      lat: 34.05, 
                      lng: -118.25
                    },
                    source: 'canvas'
                  });
                }
              }}
            >
              <MapPin className="h-4 w-4 mr-2" /> 
              Select Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
