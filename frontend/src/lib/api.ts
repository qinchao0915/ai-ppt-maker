import type { OutlineItem, Slide } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchOutline(description: string): Promise<OutlineItem[]> {
  const data = await post<{ outline: OutlineItem[] }>("/api/outline", { description });
  return data.outline;
}

export async function* streamSlides(
  outline: OutlineItem[],
  description: string
): AsyncGenerator<Slide> {
  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outline, description }),
  });
  if (!res.ok || !res.body) throw new Error("Generate failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const line = part.replace(/^data: /, "").trim();
      if (line) {
        try {
          yield JSON.parse(line) as Slide;
        } catch {
          // skip malformed
        }
      }
    }
  }
}

export async function regenerateSlide(
  slideId: string,
  prompt: string,
  slideIndex: number,
  description: string
): Promise<Slide> {
  return post<Slide>(`/api/regenerate/${slideId}`, {
    prompt,
    slide_index: slideIndex,
    description,
  });
}

export async function exportPptx(slides: Slide[], title: string): Promise<Blob> {
  const res = await fetch(`${BASE}/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slides, title }),
  });
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}
