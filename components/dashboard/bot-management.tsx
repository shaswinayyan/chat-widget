"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  BotIcon,
  MessageSquare,
  Users,
  Clock,
  Copy,
  Edit,
  Trash2,
  FileText,
  File,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { BotAnalytics } from "./bot-analytics"
import { BotFiles } from "./bot-files"
import { BotConversations } from "./bot-conversations"
import type { Bot } from "@/types"

export function BotManagement() {
  const { currentBot, setCurrentBot, updateBot, deleteBot, currentProject } = useAppStore()
  const { toast } = useToast()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState<Partial<Bot>>({})

  if (!currentBot || !currentProject) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BotIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a bot to manage</p>
        </CardContent>
      </Card>
    )
  }

  const handleEditBot = () => {
    if (!editData.name?.trim()) return

    updateBot(currentBot.id, editData)
    setIsEditOpen(false)
    setEditData({})

    toast({
      title: "Bot updated",
      description: "Your bot settings have been saved successfully",
    })
  }

  const handleDeleteBot = () => {
    deleteBot(currentBot.id)
    setCurrentBot(null)

    toast({
      title: "Bot deleted",
      description: "The bot has been permanently removed",
    })
  }

  const handleCopyEmbedCode = () => {
    const embedCode = `<script src="${window.location.origin}/widget.js" data-botid="${currentBot.id}" data-api-key="${currentBot.apiKey}"></script>`
    navigator.clipboard.writeText(embedCode)

    toast({
      title: "Embed code copied!",
      description: "Paste this code into any website to add your chatbot",
    })
  }

  const openEditDialog = () => {
    setEditData({
      name: currentBot.name,
      displayName: currentBot.displayName,
      description: currentBot.description,
      welcomeMessage: currentBot.welcomeMessage,
      themeColor: currentBot.themeColor,
      position: currentBot.position,
      isActive: currentBot.isActive,
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentBot(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentBot.themeColor }} />
              <h1 className="text-3xl font-bold">{currentBot.displayName}</h1>
              <Badge variant={currentBot.isActive ? "default" : "secondary"}>
                {currentBot.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{currentBot.description || "No description provided"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyEmbedCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Embed
          </Button>
          <Button variant="outline" onClick={openEditDialog}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Bot
          </Button>
          <Button variant="outline" onClick={handleDeleteBot}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBot.analytics.totalConversations}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBot.analytics.activeUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBot.analytics.averageResponseTime}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.3s from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBot.files.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileText className="h-3 w-3 mr-1" />
              {currentBot.files.filter((f) => f.type === "pdf").length} PDFs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bot Details Tabs */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="files">Files & Resources</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <BotAnalytics bot={currentBot} />
        </TabsContent>

        <TabsContent value="conversations">
          <BotConversations bot={currentBot} />
        </TabsContent>

        <TabsContent value="files">
          <BotFiles bot={currentBot} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Manage your bot's settings and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Bot Name</Label>
                    <p className="text-sm text-muted-foreground">{currentBot.name}</p>
                  </div>
                  <div>
                    <Label>Display Name</Label>
                    <p className="text-sm text-muted-foreground">{currentBot.displayName}</p>
                  </div>
                  <div>
                    <Label>Welcome Message</Label>
                    <p className="text-sm text-muted-foreground">{currentBot.welcomeMessage}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Theme Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: currentBot.themeColor }} />
                      <span className="text-sm text-muted-foreground">{currentBot.themeColor}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Position</Label>
                    <p className="text-sm text-muted-foreground capitalize">{currentBot.position.replace("-", " ")}</p>
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{currentBot.apiKey.slice(0, 12)}...</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(currentBot.apiKey)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={openEditDialog}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Bot Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bot Settings</DialogTitle>
            <DialogDescription>Update your bot's configuration and appearance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Bot Name</Label>
                <Input
                  id="edit-name"
                  value={editData.name || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="my-support-bot"
                />
              </div>
              <div>
                <Label htmlFor="edit-display-name">Display Name</Label>
                <Input
                  id="edit-display-name"
                  value={editData.displayName || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Support Assistant"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editData.description || ""}
                onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Helps customers with orders and returns"
              />
            </div>

            <div>
              <Label htmlFor="edit-welcome">Welcome Message</Label>
              <Textarea
                id="edit-welcome"
                value={editData.welcomeMessage || ""}
                onChange={(e) => setEditData((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                placeholder="Hi! How can I help you today?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-color">Theme Color</Label>
                <Input
                  id="edit-color"
                  type="color"
                  value={editData.themeColor || "#3b82f6"}
                  onChange={(e) => setEditData((prev) => ({ ...prev, themeColor: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-position">Position</Label>
                <Select
                  value={editData.position || "bottom-right"}
                  onValueChange={(value: Bot["position"]) => setEditData((prev) => ({ ...prev, position: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={editData.isActive ?? true}
                onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-active">Bot is active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditBot} disabled={!editData.name?.trim()}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
