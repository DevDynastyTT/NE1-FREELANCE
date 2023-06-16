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

export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* <GlobalFooter/> */}
        </body>
    </html>
  )
}