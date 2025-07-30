'use client'

import { useState, useEffect } from 'react'

interface RejectedBilling {
  id: string;
  projectName: string;
  clientName: string;
  billingNumber: string;
  amount: number;
  appliedAt: string;
  appliedBy: string;
  rejectedAt: string;
  rejectedBy: string;
  rejectComment: string;
  items: BillingItem[];
  remarks: string;
}

interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface BillingRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  billing: RejectedBilling | null;
}

export default function BillingRejectModal({ 
  isOpen, 
  onClose, 
  billing 
}: BillingRejectModalProps) {
  const [formData, setFormData] = useState<RejectedBilling | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (billing) {
      setFormData(billing);
      setReply('');
    }
  }, [billing]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const updateItem = (index: number, field: keyof BillingItem, value: any) => {
    if (!formData) return;
    
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // 金額を再計算
    newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);
    setFormData(prev => prev ? {
      ...prev,
      items: newItems,
      amount: totalAmount
    } : null);
  };

  const handleSubmit = () => {
    if (!reply.trim()) {
      alert('経理からのコメントに対するリプライを入力してください。');
      return;
    }

    // 修正・再申請処理
    console.log('修正・再申請:', formData?.id, reply);
    alert('修正・再申請が完了しました。');
    onClose();
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">修正・再申請</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {/* 差戻しコメント */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">差戻しコメント</h3>
                <p className="text-sm text-red-800 mt-2">
                  <strong>差戻し担当者:</strong> {formData.rejectedBy}
                </p>
                <p className="text-sm text-red-800 mt-2">
                  <strong>差戻し日:</strong> {formData.rejectedAt}
                </p>
                <p className="text-sm text-red-800 mt-2">
                  {formData.rejectComment}
                </p>
              </div>
            </div>
          </div>

          {/* 請求書情報 */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">請求書情報</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">請求書番号</label>
                  <p className="text-gray-900">{formData.billingNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">案件名</label>
                  <p className="text-gray-900">{formData.projectName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">顧客名</label>
                  <p className="text-gray-900">{formData.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">申請者</label>
                  <p className="text-gray-900">{formData.appliedBy}</p>
                </div>
              </div>

              {/* 請求項目 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">請求項目</h3>
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">項目名</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">単価</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          小計: {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 合計金額 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">合計金額</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(formData.amount)}</span>
                </div>
              </div>

              {/* 備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => prev ? { ...prev, remarks: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              {/* リプライ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  経理からのコメントに対するリプライ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="修正内容や対応状況を入力してください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reply.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              修正・再申請
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 