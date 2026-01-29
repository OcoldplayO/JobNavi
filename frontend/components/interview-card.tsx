"use client"

import { MapPin } from "lucide-react"

interface Interview {
  id: number
  date: string
  dayOfWeek: string
  time: string
  company: string
  position: string
  address: string
  status: "upcoming" | "completed"
}

interface InterviewCardProps {
  interview: Interview
  onClick: () => void
}

export default function InterviewCard({ interview, onClick }: InterviewCardProps) {
  const isCompleted = interview.status === "completed"

  return (
    <div
      onClick={onClick}
      className={`flex bg-white rounded-[10px] border border-[#EEEEEE] overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* 左侧日期区 */}
      <div className="w-[60px] bg-[#F0F2F5] flex flex-col items-center justify-center py-3">
        <span className="text-lg font-semibold text-[#333333]">{interview.date.split("/")[1]}</span>
        <span className="text-xs text-[#666666]">{interview.dayOfWeek}</span>
      </div>

      {/* 右侧信息区 */}
      <div className="flex-1 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#333333]">{interview.company}</span>
          <span className="text-sm text-[#4A90E2]">{interview.time}</span>
        </div>
        <p className="text-sm text-[#4A90E2] mb-2">{interview.position}</p>
        <div className="flex items-center gap-1 text-xs text-[#666666]">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{interview.address}</span>
        </div>
      </div>
    </div>
  )
}
