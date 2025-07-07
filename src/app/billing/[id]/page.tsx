'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  DownloadIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

// 仮のデータ
const mockInvoice = {
  id: 1,
  invoiceNumber: 'INV-2024-001',
  client: 'A株式会社',
  clientAddress: '〒150-0001 東京都渋谷区神宮前1-1-1',
  clientPhone: '03-1234-5678',
  clientEmail: 'info@a-company.co.jp',
  project: 'A社コンサルティング案件',
  issueDate: '2024-01-15',
  dueDate: '2024-02-15',
  status: 'sent',
  paymentStatus: 'pending',
  sentDate: '2024-01-15',
  paymentDate: null,
  notes: '第1回請求書',
  
  // 請求項目
  items: [
    {
      id: 1,
      description: 'コンサルティングサービス（1月分）',
      quantity: 1,
      unitPrice: 2000000,
      amount: 2000000
    }
  ],
  
  // 金額情報
  subtotal: 2000000,
  taxRate: 0.1,
  taxAmount: 200000,
  totalAmount: 2200000,
  
  // 送付履歴
  sentHistory: [
    {
      id: 1,
      date: '2024-01-15',
      method: 'email',
      recipient: 'info@a-company.co.jp',
      status: 'sent'
    }
  ],
  
  // 入金履歴
  paymentHistory: []
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
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

  const isOverdue = () => {
    return new Date(mockInvoice.dueDate) < new Date() && mockInvoice.paymentStatus !== 'paid'
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
              <h1 className="text-2xl font-bold text-gray-900">{mockInvoice.invoiceNumber}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mockInvoice.status)}`}>
                  {getStatusText(mockInvoice.status)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(mockInvoice.paymentStatus)}`}>
                  {getPaymentStatusText(mockInvoice.paymentStatus)}
                </span>
                {isOverdue() && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    期限超過
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors">
              <EyeIcon className="w-4 h-4" />
              プレビュー
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors">
              <DownloadIcon className="w-4 h-4" />
              PDF出力
            </button>
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
                    { id: 'details', name: '詳細' },
                    { id: 'items', name: '請求項目' },
                    { id: 'history', name: '履歴' },
                    { id: 'actions', name: 'アクション' }
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
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* 基本情報 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">請求書番号</label>
                            <p className="text-gray-900">{mockInvoice.invoiceNumber}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">案件名</label>
                            <p className="text-gray-900">{mockInvoice.project}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">発行日</label>
                            <p className="text-gray-900">{mockInvoice.issueDate}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">支払期日</label>
                            <p className="text-gray-900">{mockInvoice.dueDate}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
                            <p className="text-gray-900">{mockInvoice.client}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">顧客住所</label>
                            <p className="text-gray-900">{mockInvoice.clientAddress}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">顧客電話番号</label>
                            <p className="text-gray-900">{mockInvoice.clientPhone}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">顧客メールアドレス</label>
                            <p className="text-gray-900">{mockInvoice.clientEmail}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 金額情報 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">金額情報</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">税抜金額</label>
                            <p className="text-2xl font-bold text-gray-900">¥{mockInvoice.subtotal.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">消費税（{mockInvoice.taxRate * 100}%）</label>
                            <p className="text-2xl font-bold text-gray-900">¥{mockInvoice.taxAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">税込合計</label>
                            <p className="text-2xl font-bold text-blue-600">¥{mockInvoice.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 備考 */}
                    {mockInvoice.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">備考</h3>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{mockInvoice.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'items' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">請求項目</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              項目
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              数量
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              単価
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              金額
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockInvoice.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ¥{item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ¥{item.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">送付・入金履歴</h3>
                    
                    {/* 送付履歴 */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">送付履歴</h4>
                      <div className="space-y-3">
                        {mockInvoice.sentHistory.map((sent) => (
                          <div key={sent.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{sent.date}</p>
                              <p className="text-sm text-gray-600">
                                {sent.method === 'email' ? 'メール送付' : '郵送'} - {sent.recipient}
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              送付済み
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 入金履歴 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">入金履歴</h4>
                      {mockInvoice.paymentHistory.length > 0 ? (
                        <div className="space-y-3">
                          {mockInvoice.paymentHistory.map((payment) => (
                            <div key={payment.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{payment.date}</p>
                                <p className="text-sm text-gray-600">¥{payment.amount.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <ClockIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>入金履歴がありません</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">アクション</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">請求書を送付</h4>
                            <p className="text-sm text-gray-600">メールまたは郵送で請求書を送付</p>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="w-6 h-6 text-green-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">入金確認</h4>
                            <p className="text-sm text-gray-600">入金状況を更新</p>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">PDF出力</h4>
                            <p className="text-sm text-gray-600">請求書をPDFで出力</p>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <PencilIcon className="w-6 h-6 text-orange-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">請求書を編集</h4>
                            <p className="text-sm text-gray-600">請求書の内容を修正</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* ステータス情報 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ステータス情報</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">請求書ステータス</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mockInvoice.status)}`}>
                    {getStatusText(mockInvoice.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">入金ステータス</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(mockInvoice.paymentStatus)}`}>
                    {getPaymentStatusText(mockInvoice.paymentStatus)}
                  </span>
                </div>
                {isOverdue() && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800">支払期日を超過しています</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  請求書を送付
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                  入金確認
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                  PDF出力
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm">
                  請求書を編集
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 