'use client'

import { useState } from 'react'
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* 左側 - 検索 */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="検索..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* 右側 - 通知・ユーザー */}
      <div className="flex items-center space-x-4">
        {/* 通知 */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
        </button>

        {/* ユーザーメニュー */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">田中太郎</div>
              <div className="text-xs text-gray-500">コンサル事業部</div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                プロフィール設定
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                パスワード変更
              </a>
              <hr className="my-1" />
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                ログアウト
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 