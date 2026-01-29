"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Lock, Phone, QrCode, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

// --- 表单验证规则 (Schema) ---
const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名或邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // 初始化表单
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // --- 模拟登录提交 ---
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    
    // TODO: 这里将来替换为 fetch('http://localhost:8080/api/auth/login', ...)
    console.log("正在尝试登录:", values)

    try {
      // 模拟网络请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟成功
      toast({
        title: "登录成功",
        description: "欢迎回来，正在跳转...",
      })
      
      // 可以在这里执行路由跳转 router.push('/dashboard')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: "账号或密码错误，请重试。",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            职路通 JobRoad
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            AI 驱动的智能求职助手，帮你避坑每一份工作
          </p>
        </div>

        <Card className="shadow-lg border-none sm:border bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
            <CardDescription className="text-center">
              选择适合您的登录方式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="account">账号密码</TabsTrigger>
                <TabsTrigger value="wechat">微信扫码</TabsTrigger>
                <TabsTrigger value="phone">手机验证</TabsTrigger>
              </TabsList>

              {/* === 方式 1: 账号密码登录 (本次重点) === */}
              <TabsContent value="account">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>账号</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="用户名 / 邮箱" className="pl-10" {...field} />
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
                          <FormLabel>密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="请输入密码" 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
                    
                    <div className="flex items-center justify-between text-sm">
                      <Link href="/forgot-password" className="text-blue-600 hover:underline">
                        忘记密码?
                      </Link>
                      <Link href="/register" className="text-blue-600 hover:underline">
                        注册新账号
                      </Link>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          登录中...
                        </>
                      ) : (
                        "登 录"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* === 方式 2: 微信扫码 (占位) === */}
              <TabsContent value="wechat">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 text-center px-4">
                    微信扫码功能开发中...<br/>
                    请先使用账号密码登录
                  </p>
                </div>
              </TabsContent>

              {/* === 方式 3: 手机验证 (占位) === */}
              <TabsContent value="phone">
                <div className="space-y-4 py-2">
                   <div className="space-y-2">
                    <Label htmlFor="phone">手机号</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input id="phone" placeholder="请输入手机号" className="pl-10" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">验证码</Label>
                    <div className="flex space-x-2">
                      <Input id="code" placeholder="6位验证码" disabled />
                      <Button variant="outline" disabled>获取验证码</Button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full" disabled>暂未开放</Button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                      为了节省短信成本，开发阶段暂关闭此功能
                    </p>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
             <p className="text-xs text-gray-500">
                登录即代表同意 <Link href="/terms" className="underline">用户协议</Link> 和 <Link href="/privacy" className="underline">隐私政策</Link>
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}