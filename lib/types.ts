export type Platform = 'DOUYIN' | 'DOUYU' | 'HUYA' | 'BILIBILI' | 'OTHER'

export type StreamerStatus = 'ACTIVE' | 'EXPIRED'

export interface Streamer {
  id: string
  wechatId: string
  wechatName: string
  streamerName: string
  liveUrl: string
  platform: Platform
  isCustom: boolean
  fee: number
  startDate: string
  expireDate: string
  status: StreamerStatus
  createdAt: string
  updatedAt: string
}

export interface ServerChan {
  id: string
  name: string
  sendKey: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailConfig {
  id: string
  name: string
  email: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RevenueStats {
  currentMonth: {
    total: number
    count: number
  }
  previousMonth: {
    total: number
    count: number
  }
  comparison: {
    percentageChange: number
    absoluteChange: number
  }
}

export const platformNames: Record<Platform, string> = {
  DOUYIN: '抖音',
  DOUYU: '斗鱼',
  HUYA: '虎牙',
  BILIBILI: 'B站',
  OTHER: '其他',
}

