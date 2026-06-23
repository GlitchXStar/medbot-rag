"use client";

import { motion } from "framer-motion";
import { User, BrainCircuit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SourceCard from "./source-card";
import type { Message } from "../mock-data";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      }}
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex items-start pt-1 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 shadow-[0_0_12px_rgba(37,99,235,0.08)]">
            <BrainCircuit size={15} className="text-accent-primary" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] lg:max-w-[75%]`}>
        {/* Label */}
        <span className="text-[11px] font-medium text-text-tertiary mb-1.5 px-1">
          {isUser ? "You" : "MedBot AI"}
        </span>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? "bg-accent-primary text-white rounded-br-md shadow-[0_4px_16px_rgba(37,99,235,0.2)]"
              : "bg-white/[0.03] border border-white/[0.06] text-text-primary rounded-bl-md"
          }`}
        >
          {/* Render content with basic markdown-like formatting */}
          <div className={`text-[14px] leading-[1.75] ${isUser ? "" : "prose prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"}`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        </div>

        {/* Source Cards */}
        {message.sources && message.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mt-3 w-full"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary mb-2.5 px-1 flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-accent-secondary" />
              Sources
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {message.sources.map((source, si) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.2 + si * 0.08 }}
                >
                  <SourceCard source={source} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex items-start pt-1 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <User size={15} className="text-text-secondary" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
