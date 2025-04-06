
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuotationVersion } from "@/types/quotation";
import QuotationHeader from "@/components/quotation/QuotationHeader";
import QuotationTabs from "@/components/quotation/QuotationTabs";
import { generateRfp, createNewVersion, createEditedVersion } from "@/services/QuotationGenerator";

const Quotation = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("editor");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputContent, setInputContent] = useState("");
  const [rfpContent, setRfpContent] = useState<string | null>(null);
  const [versions, setVersions] = useState<QuotationVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  // Check if we have input from the chat
  useEffect(() => {
    const state = location.state as { inputText?: string; fromChat?: boolean } | null;
    
    if (state?.inputText) {
      setInputContent(state.inputText);
      
      // If we came from chat, automatically generate the RFP
      if (state.fromChat) {
        const timeoutId = setTimeout(() => {
          handleGenerate();
        }, 500);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [location.state]);

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
      const generatedRfp = await generateRfp(inputContent);
      
      // Create a new version
      const newVersion = createNewVersion(generatedRfp, inputContent, versions);
      
      setRfpContent(generatedRfp);
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
      setActiveTab("preview");
      
      toast({
        title: "RFP Generated",
        description: "Your RFP document has been created successfully.",
      });
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
    const newVersion = createEditedVersion(editedContent, inputContent, versions);
    
    setRfpContent(editedContent);
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newVersion.id);
    
    toast({
      title: "Changes saved",
      description: "Your edits have been saved as a new version.",
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <QuotationHeader />
      <main className="flex-1 overflow-hidden">
        <QuotationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          inputContent={inputContent}
          setInputContent={setInputContent}
          rfpContent={rfpContent}
          versions={versions}
          currentVersionId={currentVersionId}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onRestore={handleRestoreVersion}
          onSaveEdits={handleSaveEdits}
        />
      </main>
    </div>
  );
};

export default Quotation;
