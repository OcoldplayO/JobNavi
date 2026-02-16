"use client"

import { useRouter } from "next/navigation"
import JobListPage from "@/components/job-list-page"

export default function JobsPage() {
    const router = useRouter()

    return (
        <JobListPage
            onBack={() => router.back()}
        />
    )
}
