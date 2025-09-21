"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, ImageIcon, Music, File, Download, Trash2, Plus, Eye } from "lucide-react"
import type { Bot, BotFile } from "@/types"

interface BotFilesProps {
  bot: Bot
}

export function BotFiles({ bot }: BotFilesProps) {
  const { toast } = useToast()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    name: "",
    type: "pdf" as BotFile["type"],
    url: "",
  })

  const handleUploadFile = () => {
    if (!uploadData.name.trim()) return

    // Mock file upload for demo
    const newFile: BotFile = {
      id: `file-${Date.now()}`,
      name: uploadData.name,
      type: uploadData.type,
      url: uploadData.url || "/placeholder.pdf",
      size: Math.floor(Math.random() * 1000000) + 100000, // Random size between 100KB - 1MB
      uploadedAt: new Date(),
    }

    // In real app, would update bot files through store
    toast({
      title: "File uploaded",
      description: `${uploadData.name} has been added to your bot`,
    })

    setUploadData({ name: "", type: "pdf", url: "" })
    setIsUploadOpen(false)
  }

  const getFileIcon = (type: BotFile["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-500" />
      case "audio":
        return <Music className="h-5 w-5 text-purple-500" />
      case "text":
        return <File className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeBadge = (type: BotFile["type"]) => {
    const variants = {
      pdf: "destructive",
      image: "default",
      audio: "secondary",
      text: "outline",
    } as const

    return (
      <Badge variant={variants[type]} className="text-xs">
        {type.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Files & Resources</h2>
          <p className="text-muted-foreground">Manage files that help train and improve your bot</p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
              <DialogDescription>
                Add documents, images, or audio files to enhance your bot's knowledge
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-name">File Name</Label>
                <Input
                  id="file-name"
                  value={uploadData.name}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="product-manual.pdf"
                />
              </div>
              <div>
                <Label htmlFor="file-type">File Type</Label>
                <select
                  id="file-type"
                  value={uploadData.type}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, type: e.target.value as BotFile["type"] }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="text">Text File</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <Label>File Upload</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, TXT, JPG, PNG, MP3 files up to 10MB
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadFile} disabled={!uploadData.name.trim()}>
                  Upload File
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* File Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bot.files.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDF Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bot.files.filter((f) => f.type === "pdf").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bot.files.filter((f) => f.type === "image").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(bot.files.reduce((acc, file) => acc + file.size, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}
      {bot.files.length > 0 ? (
        <div className="grid gap-4">
          {bot.files.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{file.name}</h4>
                        {getFileTypeBadge(file.type)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload documents, images, or audio files to enhance your bot's knowledge base
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
