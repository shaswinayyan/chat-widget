"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Bot, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Bot as BotType } from "@/types"

interface CreateBotDialogProps {
    children?: React.ReactNode
}

const LLM_OPTIONS = [
    { value: "gpt-4", label: "GPT-4", description: "Most capable model from OpenAI" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Fast and efficient" },
    { value: "claude-3", label: "Claude 3", description: "Anthropic's advanced AI" },
    { value: "llama-2", label: "Llama 2", description: "Open-source model by Meta" },
]

const THEME_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316", // Orange
]

const POSITIONS = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
] as const

export function CreateBotDialog({ children }: CreateBotDialogProps) {
    const { addBot, currentProject } = useAppStore()
    const { toast } = useToast()
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        description: "",
        welcomeMessage: "Hi! How can I help you today?",
        llmModel: "",
        themeColor: "#3b82f6",
        position: "bottom-right" as const,
    })

    const handleCreateBot = async () => {
        if (!currentProject || !formData.name.trim() || !formData.displayName.trim() || !formData.llmModel) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Generate API key
            const apiKey = `sk-${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`

            const newBot: BotType = {
                id: `bot-${Date.now()}`,
                name: formData.name.toLowerCase().replace(/\s+/g, '-'),
                displayName: formData.displayName,
                description: formData.description,
                welcomeMessage: formData.welcomeMessage,
                themeColor: formData.themeColor,
                position: formData.position,
                projectId: currentProject.id,
                apiKey,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                analytics: {
                    totalConversations: 0,
                    activeUsers: 0,
                    averageResponseTime: 0,
                    dailyStats: [],
                    weeklyStats: [],
                    monthlyStats: [],
                },
                files: [],
                conversations: [],
                llmModel: formData.llmModel,
            }

            addBot(newBot)

            toast({
                title: "Bot Created Successfully!",
                description: `${formData.displayName} is ready to use`,
            })

            // Reset form and close dialog
            setFormData({
                name: "",
                displayName: "",
                description: "",
                welcomeMessage: "Hi! How can I help you today?",
                llmModel: "",
                themeColor: "#3b82f6",
                position: "bottom-right",
            })
            setIsOpen(false)

            // Navigate to the new bot
            router.push(`/dashboard/${currentProject.id}/${newBot.id}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create bot. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = formData.name.trim() && formData.displayName.trim() && formData.llmModel

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2 " />
                        Create Bot
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        Create New Chatbot
                    </DialogTitle>
                    <DialogDescription>
                        Configure your AI chatbot with custom settings and personality
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="bot-name">Bot Name *</Label>
                                <Input
                                    id="bot-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., support-assistant"
                                    className="mt-1"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Used internally (lowercase, no spaces)
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="display-name">Display Name *</Label>
                                <Input
                                    id="display-name"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                    placeholder="e.g., Support Assistant"
                                    className="mt-1"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Shown to users in the chat widget
                                </p>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Brief description of what this bot does"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="welcome-message">Welcome Message</Label>
                            <Textarea
                                id="welcome-message"
                                value={formData.welcomeMessage}
                                onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                                placeholder="Hi! How can I help you today?"
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* AI Model Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">AI Model Selection</h3>

                        <div>
                            <Label htmlFor="llm-model">Language Model *</Label>
                            <Select value={formData.llmModel} onValueChange={(value) => setFormData(prev => ({ ...prev, llmModel: value }))}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Choose an AI model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LLM_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{option.label}</span>
                                                <span className="text-xs text-muted-foreground">{option.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Appearance Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Appearance & Position</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Theme Color</Label>
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {THEME_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${formData.themeColor === color
                                                        ? 'border-ring scale-110'
                                                        : 'border-transparent hover:scale-105'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setFormData(prev => ({ ...prev, themeColor: color }))}
                                            />
                                        ))}
                                    </div>
                                    <Input
                                        type="color"
                                        value={formData.themeColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, themeColor: e.target.value }))}
                                        className="w-20 h-8 mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="position">Chat Position</Label>
                                <Select
                                    value={formData.position}
                                    onValueChange={(value: typeof formData.position) => setFormData(prev => ({ ...prev, position: value }))}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {POSITIONS.map((position) => (
                                            <SelectItem key={position.value} value={position.value}>
                                                {position.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Preview</h3>
                        <div className="border rounded-lg p-4 bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                    style={{ backgroundColor: formData.themeColor }}
                                >
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{formData.displayName || "Your Bot"}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {formData.welcomeMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateBot} disabled={!isFormValid || isLoading}>
                            {isLoading ? "Creating..." : "Create Bot"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}