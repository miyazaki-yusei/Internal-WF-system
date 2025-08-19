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
import { useEmailTemplates } from '@/contexts/EmailTemplateContext'

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
  const [activeTab, setActiveTab] = useState<'billing' | 'email'>('billing');
  const [emailContent, setEmailContent] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });
  const [ccFields, setCcFields] = useState<string[]>(['']);
  const [bccFields, setBccFields] = useState<string[]>(['']);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [applicantComment, setApplicantComment] = useState('');
  const [approveComment, setApproveComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');
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

  // EmailTemplateContextを使用
  const { templates } = useEmailTemplates()

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
          if (field === 'unitPrice' || field === 'quantity') {
            updatedItem.amount = updatedItem.unitPrice * updatedItem.quantity
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const addItem = () => {
    const newItem: BillingItem = {
      id: Date.now().toString(),
      summary: '',
      unitPrice: 0,
      quantity: 1,
      amount: 0,
      remarks: ''
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
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

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  }

  const calculateTaxAmount = () => {
    return Math.round(calculateSubtotal() * (formData.taxRate / 100))
  }

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateTaxAmount()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const getCurrentUser = () => {
    return {
      name: '田中太郎',
      email: 'tanaka@festal.co.jp',
      department: '営業部'
    }
  }

  const generateEmailContent = () => {
    const currentUser = getCurrentUser()
    const totalAmount = calculateTotalAmount()
    
    return {
      subject: `【${formData.clientName}】請求書の件`,
      body: `${formData.clientName} 担当者様

平素より格別のご高配を賜り、厚く御礼申し上げます。

この度、${formData.projectName}に関する請求書を発行いたしましたので、ご連絡申し上げます。

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
      to: `${formData.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      cc: emailContent.cc,
      bcc: emailContent.bcc
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'create' || mode === 'edit') {
      setShowFinalConfirm(true)
    }
  }

  const handleApprove = () => {
    if (onApprove && billing) {
      onApprove(billing.id, approveComment)
    }
  }

  const handleReject = () => {
    if (onReject && billing) {
      onReject(billing.id, rejectComment)
    }
  }

  const addCcField = () => {
    setCcFields([...ccFields, '']);
  };

  const removeCcField = (index: number) => {
    if (ccFields.length > 1) {
      setCcFields(ccFields.filter((_, i) => i !== index));
    }
  };

  const updateCcField = (index: number, value: string) => {
    const newCcFields = [...ccFields];
    newCcFields[index] = value;
    setCcFields(newCcFields);
    setEmailContent(prev => ({ ...prev, cc: newCcFields.filter(field => field.trim()).join(', ') }));
  };

  const addBccField = () => {
    setBccFields([...bccFields, '']);
  };

  const removeBccField = (index: number) => {
    if (bccFields.length > 1) {
      setBccFields(bccFields.filter((_, i) => i !== index));
    }
  };

  const updateBccField = (index: number, value: string) => {
    const newBccFields = [...bccFields];
    newBccFields[index] = value;
    setBccFields(newBccFields);
    setEmailContent(prev => ({ ...prev, bcc: newBccFields.filter(field => field.trim()).join(', ') }));
  };

  // メールテンプレートの自動適用
  useEffect(() => {
    if (activeTab === 'email' && formData.clientName) {
      // クライアント名からメールアドレスを自動生成（実際の実装ではデータベースから取得）
      const clientEmail = `${formData.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      setEmailContent(prev => ({
        ...prev,
        to: clientEmail,
        subject: `【請求書】${formData.projectName} - ${formData.billingNumber}`,
        body: generateEmailContent().body
      }));
    }
  }, [activeTab, formData.clientName, formData.projectName, formData.billingNumber]);

  const handleTemplateSelect = (template: any) => {
    const generatedContent = generateEmailContent()
    setEmailContent({
      subject: template.subject.replace('{clientName}', formData.clientName),
      body: template.body
        .replace('{clientName}', formData.clientName)
        .replace('{projectName}', formData.projectName)
        .replace('{billingNumber}', formData.billingNumber)
        .replace('{billingDate}', formData.billingDate)
        .replace('{totalAmount}', formatCurrency(calculateTotalAmount()))
        .replace('{items}', formData.items.map(item => `・${item.summary}: ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n'))
        .replace('{userName}', getCurrentUser().name)
        .replace('{userEmail}', getCurrentUser().email),
      to: generatedContent.to,
      cc: emailContent.cc,
      bcc: emailContent.bcc
    })
  }

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
            type="button"
            onClick={() => setShowFinalConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            確定
          </button>
        )
      case 'edit':
        return (
          <button
            type="button"
            onClick={() => setShowFinalConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            確定
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
    <>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          請求書番号 <span className="text-red-500">*</span>
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
                          請求日 <span className="text-red-500">*</span>
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
                          支払期限
                        </label>
                        <input
                          type="date"
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
                                readOnly={mode === 'view'}
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
                                readOnly={mode === 'view'}
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
                                readOnly={mode === 'view'}
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

                  {/* 税区分・合計 */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">税区分・合計</h3>
                    <div className="flex gap-6">
                      <div className="w-48">
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
                          value={emailContent.to}
                          onChange={(e) => setEmailContent(prev => ({ ...prev, to: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="メールアドレスを入力"
                          readOnly={mode === 'view'}
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
                            value={emailContent.cc}
                            onChange={(e) => setEmailContent(prev => ({ ...prev, cc: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="CCメールアドレス"
                            readOnly={mode === 'view'}
                          />
                        </div>
                        
                        {/* BCC */}
                        <div className="w-36">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            BCC
                          </label>
                          <input
                            type="email"
                            value={emailContent.bcc}
                            onChange={(e) => setEmailContent(prev => ({ ...prev, bcc: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="BCCメールアドレス"
                            readOnly={mode === 'view'}
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
                          value={emailContent.subject}
                          onChange={(e) => setEmailContent(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="メール件名を入力"
                          readOnly={mode === 'view'}
                        />
                      </div>
                      
                      {/* メール本文 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          本文 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={6}
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
                    onClick={() => {
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
                      
                      if (onSubmit) {
                        onSubmit(billingData);
                      }
                      
                      setShowFinalConfirm(false);
                      onClose();
                    }}
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
  )
} 