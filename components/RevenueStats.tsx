'use client'

import React, { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react'

interface RevenueData {
  currentMonth: {
    year: number
    month: number
    total: number
    count: number
  }
  previousMonth: {
    year: number
    month: number
    total: number
    count: number
  }
  comparison: {
    absoluteChange: number
    percentageChange: number
  }
}

export default function RevenueStats() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [selectedYear, selectedMonth])

  const fetchRevenueData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/revenue?year=${selectedYear}&month=${selectedMonth}`
      )
      const data = await response.json()
      setRevenueData(data)
    } catch (error) {
      console.error('获取收益数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  if (loading || !revenueData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const isPositiveChange = revenueData.comparison.absoluteChange >= 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">收益统计</h2>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}月
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 当前月收益 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">
              {revenueData.currentMonth.year}年{revenueData.currentMonth.month}月
            </span>
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-green-900 mb-1">
            {formatCurrency(revenueData.currentMonth.total)}
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Users size={16} />
            <span>{revenueData.currentMonth.count} 个主播</span>
          </div>
        </div>

        {/* 上个月收益 */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {revenueData.previousMonth.year}年{revenueData.previousMonth.month}月
            </span>
            <DollarSign className="text-gray-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(revenueData.previousMonth.total)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} />
            <span>{revenueData.previousMonth.count} 个主播</span>
          </div>
        </div>
      </div>

      {/* 对比分析 */}
      <div className={`rounded-lg p-4 ${isPositiveChange ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositiveChange ? (
              <TrendingUp className="text-green-600" size={24} />
            ) : (
              <TrendingDown className="text-red-600" size={24} />
            )}
            <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-700' : 'text-red-700'}`}>
              环比{isPositiveChange ? '增长' : '下降'}
            </span>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isPositiveChange ? 'text-green-900' : 'text-red-900'}`}>
              {isPositiveChange ? '+' : ''}{revenueData.comparison.percentageChange.toFixed(2)}%
            </div>
            <div className={`text-sm ${isPositiveChange ? 'text-green-700' : 'text-red-700'}`}>
              {isPositiveChange ? '+' : ''}{formatCurrency(revenueData.comparison.absoluteChange)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

