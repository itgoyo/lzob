'use client'

import React from 'react'
import { Streamer, platformNames } from '@/lib/types'
import { calculateProgress, getDaysRemaining, formatDate, formatCurrency } from '@/lib/utils'
import PlatformIcon from './PlatformIcon'
import ProgressBar from './ProgressBar'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'

interface StreamerCardProps {
  streamer: Streamer
  onEdit: (streamer: Streamer) => void
  onDelete: (id: string) => void
}

export default function StreamerCard({ streamer, onEdit, onDelete }: StreamerCardProps) {
  const progress = calculateProgress(streamer.startDate, streamer.expireDate)
  const daysRemaining = getDaysRemaining(streamer.expireDate)

  return (
    <div 
      id={`streamer-${streamer.id}`}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* 平台图标 */}
        <PlatformIcon platform={streamer.platform} size={50} />

        {/* 主要信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {streamer.streamerName}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                {streamer.wechatName} ({streamer.wechatId})
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => onEdit(streamer)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="编辑"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(streamer.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* 直播信息 */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-gray-700">平台:</span>
              <span className="text-gray-900">{platformNames[streamer.platform]}</span>
              {streamer.isCustom && (
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                  定制
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-gray-700">收费:</span>
              <span className="text-base font-bold text-green-600">
                {formatCurrency(Number(streamer.fee))}
              </span>
            </div>
            <a
              href={streamer.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
              title={streamer.liveUrl}
            >
              <ExternalLink size={12} />
              <span className="truncate max-w-[200px]">{streamer.liveUrl}</span>
            </a>
          </div>

          {/* 时间信息 */}
          <div className="space-y-1 mb-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>开始: {formatDate(streamer.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>到期: {formatDate(streamer.expireDate)}</span>
            </div>
          </div>

          {/* 进度条 */}
          <ProgressBar progress={progress} daysRemaining={daysRemaining} />
        </div>
      </div>
    </div>
  )
}

