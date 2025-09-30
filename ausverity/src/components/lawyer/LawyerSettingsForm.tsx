"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Bell, Eye, FileText } from 'lucide-react'
import { ProfileStatus } from '@prisma/client'

interface LawyerSettingsFormProps {
  lawyer: {
    id: string
    displayPhone: boolean
    displayEmail: boolean
    status: ProfileStatus
    user: {
      id: string
      email: string
      name: string | null
    }
  }
}

export function LawyerSettingsForm({ lawyer }: LawyerSettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Account Information
  const [email, setEmail] = useState(lawyer.user.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Contact Preferences
  const [displayPhone, setDisplayPhone] = useState(lawyer.displayPhone)
  const [displayEmail, setDisplayEmail] = useState(lawyer.displayEmail)

  // Notification Preferences
  const [notifyNewReviews, setNotifyNewReviews] = useState(true)
  const [notifyClientInquiries, setNotifyClientInquiries] = useState(true)
  const [notifyFirmInvitations, setNotifyFirmInvitations] = useState(true)

  // Profile Visibility
  const [profileStatus, setProfileStatus] = useState(lawyer.status)

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/lawyer/settings/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Failed to update account')
      }

      toast.success('Account information updated successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update account information')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/lawyer/settings/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (!response.ok) {
        throw new Error('Failed to update password')
      }

      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactPreferencesUpdate = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/lawyer/settings/contact-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayPhone, displayEmail })
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      toast.success('Contact preferences updated')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update contact preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/lawyer/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notifyNewReviews,
          notifyClientInquiries,
          notifyFirmInvitations
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update notifications')
      }

      toast.success('Notification preferences updated')
    } catch (error) {
      toast.error('Failed to update notification preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileVisibilityUpdate = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/lawyer/settings/visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: profileStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update visibility')
      }

      toast.success('Profile visibility updated')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update profile visibility')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-slate-600" />
            <CardTitle>Account Information</CardTitle>
          </div>
          <CardDescription>Update your email address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccountUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-slate-600" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-slate-600" />
            <CardTitle>Contact Visibility</CardTitle>
          </div>
          <CardDescription>Control what contact information is displayed publicly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Display Phone Number</Label>
              <p className="text-sm text-slate-500">Show your phone number on your public profile</p>
            </div>
            <Switch
              checked={displayPhone}
              onCheckedChange={setDisplayPhone}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Display Email Address</Label>
              <p className="text-sm text-slate-500">Show your email address on your public profile</p>
            </div>
            <Switch
              checked={displayEmail}
              onCheckedChange={setDisplayEmail}
            />
          </div>
          <Button onClick={handleContactPreferencesUpdate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-slate-600" />
            <CardTitle>Email Notifications</CardTitle>
          </div>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Reviews</Label>
              <p className="text-sm text-slate-500">Get notified when you receive a new review</p>
            </div>
            <Switch
              checked={notifyNewReviews}
              onCheckedChange={setNotifyNewReviews}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Client Inquiries</Label>
              <p className="text-sm text-slate-500">Get notified when clients contact you</p>
            </div>
            <Switch
              checked={notifyClientInquiries}
              onCheckedChange={setNotifyClientInquiries}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Firm Invitations</Label>
              <p className="text-sm text-slate-500">Get notified about invitations to join law firms</p>
            </div>
            <Switch
              checked={notifyFirmInvitations}
              onCheckedChange={setNotifyFirmInvitations}
            />
          </div>
          <Button onClick={handleNotificationUpdate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-slate-600" />
            <CardTitle>Profile Visibility</CardTitle>
          </div>
          <CardDescription>Control whether your profile is publicly visible</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Status</Label>
              <p className="text-sm text-slate-500">
                Current status: <span className="font-medium">{profileStatus}</span>
              </p>
            </div>
            <Switch
              checked={profileStatus === 'PUBLISHED'}
              onCheckedChange={(checked) => setProfileStatus(checked ? 'PUBLISHED' : 'DRAFT')}
            />
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              <strong>Published:</strong> Your profile is visible to the public and searchable.<br />
              <strong>Draft:</strong> Your profile is hidden from public view.
            </p>
          </div>
          <Button onClick={handleProfileVisibilityUpdate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Visibility
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}