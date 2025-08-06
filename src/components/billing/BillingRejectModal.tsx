'use client'

import React, { useState, useEffect } from 'react';

interface BillingItem {
  id: string;
  summary: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  remarks: string;
}

interface BillingRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  billingData: {
    id: string;
    projectName: string;
    clientName: string;
    billingNumber: string;
    amount: number;
    status: string;
    appliedAt: string;
    appliedBy: string;
    comment?: string;
    // 請求詳細データ
    billingDate?: string;
    dueDate?: string;
    items?: BillingItem[];
    taxRate?: number;
    subtotal?: number;
    taxAmount?: number;
    totalAmount?: number;
    emailContent?: {
      subject: string;
      body: string;
      to: string;
      cc?: string;
    };
  };
  onSave: (updatedData: any) => void;
}

export default function BillingRejectModal({
  isOpen,
  onClose,
  billingData,
  onSave
}: BillingRejectModalProps) {
  const [formData, setFormData] = useState({
    billingNumber: billingData?.billingNumber || '',
    billingDate: billingData?.billingDate || '',
    dueDate: billingData?.dueDate || '',
    items: billingData?.items || [{ id: '1', summary: '', unitPrice: 0, quantity: 1, amount: 0, remarks: '' }],
    taxRate: billingData?.taxRate || 10,
    subtotal: billingData?.subtotal || 0,
    taxAmount: billingData?.taxAmount || 0,
    totalAmount: billingData?.totalAmount || 0,
    emailContent: billingData?.emailContent || {
      subject: '',
      body: '',
      to: '',
      cc: ''
    },
    comment: billingData?.comment || ''
  });

  const [activeTab, setActiveTab] = useState<'billing' | 'email'>('billing');

  useEffect(() => {
    if (isOpen && billingData) {
      setFormData({
        billingNumber: billingData.billingNumber || '',
        billingDate: billingData.billingDate || '',
        dueDate: billingData.dueDate || '',
        items: billingData.items || [{ id: '1', summary: '', unitPrice: 0, quantity: 1, amount: 0, remarks: '' }],
        taxRate: billingData.taxRate || 10,
        subtotal: billingData.subtotal || 0,
        taxAmount: billingData.taxAmount || 0,
        totalAmount: billingData.totalAmount || 0,
        emailContent: billingData.emailContent || {
          subject: '',
          body: '',
          to: '',
          cc: ''
        },
        comment: billingData.comment || ''
      });
    }
  }, [isOpen, billingData]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateItemAmount = (item: BillingItem) => {
    return item.unitPrice * item.quantity;
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  };

  const calculateTaxAmount = () => {
    return Math.round(calculateSubtotal() * (formData.taxRate / 100));
  };

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const addBillingItem = () => {
    const newItem: BillingItem = {
      id: Date.now().toString(),
      summary: '',
      unitPrice: 0,
      quantity: 1,
      amount: 0,
      remarks: ''
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeBillingItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const updateBillingItem = (itemId: string, field: keyof BillingItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'unitPrice' || field === 'quantity') {
            updatedItem.amount = calculateItemAmount(updatedItem);
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSave = () => {
    if (!billingData) return;
    
    const updatedData = {
      ...billingData,
      ...formData,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTaxAmount(),
      totalAmount: calculateTotalAmount()
    };
    onSave(updatedData);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  if (!isOpen || !billingData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">請求書修正</h2>
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
              請求詳細
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

          {/* 請求詳細タブ */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      請求書番号
                    </label>
                    <input
                      type="text"
                      value={formData.billingNumber}
                      onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      請求日
                    </label>
                    <input
                      type="date"
                      value={formData.billingDate}
                      onChange={(e) => handleInputChange('billingDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      支払期限
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 請求項目 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">請求項目</h3>
                  <button
                    type="button"
                    onClick={addBillingItem}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    項目を追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">摘要</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">単価</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">数量</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">金額</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">備考</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="text"
                              value={item.summary}
                              onChange={(e) => updateBillingItem(item.id, 'summary', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="摘要を入力"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateBillingItem(item.id, 'unitPrice', Number(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateBillingItem(item.id, 'quantity', Number(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="1"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="number"
                              value={item.amount}
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                              readOnly
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={(e) => updateBillingItem(item.id, 'remarks', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="備考"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBillingItem(item.id)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                削除
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 税区分・合計 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">税区分・合計</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      税区分 (%)
                    </label>
                    <input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      小計
                    </label>
                    <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                      {formatCurrency(calculateSubtotal())}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      消費税
                    </label>
                    <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                      {formatCurrency(calculateTaxAmount())}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      合計
                    </label>
                    <div className="px-3 py-2 bg-white border border-gray-300 rounded-md font-medium">
                      {formatCurrency(calculateTotalAmount())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* メール内容タブ */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    件名
                  </label>
                  <input
                    type="text"
                    value={formData.emailContent.subject}
                    onChange={(e) => handleInputChange('emailContent', {
                      ...formData.emailContent,
                      subject: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宛先
                  </label>
                  <input
                    type="email"
                    value={formData.emailContent.to}
                    onChange={(e) => handleInputChange('emailContent', {
                      ...formData.emailContent,
                      to: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CC
                </label>
                <input
                  type="email"
                  value={formData.emailContent.cc || ''}
                  onChange={(e) => handleInputChange('emailContent', {
                    ...formData.emailContent,
                    cc: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本文
                </label>
                <textarea
                  value={formData.emailContent.body}
                  onChange={(e) => handleInputChange('emailContent', {
                    ...formData.emailContent,
                    body: e.target.value
                  })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* 経理からのコメント */}
          {billingData.comment && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                経理からのコメント
              </label>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{billingData.comment}</p>
              </div>
            </div>
          )}

          {/* 申請者コメント */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              申請者コメント
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="修正内容やコメントがあれば入力してください"
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              修正を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 