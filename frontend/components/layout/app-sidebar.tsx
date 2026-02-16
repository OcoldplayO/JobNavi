"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Briefcase,
    Settings,
    LogOut,
    User,
    HelpCircle,
    Shield,
    Lock,
    Mail,
    Palette,
    ClipboardList,
    Calendar
} from "lucide-react"

import { cn } from "@/lib/utils"
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
import { useAuth } from "@/components/auth/auth-provider"
import { DeleteAccountModal } from "@/components/auth/delete-account-modal"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AppSidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleLogout = () => {
        logout()
        toast({
            title: "已退出登录",
            description: "期待再次见面",
        })
    }

    const navItems = [
        {
            title: "控制台",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: pathname === "/dashboard",
        },
        {
            title: "岗位筛选",
            href: "/dashboard/jobs",
            icon: Briefcase,
            isActive: pathname?.startsWith("/dashboard/jobs"),
        },
        {
            title: "面试管理",
            href: "/dashboard/interviews",
            icon: Calendar,
            isActive: pathname?.startsWith("/dashboard/interviews"),
        },
        {
            title: "安全屋",
            href: "#", // Placeholder
            icon: Shield,
            isActive: false,
        },
    ]

    return (
        <div className="flex flex-col h-full w-[240px] bg-slate-50 border-r border-slate-200">
            {/* 顶部 Logo 区 */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-brand-DEFAULT" strokeWidth={1.5} />
                    <span className="text-lg font-semibold text-slate-800">JobNavi</span>
                </Link>
            </div>

            {/* 中部导航区 */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            item.isActive
                                ? "bg-brand-light/10 text-brand-DEFAULT"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                    </Link>
                ))}
            </div>

            {/* 底部用户与设置区 */}
            <div className="p-4 border-t border-slate-200 space-y-2">
                {/* 设置菜单 */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900 px-2">
                            <Settings className="mr-2 h-4 w-4" />
                            设置
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" side="right">
                        <DropdownMenuLabel>通用设置</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem disabled>
                                <Shield className="mr-2 h-4 w-4" />
                                <span>隐私协议</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Palette className="mr-2 h-4 w-4" />
                                <span>主题切换</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>邮箱管理</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Lock className="mr-2 h-4 w-4" />
                                <span>密码管理</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>帮助反馈</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setShowDeleteModal(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>注销账号</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* 用户菜单 */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start px-2 h-auto py-2 hover:bg-slate-100">
                            <div className="flex items-center gap-3 w-full">
                                <div className="h-8 w-8 rounded-full bg-brand-light/20 flex items-center justify-center text-brand-DEFAULT">
                                    <User className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col items-start truncate">
                                    <span className="text-sm font-medium text-slate-700 truncate w-full text-left">
                                        {user?.nickname || user?.username || "用户"}
                                    </span>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" side="right">
                        <DropdownMenuItem disabled>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            <span>个人资料</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>退出登录</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Account Deletion Modal Triggered by state */}
            <DeleteAccountModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
            />
        </div>
    )
}
