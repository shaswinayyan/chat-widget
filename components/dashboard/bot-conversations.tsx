"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageSquare, User, BotIcon, Calendar, Filter, Download } from "lucide-react"
import type { Bot, Conversation } from "@/types"

interface BotConversationsProps {
  bot: Bot
}

// Mock conversation data
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    botId: "bot-1",
    userId: "user-123",
    messages: [
      {
        id: "msg-1",
        content: "Hi, I need help with my order",
        role: "user",
        timestamp: new Date("2024-01-15T10:30:00"),
        conversationId: "conv-1",
      },
      {
        id: "msg-2",
        content: "I'd be happy to help you with your order! Could you please provide your order number?",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:30:15"),
        conversationId: "conv-1",
      },
      {
        id: "msg-3",
        content: "It's #12345",
        role: "user",
        timestamp: new Date("2024-01-15T10:31:00"),
        conversationId: "conv-1",
      },
      {
        id: "msg-4",
        content:
          "Thank you! I can see your order #12345. It was shipped yesterday and should arrive by tomorrow. You can track it using the link I'll send you.",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:31:30"),
        conversationId: "conv-1",
      },
    ],
    startedAt: new Date("2024-01-15T10:30:00"),
    lastMessageAt: new Date("2024-01-15T10:31:30"),
    isActive: false,
  },
  {
    id: "conv-2",
    botId: "bot-1",
    userId: "user-456",
    messages: [
      {
        id: "msg-5",
        content: "What are your business hours?",
        role: "user",
        timestamp: new Date("2024-01-15T14:20:00"),
        conversationId: "conv-2",
      },
      {
        id: "msg-6",
        content:
          "Our business hours are Monday to Friday, 9 AM to 6 PM EST. We're also available on weekends from 10 AM to 4 PM. Is there anything specific I can help you with?",
        role: "assistant",
        timestamp: new Date("2024-01-15T14:20:10"),
        conversationId: "conv-2",
      },
    ],
    startedAt: new Date("2024-01-15T14:20:00"),
    lastMessageAt: new Date("2024-01-15T14:20:10"),
    isActive: true,
  },
]

export function BotConversations({ bot }: BotConversationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const conversations = mockConversations.filter((conv) =>
    conv.messages.some((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conversations</h2>
          <p className="text-muted-foreground">View and analyze chat history with your bot</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>{conversations.length} conversations found</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedConversation?.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">User {conversation.userId?.slice(-3)}</span>
                        <Badge variant={conversation.isActive ? "default" : "secondary"} className="text-xs">
                          {conversation.isActive ? "Active" : "Ended"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(conversation.lastMessageAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conversation.messages[conversation.messages.length - 1]?.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{conversation.messages.length} messages</span>
                        <span>
                          {Math.round(
                            (new Date(conversation.lastMessageAt).getTime() -
                              new Date(conversation.startedAt).getTime()) /
                              60000,
                          )}{" "}
                          min duration
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Conversation Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Details</CardTitle>
            <CardDescription>
              {selectedConversation
                ? `Started ${new Date(selectedConversation.startedAt).toLocaleString()}`
                : "Select a conversation to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.role === "assistant" ? (
                            <BotIcon className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground ml-auto"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a conversation to view the chat history</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
