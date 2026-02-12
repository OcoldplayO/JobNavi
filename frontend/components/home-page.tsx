"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PageType } from "@/app/page"

interface HomePageProps {
  onNavigate: (page: PageType) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [nickname, setNickname] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    if (token && userStr) {
      setIsLoggedIn(true)
      try {
        const user = JSON.parse(userStr)
        setNickname(user.nickname || user.username || "用户")
      } catch {
        setNickname("用户")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setNickname("")

    toast({
      variant: "success" as any,
      title: "已退出登录",
      description: "即将返回登录页...",
    })

    setTimeout(() => router.push("/login"), 800)
  }

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      {/* 顶部品牌区 */}
      <header className="h-20 px-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-DEFAULT" strokeWidth={1.5} />
            <span className="text-xl font-semibold text-slate-800">JobNavi</span>
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Hi, {nickname}</span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-brand-DEFAULT text-sm font-medium hover:underline">
            登录
          </Link>
        )}
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
