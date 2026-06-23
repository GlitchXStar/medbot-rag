"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  Database,
  BrainCircuit,
  MessageSquareText,
  FileCheck,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "User Query",
    description: "You ask a medical question in natural language.",
  },
  {
    icon: Database,
    title: "Retrieve Medical Context",
    description:
      "Pinecone vector search finds the most relevant passages from verified medical sources.",
  },
  {
    icon: BrainCircuit,
    title: "AI Reasoning",
    description:
      "The language model reasons over retrieved context — not from memory, from evidence.",
  },
  {
    icon: MessageSquareText,
    title: "Generate Trusted Response",
    description:
      "A grounded, evidence-backed answer is synthesized with medical precision.",
  },
  {
    icon: FileCheck,
    title: "Show Citations",
    description:
      "Source cards display the exact references, page numbers, and confidence scores.",
  },
];

export default function ProductShowcaseSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-[120px]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent-primary mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="text-[2.5rem] sm:text-[3rem] font-bold tracking-[-0.03em] text-text-primary"
          >
            From Question to Citation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-text-secondary text-[17px] max-w-lg mx-auto"
          >
            A transparent pipeline you can trust — every step is traceable.
          </motion.p>
        </div>

        {/* Pipeline */}
        <div
          ref={containerRef}
          className="relative max-w-[560px] mx-auto"
        >
          {/* Vertical line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/[0.06]">
            <motion.div
              className="w-full bg-gradient-to-b from-accent-primary/50 to-accent-secondary/30 origin-top"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.8, ease: [0.25, 0.4, 0.25, 1], delay: 0.3 }}
              style={{ height: "100%" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.18,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="relative flex gap-5 py-5"
              >
                {/* Step node */}
                <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] shrink-0 rounded-full border border-accent-primary/30 bg-bg-primary">
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className="text-accent-primary"
                  />
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="text-[15px] font-semibold text-text-primary mb-1.5 tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed max-w-[400px]">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
