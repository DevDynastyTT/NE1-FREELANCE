import InboxComponent from "@components/auth/inbox/InboxComponent";
import '@styles/inbox/inbox.css'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Inbox - NE1-FREELANCE'
}
export default function InboxPage() {
  return (
        <InboxComponent />
  )
}
