"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, FileText, Zap } from "lucide-react";

const pills = [
  { label: "RAG Powered", icon: Cpu },
  { label: "Verified Sources", icon: ShieldCheck },
  { label: "Evidence Based", icon: FileText },
  { label: "Low Hallucination", icon: Zap },
];

export default function TrustSection() {
  return (
    <section className="relative py-12 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {pills.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide text-text-secondary bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 rounded-full"
            >
              <Icon size={13} className="text-text-tertiary" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
