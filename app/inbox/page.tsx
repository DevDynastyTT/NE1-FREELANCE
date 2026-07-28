import InboxComponent from '@/components/inbox/InboxComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inbox - NE1-FREELANCE',
}

export default function InboxPage() {
  return <InboxComponent />
}
