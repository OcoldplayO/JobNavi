"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Briefcase,
  LogOut,
  User,
  ClipboardList,
  Sun,
  Moon
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { DeleteAccountModal } from "@/components/auth/delete-account-modal"

interface HomePageProps {
  onNavigate?: () => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleLogout = () => {
    logout()

    toast({
      variant: "success" as any,
      title: "已退出登录",
      description: "即将返回登录页...",
    })
  }

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      <DeleteAccountModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />

      {/* 顶部品牌区 */}
      <header className="h-20 px-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-DEFAULT" strokeWidth={1.5} />
            <span className="text-xl font-semibold text-slate-800">JobNavi</span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            {/* 主题切换按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">切换主题</span>
            </Button>


            {/* 用户菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-2 pr-4 h-10 hover:bg-slate-100 rounded-full gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-light/20 flex items-center justify-center text-brand-DEFAULT">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start hidden sm:flex">
                    <span className="text-sm font-medium text-slate-700 leading-none">
                      {user.nickname || user.username || "用户"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>个人中心</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>编辑资料</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setShowDeleteModal(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>注销账号</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div >
        ) : (
          <Link href="/login" className="text-brand-DEFAULT text-sm font-medium hover:underline">
            登录
          </Link>
        )
        }
      </header >

      {/* 中部功能入口区 */}
      < main className="flex-1 flex flex-col items-center justify-center gap-6 px-8" >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-[150px] h-[60px] bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-[10px] font-medium text-base shadow-sm hover:bg-[#F0F7FF] transition-colors"
        >
          进入控制台
        </button>
        <p className="text-xs text-[#666666] -mt-3">总览概况，个人中心</p>

        <button
          onClick={() => router.push("/dashboard/jobs")}
          className="w-[150px] h-[60px] bg-[#4A90E2] text-white rounded-[10px] font-medium text-base shadow-sm hover:bg-[#3A80D2] transition-colors"
        >
          岗位筛选
        </button>
        <p className="text-xs text-[#666666] -mt-3">精准找岗，规避风险</p>

        <button
          onClick={() => router.push("/dashboard/interviews")}
          className="w-[150px] h-[60px] bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-[10px] font-medium text-base shadow-sm hover:bg-[#F0F7FF] transition-colors"
        >
          面试管理
        </button>
        <p className="text-xs text-[#666666] -mt-3">日程规划，轻松备战</p>
      </main >

      {/* 底部快捷提示 */}
      < footer className="h-10 flex items-center justify-center" >
        <p className="text-xs text-[#666666]">已为你屏蔽 200+ 高风险岗位</p>
      </footer >
    </div >
  )
}
