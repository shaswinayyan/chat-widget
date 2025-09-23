"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Plus } from "lucide-react"
import type { Project } from "@/types"

export function NewProjectDialog({ triggerAsIcon = false }: { triggerAsIcon?: boolean }) {
  const router = useRouter()
  const { addProject, currentUser } = useAppStore()

  const [isOpen, setIsOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", description: "" })

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !currentUser) return

    const project: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: currentUser.id,
      members: [
        {
          userId: currentUser.id,
          user: currentUser,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
      bots: [],
    }

    addProject(project)
    setNewProject({ name: "", description: "" })
    setIsOpen(false)

    router.push(`/dashboard/${project.id}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerAsIcon ? (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer">
            <Plus className="h-3 w-3" />
          </Button>
        ) : (
          <Button className="transition-all duration-300 ease-in-out hover-lift slide-in-right">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="slide-in-up">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Set up a new project to organize your chatbots and team members.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={newProject.name}
              onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="E-commerce Support"
              className="mt-4 transition-all duration-300 ease-in-out"
            />
          </div>
          <div>
            <Label htmlFor="project-description">Description (Optional)</Label>
            <Textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Customer support chatbots for online store"
              rows={3}
              className="mt-4 transition-all duration-300 ease-in-out"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="cursor-pointer" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProject.name.trim()} className="hover-lift cursor-pointer">
              Create Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
