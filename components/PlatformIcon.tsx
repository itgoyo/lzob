import React from 'react'
import { Platform } from '@/lib/types'

interface PlatformIconProps {
  platform: Platform
  size?: number
}

export default function PlatformIcon({ platform, size = 40 }: PlatformIconProps) {
  const iconMap: Record<Platform, string> = {
    DOUYIN: '🎵',
    DOUYU: '🐟',
    HUYA: '🐯',
    BILIBILI: '📺',
    OTHER: '🎮',
  }

  const colorMap: Record<Platform, string> = {
    DOUYIN: 'bg-gradient-to-br from-pink-500 to-red-500',
    DOUYU: 'bg-gradient-to-br from-orange-500 to-yellow-500',
    HUYA: 'bg-gradient-to-br from-orange-600 to-yellow-600',
    BILIBILI: 'bg-gradient-to-br from-blue-400 to-cyan-400',
    OTHER: 'bg-gradient-to-br from-gray-400 to-gray-600',
  }

  return (
    <div
      className={`${colorMap[platform]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {iconMap[platform]}
    </div>
  )
}

