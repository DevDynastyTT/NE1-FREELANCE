'use client'

import { useParams } from "next/navigation"

export default function page() {
  const {id} = useParams()

  return (
    <div>
      Coming soon
    </div>
  )
}
