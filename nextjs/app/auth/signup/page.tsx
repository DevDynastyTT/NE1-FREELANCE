'use client'
import '@styles/members/members.css'
import {useRouter} from 'next/navigation';
import SignUpComponent from '@components/auth/signup/SignUpComponent'
export default function Signup(){
  const router = useRouter()

  return  <SignUpComponent router={router}/>
}

