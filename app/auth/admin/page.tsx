import AdminComponent from '@/components/auth/admin/AdminComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default function AdminDashboardPage() {
  return <AdminComponent />
}
