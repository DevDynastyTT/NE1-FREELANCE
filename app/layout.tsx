import type { Metadata } from 'next'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'NE1-FREELANCE',
  description: 'Find and hire talented freelancers for your projects. NE1-FREELANCE offers a wide range of freelancing services for businesses and individuals.',
  keywords: 'freelance, freelancers, freelancing services, hire freelancers, find freelancers, freelance projects, remote freelancers, freelance marketplace, freelance jobs, freelance gigs, freelance platform, freelance work, freelance services, freelance professionals, hire freelancers, find freelancers, freelance skills, freelance portfolio, freelance rates, freelance contracts, freelance collaboration, freelance networking, freelance success, freelance tips, freelance community',
  authors: [{ name: 'Drgn Studio' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  )
}
