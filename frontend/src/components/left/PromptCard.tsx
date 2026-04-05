"use client";
import type { Slide } from "@/types";

interface PromptCardProps {
  slide: Slide;
  index: number;
  onRegenerate: (slide: Slide) => void;
  onPromptChange: (id: string, prompt: string) => void;
  isGenerating: boolean;
}

export default function PromptCard({
  slide,
  index,
  onRegenerate,
  onPromptChange,
  isGenerating,
}: PromptCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">Slide {index + 1}</span>
        <button
          className="min-h-[32px] rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          onClick={() => onRegenerate(slide)}
          disabled={isGenerating}
          aria-label="重新生成"
        >
          ↺ 重新生成
        </button>
      </div>
      <p className="mb-1 text-xs font-medium text-gray-800 truncate">{slide.title}</p>
      <textarea
        className="w-full resize-none rounded border border-gray-200 p-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        value={slide.prompt}
        onChange={(e) => onPromptChange(slide.id, e.target.value)}
        disabled={isGenerating}
        aria-label={`Slide ${index + 1} prompt`}
      />
    </div>
  );
}
