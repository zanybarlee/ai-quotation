
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, ChartContainer, BarChart } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Edit, Map, MapPin, RefreshCw } from "lucide-react";

// Mock data for the charts
const data = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 170 },
  { month: "Apr", value: 140 },
  { month: "May", value: 200 },
  { month: "Jun", value: 120 },
  { month: "Jul", value: 150 },
];

interface CanvasExampleProps {
  interruptType?: string;
  onInterrupt?: (type: string, data?: any) => void;
}

const CanvasExample: React.FC<CanvasExampleProps> = ({ interruptType, onInterrupt }) => {
  const [activeTab, setActiveTab] = useState("data");
  const [sliderValue, setSliderValue] = useState([50]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="data" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
          <TabsTrigger value="map">Location</TabsTrigger>
          <TabsTrigger value="calendar">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
              <CardDescription>Interactive charts that update based on parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[200px]">
                <ChartContainer
                  title="Monthly Metrics"
                  series={[{ name: "Value", type: "area", data: data.map(d => d.value) }]}
                  categories={data.map(d => d.month)}
                />
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
                  onValueChange={setSliderValue} 
                  max={100} 
                  step={1}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => onInterrupt?.("analysis", { type: "visualize" })}
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
                    onClick={() => onInterrupt?.("location", { action: "select" })}
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
                onSelect={setDate}
                className="mx-auto"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setDate(new Date())}>
                Reset
              </Button>
              <Button 
                onClick={() => onInterrupt?.("date", { selected: date })}
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
