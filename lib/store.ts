import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project, Bot, User } from "@/types"

interface AppState {
  // User state
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Projects state
  projects: Project[]
  currentProject: Project | null
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void

  // Bots state
  currentBot: Bot | null
  setCurrentBot: (bot: Bot | null) => void
  addBot: (bot: Bot) => void
  updateBot: (botId: string, updates: Partial<Bot>) => void
  deleteBot: (botId: string) => void

  // UI state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // Projects state
      projects: [],
      currentProject: null,
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p)),
          currentProject:
            state.currentProject?.id === projectId ? { ...state.currentProject, ...updates } : state.currentProject,
        })),
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        })),

      // Bots state
      currentBot: null,
      setCurrentBot: (bot) => set({ currentBot: bot }),
      addBot: (bot) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === bot.projectId ? { ...p, bots: [...p.bots, bot] } : p)),
          currentProject:
            state.currentProject?.id === bot.projectId
              ? { ...state.currentProject, bots: [...state.currentProject.bots, bot] }
              : state.currentProject,
        })),
      updateBot: (botId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            bots: p.bots.map((b) => (b.id === botId ? { ...b, ...updates } : b)),
          })),
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                bots: state.currentProject.bots.map((b) => (b.id === botId ? { ...b, ...updates } : b)),
              }
            : null,
          currentBot: state.currentBot?.id === botId ? { ...state.currentBot, ...updates } : state.currentBot,
        })),
      deleteBot: (botId) =>
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            bots: p.bots.filter((b) => b.id !== botId),
          })),
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                bots: state.currentProject.bots.filter((b) => b.id !== botId),
              }
            : null,
          currentBot: state.currentBot?.id === botId ? null : state.currentBot,
        })),

      // UI state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "chatbot-saas-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        projects: state.projects,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
)
