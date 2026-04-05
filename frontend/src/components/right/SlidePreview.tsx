"use client";
import type { Slide } from "@/types";
import SlideRenderer from "./SlideRenderer";

interface SlidePreviewProps {
  slide: Slide | null;
  onUpdateSlide?: (id: string, patch: Partial<Slide>) => void;
}

export default function SlidePreview({ slide, onUpdateSlide }: SlidePreviewProps) {
  if (!slide) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p>选择或生成幻灯片以预览</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-2xl"
        style={{ aspectRatio: "16/9" }}
      >
        <SlideRenderer slide={slide} />
        <div
          className="absolute inset-0 cursor-text"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "H1" && onUpdateSlide) {
              target.contentEditable = "true";
              target.focus();
              target.onblur = () => {
                target.contentEditable = "false";
                onUpdateSlide(slide.id, { title: target.textContent ?? slide.title });
              };
            }
          }}
        />
      </div>
    </div>
  );
}
