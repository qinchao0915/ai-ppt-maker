"use client";
import type { Slide } from "@/types";
import PromptCard from "./PromptCard";
import SkeletonCard from "@/components/shared/SkeletonCard";

interface PromptCardListProps {
  slides: Slide[];
  generatingSlideIds: Set<string>;
  pendingCount: number;
  onRegenerate: (slide: Slide) => void;
  onPromptChange: (id: string, prompt: string) => void;
}

export default function PromptCardList({
  slides,
  generatingSlideIds,
  pendingCount,
  onRegenerate,
  onPromptChange,
}: PromptCardListProps) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto p-3">
      {slides.map((slide, i) => (
        <PromptCard
          key={slide.id}
          slide={slide}
          index={i}
          onRegenerate={onRegenerate}
          onPromptChange={onPromptChange}
          isGenerating={generatingSlideIds.has(slide.id)}
        />
      ))}
      {Array.from({ length: pendingCount }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
