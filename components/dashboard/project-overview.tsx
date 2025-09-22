"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Bot, Users, BarChart3, Calendar, Folder, Settings, MoreHorizontal, Pin } from "lucide-react"
import { ProjectDetail } from "./project/project-details"
import type { Project } from "@/types"

export function ProjectOverview() {
  const router = useRouter()
  const { projects, currentProject, setCurrentProject, addProject, currentUser } = useAppStore()

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  })

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !currentUser) return

    const project: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: currentUser.id,
      members: [
        {
          userId: currentUser.id,
          user: currentUser,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
      bots: [],
    }

    addProject(project)
    setNewProject({ name: "", description: "" })
    setIsCreateProjectOpen(false)
    
    // Redirect to the new project
    router.push(`/dashboard/${project.id}`)
  }

  const handleViewProject = (project: Project) => {
    router.push(`/dashboard/${project.id}`)
  }

  // If we're on a project detail page, show the project detail component
  if (currentProject) {
    return (
      <ProjectDetail 
        project={currentProject} 
        onBack={() => {
          setCurrentProject(null)
          router.push('/dashboard')
        }} 
      />
    )
  }
  // Show all projects overview
  const displayProjects = projects

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="slide-in-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">All Projects</h1>
          <p className="text-muted-foreground text-pretty">Manage your {projects.length} projects and chatbots</p>
        </div>

        <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
          <DialogTrigger asChild>
            <Button className="transition-all duration-300 ease-in-out hover-lift slide-in-right">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="slide-in-up">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Set up a new project to organize your chatbots and team members.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="E-commerce Support"
                  className="transition-all duration-300 ease-in-out"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description (Optional)</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Customer support chatbots for online store"
                  rows={3}
                  className="transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateProjectOpen(false)}
                  className="transition-all duration-300 ease-in-out"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProject.name.trim()}
                  className="transition-all duration-300 ease-in-out hover-lift"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="responsive-grid">
        <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((acc, project) => acc + project.bots.length, 0)}</div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((acc, project) => acc + project.members.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce(
                (acc, project) =>
                  acc + project.bots.reduce((botAcc, bot) => botAcc + bot.analytics.totalConversations, 0),
                0,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="responsive-grid">
        {displayProjects.map((project, index) => (
          <Card
            key={project.id}
            className="hover-glow transition-all duration-300 ease-in-out interactive stagger-item h-full flex flex-col"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header */}
            <CardHeader className="pb-3 overflow-hidden">
              <div className="grid gap-1">
                {/* Row 1: icon | title | action */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <Folder className="h-5 w-5 text-primary flex-shrink-0" />
                  <span
                    title={project.name}
                    className="truncate text-lg font-semibold block min-w-0"
                  >
                    {project.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="opacity-50 cursor-not-allowed flex-shrink-0 p-2"
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>

                {/* Row 2: description (clamped) */}
                <p
                  className="text-sm text-muted-foreground line-clamp-1 "
                  title={project.description}
                >
                  {project.description || "No description provided"}
                </p>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col justify-between ">
              <div className="space-y-4">
                {/* Project Stats */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Bot className="h-3 w-3 flex-shrink-0" />
                    <span>{project.bots.length} bots</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span>{project.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="hidden sm:inline">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <span className="sm:hidden">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Bots Preview (max 2 items + ellipsis) */}
                {project.bots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Bots</h4>
                    <div className="space-y-2">
                      {project.bots.slice(0, 2).map((bot) => (
                        <div
                          key={bot.id}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: bot.themeColor }}
                            />
                            <span className="truncate">{bot.displayName}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {bot.analytics?.totalConversations ?? 0}
                          </Badge>
                        </div>
                      ))}
                      {project.bots.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{project.bots.length - 2} more bots
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent transition-all duration-300 ease-in-out hover-lift"
                  onClick={() => handleViewProject(project)}
                >
                  View Project
                </Button>
                <Button variant="ghost" size="sm" className="transition-all duration-300 ease-in-out">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>




      {/* Empty State */}
      {projects.length === 0 && (
        <Card className="text-center py-12 fade-in">
          <CardContent>
            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4 bounce-gentle" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4 text-pretty">
              Create your first project to start organizing your chatbots
            </p>
            <Button
              onClick={() => setIsCreateProjectOpen(true)}
              className="transition-all duration-300 ease-in-out hover-lift"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
