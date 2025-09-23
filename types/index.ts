export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  ownerId: string
  members: ProjectMember[]
  bots: Bot[]
}

export interface ProjectMember {
  userId: string
  user: User
  role: "owner" | "editor" | "viewer"
  joinedAt: Date
}

export interface Bot {
  id: string
  name: string
  displayName: string
  description?: string
  welcomeMessage: string
  themeColor: string
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  projectId: string
  apiKey: string
  isActive: boolean
  llmModel?: string
  createdAt: Date
  updatedAt: Date
  analytics: BotAnalytics
  files: BotFile[]
  conversations: Conversation[]
}

export interface BotAnalytics {
  totalConversations: number
  activeUsers: number
  averageResponseTime: number
  dailyStats: DailyStats[]
  weeklyStats: WeeklyStats[]
  monthlyStats: MonthlyStats[]
}

export interface DailyStats {
  date: string
  conversations: number
  users: number
  messages: number
}

export interface WeeklyStats {
  week: string
  conversations: number
  users: number
  messages: number
}

export interface MonthlyStats {
  month: string
  conversations: number
  users: number
  messages: number
}

export interface BotFile {
  id: string
  name: string
  type: "pdf" | "image" | "audio" | "text"
  url: string
  size: number
  uploadedAt: Date
}

export interface Conversation {
  id: string
  botId: string
  userId?: string
  messages: Message[]
  startedAt: Date
  lastMessageAt: Date
  isActive: boolean
}

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  conversationId: string
}

export interface EmbedConfig {
  botId: string
  apiKey: string
  position: Bot["position"]
  themeColor: string
  welcomeMessage: string
  customCSS?: string
}
