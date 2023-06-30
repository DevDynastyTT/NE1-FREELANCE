import '@styles/jobs/createjob.css'
import CreateJobComponent from "@components/jobs/create/CreateJobComponent";
import GlobalFooter from '@components/GlobalFooter'

import Head from 'next/head'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Create Job - NE1-FREELANCE'
}

export default function CreateJobPage() {
  return (
    <>
        <CreateJobComponent />
        <GlobalFooter/>

    </>
  )
}
