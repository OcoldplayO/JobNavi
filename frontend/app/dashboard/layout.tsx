"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-white">
            {/* 侧边栏 - 固定宽度 */}
            <aside className="hidden md:flex h-screen sticky top-0">
                <AppSidebar />
            </aside>

            {/* 主内容区 - 自适应 */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
                <div className="container mx-auto py-6 px-4 md:px-8 max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
