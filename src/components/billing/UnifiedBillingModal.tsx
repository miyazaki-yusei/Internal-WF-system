'use client'

import { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline'

interface BillingItem {
  id: string
  summary: string
  unitPrice: number
  quantity: number
  amount: number
  remarks: string
}

interface BillingApplication {
  id: string
  projectName: string
  clientName: string
  billingNumber: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'resubmitted'
  appliedAt: string
  appliedBy: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  comment?: string
  items?: BillingItem[]
  taxRate?: number
  billingDate?: string
  dueDate?: string
  notes?: string
}

interface UnifiedBillingModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'view' | 'edit' | 'approve' | 'reject'
  billing?: BillingApplication | null
  onSubmit?: (data: any) => void
  onApprove?: (id: string, comment?: string) => void
  onReject?: (id: string, comment: string) => void
}

export default function UnifiedBillingModal({ 
  isOpen, 
  onClose, 
  mode, 
  billing, 
  onSubmit, 
  onApprove, 
  onReject 
}: UnifiedBillingModalProps) {
  const [activeTab, setActiveTab] = useState<'billing' | 'email'>('billing')
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    billingNumber: '',
    billingDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: 10,
    notes: '',
    items: [
      {
        id: '1',
        summary: '',
        unitPrice: 0,
        quantity: 1,
        amount: 0,
        remarks: ''
      }
    ] as BillingItem[]
  })
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: '',
    to: '',
    cc: '',
    bcc: ''
  })
  const [approveComment, setApproveComment] = useState('')
  const [rejectComment, setRejectComment] = useState('')

  useEffect(() => {
    if (billing && mode !== 'create') {
      setFormData({
        projectName: billing.projectName || '',
        clientName: billing.clientName || '',
        billingNumber: billing.billingNumber || '',
        billingDate: billing.billingDate || new Date().toISOString().split('T')[0],
        dueDate: billing.dueDate || '',
        taxRate: billing.taxRate || 10,
        notes: billing.notes || '',
        items: billing.items || [
          {
            id: '1',
            summary: '',
            unitPrice: 0,
            quantity: 1,
            amount: 0,
            remarks: ''
          }
        ]
      })
    }
  }, [billing, mode])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (itemId: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          // 金額を自動計算
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const addItem = () => {
    const newId = Date.now().toString()
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: newId,
        summary: '',
        unitPrice: 0,
        quantity: 1,
        amount: 0,
        remarks: ''
      }]
    }))
  }

  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (formData.taxRate / 100)
    const totalAmount = subtotal + taxAmount
    
    if (onSubmit) {
      onSubmit({
        ...formData,
        subtotal,
        taxAmount,
        totalAmount,
        emailContent
      })
    }
    onClose()
  }

  const handleApprove = () => {
    if (onApprove && billing) {
      onApprove(billing.id, approveComment)
    }
    onClose()
  }

  const handleReject = () => {
    if (onReject && billing && rejectComment.trim()) {
      onReject(billing.id, rejectComment)
    }
    onClose()
  }

  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = subtotal * (formData.taxRate / 100)
  const totalAmount = subtotal + taxAmount

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return '請求書作成'
      case 'view':
        return '請求書詳細'
      case 'edit':
        return '請求書編集'
      case 'approve':
        return '請求書承認'
      case 'reject':
        return '請求書差戻'
      default:
        return '請求書'
    }
  }

  const getActionButton = () => {
    switch (mode) {
      case 'create':
        return (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            請求書を作成
          </button>
        )
      case 'edit':
        return (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            請求書を更新
          </button>
        )
      case 'approve':
        return (
          <button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            承認
          </button>
        )
      case 'reject':
        return (
          <button
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            差戻
          </button>
        )
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' && '新しい請求書の情報を入力してください'}
              {mode === 'view' && '請求書の詳細を確認してください'}
              {mode === 'edit' && '請求書の情報を編集してください'}
              {mode === 'approve' && '請求書の内容を確認して承認してください'}
              {mode === 'reject' && '請求書の差戻理由を入力してください'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6">
          {/* タブナビゲーション */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'billing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              請求内容
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              メール内容
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 請求内容タブ */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                {/* 案件情報 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">案件情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        案件名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.projectName}
                        onChange={(e) => handleInputChange('projectName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="案件名を入力"
                        readOnly={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        クライアント名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="クライアント名を入力"
                        readOnly={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        担当者
                      </label>
                      <input
                        type="text"
                        value={billing?.appliedBy || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="担当者名"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* 請求書詳細 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-md font-medium text-gray-900">請求書詳細</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">ファーム案件</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        請求書番号* <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.billingNumber}
                        onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="請求書番号"
                        readOnly={mode === 'view'}
                      />
                      <p className="text-xs text-gray-500 mt-1">(自動生成) フォーマット: YYYYMMDDSSCC</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        請求日* <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.billingDate}
                        onChange={(e) => handleInputChange('billingDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        支払期限* <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="yyyy/mm/dd"
                        readOnly={mode === 'view'}
                      />
                    </div>
                  </div>
                </div>

                {/* 請求項目 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">請求項目</h3>
                    {(mode === 'create' || mode === 'edit') && (
                      <button
                        type="button"
                        onClick={addItem}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <PlusIcon className="w-4 h-4" />
                        項目を追加
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              摘要 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.summary}
                              onChange={(e) => handleItemChange(item.id, 'summary', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="摘要を入力"
                              readOnly={mode === 'view'}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              単価
                            </label>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              readOnly={mode === 'view'}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              数量
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1"
                              readOnly={mode === 'view'}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              金額
                            </label>
                            <input
                              type="number"
                              value={item.amount}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                              placeholder="0"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              備考
                            </label>
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={(e) => handleItemChange(item.id, 'remarks', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="備考"
                              readOnly={mode === 'view'}
                            />
                          </div>
                        </div>
                        {(mode === 'create' || mode === 'edit') && formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                            削除
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 税区分 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">税区分</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        税率(%)
                      </label>
                      <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10"
                        readOnly={mode === 'view'}
                      />
                    </div>
                  </div>
                </div>

                {/* 合計 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">合計</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">小計:</span>
                        <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">消費税({formData.taxRate}%):</span>
                        <span className="font-medium">¥{taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-blue-600 border-t border-gray-200 pt-3">
                        <span>合計:</span>
                        <span>¥{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 備考 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">備考</h3>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="備考があれば入力してください"
                    readOnly={mode === 'view'}
                  />
                </div>

                {/* 承認・差戻コメント */}
                {(mode === 'approve' || mode === 'reject') && (
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      {mode === 'approve' ? '承認コメント' : '差戻理由'}
                    </h3>
                    <textarea
                      rows={4}
                      value={mode === 'approve' ? approveComment : rejectComment}
                      onChange={(e) => mode === 'approve' ? setApproveComment(e.target.value) : setRejectComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={mode === 'approve' ? '承認コメントを入力してください（任意）' : '差戻理由を入力してください'}
                      required={mode === 'reject'}
                    />
                  </div>
                )}
              </div>
            )}

            {/* メール内容タブ */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">メール内容</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        件名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={emailContent.subject}
                        onChange={(e) => setEmailContent(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="メール件名を入力"
                        readOnly={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        宛先 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={emailContent.to}
                        onChange={(e) => setEmailContent(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="メールアドレスを入力"
                        readOnly={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CC
                      </label>
                      <input
                        type="email"
                        value={emailContent.cc}
                        onChange={(e) => setEmailContent(prev => ({ ...prev, cc: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="CCメールアドレスを入力"
                        readOnly={mode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メール本文 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={emailContent.body}
                        onChange={(e) => setEmailContent(prev => ({ ...prev, body: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="メール本文を入力"
                        readOnly={mode === 'view'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              {getActionButton()}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 