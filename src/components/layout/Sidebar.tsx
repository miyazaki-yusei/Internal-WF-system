'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  CurrencyYenIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
  { name: '案件管理', href: '/projects', icon: DocumentTextIcon },
  { name: 'シフト管理', href: '/shifts', icon: CalendarIcon },
  { name: '請求管理', href: '/billing', icon: CreditCardIcon },
  { name: '予算管理', href: '/budget', icon: CurrencyYenIcon },
  { name: 'ユーザー管理', href: '/users', icon: UsersIcon },
  { name: '帳票出力', href: '/reports', icon: DocumentArrowDownIcon },
  { name: 'お知らせ', href: '/notifications', icon: BellIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const isPerformanceActive = () => {
    const tab = searchParams.get('tab')
    return pathname === '/dashboard' && tab === 'performance'
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* ロゴ */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Festal</span>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {item.name}
          </Link>
        ))}

        {/* 成績表 */}
        <Link
          href="/dashboard?tab=performance"
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isPerformanceActive()
              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <ChartBarIcon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              isPerformanceActive() ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          成績表
        </Link>

        {/* マスター管理 */}
        <Link
          href="/master"
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname.startsWith('/master')
              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Squares2X2Icon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              pathname.startsWith('/master') ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          マスター管理
        </Link>
      </nav>

      {/* ログアウト */}
      <div className="border-t border-gray-200 p-3">
        <button className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          ログアウト
        </button>
      </div>
    </div>
  )
} 