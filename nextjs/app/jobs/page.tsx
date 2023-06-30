import JobsComponent from '@components/jobs/JobsComponent'
import GlobalFooter from '@components/GlobalFooter'

import '@styles/searchResults/style.css'
import Head from 'next/head'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Jobs - NE1-FREELANCE'
}


export default function JobsPage(){

return (
    <>
        <JobsComponent />
        <GlobalFooter/>

    </>
)
}

