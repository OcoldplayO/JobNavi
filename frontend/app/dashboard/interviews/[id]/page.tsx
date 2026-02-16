"use client"

import { useRouter } from "next/navigation"
import { use } from "react"
import InterviewDetailPage from "@/components/interview-detail-page"

// Dynamic route parameters are passed as a Promise in newer Next.js versions, 
// but for standard client components in App Router, we often access params via props.
// However, since this is a client component, we should be careful. 
// Actually, in Next.js 15+, params is a Promise. In 14, it's an object.
// Let's assume standard behavior for now. usage of `use` is for unwrapping promises.

export default function InterviewDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    // Unwrap params using React.use() if available or await it if it's a server component.
    // Since this is a client component ('use client'), we receive params as a promise in newer versions.
    // To be safe and compatible with recent Next.js 15 changes (which made params async), we use `use`.

    const { id } = use(params)

    return (
        <InterviewDetailPage
            interviewId={parseInt(id)}
            onBack={() => router.back()}
        />
    )
}
