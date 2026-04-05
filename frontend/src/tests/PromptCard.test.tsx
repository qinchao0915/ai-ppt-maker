import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PromptCard from "../components/left/PromptCard";
import type { Slide } from "../types";

const slide: Slide = {
  id: "s1",
  title: "Introduction",
  bullets: ["Point A"],
  layout: "title-bullets",
  style: { theme: "blue", font: "sans" },
  prompt: "An intro slide about AI",
};

describe("PromptCard", () => {
  it("renders slide title and prompt", () => {
    render(<PromptCard slide={slide} index={0} onRegenerate={vi.fn()} onPromptChange={vi.fn()} isGenerating={false} />);
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("An intro slide about AI")).toBeInTheDocument();
  });

  it("calls onRegenerate when ↺ clicked", async () => {
    const onRegenerate = vi.fn();
    render(<PromptCard slide={slide} index={0} onRegenerate={onRegenerate} onPromptChange={vi.fn()} isGenerating={false} />);
    await userEvent.click(screen.getByRole("button", { name: /重新生成/i }));
    expect(onRegenerate).toHaveBeenCalledWith(slide);
  });

  it("disables ↺ when isGenerating=true", () => {
    render(<PromptCard slide={slide} index={0} onRegenerate={vi.fn()} onPromptChange={vi.fn()} isGenerating={true} />);
    expect(screen.getByRole("button", { name: /重新生成/i })).toBeDisabled();
  });

  it("calls onPromptChange when textarea changes", async () => {
    const onPromptChange = vi.fn();
    render(<PromptCard slide={slide} index={0} onRegenerate={vi.fn()} onPromptChange={onPromptChange} isGenerating={false} />);
    const textarea = screen.getByDisplayValue("An intro slide about AI");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "New prompt");
    expect(onPromptChange).toHaveBeenCalled();
  });
});
