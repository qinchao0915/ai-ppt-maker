"use client";
import type { Slide } from "@/types";
import SlideRenderer from "./SlideRenderer";

interface ThumbnailStripProps {
  slides: Slide[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function ThumbnailStrip({
  slides,
  selectedIndex,
  onSelect,
}: ThumbnailStripProps) {
  if (slides.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white p-2">
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          className={`relative shrink-0 overflow-hidden rounded border-2 transition-all ${
            i === selectedIndex
              ? "border-blue-500 shadow-md"
              : "border-transparent hover:border-gray-300"
          }`}
          style={{ width: 120, height: 68 }}
          onClick={() => onSelect(i)}
          aria-label={`Slide ${i + 1}: ${slide.title}`}
          aria-pressed={i === selectedIndex}
        >
          <div
            className="h-full w-full"
            style={{
              transform: "scale(0.25)",
              transformOrigin: "top left",
              width: "400%",
              height: "400%",
            }}
          >
            <SlideRenderer slide={slide} />
          </div>
          <span className="absolute bottom-0.5 right-1 text-[9px] font-medium text-white drop-shadow">
            {i + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
