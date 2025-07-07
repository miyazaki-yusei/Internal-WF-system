'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import { 
  CalendarIcon,
  CurrencyYenIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/solid'

// 仮のデータ
const mockProjects = [
  {
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
    members: ['田中太郎', '佐藤花子'],
    progress: 65
  },
  {
    id: 2,
    name: 'B社システム開発案件',
    client: 'B株式会社',
    type: 'prime',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2024-03-31',
    revenue: 8000000,
    cost: 4500000,
    profit: 3500000,
    members: ['山田次郎', '鈴木三郎'],
    progress: 100
  },
  {
    id: 3,
    name: 'C社DX推進案件',
    client: 'C株式会社',
    type: 'farm',
    status: 'planning',
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    revenue: 3000000,
    cost: 1800000,
    profit: 1200000,
    members: ['田中太郎'],
    progress: 15
  }
]

const projectTypes = [
  { id: 'all', name: '全て' },
  { id: 'farm', name: 'ファーム案件' },
  { id: 'prime', name: 'プライム案件' }
]

const projectStatuses = [
  { id: 'all', name: '全て' },
  { id: 'planning', name: '計画中' },
  { id: 'active', name: '進行中' },
  { id: 'completed', name: '完了' },
  { id: 'cancelled', name: '中止' }
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || project.type === selectedType
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">案件管理</h1>
            <p className="text-gray-600 mt-1">案件の一覧・詳細・編集を行えます</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            新規案件作成
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-6">
        {/* 検索・フィルター */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 検索 */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="案件名・顧客名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* フィルター */}
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projectStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5" />
                詳細フィルター
              </button>
            </div>
          </div>

          {/* 詳細フィルター */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">売上範囲</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="最小"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="flex items-center">〜</span>
                    <input
                      type="number"
                      placeholder="最大"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">担当者</label>
                  <input
                    type="text"
                    placeholder="担当者名"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総案件数</p>
                <p className="text-2xl font-bold text-gray-900">{filteredProjects.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{filteredProjects.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyYenIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総利益</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{filteredProjects.reduce((sum, p) => sum + p.profit, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CurrencyYenIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">進行中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredProjects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 案件一覧 */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">案件一覧</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {getTypeText(project.type)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {project.startDate} 〜 {project.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CurrencyYenIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          売上: ¥{project.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          担当: {project.members.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* 進捗バー */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>進捗</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 利益情報 */}
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">原価: </span>
                        <span className="font-medium">¥{project.cost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">利益: </span>
                        <span className="font-medium text-green-600">¥{project.profit.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">利益率: </span>
                        <span className="font-medium text-green-600">
                          {((project.profit / project.revenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      詳細
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                      編集
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BuildingOfficeIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">案件が見つかりません</h3>
            <p className="text-gray-600">検索条件を変更するか、新しい案件を作成してください。</p>
          </div>
        )}
      </div>
    </div>
  )
} 