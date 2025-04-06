
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanvasAction, CanvasState } from "@/utils/canvasInteraction";
import DataVisualization from "@/components/canvas/DataVisualization";
import LocationMap from "@/components/canvas/LocationMap";
import ScheduleCalendar from "@/components/canvas/ScheduleCalendar";

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
  const [activeTab, setActiveTab] = useState(canvasState?.activeTab || "data");
  const [sliderValue, setSliderValue] = useState([50]);
  const [date, setDate] = useState<Date | undefined>(canvasState?.selectedDate || new Date());
  const [chartType, setChartType] = useState<string>(canvasState?.visualizationType || 'bar');
  const [dataType, setDataType] = useState<'sales' | 'revenue' | 'users' | 'conversion'>(
    canvasState?.dataType || 'revenue'
  );
  
  useEffect(() => {
    // If canvasState changes from parent, update local state
    if (canvasState) {
      if (canvasState.activeTab) setActiveTab(canvasState.activeTab);
      if (canvasState.selectedDate) setDate(canvasState.selectedDate);
      if (canvasState.visualizationType) setChartType(canvasState.visualizationType);
      if (canvasState.dataType) setDataType(canvasState.dataType as any);
    }
  }, [canvasState]);
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Notify parent component about tab change
    if (onCanvasAction) {
      onCanvasAction({
        type: 'selection',
        payload: { 
          item: value === 'data' ? 'Data Analysis' : 
                value === 'map' ? 'Location Map' : 'Calendar View', 
          tabId: value
        },
        source: 'canvas'
      });
    }
  };
  
  // Handle slider changes
  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue);
    
    // Notify parent after a short delay to avoid too many updates
    if (onCanvasAction) {
      onCanvasAction({
        type: 'data_update',
        payload: { 
          filter: 'threshold', 
          value: newValue[0],
          description: `Data threshold set to ${newValue[0]}%`
        },
        source: 'canvas'
      });
    }
  };
  
  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    
    if (newDate && onCanvasAction) {
      onCanvasAction({
        type: 'date_selection',
        payload: { 
          date: newDate,
          description: `Selected ${newDate.toLocaleDateString()}`
        },
        source: 'canvas'
      });
    }
  };
  
  // Handle chart type change
  const handleChartTypeChange = (type: string) => {
    setChartType(type);
    
    if (onCanvasAction) {
      onCanvasAction({
        type: 'visualization',
        payload: { 
          type: type,
          dataType: dataType,
          description: `Changed to ${type} chart for ${dataType} data`
        },
        source: 'canvas'
      });
    }
  };
  
  // Handle data type change
  const handleDataTypeChange = (type: 'sales' | 'revenue' | 'users' | 'conversion') => {
    setDataType(type);
    
    if (onCanvasAction) {
      onCanvasAction({
        type: 'data_update',
        payload: { 
          dataType: type,
          description: `Switched to ${type} data`
        },
        source: 'canvas'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="data" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
          <TabsTrigger value="map">Location</TabsTrigger>
          <TabsTrigger value="calendar">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-4">
          <DataVisualization 
            chartType={chartType}
            dataType={dataType}
            sliderValue={sliderValue}
            onChartTypeChange={handleChartTypeChange}
            onDataTypeChange={handleDataTypeChange}
            onSliderChange={handleSliderChange}
            onInterrupt={onInterrupt}
            onCanvasAction={onCanvasAction}
          />
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4">
          <LocationMap 
            onInterrupt={onInterrupt}
            onCanvasAction={onCanvasAction}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <ScheduleCalendar 
            date={date}
            onDateSelect={handleDateSelect}
            onInterrupt={onInterrupt}
            onCanvasAction={onCanvasAction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanvasExample;
