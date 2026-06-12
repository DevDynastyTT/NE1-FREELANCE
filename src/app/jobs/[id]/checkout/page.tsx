'use client'
import { useParams } from 'next/navigation'

export default function CheckoutPage() {
  const params = useParams()
  return <div>Checkout for job {params.id} — Coming soon</div>
}
