import '@styles/jobs/jobDetails.css'
import JobDetailsComponent from "@components/jobs/[id]/JobDetailsComponent"
import GlobalFooter from '@components/GlobalFooter'

import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Job Description - NE1-FREELANCE',
}

export default function JobDetailsPage() {
  return (
    <>
        <JobDetailsComponent />
        <GlobalFooter/>

    </>
  )
}
