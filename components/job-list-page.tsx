"use client"

import { useState } from "react"
import { Search, ChevronLeft, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import JobCard from "./job-card"
import RiskModal from "./risk-modal"

interface JobListPageProps {
  onBack: () => void
}

const educationFilters = ["全部", "大专", "本科", "硕士"]
const experienceFilters = ["全部", "应届生", "1-3年", "3-5年"]
const salaryFilters = ["全部", "3k-5k", "5k-10k", "10k+"]

const mockJobs = [
  {
    id: 1,
    company: "星辰科技有限公司",
    position: "前端开发工程师",
    salary: "8k-15k",
    established: "2020年成立",
    capital: "注册资本500万",
    size: "规模50-100人",
    riskLevel: "green" as const,
    riskReasons: [],
  },
  {
    id: 2,
    company: "创新互联网公司",
    position: "产品经理",
    salary: "12k-20k",
    established: "2023年成立",
    capital: "注册资本80万",
    size: "规模10-20人",
    riskLevel: "yellow" as const,
    riskReasons: ["公司成立时间不足1年，稳定性待验证", "注册资本较低，需进一步核实"],
  },
  {
    id: 3,
    company: "未来数据科技",
    position: "数据分析师",
    salary: "6k-10k",
    established: "2024年成立",
    capital: "注册资本50万",
    size: "规模5-10人",
    riskLevel: "red" as const,
    riskReasons: ["注册资本低于100万，存在经营风险", "公司成立时间不足1年，稳定性待验证", "公司规模较小，发展空间有限"],
  },
  {
    id: 4,
    company: "智慧云计算",
    position: "后端开发工程师",
    salary: "15k-25k",
    established: "2018年成立",
    capital: "注册资本2000万",
    size: "规模200-500人",
    riskLevel: "green" as const,
    riskReasons: [],
  },
]

export default function JobListPage({ onBack }: JobListPageProps) {
  const [selectedEducation, setSelectedEducation] = useState("全部")
  const [selectedExperience, setSelectedExperience] = useState("全部")
  const [selectedSalary, setSelectedSalary] = useState("全部")
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [currentRiskReasons, setCurrentRiskReasons] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"salary" | "time">("salary")

  const handleRiskClick = (reasons: string[]) => {
    setCurrentRiskReasons(reasons)
    setShowRiskModal(true)
  }

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="h-[60px] px-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-[#333333]" />
          </button>
          <div className="flex-1 h-10 bg-[#F5F7FA] rounded-lg flex items-center px-3 gap-2">
            <Search className="w-4 h-4 text-[#999999]" />
            <input
              type="text"
              placeholder="搜索岗位/公司"
              className="flex-1 bg-transparent text-sm text-[#333333] placeholder:text-[#999999] outline-none"
            />
          </div>
        </div>

        {/* 筛选标签栏 */}
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2 mb-2">
            <span className="text-xs text-[#666666] shrink-0 py-1">学历:</span>
            {educationFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedEducation(filter)}
                className={`px-3 py-1 rounded-full text-xs shrink-0 transition-colors ${
                  selectedEducation === filter
                    ? "bg-[#4A90E2] text-white"
                    : "bg-white text-[#333333] border border-[#EEEEEE]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <span className="text-xs text-[#666666] shrink-0 py-1">经验:</span>
            {experienceFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedExperience(filter)}
                className={`px-3 py-1 rounded-full text-xs shrink-0 transition-colors ${
                  selectedExperience === filter
                    ? "bg-[#4A90E2] text-white"
                    : "bg-white text-[#333333] border border-[#EEEEEE]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-[#666666] shrink-0 py-1">薪资:</span>
            {salaryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedSalary(filter)}
                className={`px-3 py-1 rounded-full text-xs shrink-0 transition-colors ${
                  selectedSalary === filter
                    ? "bg-[#4A90E2] text-white"
                    : "bg-white text-[#333333] border border-[#EEEEEE]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 岗位列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {mockJobs.map((job) => (
            <JobCard key={job.id} job={job} onRiskClick={() => handleRiskClick(job.riskReasons)} />
          ))}
        </div>
      </div>

      {/* 底部功能按钮 */}
      <div className="h-[50px] bg-white border-t border-[#EEEEEE] flex items-center justify-around px-4">
        <button className="flex items-center gap-1 text-[#333333]">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm">筛选</span>
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === "salary" ? "time" : "salary")}
          className="flex items-center gap-1 text-[#333333]"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm">{sortOrder === "salary" ? "薪资从高到低" : "成立时间从久到新"}</span>
        </button>
      </div>

      {/* 风险详情弹窗 */}
      <RiskModal isOpen={showRiskModal} reasons={currentRiskReasons} onClose={() => setShowRiskModal(false)} />
    </div>
  )
}
