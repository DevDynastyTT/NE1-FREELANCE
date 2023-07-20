import '@styles/auth/login_signup/members.css'
import LoginComponent from '@components/auth/login/LoginComponent';
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Login - NE1-FREELANCE'
}
export default function LoginPage(){
  return  (
    <>
      <LoginComponent />
    </>
  )
}

