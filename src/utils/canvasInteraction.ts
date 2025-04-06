
// Types for canvas interactions
export interface CanvasAction {
  type: 'data_update' | 'selection' | 'visualization' | 'position_change' | 'date_selection';
  payload: any;
  source: 'canvas' | 'chat';
}

export interface CanvasState {
  activeTab: string;
  visualizationType?: string;
  selectedLocation?: { lat: number; lng: number; name?: string };
  selectedDate?: Date;
  dataFilters?: Record<string, any>;
}

// Helper function to convert canvas actions to human-readable messages
export const canvasActionToMessage = (action: CanvasAction): string => {
  switch (action.type) {
    case 'data_update':
      return `Updated visualization with new data: ${action.payload.description || 'Data update'}`;
    case 'selection':
      return `Selected ${action.payload.item} ${action.payload.description ? `(${action.payload.description})` : ''}`;
    case 'visualization':
      return `Changed visualization to ${action.payload.type}`;
    case 'position_change':
      return `Moved to location: ${action.payload.name || 'New location'}`;
    case 'date_selection':
      return `Selected date: ${action.payload.date?.toLocaleDateString() || 'New date'}`;
    default:
      return 'Canvas updated';
  }
};

// Helper function to convert user messages to canvas actions
export const messageToCanvasAction = (message: string): CanvasAction | null => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('data')) {
    return {
      type: 'visualization',
      payload: { 
        type: lowerMessage.includes('bar') ? 'bar' : 
              lowerMessage.includes('line') ? 'line' : 
              lowerMessage.includes('area') ? 'area' : 'default',
        description: 'Visualization from chat request'
      },
      source: 'chat'
    };
  }
  
  if (lowerMessage.includes('map') || lowerMessage.includes('location')) {
    return {
      type: 'position_change',
      payload: { activate: true },
      source: 'chat'
    };
  }
  
  if (lowerMessage.includes('calendar') || lowerMessage.includes('date') || lowerMessage.includes('schedule')) {
    return {
      type: 'date_selection',
      payload: { activate: true },
      source: 'chat'
    };
  }
  
  return null;
};
