"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Lock, User, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(6, "密码至少 6 位"),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // If already logged in, redirect to homepage
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.replace("/")
    }
  }, [router])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Clear form every time page mounts (e.g. redirected from register)
  // NOTE: Chrome autofill may run AFTER first paint, so we clear twice.
  useEffect(() => {
    const clear = () => {
      setShowPassword(false)
      form.reset({ username: "", password: "" })
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

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: values.username,
          password: values.password,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.code !== 200) {
        throw new Error(data.msg || `登录失败 (${res.status})`)
      }

      localStorage.setItem("token", data.data.token)
      localStorage.setItem("user", JSON.stringify(data.data.user))

      // Clear form
      form.reset()

      toast({ variant: "success" as any, title: "登录成功", description: "正在跳转..." })
      setTimeout(() => router.push("/"), 800)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: error.message || "无法连接到服务器",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onErrors = () => {
    toast({
      variant: "destructive",
      title: "输入有误",
      description: "请检查用户名和密码格式",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 text-brand-DEFAULT">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">JobNavi</h1>
          <p className="text-slate-500 mt-2">您的职场避风港与智能诊断助手</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-slate-800">欢迎回来</CardTitle>
            <CardDescription className="text-center text-slate-500">请输入您的账号密码以继续</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onErrors)}
                className="space-y-5"
                autoComplete="off"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">账号</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                          <Input
                            placeholder="用户名 / 邮箱"
                            autoComplete="new-password"
                            data-lpignore="true"
                            className="pl-10 bg-white/50 border-slate-200 focus:border-brand-DEFAULT focus:ring-brand-DEFAULT/20 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600">密码</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="请输入密码"
                            autoComplete="new-password"
                            data-lpignore="true"
                            className="pl-10 pr-10 bg-white/50 border-slate-200 focus:border-brand-DEFAULT focus:ring-brand-DEFAULT/20 transition-all"
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

                <div className="flex items-center justify-end text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-brand-DEFAULT hover:text-brand-dark hover:underline transition-colors"
                  >
                    忘记密码?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-DEFAULT hover:bg-brand-dark text-white shadow-lg shadow-brand-DEFAULT/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登 录"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/70 px-2 text-slate-400">或者</span>
                  </div>
                </div>

                <Button variant="outline" type="button" className="w-full bg-white/50 border-slate-200 hover:bg-slate-50">
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 488 512">
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                  </svg>
                  Google 登录
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href="/register"
                    className="text-sm text-slate-600 hover:text-brand-DEFAULT font-medium transition-colors"
                  >
                    还没有账号? 立即注册
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
