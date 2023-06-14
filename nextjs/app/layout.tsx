import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Head from 'next/head'
export const metadata = {
  title: 'NE1-FREELANCE',
  description: 'Freelancing Services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/N.png" sizes="any" />      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
