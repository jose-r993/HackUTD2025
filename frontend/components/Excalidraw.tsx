"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useState } from "react";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

interface ExcalidrawComponentProps {
    mermaidCode?: string | null;
}

export default function ExcalidrawComponent({ mermaidCode }: ExcalidrawComponentProps) {
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (mermaidCode && excalidrawAPI) {
            setIsLoading(true);
            // Parse mermaid to Excalidraw skeleton elements (async)
            parseMermaidToExcalidraw(mermaidCode, { fontSize: 20 })
                .then(({ elements }) => {
                    // Convert skeleton elements to full Excalidraw elements
                    const excalidrawElements = convertToExcalidrawElements(elements);
                    
                    // Update the Excalidraw scene with the new elements
                    excalidrawAPI.updateScene({
                        elements: excalidrawElements,
                    });
                })
                .catch((error) => {
                    console.error("Error converting Mermaid to Excalidraw:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [mermaidCode, excalidrawAPI]);

    return (
        <div style={{ width: "100%", height: "650px", position: "relative" }}>
            {isLoading && (
                <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "14px"
                }}>
                    Converting diagram...
                </div>
            )}
            <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
            />
        </div>
    );
}