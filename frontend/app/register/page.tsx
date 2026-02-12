"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Lock, User, Mail, Briefcase } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Password Validation Logic
const passwordSchema = z.string()
  .min(9, "密码至少 9 位")
  .regex(/[A-Za-z]/, "需包含字母")
  .regex(/[0-9]/, "需包含数字")
  .regex(/[^A-Za-z0-9]/, "需包含特殊字符 (如 @$!%*?&)");

// Schema for Username Registration
const usernameRegisterSchema = z.object({
  username: z.string().min(3, "用户名至少 3 位"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

// Schema for Email Registration
const emailRegisterSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("username")
  const { toast } = useToast()
  const router = useRouter()

  // Forms
  const usernameForm = useForm<z.infer<typeof usernameRegisterSchema>>({
    resolver: zodResolver(usernameRegisterSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  })

  const emailForm = useForm<z.infer<typeof emailRegisterSchema>>({
    resolver: zodResolver(emailRegisterSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  // Clear forms on mount. Chrome autofill may run AFTER first paint, so clear twice.
  useEffect(() => {
    const clear = () => {
      setShowPassword(false)
      usernameForm.reset({ username: "", password: "", confirmPassword: "" })
      emailForm.reset({ email: "", password: "", confirmPassword: "" })
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

  // Submit Handler
  async function onRegister(values: any, type: "username" | "email") {
    setIsLoading(true)

    try {
      const endpoint = type === 'username' 
        ? 'http://localhost:8080/api/v1/auth/register/username'
        : 'http://localhost:8080/api/v1/auth/register/email'

      const payload = type === 'username' 
        ? { username: values.username, password: values.password }
        : { email: values.email, password: values.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || data.code !== 200) {
        throw new Error(data.msg || "注册失败")
      }

      // Clear forms after success
      usernameForm.reset()
      emailForm.reset()

      toast({
        variant: "success" as any,
        title: "注册成功",
        description: "账号已创建，正在跳转登录...",
      })
      
      setTimeout(() => router.push("/login"), 800)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "注册失败",
        description: error.message || "该账号已被占用或网络错误",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    toast({
      title: "Google 登录",
      description: "正在连接 Google OAuth...",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 delay-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 text-brand-DEFAULT">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            加入 JobNavi
          </h1>
          <p className="text-slate-500 mt-2">
            开启您的职场避坑之旅
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center text-slate-800">
              创建新账号
            </CardTitle>
          </CardHeader>
          <CardContent>
            
            {/* Google Login Button */}
            <Button 
              variant="outline" 
              className="w-full mb-6 flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              onClick={handleGoogleLogin}
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12.0003 20.45c4.659 0 8.364-3.69 8.364-8.355 0-1.14-.195-2.235-.54-3.255h-7.824v6.09h4.635c-.63 1.935-2.34 3.375-4.635 3.375-2.73 0-4.935-2.205-4.935-4.935s2.205-4.935 4.935-4.935c1.185 0 2.265.405 3.12 1.08l3.6-3.6c-1.83-1.695-4.245-2.7-6.72-2.7-5.52 0-10.005 4.485-10.005 10.005s4.485 10.005 10.005 10.005z" fill="currentColor" />
              </svg>
              使用 Google 账号继续
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 px-2 text-slate-400 backdrop-blur-sm">
                  或者选择注册方式
                </span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val)
              const clear = () => {
                usernameForm.reset({ username: "", password: "", confirmPassword: "" })
                emailForm.reset({ email: "", password: "", confirmPassword: "" })
                setShowPassword(false)
              }
              clear()
              // second clear: fight Chrome autofill
              setTimeout(clear, 0)
              setTimeout(clear, 200)
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="username">用户名注册</TabsTrigger>
                <TabsTrigger value="email">邮箱注册</TabsTrigger>
              </TabsList>

              {/* Tab 1: Username Registration - key forces remount */}
              <TabsContent value="username" key={`username-${activeTab}`}>
                <Form {...usernameForm}>
                  <form
                    onSubmit={usernameForm.handleSubmit((v) => onRegister(v, "username"))}
                    className="space-y-4"
                    autoComplete="off"
                    noValidate
                  >
                    <FormField
                      control={usernameForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600">用户名</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                              <Input 
                                placeholder="设置您的用户名"
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
                      control={usernameForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600">密码</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="9位以上，含字母数字符号" 
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
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={usernameForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600">确认密码</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                              <Input 
                                type="password" 
                                placeholder="再次输入密码" 
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
                    <Button 
                      type="submit" 
                      className="w-full mt-2 bg-brand-DEFAULT hover:bg-brand-dark text-white shadow-lg shadow-brand-DEFAULT/30 transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "立即注册"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Tab 2: Email Registration */}
              <TabsContent value="email" key={`email-${activeTab}`}>
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit((v) => onRegister(v, "email"))}
                    className="space-y-4"
                    autoComplete="off"
                    noValidate
                  >
                    <FormField
                      control={emailForm.control}
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
                      control={emailForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600">密码</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="9位以上，含字母数字符号" 
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
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600">确认密码</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-brand-DEFAULT transition-colors" />
                              <Input 
                                type="password" 
                                placeholder="再次输入密码" 
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
                    <Button 
                      type="submit" 
                      className="w-full mt-2 bg-brand-DEFAULT hover:bg-brand-dark text-white shadow-lg shadow-brand-DEFAULT/30 transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "立即注册"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <Link 
                href="/login" 
                className="text-sm text-slate-600 hover:text-brand-DEFAULT font-medium transition-colors"
              >
                已有账号? 直接登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
