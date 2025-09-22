"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bot, Users, BarChart3, Settings } from "lucide-react"
import { TeamManagement } from "@/components/dashboard/team-management"
import type { Project } from "@/types"

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="slide-in-left">
          {/* <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="transition-all duration-300 ease-in-out"
            >
              ← Back to Projects
            </Button>
          </div> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">{project.name}</h1>
          <p className="text-muted-foreground text-pretty">
            {project.description || "Manage your chatbots and team members"}
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
              <CardTitle>Recent Bots</CardTitle>
              <CardDescription>Your most recently updated chatbots</CardDescription>
            </CardHeader>
            <CardContent>
              {project.bots.length > 0 ? (
                <div className="space-y-4">
                  {project.bots.slice(0, 5).map((bot, index) => (
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