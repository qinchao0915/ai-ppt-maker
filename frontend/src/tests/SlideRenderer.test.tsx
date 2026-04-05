import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SlideRenderer from "../components/right/SlideRenderer";
import type { Slide } from "../types";

const slide: Slide = {
  id: "s1",
  title: "Hello World",
  bullets: ["First point", "Second point"],
  layout: "title-bullets",
  style: { theme: "blue", font: "sans" },
  prompt: "test",
};

describe("SlideRenderer", () => {
  it("renders slide title", () => {
    render(<SlideRenderer slide={slide} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders all bullets", () => {
    render(<SlideRenderer slide={slide} />);
    expect(screen.getByText("First point")).toBeInTheDocument();
    expect(screen.getByText("Second point")).toBeInTheDocument();
  });

  it("renders title-only layout without bullets", () => {
    const s = { ...slide, layout: "title-only" as const, bullets: [] };
    render(<SlideRenderer slide={s} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("applies blue theme background class", () => {
    const { container } = render(<SlideRenderer slide={slide} />);
    expect(container.firstChild).toHaveClass("bg-blue-700");
  });
});
