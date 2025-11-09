"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIPromptInputProps {
  onSubmit?: (prompt: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function AIPromptInput({
  onSubmit,
  placeholder = "Enter your AI prompt here...",
  className,
  disabled = false,
}: AIPromptInputProps) {
  const [prompt, setPrompt] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || disabled || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(prompt);
      setPrompt("");
    } catch (error) {
      console.error("Error submitting prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className="min-h-[80px] resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!prompt.trim() || disabled || isSubmitting}
          size="default"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}