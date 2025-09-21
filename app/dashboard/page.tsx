"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Plus, Edit, Copy, Trash2, Upload, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatBot {
  id: string
  name: string
  displayName: string
  welcomeMessage: string
  themeColor: string
  position: "bottom-left" | "bottom-right"
  files: string[]
  usageCount: number
  createdAt: string
}

export default function DashboardPage() {
  const [bots, setBots] = useState<ChatBot[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingBot, setEditingBot] = useState<ChatBot | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const { toast } = useToast()

  // Load bots from localStorage on mount
  useEffect(() => {
    const savedBots = localStorage.getItem("chatbots")
    if (savedBots) {
      setBots(JSON.parse(savedBots))
    }

    const loggedIn = localStorage.getItem("isLoggedIn")
    setIsLoggedIn(loggedIn === "true")
  }, [])

  // Save bots to localStorage whenever bots change
  useEffect(() => {
    localStorage.setItem("chatbots", JSON.stringify(bots))
  }, [bots])

  const handleLogin = () => {
    if (loginEmail) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", loginEmail)
      setIsLoggedIn(true)
      toast({
        title: "Logged in successfully",
        description: `Welcome, ${loginEmail}!`,
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
    setLoginEmail("")
  }

  const createBot = (botData: Omit<ChatBot, "id" | "usageCount" | "createdAt">) => {
    const newBot: ChatBot = {
      ...botData,
      id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }
    setBots((prev) => [...prev, newBot])
    setIsCreateOpen(false)
    toast({
      title: "Bot created successfully",
      description: `${newBot.name} is ready to use!`,
    })
  }

  const updateBot = (updatedBot: ChatBot) => {
    setBots((prev) => prev.map((bot) => (bot.id === updatedBot.id ? updatedBot : bot)))
    setEditingBot(null)
    toast({
      title: "Bot updated successfully",
      description: `${updatedBot.name} has been updated.`,
    })
  }

  const deleteBot = (botId: string) => {
    setBots((prev) => prev.filter((bot) => bot.id !== botId))
    toast({
      title: "Bot deleted",
      description: "The bot has been removed from your dashboard.",
    })
  }

  const copyEmbedCode = (bot: ChatBot) => {
    const embedCode = `<script src="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"}/widget.js" data-botid="${bot.id}"></script>`
    navigator.clipboard.writeText(embedCode)
    toast({
      title: "Embed code copied!",
      description: "Paste this code into any website to add your chatbot.",
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Professor Login</CardTitle>
            <CardDescription className="text-center">Enter your email to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="professor@university.edu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={!loginEmail}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Professor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{localStorage.getItem("userEmail")}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Your Chatbots</h2>
            <p className="text-muted-foreground">Manage and deploy your AI-powered chatbots</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>Configure your chatbot settings and appearance</DialogDescription>
              </DialogHeader>
              <BotForm onSubmit={createBot} />
            </DialogContent>
          </Dialog>
        </div>

        {bots.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No chatbots yet</h3>
              <p className="text-muted-foreground mb-4">Create your first chatbot to get started</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <CardDescription>{bot.displayName}</CardDescription>
                    </div>
                    <Badge style={{ backgroundColor: bot.themeColor, color: "white" }} className="text-xs">
                      {bot.position}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bot.welcomeMessage}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{bot.usageCount} conversations</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingBot(bot)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyEmbedCode(bot)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteBot(bot.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {editingBot && (
          <Dialog open={!!editingBot} onOpenChange={() => setEditingBot(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Chatbot</DialogTitle>
                <DialogDescription>Update your chatbot settings and appearance</DialogDescription>
              </DialogHeader>
              <BotForm initialData={editingBot} onSubmit={updateBot} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

function BotForm({
  initialData,
  onSubmit,
}: {
  initialData?: ChatBot
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    displayName: initialData?.displayName || "",
    welcomeMessage: initialData?.welcomeMessage || "Hello! How can I help you today?",
    themeColor: initialData?.themeColor || "#3b82f6",
    position: initialData?.position || ("bottom-right" as const),
    files: initialData?.files || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Bot Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="My Assistant Bot"
          required
        />
      </div>

      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={formData.displayName}
          onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
          placeholder="Assistant"
          required
        />
      </div>

      <div>
        <Label htmlFor="welcomeMessage">Welcome Message</Label>
        <Textarea
          id="welcomeMessage"
          value={formData.welcomeMessage}
          onChange={(e) => setFormData((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
          placeholder="Hello! How can I help you today?"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="themeColor">Theme Color</Label>
        <Input
          id="themeColor"
          type="color"
          value={formData.themeColor}
          onChange={(e) => setFormData((prev) => ({ ...prev, themeColor: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Select
          value={formData.position}
          onValueChange={(value: "bottom-left" | "bottom-right") =>
            setFormData((prev) => ({ ...prev, position: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>File Upload (Placeholder)</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">File upload coming soon - drag and drop files here</p>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Bot" : "Create Bot"}
      </Button>
    </form>
  )
}
