import './globals.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS

import { Inter } from 'next/font/google'
import GlobalFooter from '@components/GlobalFooter'
const inter = Inter({ subsets: ['latin'] })
import Head from 'next/head'

export const metadata = {
  title: 'NE1-FREELANCE',
  description: 'Freelancing Services',
}

type childrenProps = { children: React.ReactNode}
export default function RootLayout(props: childrenProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {props.children}
        <GlobalFooter/>
        </body>
    </html>
  )
}