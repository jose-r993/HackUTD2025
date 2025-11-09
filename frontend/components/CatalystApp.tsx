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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Catalyst
          </h1>
        </div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          AI-powered PM productivity agent by NVIDIA Nemotron
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
            <CardDescription>
              Paste your raw meeting notes below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your meeting notes here..."
              className="min-h-[300px] font-mono text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium">Select Output Type</label>
              <div className="grid grid-cols-2 gap-2">
                {outputTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.value}
                      variant={selectedType === type.value ? "default" : "outline"}
                      onClick={() => setSelectedType(type.value as OutputType)}
                      className="justify-start"
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
              className="w-full"
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

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Processed Output</CardTitle>
                <CardDescription>
                  AI-generated structured deliverable
                </CardDescription>
              </div>
              {processedOutput && (
                <Badge variant="secondary">
                  {outputTypes.find(t => t.value === selectedType)?.label}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[300px] p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
              {processedOutput ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {processedOutput}
                </div>
              ) : (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-20">
                  Your processed output will appear here...
                </p>
              )}
            </div>

            {processedOutput && (
              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-medium">Export to Notion</label>
                <Input
                  placeholder="Enter page title..."
                  value={notionTitle}
                  onChange={(e) => setNotionTitle(e.target.value)}
                />
                <Button
                  onClick={handleExportToNotion}
                  disabled={isExporting || !notionTitle.trim()}
                  className="w-full"
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

      <div className="mt-8 text-center text-sm text-zinc-500">
        <p>Powered by NVIDIA Nemotron LLM | Built for HackUTD 2025</p>
      </div>
    </div>
  );
}
