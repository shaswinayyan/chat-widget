"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bot, Users, BarChart3, Settings, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { TeamManagement } from "@/components/dashboard/team-management"
import { CreateBotDialog } from "@/components/dashboard/bot/create-bot-dialog"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import type { Project } from "@/types"

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { setCurrentBot } = useAppStore()
  const router = useRouter()

  const handleBotClick = (bot: Project['bots'][0]) => {
    setCurrentBot(bot)
    router.push(`/dashboard/${project.id}/${bot.id}`)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="slide-in-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">{project.name}</h1>
          <p className="text-muted-foreground text-pretty">
            {project.description || "Manage your chatbots and team members"}
          </p>
        </div>

        <div className="flex gap-2 slide-in-right">
          <CreateBotDialog />
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
            Bots ({project.bots.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="transition-all duration-300 ease-in-out">
            Team ({project.members.length})
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
                <div className="text-2xl font-bold">{project.bots.length}</div>
              </CardContent>
            </Card>

            <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.members.length}</div>
              </CardContent>
            </Card>

            <Card className="hover-glow transition-all duration-300 ease-in-out stagger-item">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.bots.reduce((acc, bot) => acc + bot.analytics.totalConversations, 0)}
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
                  {project.bots.reduce((acc, bot) => acc + bot.analytics.activeUsers, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bots */}
          <Card className="slide-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Chatbots</CardTitle>
                  <CardDescription>Manage and monitor your AI assistants</CardDescription>
                </div>
                <CreateBotDialog>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bot
                  </Button>
                </CreateBotDialog>
              </div>
            </CardHeader>
            <CardContent>
              {project.bots.length > 0 ? (
                <div className="space-y-4">
                  {project.bots.map((bot, index) => (
                    <div
                      key={bot.id}
                      className={`flex items-center justify-between p-4 border rounded-lg interactive stagger-item hover:bg-muted/50 transition-colors`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-in-out"
                          style={{ backgroundColor: bot.themeColor }}
                        >
                          <Bot className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{bot.displayName}</h4>
                          <p className="text-sm text-muted-foreground">{bot.description || "No description"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {bot.llmModel || "GPT-4"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {bot.files.length} files
                            </span>
                          </div>
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBotClick(bot)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBotClick(bot)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 fade-in">
                  <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4 bounce-gentle" />
                  <h3 className="text-lg font-medium mb-2">No bots created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI chatbot to get started with automated customer support
                  </p>
                  <CreateBotDialog>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Bot
                    </Button>
                  </CreateBotDialog>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="fade-in">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bot Management</CardTitle>
                  <CardDescription>Create, configure, and manage your chatbots</CardDescription>
                </div>
                <CreateBotDialog />
              </div>
            </CardHeader>
            <CardContent>
              {project.bots.length > 0 ? (
                <div className="grid gap-4">
                  {project.bots.map((bot) => (
                    <Card key={bot.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: bot.themeColor }}
                            >
                              <Bot className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{bot.displayName}</h3>
                              <p className="text-muted-foreground mb-2">{bot.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Model: {bot.llmModel || "GPT-4"}</span>
                                <span>{bot.analytics.totalConversations} conversations</span>
                                <span>{bot.files.length} files</span>
                                <span>Created {new Date(bot.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={bot.isActive ? "default" : "secondary"}>
                              {bot.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBotClick(bot)}
                            >
                              Manage Bot
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bots created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI chatbot to start helping your users
                  </p>
                  <CreateBotDialog />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="fade-in">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="analytics" className="fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
              <CardDescription>Overview of all bots in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {project.bots.reduce((acc, bot) => acc + bot.analytics.totalConversations, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {project.bots.reduce((acc, bot) => acc + bot.analytics.activeUsers, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {project.bots.reduce((acc, bot) => acc + bot.files.length, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}