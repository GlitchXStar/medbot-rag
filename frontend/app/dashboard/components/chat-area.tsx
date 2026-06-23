"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";
import MessageBubble from "./message-bubble";
import TypingIndicator from "./typing-indicator";
import type { Message } from "../mock-data";

interface ChatAreaProps {
  messages: Message[];
  chatTitle: string;
  isTyping?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const suggestions = [
  "What are the symptoms of malaria?",
  "How is diabetes diagnosed?",
  "Explain hypertension treatment",
  "Side effects of ibuprofen",
];

export default function ChatArea({
  messages,
  chatTitle,
  isTyping = false,
  onSuggestionClick,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Subtle background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
          }}
          className="relative flex flex-col items-center"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/15 mb-6 shadow-[0_0_24px_rgba(37,99,235,0.1)]">
            <BrainCircuit size={28} className="text-accent-primary" />
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2 tracking-[-0.02em]">
            How can I help you today?
          </h2>
          <p className="text-[14px] text-text-tertiary text-center max-w-sm leading-relaxed">
            Ask any medical question and I&apos;ll provide evidence-backed
            answers with verified source citations.
          </p>

          {/* Suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-10 max-w-lg">
            {suggestions.map((suggestion, i) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3 + i * 0.08,
                  ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
                }}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="group flex items-center gap-2 text-[12px] text-text-secondary bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 rounded-full hover:bg-white/[0.07] hover:text-text-primary hover:border-white/[0.12] transition-all duration-250 hover:-translate-y-[1px]"
              >
                <Sparkles size={11} className="text-text-tertiary group-hover:text-accent-secondary transition-colors" />
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[850px] mx-auto px-4 lg:px-8 py-8 space-y-8">
        {messages.map((message, i) => (
          <MessageBubble key={message.id} message={message} index={i} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
