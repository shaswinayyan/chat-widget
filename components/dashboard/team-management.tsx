"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, MoreHorizontal, Mail, Crown, Edit, Shield, Eye, Trash2, Users } from "lucide-react"
import type { ProjectMember, User } from "@/types"

export function TeamManagement() {
  const { currentProject, updateProject, currentUser } = useAppStore()
  const { toast } = useToast()

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "viewer" as "owner" | "editor" | "viewer",
  })

  if (!currentProject) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a project to manage team members</p>
        </CardContent>
      </Card>
    )
  }

  const handleInviteMember = () => {
    if (!inviteData.email.trim()) return

    // Mock user creation for demo
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: inviteData.email.split("@")[0],
      email: inviteData.email,
      avatar: `/placeholder.svg?key=${Math.random()}`,
      createdAt: new Date(),
    }

    const newMember: ProjectMember = {
      userId: newUser.id,
      user: newUser,
      role: inviteData.role,
      joinedAt: new Date(),
    }

    updateProject(currentProject.id, {
      members: [...currentProject.members, newMember],
    })

    setInviteData({ email: "", role: "viewer" })
    setIsInviteOpen(false)

    toast({
      title: "Invitation sent",
      description: `${inviteData.email} has been invited to join the project`,
    })
  }

  const handleRoleChange = (memberId: string, newRole: "owner" | "editor" | "viewer") => {
    const updatedMembers = currentProject.members.map((member) =>
      member.userId === memberId ? { ...member, role: newRole } : member,
    )

    updateProject(currentProject.id, { members: updatedMembers })

    toast({
      title: "Role updated",
      description: "Team member role has been changed",
    })
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = currentProject.members.filter((member) => member.userId !== memberId)
    updateProject(currentProject.id, { members: updatedMembers })

    toast({
      title: "Member removed",
      description: "Team member has been removed from the project",
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />
      case "editor":
        return <Edit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <Shield className="h-3 w-3" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  const canManageMembers = currentProject.members.find((m) => m.userId === currentUser?.id)?.role === "owner"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage team members and their permissions for {currentProject.name}</p>
        </div>

        {canManageMembers && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join this project with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteData.role}
                    onValueChange={(value: "owner" | "editor" | "viewer") =>
                      setInviteData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          <span>Viewer - Can view bots and analytics</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center gap-2">
                          <Edit className="h-3 w-3" />
                          <span>Editor - Can create and edit bots</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="owner">
                        <div className="flex items-center gap-2">
                          <Crown className="h-3 w-3" />
                          <span>Owner - Full project access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteMember} disabled={!inviteData.email.trim()}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team Members List */}
      <div className="grid gap-4">
        {currentProject.members.map((member) => (
          <Card key={member.userId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatar || "/placeholder.svg"} alt={member.user.name} />
                    <AvatarFallback>
                      {member.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{member.user.name}</h3>
                      {member.userId === currentUser?.id && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1">
                    {getRoleIcon(member.role)}
                    {member.role}
                  </Badge>

                  {canManageMembers && member.userId !== currentUser?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(member.userId, "owner")}>
                          <Crown className="h-4 w-4 mr-2" />
                          Make Owner
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.userId, "editor")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Make Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.userId, "viewer")}>
                          <Eye className="h-4 w-4 mr-2" />
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
          <CardDescription>Understanding what each role can do in this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Viewer</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View bots and analytics</li>
                <li>• Access chat history</li>
                <li>• View team members</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Editor</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All viewer permissions</li>
                <li>• Create and edit bots</li>
                <li>• Upload files</li>
                <li>• Generate embed codes</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Owner</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All editor permissions</li>
                <li>• Manage team members</li>
                <li>• Delete project</li>
                <li>• Change project settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
