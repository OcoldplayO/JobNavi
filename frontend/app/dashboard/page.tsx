"use client"

import { useRouter } from "next/navigation"
import { LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

export default function DashboardPage() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">


                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">控制台概览</h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        欢迎回来, {user?.nickname || user?.username || "用户"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 岗位诊断卡片 */}
                    <div
                        onClick={() => router.push("/dashboard/jobs")}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-lg mb-2">岗位筛选与诊断</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            已为您识别 0 个风险职位。
                        </p>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-0"></div>
                        </div>
                    </div>

                    {/* 面试管理卡片 */}
                    <div
                        onClick={() => router.push("/dashboard/interviews")}
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-lg mb-2">近期面试</h3>
                        <p className="text-slate-500 text-sm">暂无即将开始的面试。</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg mb-2">安全屋</h3>
                        <p className="text-slate-500 text-sm">
                            您附近有 3 个推荐休息点。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
