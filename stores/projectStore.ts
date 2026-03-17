import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProjectFile {
  name: string;
  content: string;
  locked: boolean;
}

export interface SavedProject {
  id: string;
  name: string;
  chatId: string | null;
  files: ProjectFile[];
  activeFileName: string | null;
  openFileNames: string[];
  savedAt: string;
}

interface ProjectState {
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentChatId: string | null;
  files: ProjectFile[];
  activeFileName: string | null;
  openFileNames: string[];
  modifiedFiles: Set<string>;
  savedProjects: SavedProject[];

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
  saveCurrentProject: () => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
}

export const useProjectStore = create<ProjectState>()(persist((set, get) => ({
  currentProjectId: null,
  currentProjectName: null,
  currentChatId: null,
  files: [],
  activeFileName: null,
  openFileNames: [],
  modifiedFiles: new Set<string>(),
  savedProjects: [],

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

  saveCurrentProject: () => {
    const s = get();
    if (!s.currentChatId && !s.files.length) return;

    const id = s.currentProjectId ?? s.currentChatId ?? `proj-${Date.now()}`;
    const name = s.currentProjectName ?? "Untitled Project";

    const existing = s.savedProjects.filter((p) => p.id !== id);
    const project: SavedProject = {
      id,
      name,
      chatId: s.currentChatId,
      files: s.files,
      activeFileName: s.activeFileName,
      openFileNames: s.openFileNames,
      savedAt: new Date().toISOString(),
    };

    set({
      currentProjectId: id,
      currentProjectName: name,
      savedProjects: [project, ...existing],
    });
  },

  loadProject: (projectId) => {
    const s = get();
    const project = s.savedProjects.find((p) => p.id === projectId);
    if (!project) return;

    if (s.currentProjectId || s.files.length) {
      s.saveCurrentProject();
    }

    set({
      currentProjectId: project.id,
      currentProjectName: project.name,
      currentChatId: project.chatId,
      files: project.files,
      activeFileName: project.activeFileName,
      openFileNames: project.openFileNames,
      modifiedFiles: new Set(),
    });
  },

  deleteProject: (projectId) => {
    set((s) => ({
      savedProjects: s.savedProjects.filter((p) => p.id !== projectId),
    }));
  },
}), {
  name: "myde-project",
  storage: {
    getItem: (name) => {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.state?.modifiedFiles) {
        parsed.state.modifiedFiles = new Set(parsed.state.modifiedFiles);
      }
      return parsed;
    },
    setItem: (name, value) => {
      const toStore = {
        ...value,
        state: {
          ...value.state,
          modifiedFiles: [...value.state.modifiedFiles],
        },
      };
      localStorage.setItem(name, JSON.stringify(toStore));
    },
    removeItem: (name) => localStorage.removeItem(name),
  },
}));
