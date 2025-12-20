import React from 'react'

interface ProgressBarProps {
  progress: number
  daysRemaining: number
}

export default function ProgressBar({ progress, daysRemaining }: ProgressBarProps) {
  const getColorClass = () => {
    if (progress >= 90) return 'bg-red-500'
    if (progress >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTextColor = () => {
    if (progress >= 90) return 'text-red-600'
    if (progress >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${getTextColor()}`}>
          {progress}%
        </span>
        <span className="text-gray-600">
          {daysRemaining > 0 ? `剩余${daysRemaining}天` : '已到期'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${getColorClass()} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}

