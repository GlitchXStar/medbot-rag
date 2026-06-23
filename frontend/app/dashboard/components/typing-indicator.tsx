"use client";

import { BrainCircuit } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 justify-start animate-message-in">
      {/* AI Avatar */}
      <div className="flex items-start pt-1 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/20">
          <BrainCircuit size={15} className="text-accent-primary" />
        </div>
      </div>

      <div className="flex flex-col items-start">
        <span className="text-[11px] font-medium text-text-tertiary mb-1.5 px-1">
          MedBot AI
        </span>
        <div className="rounded-2xl rounded-bl-md bg-white/[0.03] border border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-1.5">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
