import '@styles/auth/login_signup/members.css'
import SignUpComponent from '@components/auth/signup/SignUpComponent'
import { Metadata } from 'next'
import GlobalFooter from '../../../components/GlobalFooter';

export const metadata:Metadata = {
  title: 'Signup - NE1-FREELANCE'
}
export default function SignupPage(){
  return  (
    <>
      <SignUpComponent/>
      <GlobalFooter />
    </>
  )
}

