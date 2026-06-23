"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-[120px]">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="text-center"
        >
          <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold tracking-[-0.03em] text-text-primary mb-5">
            Ready to Experience{" "}
            <br className="hidden sm:block" />
            Reliable Medical AI?
          </h2>
          <p className="text-text-secondary text-[17px] mb-10 max-w-md mx-auto">
            Join healthcare professionals using evidence-backed AI for trusted
            medical answers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center text-[14px] font-medium text-white bg-accent-primary hover:bg-accent-primary/90 px-8 py-3.5 rounded-full transition-all duration-250 hover:-translate-y-[1px] hover:shadow-[0_6px_24px_rgba(37,99,235,0.35)]"
            >
              Start Free
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center text-[14px] font-medium text-text-secondary hover:text-text-primary border border-white/[0.1] hover:border-white/[0.2] px-8 py-3.5 rounded-full transition-all duration-250 hover:-translate-y-[1px]"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
