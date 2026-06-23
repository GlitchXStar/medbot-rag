"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="shrink-0 border-t border-white/[0.04] bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-[850px] mx-auto px-4 lg:px-8 py-4">
        <div className="relative flex items-end gap-2 rounded-[28px] bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 input-glow transition-all duration-250">
          {/* Attach button */}
          <button
            type="button"
            className="shrink-0 p-2 text-text-tertiary hover:text-text-secondary transition-all duration-200 rounded-full hover:bg-white/[0.06]"
            aria-label="Attach file"
          >
            <Paperclip size={17} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a medical question..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none py-2 leading-relaxed max-h-[160px]"
          />

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0">
            <AnimatePresence mode="wait">
              {!hasText ? (
                <motion.button
                  key="mic"
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="p-2 text-text-tertiary hover:text-text-secondary transition-all duration-200 rounded-full hover:bg-white/[0.06]"
                  aria-label="Voice input"
                >
                  <Mic size={17} />
                </motion.button>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={handleSend}
              disabled={!hasText}
              animate={{
                scale: hasText ? 1 : 0.85,
                opacity: hasText ? 1 : 0.3,
              }}
              whileTap={hasText ? { scale: 0.9 } : undefined}
              transition={{ duration: 0.15 }}
              className="p-2 rounded-full bg-accent-primary text-white disabled:cursor-not-allowed transition-shadow duration-200 hover:shadow-[0_2px_16px_rgba(37,99,235,0.35)]"
              aria-label="Send message"
            >
              <Send size={15} />
            </motion.button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-text-tertiary text-center mt-2.5 opacity-50">
          MedBot AI provides information for educational purposes only. Always
          consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
