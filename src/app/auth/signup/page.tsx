import SignUpComponent from '@/components/auth/signup/SignUpComponent'
import GlobalFooter from '@/components/GlobalFooter'

export default function SignupPage() {
  return (
    <div className="flex flex-col flex-1">
      <SignUpComponent />
      <GlobalFooter />
    </div>
  )
}
