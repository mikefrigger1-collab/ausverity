'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Eye,
  Edit,
  Star,
  Building2,
  Calendar,
  Crown,
  Users
} from 'lucide-react'

interface LawyerData {
  id: string
  firstName: string
  lastName: string
  photoUrl: string | null
  status: string
  isPaidUser: boolean
  yearsExperience: number | null
  createdAt: Date
  firm: {
    name: string
  } | null
  _count: {
    reviews: number
  }
  avgRating: number
  slug: string
}

interface LawyersTableProps {
  lawyers: LawyerData[]
}

export function LawyersTable({ lawyers }: LawyersTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [accountFilter, setAccountFilter] = useState<string>('all')

  // Filter lawyers
  const filteredLawyers = lawyers.filter((lawyer) => {
    const fullName = `${lawyer.firstName} ${lawyer.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         lawyer.firm?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || lawyer.status === statusFilter

    const matchesAccount = accountFilter === 'all' ||
                          (accountFilter === 'paid' && lawyer.isPaidUser) ||
                          (accountFilter === 'free' && !lawyer.isPaidUser)

    return matchesSearch && matchesStatus && matchesAccount
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'PENDING':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700 border-slate-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          All Lawyers
        </CardTitle>
        <CardDescription>
          Manage and view all registered lawyers on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or firm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="paid">Premium Only</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredLawyers.length} of {lawyers.length} lawyers
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Lawyer</TableHead>
                <TableHead>Firm</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-center">Reviews</TableHead>
                <TableHead className="text-center">Experience</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLawyers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No lawyers found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredLawyers.map((lawyer) => (
                  <TableRow key={lawyer.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={lawyer.photoUrl || ''} alt={`${lawyer.firstName} ${lawyer.lastName}`} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {lawyer.firstName[0]}{lawyer.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">
                            {lawyer.firstName} {lawyer.lastName}
                          </p>
                          <p className="text-sm text-slate-500">ID: {lawyer.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lawyer.firm ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{lawyer.firm.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No firm</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(lawyer.status)}>
                        {lawyer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lawyer.isPaidUser ? (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-600">
                          Free
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{lawyer.avgRating > 0 ? lawyer.avgRating.toFixed(1) : '-'}</span>
                        <span className="text-sm text-slate-500">({lawyer._count.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {lawyer.yearsExperience ? (
                        <span className="text-sm font-medium">{lawyer.yearsExperience}+ years</span>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(lawyer.createdAt).toLocaleDateString('en-AU', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/lawyer/${lawyer.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/lawyers/${lawyer.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}