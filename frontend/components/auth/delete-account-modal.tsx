"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

interface DeleteAccountModalProps {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function DeleteAccountModal({ children, open, onOpenChange }: DeleteAccountModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const { user, logout, token } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const handleDeleteAccount = async () => {
        if (!user?.id) {
            toast({
                variant: "destructive",
                title: "错误",
                description: "无法获取用户信息",
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:8080/api/v1/auth/account", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id }),
            })

            if (!response.ok) {
                throw new Error("Failed to delete account")
            }

            toast({
                title: "账号已注销",
                description: "您的账号已进入注销流程，7天内未登录将永久删除。",
            })

            // Logout and redirect
            logout()
        } catch (error) {
            console.error("Delete account error:", error)
            toast({
                variant: "destructive",
                title: "注销失败",
                description: "请稍后重试或联系客服。",
            })
        } finally {
            setIsLoading(false)
            onOpenChange?.(false)
        }
    }



    // ... existing code ...

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">确认注销账号？</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-4">
                            <p>
                                此操作将把您的账号标记为注销状态。若您在 7 天内未再次登录，系统将永久删除您的所有数据且无法恢复。
                            </p>
                            <div className="space-y-2">
                                <label htmlFor="confirm-delete" className="text-sm font-medium text-slate-700">
                                    请输入 <span className="font-bold text-destructive">确认注销</span> 以继续：
                                </label>
                                <Input
                                    id="confirm-delete"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="确认注销"
                                    className="border-slate-300 focus-visible:ring-destructive"
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDeleteAccount()
                        }}
                        disabled={isLoading || confirmText !== "确认注销"}
                        className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        确认永久注销
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
