'use client'

import ErrorSection from '@/components/ui/ErrorSection'

export default function CheckoutError({ error, reset }) {
  return <ErrorSection error={error} reset={reset} />
}
