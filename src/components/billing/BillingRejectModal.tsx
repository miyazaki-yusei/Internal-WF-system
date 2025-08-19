'use client'

import { useState, useEffect } from 'react'
import { useEmailTemplates } from '@/contexts/EmailTemplateContext'

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
  billingData: any;
  onSave?: (data: any) => void;
}

export default function BillingRejectModal({
  isOpen,
  onClose,
  billingData,
  onSave
}: BillingRejectModalProps) {
  const [activeTab, setActiveTab] = useState<'billing' | 'email'>('billing');
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [applicantComment, setApplicantComment] = useState('');
  const [formData, setFormData] = useState({
    billingNumber: billingData?.billingNumber || '',
    billingDate: billingData?.billingDate || '',
    dueDate: billingData?.dueDate || '',
    items: billingData?.items || [{ id: '1', summary: '', unitPrice: 0, quantity: 1, amount: 0, remarks: '' }],
    taxRate: billingData?.taxRate || 10,
    notes: billingData?.notes || '',
    emailContent: {
      subject: '',
      body: '',
      to: '',
      cc: '',
      bcc: ''
    }
  });

  // EmailTemplateContextを使用
  const { templates } = useEmailTemplates();

  useEffect(() => {
    if (isOpen && billingData) {
      setFormData({
        billingNumber: billingData.billingNumber || '',
        billingDate: billingData.billingDate || '',
        dueDate: billingData.dueDate || '',
        items: billingData.items || [{ id: '1', summary: '', unitPrice: 0, quantity: 1, amount: 0, remarks: '' }],
        taxRate: billingData.taxRate || 10,
        notes: billingData.notes || '',
        emailContent: {
          subject: '',
          body: '',
          to: '',
          cc: '',
          bcc: ''
        }
      });
    }
  }, [isOpen, billingData]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (itemId: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'unitPrice' || field === 'quantity') {
            updatedItem.amount = updatedItem.unitPrice * updatedItem.quantity;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
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

  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const calculateTaxAmount = () => {
    return Math.round(calculateSubtotal() * (formData.taxRate / 100));
  };

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const getCurrentUser = () => {
    return {
      name: '田中太郎',
      email: 'tanaka@festal.co.jp',
      department: '営業部'
    };
  };

  const generateEmailContent = () => {
    const currentUser = getCurrentUser();
    const totalAmount = calculateTotalAmount();
    
    return {
      subject: `【${billingData?.clientName}】請求書の件`,
      body: `${billingData?.clientName} 担当者様

平素より格別のご高配を賜り、厚く御礼申し上げます。

この度、${billingData?.projectName}に関する請求書を発行いたしましたので、ご連絡申し上げます。

【請求書詳細】
請求書番号: ${formData.billingNumber}
請求日: ${formData.billingDate}
請求金額: ${formatCurrency(totalAmount)}（税込）

【請求内容】
${formData.items.map(item => `・${item.summary}: ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n')}

合計金額: ${formatCurrency(totalAmount)}（税込）

請求書の詳細は添付ファイルをご確認ください。

ご不明な点がございましたら、お気軽にお問い合わせください。

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
株式会社フェスタル
担当: ${currentUser.name}
TEL: 03-1234-5678
Email: ${currentUser.email}`,
      to: `${billingData?.clientName?.toLowerCase().replace(/\s+/g, '')}@example.com`,
      cc: formData.emailContent.cc,
      bcc: formData.emailContent.bcc
    };
  };

  const handleSave = () => {
    if (!billingData) return;
    
    const billingData = {
      ...formData,
      totalAmount: calculateTotalAmount(),
      subtotal: calculateSubtotal(),
      taxAmount: calculateTaxAmount(),
      items: formData.items.map(item => ({
        ...item,
        amount: item.unitPrice * item.quantity
      })),
      emailContent: generateEmailContent(),
      applicantComment: applicantComment,
      appliedAt: new Date().toISOString(),
      appliedBy: getCurrentUser().name,
      status: 'pending'
    };
    
    if (onSave) {
      onSave(billingData);
    }
    
    setShowFinalConfirm(false);
    onClose();
  };

  const handleTemplateSelect = (template: any) => {
    const generatedContent = generateEmailContent();
    setFormData(prev => ({
      ...prev,
      emailContent: {
        subject: template.subject.replace('{clientName}', billingData?.clientName || ''),
        body: template.body
          .replace('{clientName}', billingData?.clientName || '')
          .replace('{projectName}', billingData?.projectName || '')
          .replace('{billingNumber}', formData.billingNumber)
          .replace('{billingDate}', formData.billingDate)
          .replace('{totalAmount}', formatCurrency(calculateTotalAmount()))
          .replace('{items}', formData.items.map(item => `・${item.summary}: ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n'))
          .replace('{userName}', getCurrentUser().name)
          .replace('{userEmail}', getCurrentUser().email),
        to: generatedContent.to,
        cc: formData.emailContent.cc,
        bcc: formData.emailContent.bcc
      }
    }));
  };

  if (!isOpen || !billingData) return null;

  return (
    <>
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

          {/* タブナビゲーション */}
          <div className="px-6 pt-4">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
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
                type="button"
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
          </div>

          <div className="px-6 pb-4">
            {/* 請求内容タブ */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                {/* 案件情報セクション */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">案件情報</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        案件名
                      </label>
                      <input
                        type="text"
                        value={billingData.projectName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        クライアント名
                      </label>
                      <input
                        type="text"
                        value={billingData.clientName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        担当者
                      </label>
                      <input
                        type="text"
                        value={getCurrentUser().name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* 請求書詳細セクション */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">請求書詳細</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        請求書番号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.billingNumber}
                        onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="請求書番号"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        請求日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.billingDate}
                        onChange={(e) => handleInputChange('billingDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="yyyy/mm/dd"
                      />
                    </div>
                  </div>
                </div>

                {/* 請求項目セクション */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">請求項目</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      項目追加
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex gap-4">
                          <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              摘要 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.summary}
                              onChange={(e) => handleItemChange(item.id, 'summary', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="摘要を入力"
                            />
                          </div>
                          <div className="w-36">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              単価
                            </label>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                          <div className="w-16">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              数量
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1"
                            />
                          </div>
                          <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              金額
                            </label>
                            <input
                              type="text"
                              value={formatCurrency(item.unitPrice * item.quantity)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              readOnly
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              備考
                            </label>
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={(e) => handleItemChange(item.id, 'remarks', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="備考"
                            />
                          </div>
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            削除
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 税区分・合計セクション */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">税区分・合計</h3>
                  
                  <div className="flex gap-6">
                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        税率(%)
                      </label>
                      <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10"
                      />
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 flex-1">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">小計:</span>
                          <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">消費税({formData.taxRate}%):</span>
                          <span className="font-medium">{formatCurrency(calculateTaxAmount())}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-blue-600 border-t border-gray-200 pt-3">
                          <span>合計:</span>
                          <span>{formatCurrency(calculateTotalAmount())}</span>
                        </div>
                      </div>
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
                    type="button"
                    onClick={() => setShowFinalConfirm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    確定
                  </button>
                </div>
              </div>
            )}

            {/* メール内容タブ */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                {/* メール内容 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">メール内容</h3>
                  
                  <div className="space-y-4">
                    {/* 宛先 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        宛先 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.emailContent.to}
                        onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, to: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="メールアドレスを入力"
                      />
                    </div>
                    
                    {/* CC と BCC を横並びで配置 */}
                    <div className="flex gap-4">
                      {/* CC */}
                      <div className="w-36">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CC
                        </label>
                        <input
                          type="email"
                          value={formData.emailContent.cc}
                          onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, cc: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="CCメールアドレス"
                        />
                      </div>
                      
                      {/* BCC */}
                      <div className="w-36">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BCC
                        </label>
                        <input
                          type="email"
                          value={formData.emailContent.bcc}
                          onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, bcc: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="BCCメールアドレス"
                        />
                      </div>
                    </div>
                    
                    {/* 件名 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        件名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.emailContent.subject}
                        onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="メール件名を入力"
                      />
                    </div>
                    
                    {/* メール本文 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        本文 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.emailContent.body}
                        onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, body: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={6}
                        placeholder="メール本文を入力"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('billing')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFinalConfirm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    確定
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 最終確認モーダル */}
      {showFinalConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowFinalConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-6">
                {/* 確認メッセージ */}
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">経理申請の確認</h3>
                    <p className="text-gray-600">
                      この内容で経理担当者へ申請してもよろしいですか？
                    </p>
                  </div>
                </div>

                {/* 申請者コメント */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">申請者コメント</h3>
                  <textarea
                    value={applicantComment}
                    onChange={(e) => setApplicantComment(e.target.value)}
                    placeholder="申請に関するコメントがあれば入力してください（任意）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowFinalConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    経理申請
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 