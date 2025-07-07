'use client'

import { useState } from 'react'
import {
  CurrencyYenIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

import KPICard from '@/components/dashboard/KPICard'
import SalesChart from '@/components/dashboard/SalesChart'
import DepartmentChart from '@/components/dashboard/DepartmentChart'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import QuickActions from '@/components/dashboard/QuickActions'
import DepartmentTabs from '@/components/dashboard/DepartmentTabs'
import FarmSummary from '@/components/dashboard/FarmSummary'

const activities = [
  {
    id: 1,
    type: 'sale' as const,
    title: '新規案件が登録されました',
    description: 'A社コンサルティング案件（¥1,000,000）',
    time: '2時間前',
    user: '田中太郎'
  },
  {
    id: 2,
    type: 'billing' as const,
    title: '請求書が発行されました',
    description: 'B社システム開発案件の請求書（INV-2024-002）',
    time: '4時間前',
    user: '佐藤花子'
  },
  {
    id: 3,
    type: 'payment' as const,
    title: '入金が確認されました',
    description: 'C社コンサルティング案件の入金（¥800,000）',
    time: '1日前',
    user: '山田次郎'
  },
  {
    id: 4,
    type: 'user' as const,
    title: '新しいユーザーが追加されました',
    description: '鈴木三郎（システム開発部）',
    time: '2日前',
    user: '管理者'
  }
]

export default function DashboardPage() {
  const [department, setDepartment] = useState('all')
  const [consultingTab, setConsultingTab] = useState('farm')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">システム全体の状況を一覧で確認できます</p>
      </div>

      {/* メインコンテンツ */}
      <div className="p-6">
        <DepartmentTabs
          department={department}
          setDepartment={setDepartment}
          consultingTab={consultingTab}
          setConsultingTab={setConsultingTab}
        />

        {/* 部門ごとの表示切り替え */}
        {department === 'all' ? (
          <div>
            {/* 全体ダッシュボード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="今月の売上"
                value="¥4,100,000"
                change={{ value: 12.5, isPositive: true }}
                icon={CurrencyYenIcon}
                color="blue"
              />
              <KPICard
                title="今月の利益"
                value="¥1,640,000"
                change={{ value: 8.3, isPositive: true }}
                icon={ArrowTrendingUpIcon}
                color="green"
              />
              <KPICard
                title="請求書発行数"
                value="15件"
                change={{ value: -2.1, isPositive: false }}
                icon={DocumentTextIcon}
                color="yellow"
              />
              <KPICard
                title="未入金件数"
                value="8件"
                change={{ value: 15.2, isPositive: false }}
                icon={ExclamationTriangleIcon}
                color="red"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <div>
                <ActivityFeed activities={activities} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentChart />
              <QuickActions />
            </div>
          </div>
        ) : department === 'consulting' ? (
          <div>
            {/* サブタブごとの内容 */}
            {consultingTab === 'farm' && (
              <FarmSummary />
            )}
            {consultingTab === 'prime' && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-gray-700">プライム集計ダッシュボード（ここに内容を実装）</div>
            )}
            {consultingTab === 'budget' && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-gray-700">予算集計ダッシュボード（ここに内容を実装）</div>
            )}
            {consultingTab === 'performance' && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-gray-700">成績表ダッシュボード（ここに内容を実装）</div>
            )}
          </div>
        ) : (
          <div>
            {/* 通信事業部・地方創生事業部は従来の全体ダッシュボードを流用 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="今月の売上"
                value="¥4,100,000"
                change={{ value: 12.5, isPositive: true }}
                icon={CurrencyYenIcon}
                color="blue"
              />
              <KPICard
                title="今月の利益"
                value="¥1,640,000"
                change={{ value: 8.3, isPositive: true }}
                icon={ArrowTrendingUpIcon}
                color="green"
              />
              <KPICard
                title="請求書発行数"
                value="15件"
                change={{ value: -2.1, isPositive: false }}
                icon={DocumentTextIcon}
                color="yellow"
              />
              <KPICard
                title="未入金件数"
                value="8件"
                change={{ value: 15.2, isPositive: false }}
                icon={ExclamationTriangleIcon}
                color="red"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <div>
                <ActivityFeed activities={activities} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentChart />
              <QuickActions />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 