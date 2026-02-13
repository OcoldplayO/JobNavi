"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Mail, KeyRound, ArrowLeft, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  code: z.string().min(4, "请输入验证码"),
})

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const username = useMemo(() => (searchParams.get("username") || "").trim(), [searchParams])

  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", code: "" },
  })

  async function sendCode() {
    const email = form.getValues("email")
    if (!email) {
      toast({ variant: "destructive", title: "请输入邮箱", description: "请先填写邮箱后再发送验证码" })
      return
    }

    setIsSending(true)
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/email/code/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scene: "BIND_EMAIL" }),
      })
      const data = await res.json()
      if (!res.ok || data.code !== 200) throw new Error(data.msg || "发送失败")

      toast({
        variant: "success" as any,
        title: "验证码已发送",
        description: "MVP 阶段：请查看后端控制台日志中的验证码",
      })
    } catch (e: any) {
      toast({ variant: "destructive", title: "发送失败", description: e?.message || "网络错误" })
    } finally {
      setIsSending(false)
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!username) {
      toast({
        variant: "destructive",
        title: "缺少用户名",
        description: "请从注册流程进入该页面（URL 需要携带 username）",
      })
      return
    }

    setIsVerifying(true)
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/email/bind/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: values.email, code: values.code }),
      })
      const data = await res.json()
      if (!res.ok || data.code !== 200) throw new Error(data.msg || "验证失败")

      toast({
        variant: "success" as any,
        title: "邮箱验证成功",
        description: "已绑定邮箱，现在可以登录了",
      })
      form.reset({ email: "", code: "" })
      setTimeout(() => router.push("/login"), 800)
    } catch (e: any) {
      toast({ variant: "destructive", title: "验证失败", description: e?.message || "网络错误" })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 delay-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 text-brand-DEFAULT">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">验证邮箱</h1>
          <p className="text-slate-500 mt-2">
            {username ? <>为账号 <span className="font-medium text-slate-700">{username}</span> 绑定邮箱</> : "请从注册流程进入此页面"}
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-slate-800">邮箱验证码</CardTitle>
            <CardDescription className="text-center text-slate-500">
              MVP 阶段验证码会打印在后端控制台
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off" noValidate>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">邮箱</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                          <Input
                            type="email"
                            placeholder="name@example.com"
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

                <div className="grid grid-cols-3 gap-2 items-end">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600">验证码</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                              <Input
                                placeholder="输入验证码"
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
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={sendCode} disabled={isSending}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "发送"}
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 bg-brand-DEFAULT hover:bg-brand-dark text-white shadow-lg shadow-brand-DEFAULT/30 transition-all duration-300"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      验证中...
                    </>
                  ) : (
                    "验证并绑定"
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

