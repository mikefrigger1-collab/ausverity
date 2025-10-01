import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { FirmsTable } from '@/components/admin/firms-table'

export default async function AdminFirmsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Fetch all firms with related data
  const firms = await db.lawFirm.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      locations: {
        select: {
          city: true,
          state: true
        }
      },
      _count: {
        select: {
          lawyers: true,
          reviews: true
        }
      }
    }
  })

  // Calculate average ratings for each firm
  const firmsWithRatings = await Promise.all(
    firms.map(async (firm) => {
      const avgRatingResult = await db.review.aggregate({
        where: {
          firmId: firm.id,
          status: 'APPROVED'
        },
        _avg: {
          overallRating: true
        }
      })

      return {
        ...firm,
        avgRating: avgRatingResult._avg.overallRating || 0
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Law Firms Management</h1>
        <p className="text-slate-600 mt-2">
          View and manage all law firms registered on the platform
        </p>
      </div>

      <FirmsTable firms={firmsWithRatings} />
    </div>
  )
}