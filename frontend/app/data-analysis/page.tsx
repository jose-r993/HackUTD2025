"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ content: string; source: string }>;
}

export default function DataAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentSummary, setDocumentSummary] = useState<{
    documents_loaded: number;
    total_chunks: number;
  } | null>(null);
  const [chartRequest, setChartRequest] = useState("");
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [generatingChart, setGeneratingChart] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadStatus("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/rag/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadStatus(
        `✓ ${data.filename} uploaded successfully! Created ${data.chunks_created} chunks from ${data.total_characters} characters.`
      );
      
      // Fetch document summary
      fetchDocumentSummary();
      
      // Clear file input
      setFile(null);
    } catch (error) {
      setUploadStatus("✗ Error uploading file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchDocumentSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rag/summary`);
      if (response.ok) {
        const data = await response.json();
        setDocumentSummary(data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/rag/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`${API_URL}/api/rag/reset`, { method: "POST" });
      setMessages([]);
    } catch (error) {
      console.error("Reset error:", error);
    }
  };

  const handleGenerateChart = async () => {
    if (!chartRequest.trim()) return;

    setGeneratingChart(true);
    setChartImage(null);

    try {
      const response = await fetch(`${API_URL}/api/rag/generate-chart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request: chartRequest }),
      });

      if (!response.ok) {
        throw new Error("Chart generation failed");
      }

      const data = await response.json();
      
      if (data.success) {
        setChartImage(data.chart_image);
      } else {
        alert(data.error || "Failed to generate chart");
      }
    } catch (error) {
      console.error("Chart generation error:", error);
      alert("Error generating chart. Please try again.");
    } finally {
      setGeneratingChart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Data Analysis with RAG</h1>
        <p className="text-gray-600 mb-8">
          Upload documents and chat with an AI to extract insights
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
            
            {documentSummary && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  📄 {documentSummary.documents_loaded} document(s) loaded
                </p>
                <p className="text-sm text-blue-900">
                  📊 {documentSummary.total_chunks} chunks indexed
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select File (PDF or TXT)
                </label>
                <Input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              {file && (
                <p className="text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload & Process"}
              </Button>

              {uploadStatus && (
                <p
                  className={`text-sm ${
                    uploadStatus.startsWith("✓")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {uploadStatus}
                </p>
              )}
            </div>
          </Card>

          {/* Chat Section */}
          <Card className="p-6 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chat with Documents</h2>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
              >
                Clear History
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px]">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-lg mb-2">💬 No messages yet</p>
                  <p className="text-sm">
                    Upload a document and start asking questions!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-100 ml-auto max-w-[80%]"
                        : "bg-gray-100 mr-auto max-w-[80%]"
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-semibold mb-2">Sources:</p>
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="text-xs text-gray-600 mb-1">
                            📄 {source.source}: {source.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {loading && (
                <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
                  <p className="font-semibold mb-1">AI Assistant</p>
                  <p className="text-gray-500">Thinking...</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="flex-1"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!question.trim() || loading}
                className="self-end"
              >
                Send
              </Button>
            </div>
          </Card>

          {/* Chart Generation Section */}
          <Card className="p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">📊 Generate Charts from Data</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe the chart you want to create
                </label>
                <Textarea
                  value={chartRequest}
                  onChange={(e) => setChartRequest(e.target.value)}
                  placeholder="Example: Create a bar chart showing the grades distribution, or Create a pie chart of expenses by category"
                  rows={3}
                  disabled={generatingChart}
                />
              </div>

              <Button
                onClick={handleGenerateChart}
                disabled={!chartRequest.trim() || generatingChart}
                className="w-full"
              >
                {generatingChart ? "Generating Chart..." : "🎨 Generate Chart"}
              </Button>

              {chartImage && (
                <div className="mt-4">
                  <img
                    src={chartImage}
                    alt="Generated Chart"
                    className="w-full rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

