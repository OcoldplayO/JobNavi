"use client"

import { Building2 } from "lucide-react"

interface Job {
  id: number
  company: string
  position: string
  salary: string
  established: string
  capital: string
  size: string
  riskLevel: "green" | "yellow" | "red"
  riskReasons: string[]
}

interface JobCardProps {
  job: Job
  onRiskClick: () => void
}

const riskConfig = {
  green: {
    label: "建议投递",
    bgColor: "bg-[#52C41A]",
    textColor: "text-white",
  },
  yellow: {
    label: "待核实",
    bgColor: "bg-[#FAAD14]",
    textColor: "text-white",
  },
  red: {
    label: "高风险",
    bgColor: "bg-[#F5222D]",
    textColor: "text-white",
  },
}

export default function JobCard({ job, onRiskClick }: JobCardProps) {
  const risk = riskConfig[job.riskLevel]

  return (
    <div className="bg-white rounded-[10px] border border-[#EEEEEE] p-4 shadow-sm">
      {/* 公司信息行 */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#F0F2F5] rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#999999]" />
        </div>
        <span className="text-base font-semibold text-[#333333]">{job.company}</span>
      </div>

      {/* 岗位名称 */}
      <h3 className="text-[15px] font-semibold text-[#4A90E2] mb-2">{job.position}</h3>

      {/* 薪资和公司信息 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-[#FF6B00]">{job.salary}</span>
      </div>
      <p className="text-xs text-[#666666] mb-3">
        {job.established} | {job.capital} | {job.size}
      </p>

      {/* 风险标签 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (job.riskReasons.length > 0) {
            onRiskClick()
          }
        }}
        className={`px-3 py-1 rounded text-xs ${risk.bgColor} ${risk.textColor} ${
          job.riskReasons.length > 0 ? "cursor-pointer hover:opacity-90" : "cursor-default"
        }`}
      >
        {risk.label}
      </button>
    </div>
  )
}
