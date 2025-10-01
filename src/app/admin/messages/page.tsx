"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Search, Eye, Archive, CheckCircle, Clock, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED'
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchQuery, statusFilter])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/messages')
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((msg) => msg.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query)
      )
    }

    setFilteredMessages(filtered)
  }

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    setAdminNotes(message.adminNotes || "")
    setIsDialogOpen(true)

    // Mark as read if it's new
    if (message.status === 'NEW') {
      await updateMessageStatus(message.id, 'READ')
    }
  }

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      // Update local state
      setMessages(messages.map((msg) =>
        msg.id === id ? { ...msg, status: status as ContactMessage['status'] } : msg
      ))

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: status as ContactMessage['status'] })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedMessage) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      })

      if (!response.ok) throw new Error('Failed to save notes')

      // Update local state
      setMessages(messages.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, adminNotes } : msg
      ))
      setSelectedMessage({ ...selectedMessage, adminNotes })

      alert('Notes saved successfully')
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: ContactMessage['status']) => {
    const variants = {
      NEW: { color: "bg-blue-100 text-blue-800", label: "New" },
      READ: { color: "bg-yellow-100 text-yellow-800", label: "Read" },
      RESPONDED: { color: "bg-green-100 text-green-800", label: "Responded" },
      ARCHIVED: { color: "bg-gray-100 text-gray-800", label: "Archived" },
    }

    const variant = variants[status]
    return (
      <Badge className={`${variant.color} hover:${variant.color}`}>
        {variant.label}
      </Badge>
    )
  }

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'NEW').length,
    read: messages.filter(m => m.status === 'READ').length,
    responded: messages.filter(m => m.status === 'RESPONDED').length,
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-600 mt-2">
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Messages</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Read</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Responded</p>
                <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="READ">Read</SelectItem>
                <SelectItem value="RESPONDED">Responded</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
          <CardDescription>
            Click on a message to view details and respond
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No messages found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id} className={message.status === 'NEW' ? 'bg-blue-50' : ''}>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.message.substring(0, 100)}...</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View and manage contact form submission
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Status Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedMessage.status === 'READ' ? 'default' : 'outline'}
                  onClick={() => updateMessageStatus(selectedMessage.id, 'READ')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button
                  size="sm"
                  variant={selectedMessage.status === 'RESPONDED' ? 'default' : 'outline'}
                  onClick={() => updateMessageStatus(selectedMessage.id, 'RESPONDED')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Responded
                </Button>
                <Button
                  size="sm"
                  variant={selectedMessage.status === 'ARCHIVED' ? 'default' : 'outline'}
                  onClick={() => updateMessageStatus(selectedMessage.id, 'ARCHIVED')}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
              </div>

              {/* Message Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Name</Label>
                  <p className="text-slate-900 mt-1">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Email</Label>
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline mt-1 block">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Phone</Label>
                    <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline mt-1 block">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-slate-600">Received</Label>
                  <p className="text-slate-900 mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label className="text-sm font-medium text-slate-600">Message</Label>
                <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
                  <p className="text-slate-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes" className="text-sm font-medium text-slate-600">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this message..."
                  rows={4}
                  className="mt-2"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="mt-2"
                  size="sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Notes'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
