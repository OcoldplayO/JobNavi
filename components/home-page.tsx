"use client"

import { Briefcase } from "lucide-react"
import type { PageType } from "@/app/page"

interface HomePageProps {
  onNavigate: (page: PageType) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      {/* 顶部品牌区 */}
      <header className="h-20 px-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-[#4A90E2]" strokeWidth={1.5} />
          <span className="text-xl font-semibold text-[#333333]">职路通</span>
        </div>
        <button className="text-[#4A90E2] text-sm font-medium">登录</button>
      </header>

      {/* 中部功能入口区 */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        <button
          onClick={() => onNavigate("jobs")}
          className="w-[150px] h-[60px] bg-[#4A90E2] text-white rounded-[10px] font-medium text-base shadow-sm hover:bg-[#3A80D2] transition-colors"
        >
          岗位筛选
        </button>
        <p className="text-xs text-[#666666] -mt-3">精准找岗，规避风险</p>

        <button
          onClick={() => onNavigate("interviews")}
          className="w-[150px] h-[60px] bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-[10px] font-medium text-base shadow-sm hover:bg-[#F0F7FF] transition-colors"
        >
          面试管理
        </button>
        <p className="text-xs text-[#666666] -mt-3">日程规划，轻松备战</p>
      </main>

      {/* 底部快捷提示 */}
      <footer className="h-10 flex items-center justify-center">
        <p className="text-xs text-[#666666]">已为你屏蔽 200+ 高风险岗位</p>
      </footer>
    </div>
  )
}
