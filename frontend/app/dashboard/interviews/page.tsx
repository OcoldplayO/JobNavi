"use client"

import { useRouter } from "next/navigation"
import InterviewListPage from "@/components/interview-list-page"

export default function InterviewsPage() {
    const router = useRouter()

    return (
        <InterviewListPage
            onBack={() => router.back()}
            onSelectInterview={(id) => router.push(`/dashboard/interviews/${id}`)}
        />
    )
}
