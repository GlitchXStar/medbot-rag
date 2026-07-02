"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuthGuard } from "../lib/use-auth-guard";
import {
  apiChat,
  apiCreateSession,
  apiGetChatHistory,
  apiGetSessionMessages,
  apiDeleteChatSession,
} from "../lib/api";
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

  useEffect(() => {
    const loadChats = async () => {
      if (!token) return;

      const data = await apiGetChatHistory(token);

      if (data.chats) {
        const formattedChats = data.chats.map((chat: any) => ({
          id: chat.id,
          title: chat.title || "New Conversation",
          messages: [],
          createdAt: chat.created_at,
        }));

        setChats(formattedChats);

        if (formattedChats.length > 0) {
          setActiveChatId(formattedChats[0].id);
        }
      }
    };

    loadChats();
  }, [token]);

  const handleNewChat = useCallback(async () => {
    const session = await apiCreateSession(token || "");

    const newChat: Chat = {
      id: session.session_id,
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, [token]);

  const handleSelectChat = useCallback(
    async (chatId: string) => {
      setActiveChatId(chatId);

      const data = await apiGetSessionMessages(chatId, token || "");

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: data.messages.map((msg: any, index: number) => ({
                  id: `msg-${index}`,
                  role: msg.role,
                  content: msg.content,
                  sources: msg.sources,
                  timestamp: msg.timestamp || new Date().toISOString(),
                })),
              }
            : chat
        )
      );
    },
    [token]
  );

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      const result = await apiDeleteChatSession(chatId, token || "");

      if (result.success) {
        const updatedChats = chats.filter((chat) => chat.id !== chatId);

        setChats(updatedChats);

        if (activeChatId === chatId) {
          if (updatedChats.length > 0) {
            setActiveChatId(updatedChats[0].id);
          } else {
            setActiveChatId("");
          }
        }
      }
    },
    [token, chats, activeChatId]
  );

  const ensureActiveChat = useCallback(async () => {
    if (chats.length === 0) {
      const session = await apiCreateSession(token || "");

      const newChat: Chat = {
        id: session.session_id,
        title: "New Conversation",
        messages: [],
        createdAt: new Date().toISOString(),
      };

      setChats([newChat]);
      setActiveChatId(newChat.id);
      return newChat.id;
    }

    return activeChatId || chats[0]?.id;
  }, [chats, activeChatId, token]);

  const handleSend = useCallback(
    async (content: string) => {
      const currentChatId = await ensureActiveChat();

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

      setIsTyping(true);

      const result = await apiChat(currentChatId, content, token || "");

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
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
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