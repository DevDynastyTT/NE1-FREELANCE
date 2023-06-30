import MessagesComponent from "@components/auth/messages/MessagesComponent";
import GlobalFooter from '@components/GlobalFooter'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Messages - NE1-FREELANCE'
}
export default function MessagesPage() {
  return (
    <>
        <MessagesComponent />
        <GlobalFooter/>

    </>
  )
}
