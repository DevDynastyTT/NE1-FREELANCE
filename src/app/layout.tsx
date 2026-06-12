import '@/app/globals.css'
import "bootstrap/dist/css/bootstrap.min.css"

export const metadata = {
  title: 'NE1-FREELANCE',
  description: 'Find and hire talented freelancers for your projects. NE1-FREELANCE offers a wide range of freelancing services for businesses and individuals.',
  keywords: 'freelance, freelancers, freelancing services, hire freelancers, find freelancers, freelance projects, remote freelancers, freelance marketplace, freelance jobs, freelance gigs, freelance platform, freelance work, freelance services, freelance professionals, hire freelancers, find freelancers, freelance skills, freelance portfolio, freelance rates, freelance contracts, freelance collaboration, freelance networking, freelance success, freelance tips, freelance community',
  author: 'Drgn Studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
