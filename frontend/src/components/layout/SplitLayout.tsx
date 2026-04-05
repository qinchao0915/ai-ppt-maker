import React from "react";

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-[400px] min-w-[320px] flex-col border-r border-gray-200 bg-white">
        {left}
      </div>
      <div className="flex flex-1 flex-col bg-gray-50">
        {right}
      </div>
    </div>
  );
}
