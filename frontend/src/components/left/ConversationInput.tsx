"use client";
import { useState } from "react";

interface ConversationInputProps {
  onSubmit: (description: string) => void;
  disabled: boolean;
}

export default function ConversationInput({ onSubmit, disabled }: ConversationInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 p-3">
      <textarea
        className="min-h-[80px] w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="描述你的 PPT 需求，例如：帮我做一个关于 AI 的10页演示文稿"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="输入 PPT 描述"
      />
      <button
        className="min-h-[44px] rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="发送"
      >
        发送
      </button>
    </div>
  );
}
