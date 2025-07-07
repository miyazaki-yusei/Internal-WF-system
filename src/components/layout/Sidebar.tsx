'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
  { name: '案件管理', href: '/projects', icon: DocumentTextIcon },
  { name: 'シフト管理', href: '/shifts', icon: CalendarIcon },
  { name: '請求管理', href: '/billing', icon: CreditCardIcon },
  { name: 'ユーザー管理', href: '/users', icon: UsersIcon },
  { name: '帳票出力', href: '/reports', icon: DocumentArrowDownIcon },
  { name: 'お知らせ', href: '/notifications', icon: BellIcon },
]

const masterNavigation = [
  { name: '案件種別マスタ', href: '/masters/project-types' },
  { name: '取引先マスタ', href: '/masters/customers' },
  { name: '店舗マスタ', href: '/masters/stores' },
  { name: '報酬マスタ', href: '/masters/rewards' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMasterOpen, setIsMasterOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
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

        {/* マスタ設定 */}
        <div>
          <button
            onClick={() => setIsMasterOpen(!isMasterOpen)}
            className={`group flex w-full items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              pathname.startsWith('/masters')
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <Cog6ToothIcon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  pathname.startsWith('/masters') ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              マスタ設定
            </div>
            {isMasterOpen ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            )}
          </button>
          
          {isMasterOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {masterNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
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