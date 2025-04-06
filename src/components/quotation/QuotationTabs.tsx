
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users } from "lucide-react";
import QuotationEditor from "@/components/quotation/QuotationEditor";
import RfpPreview from "@/components/quotation/RfpPreview";
import VersionHistory from "@/components/quotation/VersionHistory";
import { QuotationVersion } from "@/types/quotation";

interface QuotationTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  inputContent: string;
  setInputContent: (content: string) => void;
  rfpContent: string | null;
  versions: QuotationVersion[];
  currentVersionId: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onRestore: (versionId: string) => void;
  onSaveEdits: (editedContent: string) => void;
}

const QuotationTabs: React.FC<QuotationTabsProps> = ({
  activeTab,
  setActiveTab,
  inputContent,
  setInputContent,
  rfpContent,
  versions,
  currentVersionId,
  isGenerating,
  onGenerate,
  onRestore,
  onSaveEdits
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="h-full flex flex-col"
    >
      <div className="border-b px-4 bg-gray-50">
        <TabsList className="mt-2">
          <TabsTrigger value="editor" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Requirements Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1" disabled={!rfpContent}>
            <FileText className="h-4 w-4" />
            RFP Preview
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1" disabled={versions.length === 0}>
            <Users className="h-4 w-4" />
            Version History
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="editor" className="flex-1 p-4 overflow-auto">
        <QuotationEditor
          content={inputContent}
          onChange={setInputContent}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
        />
      </TabsContent>

      <TabsContent value="preview" className="flex-1 overflow-auto">
        {rfpContent && (
          <RfpPreview
            content={rfpContent}
            onSave={onSaveEdits}
          />
        )}
      </TabsContent>

      <TabsContent value="history" className="flex-1 p-4 overflow-auto">
        <VersionHistory 
          versions={versions}
          currentVersionId={currentVersionId}
          onRestore={onRestore}
        />
      </TabsContent>
    </Tabs>
  );
};

export default QuotationTabs;
