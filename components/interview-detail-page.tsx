"use client"

import { ChevronLeft, MapPin, Clock, Building2, Navigation, Coffee, Hotel } from "lucide-react"

interface InterviewDetailPageProps {
  interviewId: number
  onBack: () => void
}

const interviewDetails: Record<
  number,
  {
    company: string
    position: string
    date: string
    time: string
    address: string
    contact: string
    phone: string
    notes: string
  }
> = {
  1: {
    company: "星辰科技有限公司",
    position: "前端开发工程师",
    date: "2025年01月15日",
    time: "10:00 - 11:30",
    address: "北京市海淀区中关村软件园二期B座8层",
    contact: "李经理",
    phone: "138****1234",
    notes: "请携带简历和作品集，提前15分钟到达",
  },
  2: {
    company: "智慧云计算",
    position: "后端开发工程师",
    date: "2025年01月16日",
    time: "14:30 - 16:00",
    address: "北京市朝阳区望京SOHO T1塔楼15层",
    contact: "王HR",
    phone: "139****5678",
    notes: "一面+二面，预计1.5小时",
  },
  3: {
    company: "创新互联网公司",
    position: "产品经理",
    date: "2025年01月17日",
    time: "09:30 - 11:00",
    address: "北京市海淀区五道口优盛大厦6层",
    contact: "张经理",
    phone: "136****9012",
    notes: "请准备产品案例分析",
  },
  4: {
    company: "数字未来科技",
    position: "UI设计师",
    date: "2025年01月10日",
    time: "11:00 - 12:00",
    address: "北京市东城区王府井大街88号",
    contact: "刘HR",
    phone: "137****3456",
    notes: "已完成",
  },
}

export default function InterviewDetailPage({ interviewId, onBack }: InterviewDetailPageProps) {
  const detail = interviewDetails[interviewId] || interviewDetails[1]

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      {/* 顶部栏 */}
      <div className="bg-white shadow-sm">
        <div className="h-[60px] px-4 flex items-center">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-[#333333]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-[#333333] pr-8">面试详情</h1>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 公司和岗位信息 */}
        <div className="bg-white rounded-[10px] border border-[#EEEEEE] p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#F0F2F5] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#999999]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#333333]">{detail.company}</h2>
              <p className="text-sm text-[#4A90E2]">{detail.position}</p>
            </div>
          </div>
        </div>

        {/* 时间地点信息 */}
        <div className="bg-white rounded-[10px] border border-[#EEEEEE] p-4 mb-4">
          <h3 className="text-sm font-medium text-[#333333] mb-3">面试信息</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#4A90E2]" />
              <div>
                <p className="text-sm text-[#333333]">{detail.date}</p>
                <p className="text-xs text-[#666666]">{detail.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#4A90E2] mt-0.5" />
              <p className="text-sm text-[#333333]">{detail.address}</p>
            </div>
          </div>
        </div>

        {/* 联系人信息 */}
        <div className="bg-white rounded-[10px] border border-[#EEEEEE] p-4 mb-4">
          <h3 className="text-sm font-medium text-[#333333] mb-3">联系人</h3>
          <p className="text-sm text-[#333333]">{detail.contact}</p>
          <p className="text-sm text-[#4A90E2]">{detail.phone}</p>
        </div>

        {/* 备注 */}
        <div className="bg-white rounded-[10px] border border-[#EEEEEE] p-4 mb-4">
          <h3 className="text-sm font-medium text-[#333333] mb-3">备注</h3>
          <p className="text-sm text-[#666666]">{detail.notes}</p>
        </div>

        {/* 周边推荐 */}
        <div className="bg-white rounded-[10px] border border-[#EEEEEE] p-4">
          <h3 className="text-sm font-medium text-[#333333] mb-3">周边推荐</h3>
          <div className="flex gap-4">
            <button className="flex-1 flex flex-col items-center gap-1 py-3 bg-[#F5F7FA] rounded-lg hover:bg-[#E8EAED] transition-colors">
              <Navigation className="w-5 h-5 text-[#4A90E2]" />
              <span className="text-xs text-[#333333]">导航前往</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 py-3 bg-[#F5F7FA] rounded-lg hover:bg-[#E8EAED] transition-colors">
              <Coffee className="w-5 h-5 text-[#4A90E2]" />
              <span className="text-xs text-[#333333]">附近咖啡</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 py-3 bg-[#F5F7FA] rounded-lg hover:bg-[#E8EAED] transition-colors">
              <Hotel className="w-5 h-5 text-[#4A90E2]" />
              <span className="text-xs text-[#333333]">休息场所</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
