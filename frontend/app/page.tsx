"use client"

import HomePage from "@/components/home-page"
// Legacy state-based routing removed in favor of App Router
// JobListPage -> /dashboard/jobs
// InterviewListPage -> /dashboard/interviews

export default function App() {
  // onNavigate is no longer needed since HomePage uses router.push directly for new routes
  // But we might need to keep the prop interface or update HomePage. 
  // Let's check HomePage props again. It expects onNavigate.
  // We should remove that prop from HomePage as well to be clean.

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen bg-[#F5F7FA] relative shadow-xl">
        <HomePage onNavigate={() => { }} />
      </div>
    </div>
  )
}
