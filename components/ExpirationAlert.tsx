'use client'

import React, { useState, useEffect } from 'react'
import { Streamer } from '@/lib/types'
import { formatDate, getDaysRemaining } from '@/lib/utils'
import { X, AlertTriangle } from 'lucide-react'

interface ExpirationAlertProps {
  expiredStreamers: Streamer[]
  onDismiss: (streamerId: string) => void
  onViewDetails: (streamer: Streamer) => void
}

export default function ExpirationAlert({ 
  expiredStreamers, 
  onDismiss,
  onViewDetails 
}: ExpirationAlertProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  // 从 localStorage 加载已关闭的提醒
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedExpirations')
    if (dismissed) {
      try {
        const ids = JSON.parse(dismissed)
        setDismissedIds(new Set(ids))
      } catch (e) {
        console.error('解析已关闭提醒失败:', e)
      }
    }
  }, [])

  // 过滤出未被关闭的到期主播
  const visibleExpiredStreamers = expiredStreamers.filter(
    streamer => !dismissedIds.has(streamer.id)
  )

  const handleDismiss = (streamerId: string) => {
    const newDismissed = new Set(dismissedIds)
    newDismissed.add(streamerId)
    setDismissedIds(newDismissed)
    
    // 保存到 localStorage
    localStorage.setItem('dismissedExpirations', JSON.stringify([...newDismissed]))
    
    onDismiss(streamerId)
  }

  const handleDismissAll = () => {
    const allIds = expiredStreamers.map(s => s.id)
    setDismissedIds(new Set(allIds))
    localStorage.setItem('dismissedExpirations', JSON.stringify(allIds))
  }

  // 如果没有未关闭的到期主播，不显示
  if (visibleExpiredStreamers.length === 0) {
    return null
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-red-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">
                到期提醒
              </h3>
              <p className="text-sm text-red-700">
                有 {visibleExpiredStreamers.length} 个主播已到期，请及时处理
              </p>
            </div>
          </div>
          <button
            onClick={handleDismissAll}
            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-colors"
            title="关闭所有提醒"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {visibleExpiredStreamers.map((streamer) => {
            const daysOverdue = Math.abs(getDaysRemaining(streamer.expireDate))
            
            return (
              <div
                key={streamer.id}
                className="bg-white rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {streamer.streamerName}
                    </h4>
                    <span className="text-xs text-gray-600">
                      ({streamer.wechatName})
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>到期时间: {formatDate(streamer.expireDate)}</span>
                    <span className="text-red-600 font-medium">
                      已过期 {daysOverdue} 天
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onViewDetails(streamer)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => handleDismiss(streamer.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="关闭此提醒"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 清除指定主播的提醒记录（在删除或编辑主播后调用）
export function clearExpirationDismissal(streamerId: string) {
  const dismissed = localStorage.getItem('dismissedExpirations')
  if (dismissed) {
    try {
      const ids = JSON.parse(dismissed) as string[]
      const newIds = ids.filter(id => id !== streamerId)
      localStorage.setItem('dismissedExpirations', JSON.stringify(newIds))
    } catch (e) {
      console.error('清除提醒记录失败:', e)
    }
  }
}

// 清除所有已到期主播的提醒记录
export function clearAllExpirationDismissals(streamerIds: string[]) {
  const dismissed = localStorage.getItem('dismissedExpirations')
  if (dismissed) {
    try {
      const ids = JSON.parse(dismissed) as string[]
      const newIds = ids.filter(id => !streamerIds.includes(id))
      localStorage.setItem('dismissedExpirations', JSON.stringify(newIds))
    } catch (e) {
      console.error('清除提醒记录失败:', e)
    }
  }
}

