import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { LawyersTable } from '@/components/admin/lawyers-table'

export default async function AdminLawyersPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Fetch all lawyers with related data
  const lawyers = await db.lawyer.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      firm: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    }
  })

  // Calculate average ratings for each lawyer
  const lawyersWithRatings = await Promise.all(
    lawyers.map(async (lawyer) => {
      const avgRatingResult = await db.review.aggregate({
        where: {
          lawyerId: lawyer.id,
          status: 'APPROVED'
        },
        _avg: {
          overallRating: true
        }
      })

      return {
        ...lawyer,
        avgRating: avgRatingResult._avg.overallRating || 0
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lawyers Management</h1>
        <p className="text-slate-600 mt-2">
          View and manage all lawyers registered on the platform
        </p>
      </div>

      <LawyersTable lawyers={lawyersWithRatings} />
    </div>
  )
}