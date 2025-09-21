"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { mockProjects, mockUser } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { BotManagement } from "@/components/dashboard/bot-management"

export default function DashboardPage() {
  const { currentUser, setCurrentUser, projects, setProjects, currentProject, currentBot } = useAppStore()

  // Initialize with mock data on first load
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser(mockUser)
    }
    if (projects.length === 0) {
      setProjects(mockProjects)
    }
  }, [currentUser, projects, setCurrentUser, setProjects])

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      {currentBot ? <BotManagement /> : currentProject ? <ProjectOverview /> : <ProjectOverview />}
    </DashboardLayout>
  )
}
