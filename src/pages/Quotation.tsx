
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Users } from "lucide-react";
import QuotationEditor from "@/components/quotation/QuotationEditor";
import RfpPreview from "@/components/quotation/RfpPreview";
import VersionHistory from "@/components/quotation/VersionHistory";
import { useToast } from "@/hooks/use-toast";
import { QuotationVersion } from "@/types/quotation";

const Quotation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("editor");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputContent, setInputContent] = useState("");
  const [rfpContent, setRfpContent] = useState<string | null>(null);
  const [versions, setVersions] = useState<QuotationVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter project requirements before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call to generate RFP (will be replaced with actual API)
      setTimeout(() => {
        const generatedRfp = simulateRfpGeneration(inputContent);
        
        // Create a new version
        const newVersion: QuotationVersion = {
          id: Date.now().toString(),
          name: `Version ${versions.length + 1}`,
          timestamp: new Date(),
          content: generatedRfp,
          inputContent,
        };
        
        setRfpContent(generatedRfp);
        setVersions(prev => [...prev, newVersion]);
        setCurrentVersionId(newVersion.id);
        setActiveTab("preview");
        
        toast({
          title: "RFP Generated",
          description: "Your RFP document has been created successfully.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "An error occurred while generating the RFP.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setRfpContent(version.content);
      setInputContent(version.inputContent);
      setCurrentVersionId(versionId);
      
      toast({
        title: "Version restored",
        description: `Restored to ${version.name}`,
      });
    }
  };

  const handleSaveEdits = (editedContent: string) => {
    // Create a new version based on edits
    const newVersion: QuotationVersion = {
      id: Date.now().toString(),
      name: `Version ${versions.length + 1} (Edited)`,
      timestamp: new Date(),
      content: editedContent,
      inputContent, // Keep the same input content
    };
    
    setRfpContent(editedContent);
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newVersion.id);
    
    toast({
      title: "Changes saved",
      description: "Your edits have been saved as a new version.",
    });
  };

  // This simulates what the AI would generate, will be replaced with actual AI integration
  const simulateRfpGeneration = (input: string): string => {
    return `
      <h1>Request for Proposal</h1>
      <h2>Introduction</h2>
      <p>This RFP is generated based on your requirements: ${input.substring(0, 50)}...</p>
      
      <h2>Project Background</h2>
      <p>The client is seeking professional services to address specific needs related to their business operations.</p>
      
      <h2>Scope of Work</h2>
      <ul>
        <li>Requirement analysis and documentation</li>
        <li>System design and implementation</li>
        <li>Testing and validation</li>
        <li>Deployment and maintenance</li>
      </ul>
      
      <h2>Proposal Requirements</h2>
      <p>Vendors should provide a comprehensive description of their approach, timeline, budget, and team composition.</p>
      
      <h2>Evaluation Criteria</h2>
      <p>Proposals will be evaluated based on technical merit, cost-effectiveness, expertise, and alignment with project goals.</p>
      
      <h2>Timeline & Deliverables</h2>
      <p>The project is expected to commence within 30 days of vendor selection and be completed within 6 months.</p>
    `;
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-800">Quotation Module</h1>
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
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
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto">
            {rfpContent && (
              <RfpPreview
                content={rfpContent}
                onSave={handleSaveEdits}
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-1 p-4 overflow-auto">
            <VersionHistory 
              versions={versions}
              currentVersionId={currentVersionId}
              onRestore={handleRestoreVersion}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Quotation;
