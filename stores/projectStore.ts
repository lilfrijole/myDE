import { create } from "zustand";

export interface ProjectFile {
  name: string;
  content: string;
  locked: boolean;
}

interface ProjectState {
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentChatId: string | null;
  files: ProjectFile[];
  activeFileName: string | null;
  openFileNames: string[];
  modifiedFiles: Set<string>;

  setProject: (id: string, name: string, chatId?: string) => void;
  clearProject: () => void;
  setFiles: (files: ProjectFile[]) => void;
  setActiveFile: (name: string) => void;
  openFile: (name: string) => void;
  closeFile: (name: string) => void;
  updateFileContent: (name: string, content: string) => void;
  toggleFileLock: (name: string) => void;
  setChatId: (chatId: string) => void;
  markFileSaved: (name: string) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  currentProjectId: null,
  currentProjectName: null,
  currentChatId: null,
  files: [],
  activeFileName: null,
  openFileNames: [],
  modifiedFiles: new Set<string>(),

  setProject: (id, name, chatId) =>
    set({
      currentProjectId: id,
      currentProjectName: name,
      currentChatId: chatId ?? null,
    }),

  clearProject: () =>
    set({
      currentProjectId: null,
      currentProjectName: null,
      currentChatId: null,
      files: [],
      activeFileName: null,
      openFileNames: [],
      modifiedFiles: new Set(),
    }),

  setFiles: (files) => set({ files }),

  setActiveFile: (name) => {
    const s = get();
    const open = s.openFileNames.includes(name)
      ? s.openFileNames
      : [...s.openFileNames, name];
    set({ activeFileName: name, openFileNames: open });
  },

  openFile: (name) => {
    const s = get();
    if (!s.openFileNames.includes(name)) {
      set({ openFileNames: [...s.openFileNames, name], activeFileName: name });
    } else {
      set({ activeFileName: name });
    }
  },

  closeFile: (name) => {
    const s = get();
    const open = s.openFileNames.filter((n) => n !== name);
    const active =
      s.activeFileName === name
        ? open[open.length - 1] ?? null
        : s.activeFileName;
    const modified = new Set(s.modifiedFiles);
    modified.delete(name);
    set({ openFileNames: open, activeFileName: active, modifiedFiles: modified });
  },

  updateFileContent: (name, content) => {
    const s = get();
    const files = s.files.map((f) =>
      f.name === name ? { ...f, content } : f
    );
    const modified = new Set(s.modifiedFiles);
    modified.add(name);
    set({ files, modifiedFiles: modified });
  },

  toggleFileLock: (name) =>
    set((s) => ({
      files: s.files.map((f) =>
        f.name === name ? { ...f, locked: !f.locked } : f
      ),
    })),

  setChatId: (chatId) => set({ currentChatId: chatId }),

  markFileSaved: (name) => {
    const modified = new Set(get().modifiedFiles);
    modified.delete(name);
    set({ modifiedFiles: modified });
  },
}));
