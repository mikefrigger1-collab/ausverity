'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Star,
  Calendar,
  MessageSquare,
  User
} from 'lucide-react'

interface ReviewData {
  id: string
  overallRating: number
  comment: string
  status: string
  targetType: string
  createdAt: Date
  author: {
    name: string | null
    email: string
    image: string | null
  }
  lawyer: {
    firstName: string
    lastName: string
  } | null
  firm: {
    name: string
  } | null
  communicationRating: number
  expertiseRating: number
  valueRating: number
  outcomeRating: number | null
}

interface ReviewsTableProps {
  reviews: ReviewData[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [targetFilter, setTargetFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const authorName = review.author.name || review.author.email
    const targetName = review.targetType === 'LAWYER' && review.lawyer
      ? `${review.lawyer.firstName} ${review.lawyer.lastName}`
      : review.targetType === 'FIRM' && review.firm
      ? review.firm.name
      : ''

    const matchesSearch = authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter

    const matchesTarget = targetFilter === 'all' || review.targetType === targetFilter

    const matchesRating = ratingFilter === 'all' ||
                         (ratingFilter === '5' && review.overallRating === 5) ||
                         (ratingFilter === '4' && review.overallRating === 4) ||
                         (ratingFilter === '3' && review.overallRating === 3) ||
                         (ratingFilter === '1-2' && review.overallRating <= 2)

    return matchesSearch && matchesStatus && matchesTarget && matchesRating
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'PENDING':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'FLAGGED':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const getTargetName = (review: ReviewData) => {
    if (review.targetType === 'LAWYER' && review.lawyer) {
      return `${review.lawyer.firstName} ${review.lawyer.lastName}`
    }
    if (review.targetType === 'FIRM' && review.firm) {
      return review.firm.name
    }
    return 'Unknown'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          All Reviews
        </CardTitle>
        <CardDescription>
          View and moderate all reviews submitted on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by author, target, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FLAGGED">Flagged</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={targetFilter} onValueChange={setTargetFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="LAWYER">Lawyers</SelectItem>
              <SelectItem value="FIRM">Firms</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="1-2">1-2 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Author</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No reviews found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={review.author.image || ''} alt={review.author.name || 'User'} />
                          <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-semibold">
                            {review.author.name?.[0]?.toUpperCase() || review.author.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {review.author.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">
                            {review.author.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          {review.targetType}
                        </Badge>
                        <p className="text-sm font-medium text-slate-900">
                          {getTargetName(review)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-base">{review.overallRating.toFixed(1)}</span>
                        </div>
                        <div className="flex gap-1 text-xs text-slate-500">
                          <span>C:{review.communicationRating}</span>
                          <span>E:{review.expertiseRating}</span>
                          <span>V:{review.valueRating}</span>
                          {review.outcomeRating && <span>O:{review.outcomeRating}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-700 line-clamp-2 max-w-[300px]">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span className="whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString('en-AU', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/reviews/${review.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
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