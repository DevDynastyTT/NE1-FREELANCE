import MainHomeComponent from '@/components/home/Main'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NE1-FREELANCE',
}

export default function HomePage() {
  return <MainHomeComponent />
}
