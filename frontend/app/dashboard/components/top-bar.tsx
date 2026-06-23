"use client";

import { Menu, Circle } from "lucide-react";

interface TopBarProps {
  chatTitle: string;
  onToggleSidebar: () => void;
}

export default function TopBar({ chatTitle, onToggleSidebar }: TopBarProps) {
  return (
    <header className="h-[70px] shrink-0 flex items-center justify-between px-5 lg:px-8 border-b border-white/[0.04] bg-bg-primary/80 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-text-tertiary hover:text-text-secondary transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em] leading-snug">
            {chatTitle}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-text-tertiary">
              GPT-4 Medical Model
            </span>
            <span className="text-[11px] text-text-tertiary">·</span>
            <div className="flex items-center gap-1">
              <Circle
                size={6}
                fill="#22c55e"
                className="text-green-500"
              />
              <span className="text-[11px] text-green-500/80">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
