"use client";

import { FileText, ExternalLink } from "lucide-react";
import type { Source } from "../mock-data";

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="source-card group relative min-w-[260px] max-w-[300px] rounded-2xl bg-white/[0.025] border border-white/[0.06] p-5 hover:bg-white/[0.045] hover:border-accent-primary/15 cursor-pointer">
      {/* Hover glow underlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-primary/[0.03] to-accent-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top row: icon + title */}
      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/10 shrink-0 group-hover:bg-accent-primary/15 transition-colors duration-250">
            <FileText size={13} className="text-accent-primary" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-text-primary leading-snug line-clamp-1">
              {source.title}
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              {source.page}
            </p>
          </div>
        </div>
        <ExternalLink
          size={13}
          className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 mt-1 group-hover:text-accent-secondary"
        />
      </div>

      {/* Excerpt */}
      <p className="relative text-[12px] text-text-secondary leading-relaxed line-clamp-2 mb-3">
        {source.excerpt}
      </p>

      {/* Confidence */}
      <div className="relative flex items-center gap-2">
        <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-700 ease-out"
            style={{ width: `${source.confidence}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-accent-secondary tabular-nums">
          {source.confidence}%
        </span>
      </div>
    </div>
  );
}
