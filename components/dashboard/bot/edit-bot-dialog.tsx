"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { Bot as BotType } from "@/types"

type EditBotDialogProps = {
  isOpen: boolean
  onClose: () => void
  initialData: Partial<BotType>
  onSave: (data: Partial<BotType>) => void
}

export function EditBotDialog({ isOpen, onClose, initialData, onSave }: EditBotDialogProps) {
  const [editData, setEditData] = useState<Partial<BotType>>(initialData)

  const handleSave = () => {
    if (!editData.displayName?.trim()) return
    onSave(editData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Bot Settings</DialogTitle>
          <DialogDescription>Update your bot's configuration and appearance</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label>Display Name</Label>
            <Input
              value={editData.displayName || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, displayName: e.target.value }))}
              placeholder="Support Assistant"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={editData.description || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Helps customers with orders and returns"
            />
          </div>

          <div>
            <Label>Welcome Message</Label>
            <Textarea
              value={editData.welcomeMessage || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
              placeholder="Hi! How can I help you today?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Theme Color</Label>
              <Input
                type="color"
                value={editData.themeColor || "#3b82f6"}
                onChange={(e) => setEditData((prev) => ({ ...prev, themeColor: e.target.value }))}
              />
            </div>
            <div>
              <Label>Position</Label>
              <Select
                value={editData.position || "bottom-right"}
                onValueChange={(value: BotType["position"]) =>
                  setEditData((prev) => ({ ...prev, position: value }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              checked={editData.isActive ?? true}
              onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, isActive: checked }))}
            />
            <Label>Bot is active</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!editData.displayName?.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
