"use client";
import { useState } from "react";
import type { Slide } from "@/types";
import { exportPptx } from "@/lib/api";

interface ExportButtonProps {
  slides: Slide[];
  title: string;
}

export default function ExportButton({ slides, title }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    if (slides.length === 0) return;
    setIsExporting(true);
    try {
      const blob = await exportPptx(slides, title);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("导出失败，请重试");
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      className="min-h-[44px] rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
      onClick={handleExport}
      disabled={slides.length === 0 || isExporting}
      aria-label="导出 .pptx"
    >
      {isExporting ? "导出中..." : "导出 .pptx"}
    </button>
  );
}
