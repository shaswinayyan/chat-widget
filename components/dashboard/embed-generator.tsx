"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Copy, Code, Eye, Palette, Settings, Smartphone, Monitor, Tablet } from "lucide-react"
import type { Bot, EmbedConfig } from "@/types"

interface EmbedGeneratorProps {
  bot: Bot
}

export function EmbedGenerator({ bot }: EmbedGeneratorProps) {
  const { toast } = useToast()
  const [config, setConfig] = useState<EmbedConfig>({
    botId: bot.id,
    apiKey: bot.apiKey,
    position: bot.position,
    themeColor: bot.themeColor,
    welcomeMessage: bot.welcomeMessage,
    customCSS: "",
  })

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const generateEmbedCode = () => {
    const embedCode = `<!-- ChatBot Widget -->
<script>
  window.chatbotConfig = {
    botId: "${config.botId}",
    apiKey: "${config.apiKey}",
    position: "${config.position}",
    themeColor: "${config.themeColor}",
    welcomeMessage: "${config.welcomeMessage}",
    customCSS: \`${config.customCSS}\`
  };
</script>
<script src="${window.location.origin}/widget.js" async></script>
<!-- End ChatBot Widget -->`

    return embedCode
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode())
    toast({
      title: "Embed code copied!",
      description: "Paste this code into your website's HTML",
    })
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "desktop":
        return <Monitor className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getDeviceClass = () => {
    switch (previewDevice) {
      case "desktop":
        return "w-full h-[600px]"
      case "tablet":
        return "w-[768px] h-[500px] mx-auto"
      case "mobile":
        return "w-[375px] h-[600px] mx-auto"
      default:
        return "w-full h-[600px]"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Embed Widget Generator</h2>
          <p className="text-muted-foreground">Customize and generate embed code for your chatbot</p>
        </div>
        <Button onClick={copyEmbedCode}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Embed Code
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Widget Configuration
            </CardTitle>
            <CardDescription>Customize your chatbot's appearance and behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appearance" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-2" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="behavior">
                  <Settings className="h-4 w-4 mr-2" />
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Code className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4">
                <div>
                  <Label htmlFor="theme-color">Theme Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="theme-color"
                      type="color"
                      value={config.themeColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, themeColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.themeColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, themeColor: e.target.value }))}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">Widget Position</Label>
                  <Select
                    value={config.position}
                    onValueChange={(value: Bot["position"]) => setConfig((prev) => ({ ...prev, position: value }))}
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

                <div>
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                    placeholder="Hi! How can I help you today?"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-open on page load</Label>
                      <p className="text-sm text-muted-foreground">Automatically open the chat when page loads</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show typing indicator</Label>
                      <p className="text-sm text-muted-foreground">Display typing animation when bot is responding</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound notifications</Label>
                      <p className="text-sm text-muted-foreground">Play sound when new messages arrive</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Minimize after inactivity</Label>
                      <p className="text-sm text-muted-foreground">Auto-minimize after 5 minutes of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea
                    id="custom-css"
                    value={config.customCSS}
                    onChange={(e) => setConfig((prev) => ({ ...prev, customCSS: e.target.value }))}
                    placeholder=".chatbot-widget { border-radius: 12px; }"
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Add custom CSS to override default widget styles</p>
                </div>

                <div>
                  <Label>Widget Size</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Input placeholder="400px" />
                    </div>
                    <div>
                      <Label className="text-xs">Height</Label>
                      <Input placeholder="600px" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See how your widget will look on different devices</CardDescription>
              </div>
              <div className="flex gap-1">
                {(["desktop", "tablet", "mobile"] as const).map((device) => (
                  <Button
                    key={device}
                    variant={previewDevice === device ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice(device)}
                  >
                    {getDeviceIcon(device)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className={`${getDeviceClass()} relative bg-white`}>
                {/* Mock Website Content */}
                <div className="p-6 h-full overflow-auto">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                    <div className="h-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Chat Widget Preview */}
                <div
                  className={`absolute ${
                    config.position.includes("bottom") ? "bottom-4" : "top-4"
                  } ${config.position.includes("right") ? "right-4" : "left-4"}`}
                >
                  <div className="relative">
                    {/* Chat Button */}
                    <button
                      className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105"
                      style={{ backgroundColor: config.themeColor }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L1 22l5.65-2.05C8.96 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.76-.3-4-.85L6 20l.85-2C6.3 16.76 6 15.4 6 14c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    </button>

                    {/* Chat Window Preview (shown as minimized) */}
                    <div
                      className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border opacity-90 pointer-events-none"
                      style={{ display: "none" }}
                    >
                      <div
                        className="h-12 rounded-t-lg flex items-center px-4 text-white"
                        style={{ backgroundColor: config.themeColor }}
                      >
                        <span className="font-medium">{bot.displayName}</span>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-100 rounded-lg p-3 text-sm">{config.welcomeMessage}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed Code
          </CardTitle>
          <CardDescription>Copy and paste this code into your website's HTML</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{generateEmbedCode()}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-transparent"
              onClick={copyEmbedCode}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Installation Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Copy the embed code above</li>
              <li>2. Paste it before the closing &lt;/body&gt; tag in your HTML</li>
              <li>3. The chatbot will automatically appear on your website</li>
              <li>4. Test the integration and customize as needed</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>Popular platforms and frameworks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">WordPress</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add to your theme's footer.php file or use a custom HTML widget
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">React</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add to your index.html or use dangerouslySetInnerHTML in a component
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Shopify</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Add to your theme.liquid file in the theme editor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
