import '@styles/members/members.css'
import SignUpComponent from '@components/auth/signup/SignUpComponent'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Signup - NE1-FREELANCE'
}
export default function SignupPage(){
  return  (
    <>
      <head>
        <title>SignUp</title>
      </head>
      <SignUpComponent/>
    </>
  )
}

