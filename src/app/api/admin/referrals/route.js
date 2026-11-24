import { requireAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!requireAdmin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const records = await prisma.siteSetting.findMany({
    where: { key: { startsWith: 'referral-commission:' } },
    select: { key: true, value: true },
    orderBy: { id: 'desc' },
  })

  return Response.json(records.map(({ key, value }) => ({
    ...JSON.parse(value),
    referrerId: Number(key.split(':')[1]),
  })), { headers: { 'Cache-Control': 'private, no-store' } })
}
