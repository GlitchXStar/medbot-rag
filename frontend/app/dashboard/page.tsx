"use client";

import { useState, useCallback } from "react";
import { useAuthGuard } from "../lib/use-auth-guard";
import { apiChat } from "../lib/api";
import Sidebar from "./components/sidebar";
import TopBar from "./components/top-bar";
import ChatArea from "./components/chat-area";
import ChatInput from "./components/chat-input";
import type { Chat, Message } from "./mock-data";

export default function DashboardPage() {
  const { token, loading: authLoading } = useAuthGuard();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0];

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, []);

  // Create an initial empty chat if none exists
  const ensureActiveChat = useCallback(() => {
    if (chats.length === 0) {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: "New Conversation",
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setChats([newChat]);
      setActiveChatId(newChat.id);
      return newChat.id;
    }
    return activeChatId || chats[0]?.id;
  }, [chats, activeChatId]);

  const handleSend = useCallback(
    async (content: string) => {
      const currentChatId = ensureActiveChat();

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== currentChatId) return chat;
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage
              ? content.slice(0, 40) + (content.length > 40 ? "..." : "")
              : chat.title,
            messages: [...chat.messages, userMessage],
          };
        })
      );

      // Show typing indicator
      setIsTyping(true);

      // Call the real RAG API
      const result = await apiChat(content, token || "");

      setIsTyping(false);

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: result.error
          ? `⚠️ **Error:** ${result.error}\n\nPlease try again or check that the backend server is running on port 8080.`
          : result.answer,
        sources: result.error
          ? undefined
          : result.sources?.map((src, i) => ({
              id: src.id || `src-${i}`,
              title: src.title,
              page: src.page,
              excerpt: src.excerpt,
              confidence: src.confidence,
            })),
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    },
    [activeChatId, token, ensureActiveChat]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSend(suggestion);
    },
    [handleSend]
  );

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-primary animate-pulse" />
          <span className="text-text-secondary text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          chatTitle={activeChat?.title || "New Conversation"}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <ChatArea
          messages={activeChat?.messages || []}
          chatTitle={activeChat?.title || "New Conversation"}
          isTyping={isTyping}
          onSuggestionClick={handleSuggestionClick}
        />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
