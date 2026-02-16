"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not loading and no user
      const returnUrl = encodeURIComponent(pathname)
      router.replace(`/login?returnUrl=${returnUrl}`)
    }
  }, [isLoading, user, router, pathname])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-brand-DEFAULT" />
          <p className="text-slate-500 text-sm">正在验证权限...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
