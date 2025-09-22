"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { ProjectDetail } from "@/components/dashboard/project/project-details"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useRouter } from "next/navigation"

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const { projects, currentProject, setCurrentProject } = useAppStore()

  useEffect(() => {
    // Find the project by ID
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setCurrentProject(project)
    } else {
      // Redirect if project not found
      router.push('/dashboard')
    }
  }, [projectId, projects, setCurrentProject, router])

  if (!currentProject || currentProject.id !== projectId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ProjectDetail 
        project={currentProject} 
        onBack={() => {
          setCurrentProject(null)
          router.push('/dashboard')
        }} 
      />
    </DashboardLayout>
  )
}