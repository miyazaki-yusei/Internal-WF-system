'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

// 仮のデータ
const mockCustomers = [
  {
    id: 1,
    name: 'A株式会社',
    representative: '田中 太郎',
    address: '東京都渋谷区渋谷1-1-1',
    phone: '03-1234-5678',
    email: 'info@a-company.co.jp',
    status: 'active',
    projects: 3,
    totalRevenue: 15000000
  },
  {
    id: 2,
    name: 'B株式会社',
    representative: '佐藤 花子',
    address: '大阪府大阪市北区梅田1-1-1',
    phone: '06-1234-5678',
    email: 'info@b-company.co.jp',
    status: 'active',
    projects: 2,
    totalRevenue: 8000000
  },
  {
    id: 3,
    name: 'C株式会社',
    representative: '山田 次郎',
    address: '愛知県名古屋市中区栄1-1-1',
    phone: '052-123-4567',
    email: 'info@c-company.co.jp',
    status: 'inactive',
    projects: 1,
    totalRevenue: 3000000
  }
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.representative.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '取引中'
      case 'inactive': return '取引停止'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">顧客管理</h1>
            <p className="text-gray-600 mt-1">顧客情報の一覧・詳細・編集を行えます</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            新規顧客登録
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
                  placeholder="顧客名・代表者名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* フィルター */}
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全てのステータス</option>
                <option value="active">取引中</option>
                <option value="inactive">取引停止</option>
              </select>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総顧客数</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">取引中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCustomers.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総案件数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCustomers.reduce((sum, c) => sum + c.projects, 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{filteredCustomers.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 顧客一覧 */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">顧客一覧</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">代表者: </span>
                        <span className="text-sm font-medium">{customer.representative}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">TEL: </span>
                        <span className="text-sm font-medium">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">メール: </span>
                        <span className="text-sm font-medium">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">住所: </span>
                        <span className="text-sm font-medium">{customer.address}</span>
                      </div>
                    </div>

                    {/* 取引情報 */}
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">案件数: </span>
                        <span className="font-medium">{customer.projects}件</span>
                      </div>
                      <div>
                        <span className="text-gray-600">総売上: </span>
                        <span className="font-medium text-green-600">¥{customer.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => setEditingCustomer(customer)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      編集
                    </button>
                    <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BuildingOfficeIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">顧客が見つかりません</h3>
            <p className="text-gray-600">検索条件を変更するか、新しい顧客を登録してください。</p>
          </div>
        )}
      </div>

      {/* 新規作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新規顧客登録</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  顧客名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="顧客名を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  代表者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="代表者名を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="電話番号を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="メールアドレスを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="住所を入力"
                />
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  登録
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">顧客情報編集</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  顧客名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  defaultValue={editingCustomer.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  代表者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  defaultValue={editingCustomer.representative}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <input
                  type="tel"
                  defaultValue={editingCustomer.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  defaultValue={editingCustomer.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所
                </label>
                <textarea
                  rows={3}
                  defaultValue={editingCustomer.address}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 