import { Suspense } from 'react'
import ResetPasswordComponent from '@/components/auth/reset-password/ResetPasswordComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password — NE1 Freelance',
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordComponent />
    </Suspense>
  )
}
