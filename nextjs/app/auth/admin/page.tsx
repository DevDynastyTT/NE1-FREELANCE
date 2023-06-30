import AdminComponent from '@components/auth/admin/AdminComponent'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Admin Dashboard'
}
export default function AdminPage() {
    return (
      <>
        <AdminComponent />
      </>
      
      )
  }