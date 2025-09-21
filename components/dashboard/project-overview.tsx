"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, Bot, Users, BarChart3, Calendar, Folder, Settings, MoreHorizontal } from "lucide-react"
import { TeamManagement } from "./team-management"
import type { Project } from "@/types"

export function ProjectOverview() {
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
  }

  // If we have a current project selected, show project details with tabs
  if (currentProject) {
    return (
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="slide-in-left">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentProject(null)}
                className="transition-all duration-300 ease-in-out"
              >
                ← Back to Projects
              </Button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">{currentProject.name}</h1>
            <p className="text-muted-foreground text-pretty">
              {currentProject.description || "Manage your chatbots and team members"}
            </p>
          </div>

          <div className="flex gap-2 slide-in-right">
            <Button variant="outline" className="transition-all duration-300 ease-in-out hover-lift bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Project Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview" className="transition-all duration-300 ease-in-out">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bots" className="transition-all duration-300 ease-in-out">
              Bots ({currentProject.bots.length})
            </TabsTrigger>
            <TabsTrigger value="team" className="transition-all duration-300 ease-in-out">
              Team ({currentProject.members.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="transition-all duration-300 ease-in-out">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 fade-in">
            {/* Stats Cards */}
            <div className="responsive-grid">
              <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentProject.bots.length}</div>
                </CardContent>
              </Card>

              <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentProject.members.length}</div>
                </CardContent>
              </Card>

              <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentProject.bots.reduce((acc, bot) => acc + bot.analytics.totalConversations, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentProject.bots.reduce((acc, bot) => acc + bot.analytics.activeUsers, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bots */}
            <Card className="slide-in-up">
              <CardHeader>
                <CardTitle>Recent Bots</CardTitle>
                <CardDescription>Your most recently updated chatbots</CardDescription>
              </CardHeader>
              <CardContent>
                {currentProject.bots.length > 0 ? (
                  <div className="space-y-4">
                    {currentProject.bots.slice(0, 5).map((bot, index) => (
                      <div
                        key={bot.id}
                        className={`flex items-center justify-between p-3 border rounded-lg interactive stagger-item`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full transition-all duration-300 ease-in-out"
                            style={{ backgroundColor: bot.themeColor }}
                          />
                          <div>
                            <h4 className="font-medium">{bot.displayName}</h4>
                            <p className="text-sm text-muted-foreground">{bot.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="transition-all duration-300 ease-in-out">
                            {bot.analytics.totalConversations} chats
                          </Badge>
                          <Badge
                            variant={bot.isActive ? "default" : "secondary"}
                            className="transition-all duration-300 ease-in-out"
                          >
                            {bot.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 fade-in">
                    <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4 bounce-gentle" />
                    <p className="text-muted-foreground">No bots created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bots" className="fade-in">
            <div>Bot management content will go here</div>
          </TabsContent>

          <TabsContent value="team" className="fade-in">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="analytics" className="fade-in">
            <div>Analytics content will go here</div>
          </TabsContent>
        </Tabs>
      </div>
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
            className="hover-glow transition-all duration-300 ease-in-out interactive stagger-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-balance">{project.name}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="transition-all duration-300 ease-in-out">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2 text-pretty">
                {project.description || "No description provided"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Project Stats */}
                <div className="flex items-center justify-between text-sm mobile-optimized">
                  <div className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    <span>{project.bots.length} bots</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{project.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="hidden sm:inline">{new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="sm:hidden">
                      {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Bots Preview */}
                {project.bots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Bots</h4>
                    <div className="space-y-2">
                      {project.bots.slice(0, 3).map((bot) => (
                        <div key={bot.id} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-2 h-2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ backgroundColor: bot.themeColor }}
                          />
                          <span className="truncate">{bot.displayName}</span>
                          <Badge variant="secondary" className="text-xs transition-all duration-300 ease-in-out">
                            {bot.analytics.totalConversations}
                          </Badge>
                        </div>
                      ))}
                      {project.bots.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{project.bots.length - 3} more bots</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent transition-all duration-300 ease-in-out hover-lift"
                    onClick={() => setCurrentProject(project)}
                  >
                    View Project
                  </Button>
                  <Button variant="ghost" size="sm" className="transition-all duration-300 ease-in-out">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
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
