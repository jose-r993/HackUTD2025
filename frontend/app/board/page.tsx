"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eraser, Download, Trash2, Pencil } from "lucide-react";

export default function DrawingBoardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#1A73E8");
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial canvas background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "white" : color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 3 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "drawing-board.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = [
    { name: "Blue", value: "#1A73E8" },
    { name: "Red", value: "#EA4335" },
    { name: "Green", value: "#34A853" },
    { name: "Yellow", value: "#FBBC04" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Black", value: "#000000" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drawing Board</h1>
          <p className="text-muted-foreground">
            Sketch ideas, wireframes, and diagrams
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Canvas */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-[600px] cursor-crosshair border border-border"
              />
            </CardContent>
          </Card>

          {/* Tools Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Drawing Tool</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={tool === "pen" ? "default" : "outline"}
                      onClick={() => setTool("pen")}
                      className="justify-start"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Pen
                    </Button>
                    <Button
                      variant={tool === "eraser" ? "default" : "outline"}
                      onClick={() => setTool("eraser")}
                      className="justify-start"
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      Eraser
                    </Button>
                  </div>
                </div>

                {/* Color Selection */}
                {tool === "pen" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setColor(c.value)}
                          className={`h-10 rounded-md border-2 transition-all ${
                            color === c.value
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-border"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Line Width */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {tool === "pen" ? "Line" : "Eraser"} Width: {lineWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Canvas
                </Button>
                <Button
                  onClick={downloadCanvas}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> Use the drawing board to sketch wireframes, create diagrams, or brainstorm ideas during meetings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
