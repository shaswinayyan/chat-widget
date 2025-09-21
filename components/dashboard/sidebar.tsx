"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Folder, Bot, Plus, BarChart3, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { projects, currentProject, setCurrentProject, currentBot, setCurrentBot, sidebarCollapsed } = useAppStore()

  const handleProjectClick = (project: (typeof projects)[0]) => {
    setCurrentProject(project)
    setCurrentBot(null)
  }

  const handleBotClick = (bot: (typeof projects)[0]["bots"][0]) => {
    setCurrentBot(bot)
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Projects Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              {!sidebarCollapsed && <h2 className="text-sm font-semibold text-muted-foreground">PROJECTS</h2>}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Create Project</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={currentProject?.id === project.id ? "secondary" : "ghost"}
                          className={cn("w-full justify-start", sidebarCollapsed ? "px-2" : "px-3")}
                          onClick={() => handleProjectClick(project)}
                        >
                          <Folder className="h-4 w-4 shrink-0" />
                          {!sidebarCollapsed && (
                            <>
                              <span className="ml-2 truncate">{project.name}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {project.bots.length}
                              </Badge>
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          <p>
                            {project.name} ({project.bots.length} bots)
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>

                    {/* Bots under current project */}
                    {currentProject?.id === project.id && !sidebarCollapsed && (
                      <div className="ml-4 mt-2 space-y-1">
                        {project.bots.map((bot) => (
                          <Button
                            key={bot.id}
                            variant={currentBot?.id === bot.id ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleBotClick(bot)}
                          >
                            <Bot className="h-3 w-3" />
                            <span className="ml-2 truncate">{bot.displayName}</span>
                            <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: bot.themeColor }} />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Navigation Items */}
          <div className="mt-auto p-4 border-t">
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className={cn("w-full justify-start", sidebarCollapsed ? "px-2" : "px-3")}>
                    <BarChart3 className="h-4 w-4" />
                    {!sidebarCollapsed && <span className="ml-2">Analytics</span>}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>Analytics</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className={cn("w-full justify-start", sidebarCollapsed ? "px-2" : "px-3")}>
                    <Users className="h-4 w-4" />
                    {!sidebarCollapsed && <span className="ml-2">Team</span>}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>Team</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className={cn("w-full justify-start", sidebarCollapsed ? "px-2" : "px-3")}>
                    <Settings className="h-4 w-4" />
                    {!sidebarCollapsed && <span className="ml-2">Settings</span>}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
