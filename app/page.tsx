import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Users, Code, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-balance">AI Chatbot Platform</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Create, manage, and embed intelligent chatbots powered by HuggingFace AI
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Easy Bot Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Create and customize chatbots with simple settings and configurations</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>One-Line Embed</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Add chatbots to any website with a single script tag</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>HuggingFace Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Leverage powerful AI models through secure API integration</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multi-Bot Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage multiple chatbots from a single dashboard interface</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Access the Professor Dashboard to create your first chatbot</p>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
