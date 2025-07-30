'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

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
  comment?: string
}

interface BillingRejectModalProps {
  isOpen: boolean
  onClose: () => void
  application: BillingApplication
  onSave: (application: BillingApplication, updatedContent: any) => void
}

export default function BillingRejectModal({ isOpen, onClose, application, onSave }: BillingRejectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: application.amount,
    details: [] as string[]
  })

  const [correctionComment, setCorrectionComment] = useState('')

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    if (application) {
      setFormData({
        title: `${application.projectName} システム開発`,
        description: `${application.projectName}のシステム開発業務を実施いたしました。`,
        amount: application.amount,
        details: ['要件定義', '設計', '開発', 'テスト', '運用支援']
      })
    }
  }, [application])

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...formData.details]
    newDetails[index] = value
    handleInputChange('details', newDetails)
  }

  const addDetail = () => {
    handleInputChange('details', [...formData.details, ''])
  }

  const removeDetail = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index)
    handleInputChange('details', newDetails)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です'
    }

    if (!formData.description.trim()) {
      newErrors.description = '詳細は必須です'
    }

    if (formData.amount <= 0) {
      newErrors.amount = '金額は0より大きい値を入力してください'
    }

    if (formData.details.length === 0) {
      newErrors.details = '実施内容は最低1つ入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      setShowConfirmModal(true)
    }
  }

  const handleClose = () => {
    setCorrectionComment('')
    onClose()
  }

  const handleConfirmSave = () => {
    onSave(application, { ...formData, correctionComment })
    setShowConfirmModal(false)
    onClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-900">請求書修正</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 請求書情報 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">請求書情報</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">請求書番号:</span>
                  <span className="ml-2 font-medium">{application.billingNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">案件名:</span>
                  <span className="ml-2 font-medium">{application.projectName}</span>
                </div>
                <div>
                  <span className="text-gray-600">クライアント:</span>
                  <span className="ml-2 font-medium">{application.clientName}</span>
                </div>
                <div>
                  <span className="text-gray-600">申請者:</span>
                  <span className="ml-2 font-medium">{application.appliedBy}</span>
                </div>
                <div>
                  <span className="text-gray-600">申請日:</span>
                  <span className="ml-2 font-medium">{formatDate(application.appliedAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">差戻日:</span>
                  <span className="ml-2 font-medium">{application.approvedAt ? formatDate(application.approvedAt) : '-'}</span>
                </div>
              </div>
            </div>

            {/* 差戻コメント */}
            {application.comment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">差戻し理由</h4>
                <p className="text-red-800 text-sm">{application.comment}</p>
              </div>
            )}

            {/* 請求内容修正 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">請求内容修正</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="請求書のタイトルを入力"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="請求内容の詳細を入力"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  請求金額 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  実施内容 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {formData.details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => handleDetailChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`実施内容 ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeDetail(index)}
                        className="px-2 py-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDetail}
                    className="px-3 py-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + 実施内容を追加
                  </button>
                </div>
                {errors.details && (
                  <p className="text-red-500 text-xs mt-1">{errors.details}</p>
                )}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                経理再申請
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 最終確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">経理再申請確認</h3>
              <p className="text-gray-600 mb-4">
                請求書「{application.billingNumber}」を修正して経理に再申請しますか？
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">修正内容</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-600">タイトル:</span>
                    <span className="ml-2 font-medium">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">金額:</span>
                    <span className="ml-2 font-medium">{formatCurrency(formData.amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">実施内容:</span>
                    <span className="ml-2 font-medium">{formData.details.length}項目</span>
                  </div>
                </div>
              </div>

              {/* 修正コメント入力 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  修正コメント <span className="text-gray-500">（経理コメントへのリプライ）</span>
                </label>
                <textarea
                  value={correctionComment}
                  onChange={(e) => setCorrectionComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="経理からの差戻し理由に対する修正内容や対応状況を入力してください"
                />
                <p className="text-xs text-gray-500 mt-1">
                  経理からの差戻し理由に対して、どのように修正したかを説明してください
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  いいえ
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  はい
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 