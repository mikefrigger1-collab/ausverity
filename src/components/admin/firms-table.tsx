'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  MapPin,
  Calendar,
  Crown,
  Building2,
  Users
} from 'lucide-react'
import { getFirmUrl } from '@/lib/utils/url-helpers'

interface FirmData {
  id: string
  name: string
  status: string
  isPaidUser: boolean
  createdAt: Date
  _count: {
    lawyers: number
    reviews: number
  }
  locations: {
    city: string
    state: string
  }[]
  avgRating: number
  slug: string | null
}

interface FirmsTableProps {
  firms: FirmData[]
}

export function FirmsTable({ firms }: FirmsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [accountFilter, setAccountFilter] = useState<string>('all')

  // Filter firms
  const filteredFirms = firms.filter((firm) => {
    const matchesSearch = firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         firm.locations.some(loc =>
                           `${loc.city}, ${loc.state}`.toLowerCase().includes(searchQuery.toLowerCase())
                         )

    const matchesStatus = statusFilter === 'all' || firm.status === statusFilter

    const matchesAccount = accountFilter === 'all' ||
                          (accountFilter === 'paid' && firm.isPaidUser) ||
                          (accountFilter === 'free' && !firm.isPaidUser)

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
          <Building2 className="h-5 w-5 text-purple-600" />
          All Law Firms
        </CardTitle>
        <CardDescription>
          Manage and view all registered law firms on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or location..."
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
          Showing {filteredFirms.length} of {firms.length} firms
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Firm Name</TableHead>
                <TableHead>Location(s)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-center">Lawyers</TableHead>
                <TableHead className="text-center">Reviews</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFirms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No firms found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredFirms.map((firm) => (
                  <TableRow key={firm.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{firm.name}</p>
                          <p className="text-sm text-slate-500">ID: {firm.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {firm.locations.length > 0 ? (
                        <div className="space-y-1">
                          {firm.locations.slice(0, 2).map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span>{loc.city}, {loc.state}</span>
                            </div>
                          ))}
                          {firm.locations.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{firm.locations.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No locations</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(firm.status)}>
                        {firm.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {firm.isPaidUser ? (
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
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{firm._count.lawyers}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{firm.avgRating > 0 ? firm.avgRating.toFixed(1) : '-'}</span>
                        <span className="text-sm text-slate-500">({firm._count.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(firm.createdAt).toLocaleDateString('en-AU', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {firm.slug && firm.locations.length > 0 && (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={getFirmUrl({ slug: firm.slug, locations: firm.locations }) || `/firm/${firm.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/firms/${firm.id}`}>
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