'use client'

import React, { useState, useEffect } from 'react'
import { ServerChan } from '@/lib/types'
import { Plus, Pencil, Trash2, Power, PowerOff } from 'lucide-react'

export default function ServerChanConfig() {
  const [configs, setConfigs] = useState<ServerChan[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState<ServerChan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sendKey: '',
    isActive: true,
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/server-chan')
      const data = await response.json()
      setConfigs(data)
    } catch (error) {
      console.error('获取配置失败:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingConfig) {
        // 更新
        await fetch(`/api/server-chan/${editingConfig.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        // 创建
        await fetch('/api/server-chan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }

      setShowForm(false)
      setEditingConfig(null)
      setFormData({ name: '', sendKey: '', isActive: true })
      fetchConfigs()
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }

  const handleEdit = (config: ServerChan) => {
    setEditingConfig(config)
    setFormData({
      name: config.name,
      sendKey: config.sendKey,
      isActive: config.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个配置吗？')) return

    try {
      await fetch(`/api/server-chan/${id}`, { method: 'DELETE' })
      fetchConfigs()
    } catch (error) {
      console.error('删除配置失败:', error)
    }
  }

  const toggleActive = async (config: ServerChan) => {
    try {
      await fetch(`/api/server-chan/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !config.isActive }),
      })
      fetchConfigs()
    } catch (error) {
      console.error('切换状态失败:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Server酱通知配置</h2>
        <button
          onClick={() => {
            setEditingConfig(null)
            setFormData({ name: '', sendKey: '', isActive: true })
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>新增配置</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置名称 *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如: 主要通知"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SendKey *
            </label>
            <input
              type="text"
              required
              value={formData.sendKey}
              onChange={(e) => setFormData({ ...formData, sendKey: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="从 Server酱 获取的 SendKey"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">启用此配置</label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingConfig ? '更新' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingConfig(null)
                setFormData({ name: '', sendKey: '', isActive: true })
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {configs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无配置，点击上方按钮添加
          </div>
        ) : (
          configs.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{config.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      config.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {config.isActive ? '已启用' : '已禁用'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 font-mono">
                  {config.sendKey.substring(0, 20)}...
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(config)}
                  className={`p-2 rounded-lg transition-colors ${
                    config.isActive
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={config.isActive ? '禁用' : '启用'}
                >
                  {config.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                </button>
                <button
                  onClick={() => handleEdit(config)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(config.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">使用说明</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>访问 <a href="https://sct.ftqq.com/" target="_blank" rel="noopener noreferrer" className="underline">Server酱官网</a> 获取 SendKey</li>
          <li>可以配置多个 Server酱，系统会向所有启用的配置发送通知</li>
          <li>主播到期后，系统会每2小时自动发送一次通知</li>
        </ul>
      </div>
    </div>
  )
}

