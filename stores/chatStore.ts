import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  demoUrl: string | null;
  versionId: string | null;
}

interface ChatStoreState {
  chats: Record<string, Chat>;
  activeChatId: string | null;

  createChat: (id: string) => void;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  setStreaming: (chatId: string, streaming: boolean) => void;
  setDemoUrl: (chatId: string, url: string) => void;
  setVersionId: (chatId: string, versionId: string) => void;
  clearChat: (chatId: string) => void;

  getActiveChat: () => Chat | null;
}

export const useChatStore = create<ChatStoreState>()((set, get) => ({
  chats: {},
  activeChatId: null,

  createChat: (id) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [id]: {
          id,
          messages: [],
          isStreaming: false,
          demoUrl: null,
          versionId: null,
        },
      },
      activeChatId: id,
    })),

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
}));
