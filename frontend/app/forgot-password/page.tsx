"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Mail, ArrowLeft, Briefcase } from "lucide-react"

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

const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/password/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      })
      const data = await res.json()
      // 后端会“始终返回成功”以避免枚举用户；前端这里也按成功提示
      if (!res.ok) {
        console.warn("reset request non-200:", data)
      }
      
      setIsSubmitted(true)
      form.reset({ email: "" })
      toast({
        variant: "success" as any,
        title: "已提交请求",
        description: "如果该邮箱存在账号，将收到重置链接（MVP：请查看后端控制台日志）",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "发送失败",
        description: "请稍后重试。",
      })
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            找回密码
          </h1>
          <p className="text-slate-500 mt-2">
            我们将向您发送重置链接
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-slate-800">
              重置密码
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              请输入您注册时使用的邮箱地址
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4 animate-in fade-in duration-300">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">邮件已发送!</h3>
                <p className="text-sm text-slate-500">
                  如果该邮箱存在于我们的系统中，您将收到一封包含密码重置说明的邮件。
                </p>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSubmitted(false)}>
                  尝试其他邮箱
                </Button>
                <Link href="/login" className="block mt-4 text-sm text-brand-DEFAULT hover:underline">
                  返回登录
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        发送链接...
                      </>
                    ) : (
                      "发送重置链接"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
