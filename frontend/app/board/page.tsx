"use client";

import { Card, CardContent } from "@/components/ui/card";
import ExcalidrawComponent from "@/components/Excalidraw";

export default function DrawingBoardPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <ExcalidrawComponent />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}