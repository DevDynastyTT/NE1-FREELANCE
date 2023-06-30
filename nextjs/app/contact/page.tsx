import "@styles/contact/contact.css";

import GlobalFooter from "@components/GlobalFooter"

import ContactComponent from "@components/contact/ContactComponent"
import Head from 'next/head'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - NE1-FREELANCE',
}
export default function ContactPage() {
  return (
    <>
      <Head key="contact-page">
        <title>Contact Us</title>
      </Head>

      <ContactComponent />

      <GlobalFooter />
    </>
  )
}
