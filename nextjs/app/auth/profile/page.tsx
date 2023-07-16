import '@styles/members/profile.css'
import '@styles/nav/navbar.css'
import { Metadata } from 'next'
import ProfileComponent from '@components/auth/profile/ProfileComponent'

export const metadata:Metadata = {
  title: 'Profile - NE1-FREELANCE'
}
export default function ProfilePage() {
  return (
    <>
        <ProfileComponent />
    </>
  )
}
