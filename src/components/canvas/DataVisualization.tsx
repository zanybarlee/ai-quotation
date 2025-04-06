
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, LineChart, Edit, RefreshCw } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { CanvasAction } from "@/utils/canvasInteraction";

type DataType = 'sales' | 'revenue' | 'users' | 'conversion';

interface DataVisualizationProps {
  chartType: string;
  dataType: DataType;
  sliderValue: number[];
  onChartTypeChange: (type: string) => void;
  onDataTypeChange: (type: DataType) => void;
  onSliderChange: (value: number[]) => void;
  onInterrupt?: (type: string, data?: any) => void;
  onCanvasAction?: (action: CanvasAction) => void;
}

// Mock data for the charts - these would ideally be in a separate data file
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

const DataVisualization: React.FC<DataVisualizationProps> = ({
  chartType,
  dataType,
  sliderValue,
  onChartTypeChange,
  onDataTypeChange,
  onSliderChange,
  onInterrupt,
  onCanvasAction
}) => {
  // Helper functions to get appropriate data and labels
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
  
  // Render the appropriate chart based on chartType
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

  return (
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
            onClick={() => onChartTypeChange('bar')}
          >
            <BarChart className="h-4 w-4 mr-1" /> Bar
          </Button>
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onChartTypeChange('line')}
          >
            <LineChart className="h-4 w-4 mr-1" /> Line
          </Button>
          <Button 
            variant={chartType === 'area' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onChartTypeChange('area')}
          >
            {/* Fix: Use a different icon or properly configure the Area component */}
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18H21V20H3V18Z" fill="currentColor"/>
              <path d="M3 4H21V6H3V4Z" fill="currentColor"/>
              <path d="M21 16H3L7 10L11 14L15 6L21 16Z" fill="currentColor"/>
            </svg>
            Area
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
            onClick={() => onDataTypeChange('sales')}
          >
            Sales
          </Button>
          <Button 
            variant={dataType === 'revenue' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onDataTypeChange('revenue')}
          >
            Revenue
          </Button>
          <Button 
            variant={dataType === 'users' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onDataTypeChange('users')}
          >
            Users
          </Button>
          <Button 
            variant={dataType === 'conversion' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onDataTypeChange('conversion')}
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
              onSliderChange(value);
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
  );
};

export default DataVisualization;
