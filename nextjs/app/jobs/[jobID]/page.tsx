import '@styles/jobs/jobDetails.css'
import JobDetailsComponent from "@components/jobs/[jobID]/JobDetailsComponent"
import GlobalFooter from '@components/GlobalFooter'

import Head from 'next/head'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Job Description - NE1-FREELANCE',
}

export default function CreateJobPage() {
  return (
    <>
        <Head>
            <title>NE1-FREELANCE</title>
        </Head>
        <JobDetailsComponent />
        <GlobalFooter/>

    </>
  )
}
