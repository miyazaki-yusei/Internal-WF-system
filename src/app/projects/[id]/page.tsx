'use client'

import { useState } from 'react'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CalendarIcon,
  CurrencyYenIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// 仮のデータ
const mockProject = {
  id: 1,
  name: 'A社コンサルティング案件',
  client: 'A株式会社',
  type: 'farm',
  status: 'active',
  startDate: '2024-01-15',
  endDate: '2024-06-30',
  revenue: 5000000,
  cost: 3000000,
  profit: 2000000,
  members: [
    { id: 1, name: '田中太郎', role: 'プロジェクトマネージャー', hours: 160 },
    { id: 2, name: '佐藤花子', role: 'コンサルタント', hours: 120 }
  ],
  progress: 65,
  description: 'A社のDX推進プロジェクト。業務プロセスの見直しからシステム導入まで一貫してサポートする。',
  milestones: [
    { id: 1, title: '現状分析完了', date: '2024-02-15', status: 'completed' },
    { id: 2, title: '要件定義完了', date: '2024-03-31', status: 'completed' },
    { id: 3, title: 'システム設計完了', date: '2024-05-15', status: 'active' },
    { id: 4, title: 'システム導入完了', date: '2024-06-30', status: 'pending' }
  ],
  activities: [
    { id: 1, type: 'milestone', title: 'システム設計フェーズ開始', date: '2024-04-01', user: '田中太郎' },
    { id: 2, type: 'member', title: '佐藤花子がプロジェクトに参加', date: '2024-03-15', user: '田中太郎' },
    { id: 3, type: 'billing', title: '第2回請求書発行', date: '2024-03-01', user: '田中太郎' }
  ]
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return '計画中'
      case 'active': return '進行中'
      case 'completed': return '完了'
      case 'cancelled': return '中止'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'farm': return 'ファーム案件'
      case 'prime': return 'プライム案件'
      default: return type
    }
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMilestoneStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了'
      case 'active': return '進行中'
      case 'pending': return '予定'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockProject.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mockProject.status)}`}>
                  {getStatusText(mockProject.status)}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {getTypeText(mockProject.type)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors">
              <PencilIcon className="w-4 h-4" />
              編集
            </button>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors">
              <TrashIcon className="w-4 h-4" />
              削除
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            {/* タブ */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: '概要' },
                    { id: 'members', name: 'メンバー' },
                    { id: 'milestones', name: 'マイルストーン' },
                    { id: 'activities', name: 'アクティビティ' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">プロジェクト概要</h3>
                      <p className="text-gray-600">{mockProject.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">基本情報</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">顧客: </span>
                            <span className="font-medium">{mockProject.client}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">期間: </span>
                            <span className="font-medium">{mockProject.startDate} 〜 {mockProject.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">メンバー数: </span>
                            <span className="font-medium">{mockProject.members.length}名</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">進捗</h4>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>全体進捗</span>
                            <span>{mockProject.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${mockProject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CurrencyYenIcon className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium text-gray-900">売上</h4>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">¥{mockProject.revenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CurrencyYenIcon className="w-5 h-5 text-red-600" />
                          <h4 className="font-medium text-gray-900">原価</h4>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">¥{mockProject.cost.toLocaleString()}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CurrencyYenIcon className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium text-gray-900">利益</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">¥{mockProject.profit.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          利益率: {((mockProject.profit / mockProject.revenue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'members' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">メンバー</h3>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm">
                        <PlusIcon className="w-4 h-4" />
                        メンバー追加
                      </button>
                    </div>
                    <div className="space-y-4">
                      {mockProject.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{member.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">稼働時間</p>
                              <p className="font-medium">{member.hours}h</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'milestones' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">マイルストーン</h3>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm">
                        <PlusIcon className="w-4 h-4" />
                        マイルストーン追加
                      </button>
                    </div>
                    <div className="space-y-4">
                      {mockProject.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <div>
                              <p className="font-medium text-gray-900">{milestone.title}</p>
                              <p className="text-sm text-gray-600">{milestone.date}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMilestoneStatusColor(milestone.status)}`}>
                            {getMilestoneStatusText(milestone.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'activities' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">アクティビティ</h3>
                    <div className="space-y-4">
                      {mockProject.activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{activity.date}</span>
                              <span>•</span>
                              <span>{activity.user}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* クイックアクション */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  請求書作成
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                  進捗更新
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                  レポート出力
                </button>
              </div>
            </div>

            {/* 最近のアクティビティ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h3>
              <div className="space-y-3">
                {mockProject.activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 