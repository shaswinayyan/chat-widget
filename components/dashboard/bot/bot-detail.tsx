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
    Bot,
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
    Code,
    Eye,
    Settings,
    Upload,
    Download,
    Share2,
} from "lucide-react"
import { BotAnalytics } from "@/components/dashboard/bot-analytics"
import { BotFiles } from "@/components/dashboard/bot-files"
import { BotConversations } from "@/components/dashboard/bot-conversations"
import type { Bot as BotType, Project } from "@/types"

interface BotDetailProps {
    bot: BotType
    project: Project
    onBack: () => void
}

export function BotDetail({ bot, project, onBack }: BotDetailProps) {
    const { updateBot, deleteBot, setCurrentBot } = useAppStore()
    const { toast } = useToast()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isEmbedOpen, setIsEmbedOpen] = useState(false)
    const [editData, setEditData] = useState<Partial<BotType>>({})

    const handleEditBot = () => {
        if (!editData.displayName?.trim()) return

        updateBot(bot.id, editData)
        setIsEditOpen(false)
        setEditData({})

        toast({
            title: "Bot updated",
            description: "Your bot settings have been saved successfully",
        })
    }

    const handleDeleteBot = () => {
        if (confirm("Are you sure you want to delete this bot? This action cannot be undone.")) {
            deleteBot(bot.id)
            setCurrentBot(null)
            onBack()

            toast({
                title: "Bot deleted",
                description: "The bot has been permanently removed",
            })
        }
    }

    const generateEmbedCode = () => {
        const embedCode = `<!-- ChatBot Widget -->
<script>
  window.chatbotConfig = {
    botId: "${bot.id}",
    apiKey: "${bot.apiKey}",
    position: "${bot.position}",
    themeColor: "${bot.themeColor}",
    welcomeMessage: "${bot.welcomeMessage}"
  };
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" async></script>
<!-- End ChatBot Widget -->`

        return embedCode
    }

    const handleCopyEmbedCode = () => {
        navigator.clipboard.writeText(generateEmbedCode())
        toast({
            title: "Embed code copied!",
            description: "Paste this code into any website to add your chatbot",
        })
    }

    const openEditDialog = () => {
        setEditData({
            displayName: bot.displayName,
            description: bot.description,
            welcomeMessage: bot.welcomeMessage,
            themeColor: bot.themeColor,
            position: bot.position,
            isActive: bot.isActive,
        })
        setIsEditOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to {project.name}
                    </Button>

                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEmbedOpen(true)}>
                        <Code className="h-4 w-4 mr-2" />
                        Embed Code
                    </Button>
                    <Button variant="outline" onClick={openEditDialog}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Bot
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteBot}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: bot.themeColor }}
                    >
                        <Bot className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{bot.displayName}</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant={bot.isActive ? "default" : "secondary"}>
                                {bot.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                                {bot.llmModel || "GPT-4"}
                            </Badge>
                        </div>
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">{bot.description || "No description provided"}</p>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bot.analytics.totalConversations}</div>
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
                        <div className="text-2xl font-bold">{bot.analytics.activeUsers}</div>
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
                        <div className="text-2xl font-bold">{bot.analytics.averageResponseTime}s</div>
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
                        <div className="text-2xl font-bold">{bot.files.length}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <FileText className="h-3 w-3 mr-1" />
                            {bot.files.filter((f) => f.type === "pdf").length} PDFs
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bot Details Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="conversations">Conversations</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-6">
                        {/* Bot Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bot Configuration</CardTitle>
                                <CardDescription>Current settings and configuration</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Display Name</Label>
                                        <p className="text-sm text-muted-foreground">{bot.displayName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Welcome Message</Label>
                                        <p className="text-sm text-muted-foreground">{bot.welcomeMessage}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">AI Model</Label>
                                        <p className="text-sm text-muted-foreground">{bot.llmModel || "GPT-4"}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Theme Color</Label>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border"
                                                style={{ backgroundColor: bot.themeColor }}
                                            />
                                            <span className="text-sm text-muted-foreground">{bot.themeColor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Position</Label>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {bot.position.replace("-", " ")}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <Badge variant={bot.isActive ? "default" : "secondary"} className="ml-0">
                                            {bot.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks for managing your bot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button onClick={() => setIsEmbedOpen(true)} className="h-24 flex-col">
                                        <Code className="h-6 w-6 mb-2" />
                                        <span>Get Embed Code</span>
                                        <span className="text-xs text-muted-foreground">Add to website</span>
                                    </Button>
                                    <Button variant="outline" onClick={openEditDialog} className="h-24 flex-col">
                                        <Settings className="h-6 w-6 mb-2" />
                                        <span>Edit Settings</span>
                                        <span className="text-xs text-muted-foreground">Update configuration</span>
                                    </Button>
                                    <Button variant="outline" className="h-24 flex-col">
                                        <Upload className="h-6 w-6 mb-2" />
                                        <span>Upload Files</span>
                                        <span className="text-xs text-muted-foreground">Add knowledge</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics">
                    <BotAnalytics bot={bot} />
                </TabsContent>

                <TabsContent value="conversations">
                    <BotConversations bot={bot} />
                </TabsContent>

                <TabsContent value="files">
                    <BotFiles bot={bot} />
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bot Settings</CardTitle>
                            <CardDescription>Manage your bot's configuration and behavior</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label>Bot ID</Label>
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm bg-muted px-2 py-1 rounded">{bot.id}</code>
                                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(bot.id)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>API Key</Label>
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm bg-muted px-2 py-1 rounded">{bot.apiKey.slice(0, 12)}...</code>
                                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(bot.apiKey)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Created</Label>
                                        <p className="text-sm text-muted-foreground">{new Date(bot.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Label>Last Updated</Label>
                                        <p className="text-sm text-muted-foreground">{new Date(bot.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={openEditDialog}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Settings
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteBot}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Bot
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
                        <div>
                            <Label htmlFor="edit-display-name">Display Name</Label>
                            <Input
                                id="edit-display-name"
                                value={editData.displayName || ""}
                                onChange={(e) => setEditData((prev) => ({ ...prev, displayName: e.target.value }))}
                                placeholder="Support Assistant"
                            />
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
                                    onValueChange={(value: BotType["position"]) => setEditData((prev) => ({ ...prev, position: value }))}
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
                            <Button onClick={handleEditBot} disabled={!editData.displayName?.trim()}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Embed Code Dialog */}
            <Dialog open={isEmbedOpen} onOpenChange={setIsEmbedOpen}>
                <DialogContent className="sm:max-w-3xl max-w-[95vw] max-h-[90vh] overflow-y-auto mx-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Embed Code for {bot.displayName}
                        </DialogTitle>
                        <DialogDescription>
                            Copy and paste this code into your website to add the chatbot
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="relative">
                            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-64">
                                <code className="break-all whitespace-pre-wrap">{generateEmbedCode()}</code>
                            </pre>
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleCopyEmbedCode}
                            >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                            </Button>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Installation Instructions:</h4>
                            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Copy the embed code above</li>
                                <li>Paste it before the closing &lt;/body&gt; tag in your HTML</li>
                                <li>The chatbot will automatically appear on your website</li>
                                <li>Test the integration and customize as needed</li>
                            </ol>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEmbedOpen(false)}>
                                Close
                            </Button>
                            <Button onClick={handleCopyEmbedCode}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Code
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}