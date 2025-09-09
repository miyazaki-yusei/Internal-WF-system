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

  // EmailTemplateContext繧剃ｽｿ逕ｨ
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
          // 驥鷹｡阪ｒ閾ｪ蜍戊ｨ育ｮ・
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
      name: '逕ｰ荳ｭ螟ｪ驛・,
      email: 'tanaka@festal.co.jp',
      department: '蝟ｶ讌ｭ驛ｨ'
    }
  }

  const generateEmailContent = () => {
    const currentUser = getCurrentUser()
    const totalAmount = calculateTotalAmount()
    
    return {
      subject: `縲・{formData.clientName}縲題ｫ区ｱよ嶌縺ｮ莉ｶ`,
      body: `${formData.clientName} 諡・ｽ楢・ｧ・

蟷ｳ邏繧医ｊ譬ｼ蛻･縺ｮ縺秘ｫ倬・繧定ｳ懊ｊ縲∝字縺丞ｾ｡遉ｼ逕ｳ縺嶺ｸ翫￡縺ｾ縺吶・

縺薙・蠎ｦ縲・{formData.projectName}縺ｫ髢｢縺吶ｋ隲区ｱよ嶌繧堤匱陦後＞縺溘＠縺ｾ縺励◆縺ｮ縺ｧ縲√＃騾｣邨｡逕ｳ縺嶺ｸ翫￡縺ｾ縺吶・

縲占ｫ区ｱよ嶌隧ｳ邏ｰ縲・
隲区ｱよ嶌逡ｪ蜿ｷ: ${formData.billingNumber}
隲区ｱよ律: ${formData.billingDate}
隲区ｱる≡鬘・ ${formatCurrency(totalAmount)}・育ｨ手ｾｼ・・

縲占ｫ区ｱょ・螳ｹ縲・
${formData.items.map(item => `繝ｻ${item.summary}: ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n')}

蜷郁ｨ磯≡鬘・ ${formatCurrency(totalAmount)}・育ｨ手ｾｼ・・

隲区ｱよ嶌縺ｮ隧ｳ邏ｰ縺ｯ豺ｻ莉倥ヵ繧｡繧､繝ｫ繧偵＃遒ｺ隱阪￥縺縺輔＞縲・

縺比ｸ肴・縺ｪ轤ｹ縺後＃縺悶＞縺ｾ縺励◆繧峨√♀豌苓ｻｽ縺ｫ縺雁撫縺・粋繧上○縺上□縺輔＞縲・

莉雁ｾ後→繧ゅｈ繧阪＠縺上♀鬘倥＞縺・◆縺励∪縺吶・

笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏・
譬ｪ蠑丈ｼ夂､ｾ繝輔ぉ繧ｹ繧ｿ繝ｫ
諡・ｽ・ ${currentUser.name}
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

  // 繝｡繝ｼ繝ｫ繝・Φ繝励Ξ繝ｼ繝医・閾ｪ蜍暮←逕ｨ
  useEffect(() => {
    if (activeTab === 'email' && formData.clientName) {
      // 繧ｯ繝ｩ繧､繧｢繝ｳ繝亥錐縺九ｉ繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧定・蜍慕函謌撰ｼ亥ｮ滄圀縺ｮ螳溯｣・〒縺ｯ繝・・繧ｿ繝吶・繧ｹ縺九ｉ蜿門ｾ暦ｼ・
      const clientEmail = `${formData.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      setEmailContent(prev => ({
        ...prev,
        to: clientEmail,
        subject: `縲占ｫ区ｱよ嶌縲・{formData.projectName} - ${formData.billingNumber}`,
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
        .replace('{items}', formData.items.map(item => `繝ｻ${item.summary}: ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n'))
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
        return '隲区ｱよ嶌菴懈・'
      case 'view':
        return '隲区ｱよ嶌隧ｳ邏ｰ'
      case 'edit':
        return '隲区ｱよ嶌邱ｨ髮・
      case 'approve':
        return '隲区ｱよ嶌謇ｿ隱・
      case 'reject':
        return '隲区ｱよ嶌蟾ｮ謌ｻ'
      default:
        return '隲区ｱよ嶌'
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
            遒ｺ螳・
          </button>
        )
      case 'edit':
        return (
          <button
            type="button"
            onClick={() => setShowFinalConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            遒ｺ螳・
          </button>
        )
      case 'approve':
        return (
          <button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            謇ｿ隱・
          </button>
        )
      case 'reject':
        return (
          <button
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            蟾ｮ謌ｻ
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
          {/* 繝倥ャ繝繝ｼ */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
              <p className="text-gray-600 mt-1">
                {mode === 'create' && '譁ｰ縺励＞隲区ｱよ嶌縺ｮ諠・ｱ繧貞・蜉帙＠縺ｦ縺上□縺輔＞'}
                {mode === 'view' && '隲区ｱよ嶌縺ｮ隧ｳ邏ｰ繧堤｢ｺ隱阪＠縺ｦ縺上□縺輔＞'}
                {mode === 'edit' && '隲区ｱよ嶌縺ｮ諠・ｱ繧堤ｷｨ髮・＠縺ｦ縺上□縺輔＞'}
                {mode === 'approve' && '隲区ｱよ嶌縺ｮ蜀・ｮｹ繧堤｢ｺ隱阪＠縺ｦ謇ｿ隱阪＠縺ｦ縺上□縺輔＞'}
                {mode === 'reject' && '隲区ｱよ嶌縺ｮ蟾ｮ謌ｻ逅・罰繧貞・蜉帙＠縺ｦ縺上□縺輔＞'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 繝｡繧､繝ｳ繧ｳ繝ｳ繝・Φ繝・*/}
          <div className="p-6">
            {/* 繧ｿ繝悶リ繝薙ご繝ｼ繧ｷ繝ｧ繝ｳ */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('billing')}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === 'billing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                隲区ｱょ・螳ｹ
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === 'email'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                繝｡繝ｼ繝ｫ蜀・ｮｹ
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 隲区ｱょ・螳ｹ繧ｿ繝・*/}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  {/* 譯井ｻｶ諠・ｱ */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">譯井ｻｶ諠・ｱ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          譯井ｻｶ蜷・<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.projectName}
                          onChange={(e) => handleInputChange('projectName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="譯井ｻｶ蜷阪ｒ蜈･蜉・
                          readOnly={mode === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          繧ｯ繝ｩ繧､繧｢繝ｳ繝亥錐 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="繧ｯ繝ｩ繧､繧｢繝ｳ繝亥錐繧貞・蜉・
                          readOnly={mode === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          諡・ｽ楢・
                        </label>
                        <input
                          type="text"
                          value={billing?.appliedBy || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          placeholder="諡・ｽ楢・錐"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* 隲区ｱよ嶌隧ｳ邏ｰ */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-md font-medium text-gray-900">隲区ｱよ嶌隧ｳ邏ｰ</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">繝輔ぃ繝ｼ繝譯井ｻｶ</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          隲区ｱよ嶌逡ｪ蜿ｷ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.billingNumber}
                          onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="隲区ｱよ嶌逡ｪ蜿ｷ"
                          readOnly={mode === 'view'}
                        />
                        <p className="text-xs text-gray-500 mt-1">(閾ｪ蜍慕函謌・ 繝輔か繝ｼ繝槭ャ繝・ YYYYMMDDSSCC</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          隲区ｱよ律 <span className="text-red-500">*</span>
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
                          謾ｯ謇墓悄髯・
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

                  {/* 隲区ｱる・岼 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-medium text-gray-900">隲区ｱる・岼</h3>
                      {(mode === 'create' || mode === 'edit') && (
                        <button
                          type="button"
                          onClick={addItem}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                        >
                          <PlusIcon className="w-4 h-4" />
                          鬆・岼繧定ｿｽ蜉
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {formData.items.map((item, index) => (
                        <div key={item.id} className="relative p-4 bg-gray-50 rounded-lg">
                          <div className="flex gap-4">
                            <div className="w-64">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                鞫倩ｦ・<span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={item.summary}
                                onChange={(e) => handleItemChange(item.id, 'summary', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="鞫倩ｦ√ｒ蜈･蜉・
                                readOnly={mode === 'view'}
                              />
                            </div>
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                蜊倅ｾ｡
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
                                謨ｰ驥・
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
                                驥鷹｡・
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
                                蛯呵・
                              </label>
                              <input
                                type="text"
                                value={item.remarks}
                                onChange={(e) => handleItemChange(item.id, 'remarks', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="蛯呵・
                                readOnly={mode === 'view'}
                              />
                            </div>
                          </div>
                          {(mode === 'create' || mode === 'edit') && formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                            >
                              <TrashIcon className="w-4 h-4" />
                              蜑企勁
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 遞主玄蛻・・蜷郁ｨ・*/}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">遞主玄蛻・・蜷郁ｨ・/h3>
                    <div className="flex gap-6">
                      <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          遞守紫(%)
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
                            <span className="text-gray-600">蟆剰ｨ・</span>
                            <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">豸郁ｲｻ遞・{formData.taxRate}%):</span>
                            <span className="font-medium">{formatCurrency(calculateTaxAmount())}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-blue-600 border-t border-gray-200 pt-3">
                            <span>蜷郁ｨ・</span>
                            <span>{formatCurrency(calculateTotalAmount())}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 謇ｿ隱阪・蟾ｮ謌ｻ繧ｳ繝｡繝ｳ繝・*/}
                  {(mode === 'approve' || mode === 'reject') && (
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">
                        {mode === 'approve' ? '謇ｿ隱阪さ繝｡繝ｳ繝・ : '蟾ｮ謌ｻ逅・罰'}
                      </h3>
                      <textarea
                        rows={4}
                        value={mode === 'approve' ? approveComment : rejectComment}
                        onChange={(e) => mode === 'approve' ? setApproveComment(e.target.value) : setRejectComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={mode === 'approve' ? '謇ｿ隱阪さ繝｡繝ｳ繝医ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞・井ｻｻ諢擾ｼ・ : '蟾ｮ謌ｻ逅・罰繧貞・蜉帙＠縺ｦ縺上□縺輔＞'}
                        required={mode === 'reject'}
                      />
                    </div>
                  )}
                </div>
              )}

                            {/* 繝｡繝ｼ繝ｫ蜀・ｮｹ繧ｿ繝・*/}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  {/* 繝｡繝ｼ繝ｫ蜀・ｮｹ */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">繝｡繝ｼ繝ｫ蜀・ｮｹ</h3>
                    
                    <div className="space-y-4">
                      {/* 螳帛・ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          螳帛・ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={emailContent.to}
                          onChange={(e) => setEmailContent(prev => ({ ...prev, to: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧貞・蜉・
                          readOnly={mode === 'view'}
                        />
                      </div>
                      
                      {/* CC 縺ｨ BCC 繧呈ｨｪ荳ｦ縺ｳ縺ｧ驟咲ｽｮ */}
                      <div className="flex gap-4">
                        {/* CC */}
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CC
                          </label>
                          <input
                            type="email"
                            value={emailContent.cc}
                            onChange={(e) => setEmailContent(prev => ({ ...prev, cc: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="CC繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ"
                            readOnly={mode === 'view'}
                          />
                        </div>
                        
                        {/* BCC */}
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            BCC
                          </label>
                          <input
                            type="email"
                            value={emailContent.bcc}
                            onChange={(e) => setEmailContent(prev => ({ ...prev, bcc: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="BCC繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ"
                            readOnly={mode === 'view'}
                          />
                        </div>
                      </div>
                      
                      {/* 莉ｶ蜷・*/}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          莉ｶ蜷・<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={emailContent.subject}
                          onChange={(e) => setEmailContent(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="繝｡繝ｼ繝ｫ莉ｶ蜷阪ｒ蜈･蜉・
                          readOnly={mode === 'view'}
                        />
                      </div>
                      
                      {/* 繝｡繝ｼ繝ｫ譛ｬ譁・*/}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          譛ｬ譁・<span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={6}
                          required
                          value={emailContent.body}
                          onChange={(e) => setEmailContent(prev => ({ ...prev, body: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="繝｡繝ｼ繝ｫ譛ｬ譁・ｒ蜈･蜉・
                          readOnly={mode === 'view'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  繧ｭ繝｣繝ｳ繧ｻ繝ｫ
                </button>
                {getActionButton()}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 譛邨ら｢ｺ隱阪Δ繝ｼ繝繝ｫ */}
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
                {/* 遒ｺ隱阪Γ繝・そ繝ｼ繧ｸ */}
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">邨檎炊逕ｳ隲九・遒ｺ隱・/h3>
                    <p className="text-gray-600">
                      縺薙・蜀・ｮｹ縺ｧ邨檎炊諡・ｽ楢・∈逕ｳ隲九＠縺ｦ繧ゅｈ繧阪＠縺・〒縺吶°・・
                    </p>
                  </div>
                </div>

                {/* 逕ｳ隲玖・さ繝｡繝ｳ繝・*/}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">逕ｳ隲玖・さ繝｡繝ｳ繝・/h3>
                  <textarea
                    value={applicantComment}
                    onChange={(e) => setApplicantComment(e.target.value)}
                    placeholder="逕ｳ隲九↓髢｢縺吶ｋ繧ｳ繝｡繝ｳ繝医′縺ゅｌ縺ｰ蜈･蜉帙＠縺ｦ縺上□縺輔＞・井ｻｻ諢擾ｼ・
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowFinalConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    繧ｭ繝｣繝ｳ繧ｻ繝ｫ
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
                    邨檎炊逕ｳ隲・
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
