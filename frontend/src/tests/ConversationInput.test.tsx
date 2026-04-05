import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConversationInput from "../components/left/ConversationInput";

describe("ConversationInput", () => {
  it("renders textarea and send button", () => {
    render(<ConversationInput onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /发送/i })).toBeInTheDocument();
  });

  it("calls onSubmit with trimmed text on button click", async () => {
    const onSubmit = vi.fn();
    render(<ConversationInput onSubmit={onSubmit} disabled={false} />);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "  Make a PPT about AI  ");
    fireEvent.click(screen.getByRole("button", { name: /发送/i }));
    expect(onSubmit).toHaveBeenCalledWith("Make a PPT about AI");
  });

  it("disables send when disabled=true", () => {
    render(<ConversationInput onSubmit={vi.fn()} disabled={true} />);
    expect(screen.getByRole("button", { name: /发送/i })).toBeDisabled();
  });

  it("does not submit empty input", async () => {
    const onSubmit = vi.fn();
    render(<ConversationInput onSubmit={onSubmit} disabled={false} />);
    fireEvent.click(screen.getByRole("button", { name: /发送/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
