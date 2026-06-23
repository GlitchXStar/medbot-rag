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
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const features = [
  {
    icon: Brain,
    title: "Medical Knowledge Retrieval",
    description:
      "MedBot uses Retrieval Augmented Generation to pull precise medical context from verified encyclopedias and clinical databases. Every answer is grounded in real medical literature — not fabricated from training data.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence-backed AI Responses",
    description:
      "Unlike general-purpose chatbots, MedBot anchors every response to retrieved medical passages. The model reasons over evidence, not memory, ensuring clinical-grade accuracy and reducing hallucination risk.",
  },
  {
    icon: FileText,
    title: "Transparent Source Citations",
    description:
      "Every response includes source cards showing the exact reference, page number, relevant excerpt, and confidence score. You can verify every claim against the original medical source.",
  },
  {
    icon: MessageSquare,
    title: "Multi-turn Medical Conversations",
    description:
      "Ask follow-up questions, request clarification, or dive deeper into a topic. MedBot maintains full conversational context across turns for thorough medical inquiry.",
  },
  {
    icon: Zap,
    title: "Fast Pinecone Vector Retrieval",
    description:
      "Sub-second semantic search across millions of medical knowledge embeddings powered by Pinecone. The most relevant passages are retrieved before the model even begins generating.",
  },
  {
    icon: Lock,
    title: "Secure Authenticated Sessions",
    description:
      "Your medical queries are private. MedBot uses encrypted, authenticated sessions with token-based access control. No query data is shared or stored beyond your session.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="py-[120px]">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            {/* Header */}
            <div className="text-center mb-24">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent-primary mb-4"
              >
                Features
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="text-[2.75rem] sm:text-[3.5rem] font-bold tracking-[-0.03em] text-text-primary"
              >
                What Makes MedBot Different
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 text-text-secondary text-[17px] max-w-xl mx-auto leading-relaxed"
              >
                Every capability is designed around one principle — medical
                answers should be evidence-backed, transparent, and verifiable.
              </motion.p>
            </div>

            {/* Feature Blocks */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-0"
            >
              {features.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className={`group flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-16 ${
                    i < features.length - 1
                      ? "border-b border-white/[0.04]"
                      : ""
                  }`}
                >
                  {/* Icon + Title */}
                  <div className="lg:w-[320px] shrink-0">
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="text-accent-primary mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <h2 className="text-xl font-semibold text-text-primary tracking-[-0.02em]">
                      {title}
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-[15px] text-text-secondary leading-[1.8] max-w-[560px]">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
