"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Code } from "lucide-react"
import type { Bot as BotType } from "@/types"

type EmbedCodeDialogProps = {
  isOpen: boolean
  onClose: () => void
  bot: BotType
}

export function EmbedCodeDialog({ isOpen, onClose, bot }: EmbedCodeDialogProps) {
  const generateEmbedCode = () => `<!-- ChatBot Widget -->
<script>
  window.chatbotConfig = {
    botId: "${bot.id}",
    apiKey: "${bot.apiKey}",
    position: "${bot.position}",
    themeColor: "${bot.themeColor}",
    welcomeMessage: "${bot.welcomeMessage}"
  };
</script>
<script src="/widget.js" async></script>
<!-- End ChatBot Widget -->`

  const handleCopy = () => navigator.clipboard.writeText(generateEmbedCode())

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={handleCopy}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleCopy}><Copy className="h-4 w-4 mr-2" /> Copy Code</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
