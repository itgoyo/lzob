'use client'

import React, { useState } from 'react'
import ServerChanConfig from './ServerChanConfig'
import EmailConfig from './EmailConfig'
import { MessageSquare, Mail } from 'lucide-react'

export default function SettingsPanel() {
  const [activeSection, setActiveSection] = useState<'serverchan' | 'email'>('serverchan')

  return (
    <div>
      {/* 设置选项卡 */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection('serverchan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeSection === 'serverchan'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageSquare size={20} />
            <span>Server酱通知</span>
          </button>
          <button
            onClick={() => setActiveSection('email')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeSection === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mail size={20} />
            <span>邮箱通知</span>
          </button>
        </div>
      </div>

      {/* 设置内容 */}
      {activeSection === 'serverchan' ? <ServerChanConfig /> : <EmailConfig />}
    </div>
  )
}

