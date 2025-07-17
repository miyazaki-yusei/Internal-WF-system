'use client'

import { useState } from 'react'
import { 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline'

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CreateInvoiceModal({ isOpen, onClose, onSubmit }: CreateInvoiceModalProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    client: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    project: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    taxRate: 0.1
  })
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // 金額を自動計算
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice
      newItems[index].amount = quantity * unitPrice
    }
    
    setItems(newItems)
  }

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * formData.taxRate
    const totalAmount = subtotal + taxAmount
    
    onSubmit({
      ...formData,
      items,
      subtotal,
      taxAmount,
      totalAmount
    })
    onClose()
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = subtotal * formData.taxRate
  const totalAmount = subtotal + taxAmount

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">新規請求書作成</h2>
            <p className="text-gray-600 mt-1">新しい請求書の情報を入力してください</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              {showPreview ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {showPreview ? 'プレビュー非表示' : 'プレビュー表示'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* フォーム */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本情報 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        顧客名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="顧客名を入力"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        案件名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.project}
                        onChange={(e) => handleInputChange('project', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="案件名を入力"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        発行日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        支払期日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 顧客情報 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">顧客情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        顧客住所
                      </label>
                      <textarea
                        rows={3}
                        value={formData.clientAddress}
                        onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="顧客の住所を入力"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          電話番号
                        </label>
                        <input
                          type="tel"
                          value={formData.clientPhone}
                          onChange={(e) => handleInputChange('clientPhone', e.target.value)}
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
                          value={formData.clientEmail}
                          onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="メールアドレスを入力"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 請求項目 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">請求項目</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      項目追加
                    </button>
                  </div>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              項目名 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="項目名を入力"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              数量
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              単価（円）
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="text-sm text-gray-600">金額: </span>
                            <span className="font-medium">¥{item.amount.toLocaleString()}</span>
                          </div>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 金額計算 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">金額計算</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">小計:</span>
                        <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">消費税（{formData.taxRate * 100}%）:</span>
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
                  />
                </div>

                {/* 送信ボタン */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    請求書を作成
                  </button>
                </div>
              </form>
            </div>

            {/* プレビュー */}
            {showPreview && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">プレビュー</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.client || '顧客名'}</h4>
                    <p className="text-sm text-gray-600">{formData.project || '案件名'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">発行日: </span>
                      <span className="font-medium">{formData.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">支払期日: </span>
                      <span className="font-medium">{formData.dueDate}</span>
                    </div>
                  </div>
                  {items.some(item => item.description) && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">請求項目</h5>
                      <div className="space-y-2">
                        {items.filter(item => item.description).map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{item.description}</span>
                            <span className="text-gray-600 ml-2">
                              {item.quantity} × ¥{item.unitPrice.toLocaleString()} = ¥{item.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {subtotal > 0 && (
                    <div className="p-4 bg-white rounded-lg">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>小計</span>
                          <span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>消費税</span>
                          <span>¥{taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-gray-200 pt-1">
                          <span>合計</span>
                          <span className="text-blue-600">¥{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {formData.notes && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">備考</h5>
                      <p className="text-sm text-gray-600">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 