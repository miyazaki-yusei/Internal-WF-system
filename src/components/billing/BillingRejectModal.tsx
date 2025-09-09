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

  // EmailTemplateContext繧剃ｽｿ逕ｨ
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
      name: '逕ｰ荳ｭ螟ｪ驛・,
      email: 'tanaka@festal.co.jp',
      department: '蝟ｶ讌ｭ驛ｨ'
    };
  };

  const generateEmailContent = () => {
    const currentUser = getCurrentUser();
    const totalAmount = calculateTotalAmount();
    
    return {
      subject: `縲・{billingData?.clientName}縲題ｫ区ｱよ嶌縺ｮ莉ｶ`,
      body: `${billingData?.clientName} 諡・ｽ楢・ｧ・

蟷ｳ邏繧医ｊ譬ｼ蛻･縺ｮ縺秘ｫ倬・繧定ｳ懊ｊ縲∝字縺丞ｾ｡遉ｼ逕ｳ縺嶺ｸ翫￡縺ｾ縺吶・

縺薙・蠎ｦ縲・{billingData?.projectName}縺ｫ髢｢縺吶ｋ隲区ｱよ嶌繧堤匱陦後＞縺溘＠縺ｾ縺励◆縺ｮ縺ｧ縲√＃騾｣邨｡逕ｳ縺嶺ｸ翫￡縺ｾ縺吶・

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
          .replace('{items}', formData.items.map(item => `繝ｻ${item.summary}: ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n'))
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
              <h2 className="text-xl font-semibold text-gray-900">隲区ｱよ嶌菫ｮ豁｣</h2>
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

          {/* 繧ｿ繝悶リ繝薙ご繝ｼ繧ｷ繝ｧ繝ｳ */}
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
                隲区ｱょ・螳ｹ
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
                繝｡繝ｼ繝ｫ蜀・ｮｹ
              </button>
            </div>
          </div>

          <div className="px-6 pb-4">
            {/* 隲区ｱょ・螳ｹ繧ｿ繝・*/}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                {/* 譯井ｻｶ諠・ｱ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">譯井ｻｶ諠・ｱ</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        譯井ｻｶ蜷・
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
                        繧ｯ繝ｩ繧､繧｢繝ｳ繝亥錐
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
                        諡・ｽ楢・
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

                {/* 隲区ｱよ嶌隧ｳ邏ｰ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">隲区ｱよ嶌隧ｳ邏ｰ</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        隲区ｱよ嶌逡ｪ蜿ｷ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.billingNumber}
                        onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="隲区ｱよ嶌逡ｪ蜿ｷ"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        隲区ｱよ律 <span className="text-red-500">*</span>
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
                        謾ｯ謇墓悄髯・
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

                {/* 隲区ｱる・岼繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">隲区ｱる・岼</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      鬆・岼霑ｽ蜉
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
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
                            />
                          </div>
                          <div className="w-36">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              蜊倅ｾ｡
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
                              謨ｰ驥・
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
                            />
                          </div>
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            蜑企勁
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 遞主玄蛻・・蜷郁ｨ医そ繧ｯ繧ｷ繝ｧ繝ｳ */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">遞主玄蛻・・蜷郁ｨ・/h3>
                  
                  <div className="flex gap-6">
                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        遞守紫(%)
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

                {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    繧ｭ繝｣繝ｳ繧ｻ繝ｫ
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFinalConfirm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    遒ｺ螳・
                  </button>
                </div>
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
                        value={formData.emailContent.to}
                        onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, to: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧貞・蜉・
                      />
                    </div>
                    
                    {/* CC 縺ｨ BCC 繧呈ｨｪ荳ｦ縺ｳ縺ｧ驟咲ｽｮ */}
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
                          placeholder="CC繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ"
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
                          placeholder="BCC繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ"
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
                        value={formData.emailContent.subject}
                        onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="繝｡繝ｼ繝ｫ莉ｶ蜷阪ｒ蜈･蜉・
                      />
                    </div>
                    
                    {/* 繝｡繝ｼ繝ｫ譛ｬ譁・*/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        譛ｬ譁・<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.emailContent.body}
                        onChange={(e) => handleInputChange('emailContent', { ...formData.emailContent, body: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={6}
                        placeholder="繝｡繝ｼ繝ｫ譛ｬ譁・ｒ蜈･蜉・
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝懊ち繝ｳ */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('billing')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    謌ｻ繧・
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFinalConfirm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    遒ｺ螳・
                  </button>
                </div>
              </div>
            )}
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
                    onClick={handleSave}
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
  );
} 
