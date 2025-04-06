
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CanvasAction } from "@/utils/canvasInteraction";

interface ScheduleCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onInterrupt?: (type: string, data?: any) => void;
  onCanvasAction?: (action: CanvasAction) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ 
  date, 
  onDateSelect, 
  onInterrupt, 
  onCanvasAction 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Planning</CardTitle>
        <CardDescription>Select dates for your activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            onDateSelect(newDate);
            
            // Notify about the selection but make it silent for chat
            if (onCanvasAction && newDate) {
              onCanvasAction({
                type: 'date_selection',
                payload: { 
                  date: newDate,
                  silent: true, // Add this flag to indicate it shouldn't appear in chat
                  description: `Selected ${newDate.toLocaleDateString()}`
                },
                source: 'canvas'
              });
            }
          }}
          className="mx-auto"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onDateSelect(new Date())}>
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
  );
};

export default ScheduleCalendar;
