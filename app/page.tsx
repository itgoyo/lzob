'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Streamer } from '@/lib/types'
import StreamerCard from '@/components/StreamerCard'
import StreamerForm from '@/components/StreamerForm'
import RevenueStats from '@/components/RevenueStats'
import SettingsPanel from '@/components/SettingsPanel'
import ExpirationAlert, { clearExpirationDismissal } from '@/components/ExpirationAlert'
import { Plus, ArrowUpDown, Settings, LogOut, User } from 'lucide-react'

type TabType = 'active' | 'expired' | 'revenue' | 'settings'
type SortOrder = 'asc' | 'desc'

export default function Home() {
  const router = useRouter()
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [allStreamers, setAllStreamers] = useState<Streamer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const [showForm, setShowForm] = useState(false)
  const [editingStreamer, setEditingStreamer] = useState<Streamer | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    fetchStreamers()
  }, [activeTab, sortOrder])

  const fetchCurrentUser = async () => {
    try {
      // 从 cookie 读取用户名
      const cookies = document.cookie.split(';')
      const usernameCookie = cookies.find(c => c.trim().startsWith('admin-username='))
      if (usernameCookie) {
        const name = usernameCookie.split('=')[1]
        setUsername(decodeURIComponent(name))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const handleLogout = async () => {
    if (!confirm('确定要退出登录吗？')) return

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  const fetchStreamers = async () => {
    setLoading(true)
    try {
      // 获取所有主播数据
      const response = await fetch(`/api/streamers?sortBy=expireDate&sortOrder=${sortOrder}`)
      const data = await response.json()
      
      // 在前端判断实际到期状态
      const now = new Date()
      const processedData = data.map((streamer: Streamer) => {
        const expireDate = new Date(streamer.expireDate)
        const isExpired = expireDate < now
        return {
          ...streamer,
          // 如果实际已过期但状态还是ACTIVE，在前端视为EXPIRED
          status: isExpired && streamer.status === 'ACTIVE' ? 'EXPIRED' : streamer.status
        }
      })
      
      setAllStreamers(processedData)
      
      // 根据当前标签页过滤数据
      if (activeTab === 'active') {
        setStreamers(processedData.filter((s: Streamer) => s.status === 'ACTIVE'))
      } else if (activeTab === 'expired') {
        setStreamers(processedData.filter((s: Streamer) => s.status === 'EXPIRED'))
      } else {
        setStreamers(processedData)
      }
    } catch (error) {
      console.error('获取主播列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingStreamer) {
        await fetch(`/api/streamers/${editingStreamer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        // 如果编辑后状态变为未到期，清除该主播的提醒记录
        clearExpirationDismissal(editingStreamer.id)
      } else {
        await fetch('/api/streamers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      setShowForm(false)
      setEditingStreamer(null)
      fetchStreamers()
    } catch (error) {
      console.error('操作失败:', error)
      alert('操作失败，请重试')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个主播吗？')) return

    try {
      await fetch(`/api/streamers/${id}`, { method: 'DELETE' })
      // 删除后清除该主播的提醒记录
      clearExpirationDismissal(id)
      fetchStreamers()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  const handleEdit = (streamer: Streamer) => {
    setEditingStreamer(streamer)
    setShowForm(true)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const activeStreamers = allStreamers.filter(s => s.status === 'ACTIVE')
  const expiredStreamers = allStreamers.filter(s => s.status === 'EXPIRED')

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 头部 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">直播录制管理系统</h1>
            <p className="text-gray-600">管理主播录制信息、收益统计和到期通知</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <User size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <LogOut size={18} />
              <span>退出登录</span>
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">未到期主播</div>
            <div className="text-3xl font-bold text-green-600">{activeStreamers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">已到期主播</div>
            <div className="text-3xl font-bold text-red-600">{expiredStreamers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">主播总数</div>
            <div className="text-3xl font-bold text-blue-600">{allStreamers.length}</div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2 p-4">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                未到期 ({activeStreamers.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'expired'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                已到期 ({expiredStreamers.length})
              </button>
              <button
                onClick={() => setActiveTab('revenue')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'revenue'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                收益统计
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings size={20} />
                设置
              </button>
            </div>
          </div>

          {/* 主播列表操作栏 */}
          {(activeTab === 'active' || activeTab === 'expired') && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setEditingStreamer(null)
                    setShowForm(true)
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>新增主播</span>
                </button>
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowUpDown size={20} />
                  <span>到期时间 ({sortOrder === 'asc' ? '正序' : '倒序'})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 到期提醒 - 在除了"已到期"页面外的所有页面都显示 */}
        {expiredStreamers.length > 0 && activeTab !== 'expired' && (
          <ExpirationAlert
            expiredStreamers={expiredStreamers}
            onDismiss={() => {}}
            onViewDetails={(streamer) => {
              setActiveTab('expired')
              setTimeout(() => {
                const element = document.getElementById(`streamer-${streamer.id}`)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  element.classList.add('ring-4', 'ring-blue-400')
                  setTimeout(() => {
                    element.classList.remove('ring-4', 'ring-blue-400')
                  }, 2000)
                }
              }, 100)
            }}
          />
        )}

        {/* 内容区域 */}
        {activeTab === 'revenue' ? (
          <RevenueStats />
        ) : activeTab === 'settings' ? (
          <SettingsPanel />
        ) : (
          <div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : streamers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">暂无数据</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  新增第一个主播
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streamers.map((streamer) => (
                  <StreamerCard
                    key={streamer.id}
                    streamer={streamer}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 表单模态框 */}
        {showForm && (
          <StreamerForm
            streamer={editingStreamer}
            onSubmit={handleCreateOrUpdate}
            onClose={() => {
              setShowForm(false)
              setEditingStreamer(null)
            }}
          />
        )}
      </div>
    </main>
  )
}

