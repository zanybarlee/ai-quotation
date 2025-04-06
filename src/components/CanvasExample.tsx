import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Edit, Map, MapPin, RefreshCw, BarChart, LineChart } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { CanvasAction, CanvasState } from "@/utils/canvasInteraction";

// Mock data for the charts
const salesData = [
  { month: "Jan", value: 12000, units: 120 },
  { month: "Feb", value: 19000, units: 190 },
  { month: "Mar", value: 22000, units: 220 },
  { month: "Apr", value: 17500, units: 175 },
  { month: "May", value: 24600, units: 246 },
  { month: "Jun", value: 28900, units: 289 },
  { month: "Jul", value: 21300, units: 213 },
];

const revenueData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 170 },
  { month: "Apr", value: 140 },
  { month: "May", value: 200 },
  { month: "Jun", value: 120 },
  { month: "Jul", value: 150 },
];

const usersData = [
  { month: "Jan", value: 500 },
  { month: "Feb", value: 650 },
  { month: "Mar", value: 820 },
  { month: "Apr", value: 940 },
  { month: "May", value: 1200 },
  { month: "Jun", value: 1350 },
  { month: "Jul", value: 1500 },
];

const conversionData = [
  { month: "Jan", value: 3.2 },
  { month: "Feb", value: 3.8 },
  { month: "Mar", value: 4.1 },
  { month: "Apr", value: 3.9 },
  { month: "May", value: 4.5 },
  { month: "Jun", value: 4.8 },
  { month: "Jul", value: 5.2 },
];

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
  
  // Get the appropriate data based on dataType
  const getChartData = () => {
    switch (dataType) {
      case 'sales': return salesData;
      case 'users': return usersData;
      case 'conversion': return conversionData;
      default: return revenueData;
    }
  };
  
  const getChartTitle = () => {
    switch (dataType) {
      case 'sales': return 'Sales Performance';
      case 'users': return 'User Growth';
      case 'conversion': return 'Conversion Rates';
      default: return 'Revenue Trends';
    }
  };
  
  const getValueLabel = () => {
    switch (dataType) {
      case 'sales': return 'Sales ($)';
      case 'users': return 'Users';
      case 'conversion': return 'Rate (%)';
      default: return 'Revenue ($)';
    }
  };
  
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
  
  const renderChart = () => {
    const data = getChartData();
    
    switch (chartType) {
      case 'bar':
        return (
          <RechartsPrimitive.BarChart data={data}>
            <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
            <RechartsPrimitive.XAxis dataKey="month" />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Bar 
              dataKey="value" 
              fill="#8884d8" 
              name={getValueLabel()}
            />
            {dataType === 'sales' && (
              <RechartsPrimitive.Bar 
                dataKey="units" 
                fill="#82ca9d" 
                name="Units Sold"
              />
            )}
          </RechartsPrimitive.BarChart>
        );
      case 'line':
        return (
          <RechartsPrimitive.LineChart data={data}>
            <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
            <RechartsPrimitive.XAxis dataKey="month" />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              name={getValueLabel()}
            />
            {dataType === 'sales' && (
              <RechartsPrimitive.Line 
                type="monotone" 
                dataKey="units" 
                stroke="#82ca9d" 
                name="Units Sold"
              />
            )}
          </RechartsPrimitive.LineChart>
        );
      default:
        return (
          <RechartsPrimitive.AreaChart data={data}>
            <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
            <RechartsPrimitive.XAxis dataKey="month" />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Area 
              type="monotone" 
              dataKey="value" 
              fill="#8884d8" 
              stroke="#8884d8" 
              fillOpacity={0.3} 
              name={getValueLabel()}
            />
          </RechartsPrimitive.AreaChart>
        );
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
          <Card>
            <CardHeader>
              <CardTitle>{getChartTitle()}</CardTitle>
              <CardDescription>Interactive visualization of {dataType} data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-2">
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleChartTypeChange('bar')}
                >
                  <BarChart className="h-4 w-4 mr-1" /> Bar
                </Button>
                <Button 
                  variant={chartType === 'line' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleChartTypeChange('line')}
                >
                  <LineChart className="h-4 w-4 mr-1" /> Line
                </Button>
                <Button 
                  variant={chartType === 'area' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleChartTypeChange('area')}
                >
                  <RechartsPrimitive.Area className="h-4 w-4 mr-1" /> Area
                </Button>
              </div>
              
              <div className="h-[200px]">
                <ChartContainer 
                  config={{
                    value: { label: getValueLabel(), color: "#8884d8" },
                    ...(dataType === 'sales' ? { units: { label: "Units Sold", color: "#82ca9d" } } : {})
                  }}
                >
                  <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant={dataType === 'sales' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => handleDataTypeChange('sales')}
                >
                  Sales
                </Button>
                <Button 
                  variant={dataType === 'revenue' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => handleDataTypeChange('revenue')}
                >
                  Revenue
                </Button>
                <Button 
                  variant={dataType === 'users' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => handleDataTypeChange('users')}
                >
                  Users
                </Button>
                <Button 
                  variant={dataType === 'conversion' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => handleDataTypeChange('conversion')}
                >
                  Conversion
                </Button>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <Label htmlFor="threshold">Threshold: {sliderValue[0]}%</Label>
                  <Button variant="outline" size="sm" onClick={() => onInterrupt?.("preference", { type: "threshold" })}>
                    <Edit className="h-3 w-3 mr-1" /> Customize
                  </Button>
                </div>
                <Slider 
                  id="threshold"
                  value={sliderValue} 
                  onValueChange={(value) => {
                    setSliderValue(value);
                    // Debounce the notification to avoid too many updates
                    const timeoutId = setTimeout(() => handleSliderChange(value), 500);
                    return () => clearTimeout(timeoutId);
                  }}
                  max={100} 
                  step={1}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => {
                  onInterrupt?.("analysis", { type: "visualize" });
                  
                  // Also notify about the action
                  if (onCanvasAction) {
                    onCanvasAction({
                      type: 'visualization',
                      payload: { 
                        type: chartType,
                        dataType: dataType,
                        description: `Requested ${dataType} analysis update`
                      },
                      source: 'canvas'
                    });
                  }
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> 
                Update Analysis
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Planning</CardTitle>
              <CardDescription>Select dates for your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="mx-auto"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setDate(new Date())}>
                Reset
              </Button>
              <Button 
                onClick={() => {
                  onInterrupt?.("date", { selected: date });
                  
                  // Also notify about the explicit confirmation
                  if (onCanvasAction && date) {
                    onCanvasAction({
                      type: 'date_selection',
                      payload: { 
                        date: date,
                        confirmed: true,
                        description: `Confirmed date: ${date.toLocaleDateString()}`
                      },
                      source: 'canvas'
                    });
                  }
                }}
              >
                Confirm Date
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanvasExample;
