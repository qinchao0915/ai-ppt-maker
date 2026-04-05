import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { fetchOutline, exportPptx } from "../lib/api";
import type { OutlineItem, Slide } from "../types";

describe("fetchOutline", () => {
  beforeEach(() => mockFetch.mockClear());

  it("calls /api/outline with description", async () => {
    const outline: OutlineItem[] = [{ index: 0, title: "Intro", slide_count: 1 }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ outline }),
    });

    const result = await fetchOutline("test description");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/outline"),
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toEqual(outline);
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 502 });
    await expect(fetchOutline("desc")).rejects.toThrow();
  });
});

describe("exportPptx", () => {
  beforeEach(() => mockFetch.mockClear());

  it("returns a Blob", async () => {
    const blob = new Blob(["fake"], { type: "application/pptx" });
    mockFetch.mockResolvedValueOnce({ ok: true, blob: async () => blob });

    const slide: Slide = {
      id: "s1",
      title: "T",
      bullets: [],
      layout: "title-only",
      style: { theme: "blue", font: "sans" },
      prompt: "p",
    };
    const result = await exportPptx([slide], "Title");
    expect(result).toBeInstanceOf(Blob);
  });
});
