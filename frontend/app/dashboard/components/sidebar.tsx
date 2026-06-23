"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import clsx from "clsx";
import type { Chat } from "../mock-data";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:relative top-0 left-0 z-50 lg:z-auto h-full w-[280px] shrink-0 flex flex-col bg-[#0B1120] border-r border-white/[0.06] transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[70px] border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-text-primary">
              MedBot
            </span>
            <span className="text-[15px] font-light tracking-[-0.02em] text-text-secondary">
              AI
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-text-tertiary hover:text-text-secondary transition-colors rounded-lg hover:bg-white/[0.04]"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 h-[42px] px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200 active:scale-[0.98]"
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary px-2 mb-2">
            Recent
          </p>
          <div className="space-y-0.5">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  onClose();
                }}
                className={clsx(
                  "group w-full flex items-center gap-2.5 h-[40px] px-3 rounded-lg text-[13px] transition-all duration-150 text-left truncate",
                  activeChatId === chat.id
                    ? "bg-white/[0.07] text-text-primary font-medium border-l-2 border-accent-primary rounded-l-none"
                    : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                )}
              >
                <MessageSquare
                  size={14}
                  className={clsx(
                    "shrink-0 transition-colors",
                    activeChatId === chat.id
                      ? "text-accent-primary opacity-80"
                      : "opacity-40 group-hover:opacity-60"
                  )}
                />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/[0.04] px-3 py-3 space-y-0.5">
          <button className="w-full flex items-center gap-2.5 h-[38px] px-3 rounded-lg text-[13px] text-text-secondary hover:bg-white/[0.04] hover:text-text-primary transition-all duration-150">
            <Settings size={14} className="opacity-50" />
            Settings
          </button>
          <button className="w-full flex items-center gap-2.5 h-[38px] px-3 rounded-lg text-[13px] text-text-secondary hover:bg-red-500/[0.06] hover:text-red-400 transition-all duration-150">
            <LogOut size={14} className="opacity-50" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
