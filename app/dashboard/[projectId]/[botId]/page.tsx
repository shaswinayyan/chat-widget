"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BotDetail } from "@/components/dashboard/bot/bot-detail"

export default function BotDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const botId = params.botId as string
  
  const { projects, currentProject, setCurrentProject, currentBot, setCurrentBot } = useAppStore()

  useEffect(() => {
    // Find the project
    const project = projects.find(p => p.id === projectId)
    if (!project) {
      router.push('/dashboard')
      return
    }

    // Set current project if not already set
    if (!currentProject || currentProject.id !== projectId) {
      setCurrentProject(project)
    }

    // Find the bot within the project
    const bot = project.bots.find(b => b.id === botId)
    if (!bot) {
      router.push(`/dashboard/${projectId}`)
      return
    }

    // Set current bot
    setCurrentBot(bot)
  }, [projectId, botId, projects, currentProject, setCurrentProject, setCurrentBot, router])

  if (!currentProject || !currentBot || currentBot.id !== botId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading bot...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <BotDetail 
        bot={currentBot}
        project={currentProject}
        onBack={() => {
          setCurrentBot(null)
          router.push(`/dashboard/${projectId}`)
        }}
      />
    </DashboardLayout>
  )
}