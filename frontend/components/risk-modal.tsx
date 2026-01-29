"use client"

import { X } from "lucide-react"

interface RiskModalProps {
  isOpen: boolean
  reasons: string[]
  onClose: () => void
}

export default function RiskModal({ isOpen, reasons, onClose }: RiskModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 蒙版 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗 */}
      <div className="relative w-[300px] bg-white rounded-[10px] shadow-xl">
        {/* 标题 */}
        <div className="pt-4 pb-2 px-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#333333]">风险详情</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-[#999999]" />
          </button>
        </div>

        {/* 风险原因列表 */}
        <div className="px-4 py-3">
          <ul className="space-y-3">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#666666]">
                <span className="text-[#F5222D] shrink-0">✘</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 确定按钮 */}
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full h-10 bg-[#4A90E2] text-white rounded-md font-medium hover:bg-[#3A80D2] transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
