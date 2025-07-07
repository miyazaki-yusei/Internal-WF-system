'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// 仮のデータ
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    client: 'A株式会社',
    project: 'A社コンサルティング案件',
    amount: 2000000,
    tax: 200000,
    totalAmount: 2200000,
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'sent',
    paymentStatus: 'pending',
    sentDate: '2024-01-15',
    paymentDate: null,
    notes: '第1回請求書'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    client: 'B株式会社',
    project: 'B社システム開発案件',
    amount: 3000000,
    tax: 300000,
    totalAmount: 3300000,
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    status: 'sent',
    paymentStatus: 'paid',
    sentDate: '2024-01-20',
    paymentDate: '2024-02-10',
    notes: '第2回請求書'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    client: 'C株式会社',
    project: 'C社DX推進案件',
    amount: 1500000,
    tax: 150000,
    totalAmount: 1650000,
    issueDate: '2024-01-25',
    dueDate: '2024-02-25',
    status: 'draft',
    paymentStatus: 'pending',
    sentDate: null,
    paymentDate: null,
    notes: '第1回請求書（下書き）'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-004',
    client: 'A株式会社',
    project: 'A社コンサルティング案件',
    amount: 1800000,
    tax: 180000,
    totalAmount: 1980000,
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    status: 'sent',
    paymentStatus: 'overdue',
    sentDate: '2024-02-01',
    paymentDate: null,
    notes: '第2回請求書'
  }
]

const invoiceStatuses = [
  { id: 'all', name: '全て' },
  { id: 'draft', name: '下書き' },
  { id: 'sent', name: '送付済み' },
  { id: 'cancelled', name: 'キャンセル' }
]

const paymentStatuses = [
  { id: 'all', name: '全て' },
  { id: 'pending', name: '未入金' },
  { id: 'paid', name: '入金済み' },
  { id: 'overdue', name: '期限超過' },
  { id: 'partial', name: '一部入金' }
]

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesInvoiceStatus = selectedInvoiceStatus === 'all' || invoice.status === selectedInvoiceStatus
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || invoice.paymentStatus === selectedPaymentStatus
    
    return matchesSearch && matchesInvoiceStatus && matchesPaymentStatus
  })

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInvoiceStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '下書き'
      case 'sent': return '送付済み'
      case 'cancelled': return 'キャンセル'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'partial': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '未入金'
      case 'paid': return '入金済み'
      case 'overdue': return '期限超過'
      case 'partial': return '一部入金'
      default: return status
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />
      case 'paid': return <CheckCircleIcon className="w-4 h-4" />
      case 'overdue': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'partial': return <ClockIcon className="w-4 h-4" />
      default: return <ClockIcon className="w-4 h-4" />
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">請求管理</h1>
            <p className="text-gray-600 mt-1">請求書の作成・送付・入金管理を行えます</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            新規請求書作成
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
                  placeholder="請求書番号・顧客名・案件名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* フィルター */}
            <div className="flex gap-4">
              <select
                value={selectedInvoiceStatus}
                onChange={(e) => setSelectedInvoiceStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {invoiceStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentStatuses.map(status => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">発行期間</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="flex items-center">〜</span>
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">請求金額範囲</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">顧客</label>
                  <input
                    type="text"
                    placeholder="顧客名"
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
                <p className="text-sm font-medium text-gray-600">総請求書数</p>
                <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総請求金額</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">未入金件数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredInvoices.filter(inv => inv.paymentStatus === 'pending' || inv.paymentStatus === 'overdue').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">期限超過</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredInvoices.filter(inv => inv.paymentStatus === 'overdue').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 請求書一覧 */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">請求書一覧</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                        {getInvoiceStatusText(invoice.status)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(invoice.paymentStatus)}`}>
                        {getPaymentStatusText(invoice.paymentStatus)}
                      </span>
                      {isOverdue(invoice.dueDate) && invoice.paymentStatus !== 'paid' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          期限超過
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">顧客</p>
                        <p className="font-medium text-gray-900">{invoice.client}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">案件</p>
                        <p className="font-medium text-gray-900">{invoice.project}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">発行日</p>
                        <p className="font-medium text-gray-900">{invoice.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">支払期日</p>
                        <p className="font-medium text-gray-900">{invoice.dueDate}</p>
                      </div>
                    </div>

                    {/* 金額情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">請求金額（税抜）</p>
                        <p className="font-medium text-gray-900">¥{invoice.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">消費税</p>
                        <p className="font-medium text-gray-900">¥{invoice.tax.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">合計金額</p>
                        <p className="font-medium text-gray-900">¥{invoice.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* 送付・入金情報 */}
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">送付日: </span>
                        <span className="font-medium">{invoice.sentDate || '未送付'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">入金日: </span>
                        <span className="font-medium">{invoice.paymentDate || '未入金'}</span>
                      </div>
                      {invoice.notes && (
                        <div>
                          <span className="text-gray-600">備考: </span>
                          <span className="font-medium">{invoice.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      詳細
                    </button>
                    <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors">
                      送付
                    </button>
                    <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors">
                      入金確認
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

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <DocumentTextIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">請求書が見つかりません</h3>
            <p className="text-gray-600">検索条件を変更するか、新しい請求書を作成してください。</p>
          </div>
        )}
      </div>
    </div>
  )
} 