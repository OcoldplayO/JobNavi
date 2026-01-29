"use client"

import { useState } from "react"
import HomePage from "@/components/home-page"
import JobListPage from "@/components/job-list-page"
import InterviewListPage from "@/components/interview-list-page"
import InterviewDetailPage from "@/components/interview-detail-page"

export type PageType = "home" | "jobs" | "interviews" | "interview-detail"

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [selectedInterview, setSelectedInterview] = useState<number | null>(null)

  const navigateTo = (page: PageType) => {
    setCurrentPage(page)
  }

  const openInterviewDetail = (id: number) => {
    setSelectedInterview(id)
    setCurrentPage("interview-detail")
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen bg-[#F5F7FA] relative shadow-xl">
        {currentPage === "home" && <HomePage onNavigate={navigateTo} />}
        {currentPage === "jobs" && <JobListPage onBack={() => navigateTo("home")} />}
        {currentPage === "interviews" && (
          <InterviewListPage onBack={() => navigateTo("home")} onSelectInterview={openInterviewDetail} />
        )}
        {currentPage === "interview-detail" && selectedInterview && (
          <InterviewDetailPage interviewId={selectedInterview} onBack={() => navigateTo("interviews")} />
        )}
      </div>
    </div>
  )
}
