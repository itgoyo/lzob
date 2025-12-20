import { format, parseISO, differenceInDays, startOfMonth, endOfMonth } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd', { locale: zhCN })
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
}

export function calculateProgress(startDate: string, expireDate: string): number {
  const start = parseISO(startDate)
  const expire = parseISO(expireDate)
  const now = new Date()

  const totalDays = differenceInDays(expire, start)
  const elapsedDays = differenceInDays(now, start)

  const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)
  return Math.round(progress)
}

export function getDaysRemaining(expireDate: string): number {
  const expire = parseISO(expireDate)
  const now = new Date()
  return differenceInDays(expire, now)
}

export function getMonthRange(year: number, month: number) {
  const date = new Date(year, month - 1, 1)
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount)
}

