import JobDetailsComponent from '@/components/jobs/[id]/JobDetailsComponent'
import GlobalFooter from '@/components/GlobalFooter'

export default function JobDetailsPage() {
  return (
    <div className="flex flex-col flex-1">
      <JobDetailsComponent />
      <GlobalFooter />
    </div>
  )
}
