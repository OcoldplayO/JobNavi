"use client"

import { useState } from "react"
import { ChevronLeft, Calendar, Clock } from "lucide-react"
import InterviewCard from "./interview-card"

interface InterviewListPageProps {
  onBack: () => void
  onSelectInterview: (id: number) => void
}

const mockInterviews = [
  {
    id: 1,
    date: "01/15",
    dayOfWeek: "周三",
    time: "10:00",
    company: "星辰科技有限公司",
    position: "前端开发工程师",
    address: "北京市海淀区中关村软件园",
    status: "upcoming" as const,
  },
  {
    id: 2,
    date: "01/16",
    dayOfWeek: "周四",
    time: "14:30",
    company: "智慧云计算",
    position: "后端开发工程师",
    address: "北京市朝阳区望京SOHO",
    status: "upcoming" as const,
  },
  {
    id: 3,
    date: "01/17",
    dayOfWeek: "周五",
    time: "09:30",
    company: "创新互联网公司",
    position: "产品经理",
    address: "北京市海淀区五道口",
    status: "upcoming" as const,
  },
  {
    id: 4,
    date: "01/10",
    dayOfWeek: "周五",
    time: "11:00",
    company: "数字未来科技",
    position: "UI设计师",
    address: "北京市东城区王府井",
    status: "completed" as const,
  },
]

export default function InterviewListPage({ onBack, onSelectInterview }: InterviewListPageProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("timeline")

  const upcomingInterviews = mockInterviews.filter((i) => i.status === "upcoming")
  const completedInterviews = mockInterviews.filter((i) => i.status === "completed")

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      {/* 顶部切换栏 */}
      <div className="bg-white shadow-sm">
        <div className="h-[70px] px-4 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="p-1">
              <ChevronLeft className="w-6 h-6 text-[#333333]" />
            </button>
            <h1 className="text-lg font-semibold text-[#333333]">面试日程</h1>
            <div className="w-8" />
          </div>

          {/* 切换控件 */}
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1 pb-1 text-sm ${
                viewMode === "calendar" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-[#666666]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              日历切换
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1 pb-1 text-sm ${
                viewMode === "timeline" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-[#666666]"
              }`}
            >
              <Clock className="w-4 h-4" />
              时间轴
            </button>
          </div>
        </div>
      </div>

      {/* 面试列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 即将进行 */}
        {upcomingInterviews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-[#333333] mb-3">即将进行</h2>
            <div className="flex flex-col gap-4">
              {upcomingInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={() => onSelectInterview(interview.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 已完成 */}
        {completedInterviews.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#666666] mb-3">已完成</h2>
            <div className="flex flex-col gap-4">
              {completedInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={() => onSelectInterview(interview.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
