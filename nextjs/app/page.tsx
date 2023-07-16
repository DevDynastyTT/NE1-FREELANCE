import MainHomeComponent from '@components/home/Main'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: 'NE1-FREELANCE',
};


export default function HomePage() {
  return (
    <MainHomeComponent />
  )
}
