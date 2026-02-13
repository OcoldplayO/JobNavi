"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Briefcase, Eye, EyeOff, Loader2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const passwordSchema = z.string()
  .min(9, "密码至少 9 位")
  .regex(/[A-Za-z]/, "需包含字母")
  .regex(/[0-9]/, "需包含数字")
  .regex(/[^A-Za-z0-9]/, "需包含特殊字符 (如 @$!%*?&)")

const schema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const token = useMemo(() => (searchParams.get("token") || "").trim(), [searchParams])
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    const clear = () => {
      setShowPassword(false)
      form.reset({ password: "", confirmPassword: "" })
    }
    clear()
    const t1 = setTimeout(clear, 0)
    const t2 = setTimeout(clear, 200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!token) {
      toast({ variant: "destructive", title: "缺少 token", description: "请使用邮件中的链接打开该页面" })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/password/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: values.password }),
      })
      const data = await res.json()
      if (!res.ok || data.code !== 200) throw new Error(data.msg || "重置失败")

      toast({
        variant: "success" as any,
        title: "密码已重置",
        description: "请使用新密码登录",
      })
      form.reset({ password: "", confirmPassword: "" })
      setTimeout(() => router.push("/login"), 800)
    } catch (e: any) {
      toast({ variant: "destructive", title: "重置失败", description: e?.message || "网络错误" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 delay-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 text-brand-DEFAULT">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">设置新密码</h1>
          <p className="text-slate-500 mt-2">通过邮件链接重置您的密码</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-slate-800">重置密码</CardTitle>
            <CardDescription className="text-center text-slate-500">
              {token ? "请输入新密码" : "未检测到 token，请从邮件链接进入"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off" noValidate>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">新密码</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="9位以上，含字母数字符号"
                            className="pl-10 pr-10 bg-white/50 border-slate-200 focus:border-brand-DEFAULT focus:ring-brand-DEFAULT/20 transition-all"
                            autoComplete="new-password"
                            data-lpignore="true"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">确认新密码</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                          <Input
                            type="password"
                            placeholder="再次输入新密码"
                            className="pl-10 bg-white/50 border-slate-200 focus:border-brand-DEFAULT focus:ring-brand-DEFAULT/20 transition-all"
                            autoComplete="new-password"
                            data-lpignore="true"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-2 bg-brand-DEFAULT hover:bg-brand-dark text-white shadow-lg shadow-brand-DEFAULT/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    "确认重置"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-slate-600 hover:text-brand-DEFAULT font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回登录
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

