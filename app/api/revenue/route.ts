import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

// GET - 获取收益统计
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

    // 当前月
    const currentDate = new Date(year, month - 1, 1)
    const currentStart = startOfMonth(currentDate)
    const currentEnd = endOfMonth(currentDate)

    // 上个月
    const previousDate = subMonths(currentDate, 1)
    const previousStart = startOfMonth(previousDate)
    const previousEnd = endOfMonth(previousDate)

    // 查询当前月收益
    const currentMonthStreamers = await prisma.streamer.findMany({
      where: {
        startDate: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
      select: {
        fee: true,
      },
    })

    const currentTotal = currentMonthStreamers.reduce(
      (sum, s) => sum + Number(s.fee),
      0
    )

    // 查询上个月收益
    const previousMonthStreamers = await prisma.streamer.findMany({
      where: {
        startDate: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      select: {
        fee: true,
      },
    })

    const previousTotal = previousMonthStreamers.reduce(
      (sum, s) => sum + Number(s.fee),
      0
    )

    // 计算变化
    const absoluteChange = currentTotal - previousTotal
    const percentageChange =
      previousTotal > 0 ? ((absoluteChange / previousTotal) * 100) : 0

    const result = {
      currentMonth: {
        year,
        month,
        total: currentTotal,
        count: currentMonthStreamers.length,
      },
      previousMonth: {
        year: previousDate.getFullYear(),
        month: previousDate.getMonth() + 1,
        total: previousTotal,
        count: previousMonthStreamers.length,
      },
      comparison: {
        absoluteChange,
        percentageChange: Math.round(percentageChange * 100) / 100,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('获取收益统计失败:', error)
    return NextResponse.json({ error: '获取收益统计失败' }, { status: 500 })
  }
}

