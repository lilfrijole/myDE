import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  v0ChatId: string | null;
  name: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  demoUrl: string | null;
  versionId: string | null;
  createdAt: string;
}

interface ChatStoreState {
  chats: Record<string, Chat>;
  activeChatId: string | null;

  createChat: (id: string, name?: string) => void;
  renameChat: (chatId: string, name: string) => void;
  deleteChat: (chatId: string) => void;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  setStreaming: (chatId: string, streaming: boolean) => void;
  setV0ChatId: (chatId: string, v0ChatId: string) => void;
  setDemoUrl: (chatId: string, url: string) => void;
  setVersionId: (chatId: string, versionId: string) => void;
  clearChat: (chatId: string) => void;

  getActiveChat: () => Chat | null;
  getChatList: () => { id: string; name: string; createdAt: string; messageCount: number }[];
}

export const useChatStore = create<ChatStoreState>()(persist((set, get) => ({
  chats: {},
  activeChatId: null,

  createChat: (id, name) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [id]: {
          id,
          v0ChatId: null,
          name: name ?? `Project ${Object.keys(s.chats).length + 1}`,
          messages: [],
          isStreaming: false,
          demoUrl: null,
          versionId: null,
          createdAt: new Date().toISOString(),
        },
      },
      activeChatId: id,
    })),

  renameChat: (chatId, name) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return { chats: { ...s.chats, [chatId]: { ...chat, name } } };
    }),

  deleteChat: (chatId) =>
    set((s) => {
      const { [chatId]: _, ...rest } = s.chats;
      const newActive = s.activeChatId === chatId
        ? Object.keys(rest)[0] ?? null
        : s.activeChatId;
      return { chats: rest, activeChatId: newActive };
    }),

  setActiveChat: (id) => set({ activeChatId: id }),

  addMessage: (chatId, message) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return {
        chats: {
          ...s.chats,
          [chatId]: { ...chat, messages: [...chat.messages, message] },
        },
      };
    }),

  setStreaming: (chatId, streaming) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return {
        chats: {
          ...s.chats,
          [chatId]: { ...chat, isStreaming: streaming },
        },
      };
    }),

  setV0ChatId: (chatId, v0ChatId) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return {
        chats: {
          ...s.chats,
          [chatId]: { ...chat, v0ChatId },
        },
      };
    }),

  setDemoUrl: (chatId, url) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return {
        chats: {
          ...s.chats,
          [chatId]: { ...chat, demoUrl: url },
        },
      };
    }),

  setVersionId: (chatId, versionId) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return {
        chats: {
          ...s.chats,
          [chatId]: { ...chat, versionId },
        },
      };
    }),

  clearChat: (chatId) =>
    set((s) => {
      const chat = s.chats[chatId];
      if (!chat) return s;
      return {
        chats: {
          ...s.chats,
          [chatId]: {
            ...chat,
            v0ChatId: null,
            messages: [],
            isStreaming: false,
            demoUrl: null,
            versionId: null,
          },
        },
      };
    }),

  getActiveChat: () => {
    const s = get();
    if (!s.activeChatId) return null;
    return s.chats[s.activeChatId] ?? null;
  },

  getChatList: () => {
    const s = get();
    return Object.values(s.chats)
      .map((c) => ({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        messageCount: c.messages.filter((m) => m.role !== "system").length,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
}), { name: "myde-chats" }));
