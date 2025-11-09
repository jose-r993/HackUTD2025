"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, FileText, ListChecks, BookOpen, Download } from "lucide-react";

type OutputType = "prd" | "user_story" | "action_items" | "summary";

export default function CatalystApp() {
  const [notes, setNotes] = useState("");
  const [selectedType, setSelectedType] = useState<OutputType>("summary");
  const [processedOutput, setProcessedOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [notionTitle, setNotionTitle] = useState("");

  const outputTypes = [
    { value: "summary", label: "Summary", icon: FileText },
    { value: "prd", label: "PRD", icon: BookOpen },
    { value: "user_story", label: "User Stories", icon: ListChecks },
    { value: "action_items", label: "Action Items", icon: ListChecks },
  ];

  const handleProcess = async () => {
    if (!notes.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalyst/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
          output_type: selectedType,
        }),
      });

      if (!response.ok) throw new Error("Failed to process notes");

      const data = await response.json();
      setProcessedOutput(data.content);
    } catch (error) {
      console.error("Error processing notes:", error);
      alert("Failed to process notes. Please check your backend connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportToNotion = async () => {
    if (!processedOutput.trim() || !notionTitle.trim()) {
      alert("Please provide both content and a title for the Notion page");
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalyst/export-notion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: processedOutput,
          page_title: notionTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to export to Notion");
      }

      alert(`Successfully exported to Notion! URL: ${data.notion_url}`);
    } catch (error) {
      console.error("Error exporting to Notion:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to export to Notion: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voice Assistant</h1>
          <p className="text-muted-foreground">
            Transform meeting notes into structured deliverables with AI
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Meeting Notes</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Paste your raw meeting notes below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Textarea
                placeholder="Enter your meeting notes here..."
                className="min-h-[320px] font-mono text-sm border-border resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Select Output Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {outputTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? "default" : "outline"}
                        onClick={() => setSelectedType(type.value as OutputType)}
                        className="justify-start h-10"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleProcess}
                disabled={isProcessing || !notes.trim()}
                className="w-full h-10 font-medium"
                size="lg"
              >
                {isProcessing ? (
                  <>Processing with NVIDIA Nemotron...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate {outputTypes.find(t => t.value === selectedType)?.label}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Card */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Processed Output</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    AI-generated structured deliverable
                  </CardDescription>
                </div>
                {processedOutput && (
                  <Badge variant="secondary" className="font-normal">
                    {outputTypes.find(t => t.value === selectedType)?.label}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="min-h-[320px] p-4 bg-muted/30 rounded-md border border-border">
                {processedOutput ? (
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
                    {processedOutput}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-20 text-sm">
                    Your processed output will appear here...
                  </p>
                )}
              </div>

              {processedOutput && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <label className="text-sm font-medium text-foreground">Export to Notion</label>
                  <Input
                    placeholder="Enter page title..."
                    value={notionTitle}
                    onChange={(e) => setNotionTitle(e.target.value)}
                    className="border-border"
                  />
                  <Button
                    onClick={handleExportToNotion}
                    disabled={isExporting || !notionTitle.trim()}
                    className="w-full h-10 font-medium"
                    variant="secondary"
                  >
                    {isExporting ? (
                      <>Exporting to Notion...</>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export to Notion
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
