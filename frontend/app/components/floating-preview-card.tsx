"use client";

import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";

const verifications = [
  "Retrieved from Gale Medical Encyclopedia",
  "Verified medical source",
  "Confidence score: 97%",
];

export default function FloatingPreviewCard() {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
        rotate: [0, 0.3, 0, -0.3, 0],
      }}
      transition={{
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="relative w-full max-w-[380px]"
    >
      {/* Glow behind card */}
      <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent blur-2xl" />

      {/* Card */}
      <div className="relative rounded-[24px] bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent-primary/10">
            <Search size={13} className="text-accent-primary" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-tertiary">
            Ask MedBot
          </span>
        </div>

        {/* Query */}
        <p className="text-[17px] font-medium text-text-primary leading-snug mb-6">
          What are the early symptoms of malaria?
        </p>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-5" />

        {/* Verifications */}
        <div className="space-y-3">
          {verifications.map((text, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-accent-secondary/10 shrink-0">
                <Check size={10} className="text-accent-secondary" />
              </div>
              <span className="text-[13px] text-text-secondary leading-snug">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="mt-6 h-[2px] w-16 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary opacity-40" />
      </div>
    </motion.div>
  );
}
