import { NextResponse } from 'next/server'
import { getMaintenanceMode } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { enabled, message } = await getMaintenanceMode()
  return NextResponse.json({ enabled, message })
}
