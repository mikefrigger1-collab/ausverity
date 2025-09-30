"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UserRoleManagerProps {
  userId: string
  currentRole: string
}

const roles = [
  { value: 'CLIENT', label: 'Client', description: 'Can write reviews only' },
  { value: 'LAWYER', label: 'Lawyer', description: 'Can manage lawyer profile' },
  { value: 'FIRM_OWNER', label: 'Firm Owner', description: 'Can manage firm profile' },
  { value: 'ADMIN', label: 'Admin', description: 'Full platform access' },
]

export default function UserRoleManager({ userId, currentRole }: UserRoleManagerProps) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)

  const hasChanged = selectedRole !== currentRole

  const handleUpdateRole = async () => {
    if (!hasChanged) {
      toast.info('No changes to save')
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newRole: selectedRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role')
      }

      toast.success('User role updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
      // Reset to current role on error
      setSelectedRole(currentRole)
    } finally {
      setIsUpdating(false)
    }
  }

  const selectedRoleInfo = roles.find(r => r.value === selectedRole)

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Changing a user's role will affect their permissions and access to features.
          Use caution when modifying roles.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="role">User Role</Label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                <div>
                  <p className="font-medium">{role.label}</p>
                  <p className="text-xs text-slate-500">{role.description}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRoleInfo && (
        <div className="bg-slate-50 p-3 rounded-md">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Selected:</span> {selectedRoleInfo.label}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {selectedRoleInfo.description}
          </p>
        </div>
      )}

      <Button
        onClick={handleUpdateRole}
        disabled={!hasChanged || isUpdating}
        className="w-full"
      >
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Updating Role...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Role Change
          </>
        )}
      </Button>
    </div>
  )
}