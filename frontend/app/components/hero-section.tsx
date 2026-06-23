"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FloatingPreviewCard from "./floating-preview-card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background glow - layered for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 45%, rgba(37,99,235,0.07) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 20% 80%, rgba(14,165,233,0.03) 0%, transparent 60%)",
        }}
      />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Gradient line at the very top */}
      <div className="absolute top-[72px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />

      <div className="relative mx-auto max-w-[1280px] w-full px-6 lg:px-10 pt-[72px]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-20 items-center py-16 lg:py-0">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <span className="inline-flex items-center gap-2 text-[12px] font-medium text-accent-secondary bg-accent-primary/[0.08] border border-accent-primary/15 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                Now in Public Beta
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-bold tracking-[-0.03em] leading-[1.06] text-text-primary"
            >
              AI Medical Intelligence,{" "}
              <br className="hidden sm:block" />
              Built for Reliable{" "}
              <br className="hidden lg:block" />
              <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-shift_6s_ease-in-out_infinite]">
                Healthcare Answers.
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[17px] sm:text-lg text-text-secondary leading-relaxed max-w-[520px]"
            >
              Ask medical questions and receive evidence-backed answers powered
              by trusted medical knowledge retrieval. Built on RAG for clinical
              reliability.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/register"
                className="btn-primary inline-flex items-center justify-center text-[14px] font-medium text-white bg-accent-primary px-8 py-3.5 rounded-full"
              >
                Start Free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center text-[14px] font-medium text-text-secondary hover:text-text-primary border border-white/[0.1] hover:border-white/[0.2] px-8 py-3.5 rounded-full transition-all duration-250 hover:-translate-y-[1px]"
              >
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <FloatingPreviewCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
