import './globals.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import Head from 'next/head'
export const metadata = {
  description: 'Find and hire talented freelancers for your projects. NE1-FREELANCE offers a wide range of freelancing services for businesses and individuals.',
  keywords: 'freelance, freelancers, freelancing services, hire freelancers, find freelancers, freelance projects, remote freelancers, freelance marketplace, freelance jobs, freelance gigs, freelance platform, freelance work, freelance services, freelance professionals, hire freelancers, find freelancers, freelance skills, freelance portfolio, freelance rates, freelance contracts, freelance collaboration, freelance networking, freelance success, freelance tips, freelance community',
  author: 'Drgn Studio',
  image: '/public/favicon.ico',
  url: 'https://ne1freelance.vercel.app/', 
}

type LayoutProps = {
  children: React.ReactNode;
  title: string;
}

export default function RootLayout(props: LayoutProps) {
  return (
    <>
      <html lang="en">
        <body>
          {props.children}
        </body>
      </html>
    </>
  )
}
