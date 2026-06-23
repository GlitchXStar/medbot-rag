"use client";

import { motion } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  FileText,
  MessageSquare,
  Zap,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Medical Knowledge Retrieval",
    description:
      "Retrieves precise medical context from verified encyclopedias and clinical databases using vector search.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence-backed AI",
    description:
      "Every response is grounded in retrieved medical literature — not hallucinated from training data.",
  },
  {
    icon: FileText,
    title: "Source Citations",
    description:
      "Transparent source attribution with page numbers, confidence scores, and direct excerpt previews.",
  },
  {
    icon: MessageSquare,
    title: "Multi-turn Conversations",
    description:
      "Maintains context across follow-up questions for deeper medical inquiry and clarification.",
  },
  {
    icon: Zap,
    title: "Fast Pinecone Retrieval",
    description:
      "Sub-second vector search across millions of medical knowledge embeddings for instant context retrieval.",
  },
  {
    icon: Lock,
    title: "Secure User Sessions",
    description:
      "End-to-end encrypted sessions with authenticated access. Your medical queries stay private.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-[120px]">
      {/* Subtle background variation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(37,99,235,0.03) 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent-primary mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-[2.5rem] sm:text-[3rem] font-bold tracking-[-0.03em] text-text-primary"
          >
            Built for Clinical Reliability
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-text-secondary text-[17px] max-w-lg mx-auto"
          >
            Every component is designed around trust, accuracy, and medical-grade
            reliability.
          </motion.p>
        </div>

        {/* Feature Grid — Linear.app divider-line pattern */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-white/[0.04] overflow-hidden"
        >
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className={`group relative p-10 lg:p-12 transition-colors duration-300 hover:bg-white/[0.02] ${
                /* Right borders for left/center columns */
                i % 3 !== 2 ? "lg:border-r border-white/[0.04]" : ""
              } ${
                /* Bottom borders for top row */
                i < 3 ? "border-b border-white/[0.04]" : ""
              } ${
                /* Mobile: all but last get bottom border */
                i < 5 ? "max-lg:border-b max-lg:border-white/[0.04]" : ""
              }`}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className="text-accent-primary mb-5 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <h3 className="text-[15px] font-semibold text-text-primary mb-3 tracking-[-0.01em]">
                {title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed max-w-[280px]">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
