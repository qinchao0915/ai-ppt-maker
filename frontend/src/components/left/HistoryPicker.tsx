"use client";
import { useEffect, useState } from "react";
import type { ProjectRecord } from "@/types";
import { getProjects } from "@/lib/db";
import { getDeviceId } from "@/lib/deviceId";

interface HistoryPickerProps {
  onSelect: (project: ProjectRecord) => void;
}

export default function HistoryPicker({ onSelect }: HistoryPickerProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    getProjects(deviceId).then(setProjects).catch(console.error);
  }, []);

  if (projects.length === 0) return null;

  return (
    <div className="relative p-3">
      <button
        className="flex min-h-[36px] w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-gray-600">历史记录</span>
        <span className="text-gray-400">{open ? "▲" : "▾"}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-3 right-3 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {projects.map((p) => (
            <li key={p.id}>
              <button
                role="option"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => {
                  onSelect(p);
                  setOpen(false);
                }}
              >
                <span className="block truncate font-medium">{p.title}</span>
                <span className="block text-xs text-gray-400">
                  {new Date(p.updatedAt).toLocaleDateString("zh-CN")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
