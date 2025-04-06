
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, FileText, Save, Undo } from "lucide-react";

interface RfpPreviewProps {
  content: string;
  onSave: (content: string) => void;
}

const RfpPreview: React.FC<RfpPreviewProps> = ({ content, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');

  const handleSave = () => {
    onSave(editedContent);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setEditMode(false);
  };

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>RFP Document</CardTitle>
          <div className="flex space-x-2">
            {!editMode ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditMode(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <Tabs defaultValue="preview" onValueChange={(value) => setViewMode(value as 'preview' | 'source')}>
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="source">HTML Source</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div 
                  contentEditable={true}
                  className="min-h-[500px] p-4 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                  onBlur={(e) => setEditedContent(e.currentTarget.innerHTML)}
                />
              </TabsContent>
              <TabsContent value="source">
                <textarea
                  className="w-full min-h-[500px] p-4 border rounded-md font-mono text-sm"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="rfp-content">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </div>
          )}
          
          <Alert className="mt-4">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              This is a generated RFP document. You can edit it directly or adjust the settings to regenerate.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default RfpPreview;
