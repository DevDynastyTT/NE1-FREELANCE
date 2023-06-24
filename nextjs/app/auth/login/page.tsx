'use client'
import '@styles/members/members.css'
import {useRouter} from 'next/navigation';
import LoginComponent from '@components/auth/login/LoginComponent';
export default function Login(){
  const router = useRouter()
  return  (
    <>
      <head>
        <title>Login</title>
      </head>
      
      <LoginComponent router={router} />
    </>
  )
}

