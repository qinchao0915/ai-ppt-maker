import type { Slide } from "@/types";

const THEME_BG: Record<string, string> = {
  blue: "bg-blue-700 text-white",
  dark: "bg-gray-900 text-white",
  minimal: "bg-white text-gray-900",
};

const FONT: Record<string, string> = {
  sans: "font-sans",
  serif: "font-serif",
};

interface SlideRendererProps {
  slide: Slide;
  scale?: number;
}

export default function SlideRenderer({ slide, scale = 1 }: SlideRendererProps) {
  const themeClass = THEME_BG[slide.style.theme] ?? "bg-white text-gray-900";
  const fontClass = FONT[slide.style.font] ?? "font-sans";

  return (
    <div
      className={`flex h-full w-full flex-col ${themeClass} ${fontClass} overflow-hidden rounded`}
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      <div className="flex flex-1 flex-col justify-center px-10 py-8">
        <h1 className="mb-4 text-3xl font-bold leading-tight">
          {slide.title}
        </h1>
        {slide.layout === "title-bullets" && slide.bullets.length > 0 && (
          <ul className="space-y-2">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-lg">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-current opacity-60" />
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
