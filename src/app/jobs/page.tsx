import { Suspense } from 'react'
import JobsComponent from '@/components/jobs/JobsComponent'
import GlobalFooter from '@/components/GlobalFooter'

export default function JobsPage() {
  return (
    <div className="flex flex-col flex-1">
      <Suspense>
        <JobsComponent />
      </Suspense>
      <GlobalFooter />
    </div>
  )
}
