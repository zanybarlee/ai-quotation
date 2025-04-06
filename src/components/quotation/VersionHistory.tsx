
import React from 'react';
import { QuotationVersion } from '@/types/quotation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp, FileText } from "lucide-react";

interface VersionHistoryProps {
  versions: QuotationVersion[];
  currentVersionId: string | null;
  onRestore: (versionId: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  currentVersionId,
  onRestore,
}) => {
  // Sort versions by timestamp in descending order (newest first)
  const sortedVersions = [...versions].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {sortedVersions.map((version) => (
              <div 
                key={version.id}
                className={`p-4 border rounded-lg ${
                  version.id === currentVersionId 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">{version.name}</h3>
                    {version.id === currentVersionId && (
                      <Badge variant="outline" className="ml-2">Current</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(version.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {version.inputContent.substring(0, 100)}
                  {version.inputContent.length > 100 ? '...' : ''}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="flex items-center mr-3">
                      <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                      {Math.floor(version.content.length / 10)} words
                    </span>
                    <span className="flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1 text-purple-500" />
                      {version.content.split('<h2>').length - 1} sections
                    </span>
                  </div>
                  
                  {version.id !== currentVersionId && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onRestore(version.id)}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VersionHistory;
