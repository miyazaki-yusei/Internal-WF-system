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
    
    // 驥鷹｡阪ｒ閾ｪ蜍戊ｨ育ｮ・
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
        {/* 繝倥ャ繝繝ｼ */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">譁ｰ隕剰ｫ区ｱよ嶌菴懈・</h2>
            <p className="text-gray-600 mt-1">譁ｰ縺励＞隲区ｱよ嶌縺ｮ諠・ｱ繧貞・蜉帙＠縺ｦ縺上□縺輔＞</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              {showPreview ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {showPreview ? '繝励Ξ繝薙Η繝ｼ髱櫁｡ｨ遉ｺ' : '繝励Ξ繝薙Η繝ｼ陦ｨ遉ｺ'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 繝｡繧､繝ｳ繧ｳ繝ｳ繝・Φ繝・*/}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 繝輔か繝ｼ繝 */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 蝓ｺ譛ｬ諠・ｱ */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">蝓ｺ譛ｬ諠・ｱ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        鬘ｧ螳｢蜷・<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="鬘ｧ螳｢蜷阪ｒ蜈･蜉・
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        譯井ｻｶ蜷・<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.project}
                        onChange={(e) => handleInputChange('project', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="譯井ｻｶ蜷阪ｒ蜈･蜉・
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        逋ｺ陦梧律 <span className="text-red-500">*</span>
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
                        謾ｯ謇墓悄譌･ <span className="text-red-500">*</span>
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

                {/* 鬘ｧ螳｢諠・ｱ */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">鬘ｧ螳｢諠・ｱ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        鬘ｧ螳｢菴乗園
                      </label>
                      <textarea
                        rows={3}
                        value={formData.clientAddress}
                        onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="鬘ｧ螳｢縺ｮ菴乗園繧貞・蜉・
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          髮ｻ隧ｱ逡ｪ蜿ｷ
                        </label>
                        <input
                          type="tel"
                          value={formData.clientPhone}
                          onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="髮ｻ隧ｱ逡ｪ蜿ｷ繧貞・蜉・
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ
                        </label>
                        <input
                          type="email"
                          value={formData.clientEmail}
                          onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧貞・蜉・
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 隲区ｱる・岼 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">隲区ｱる・岼</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                    >
                      <PlusIcon className="w-4 h-4" />
                      鬆・岼霑ｽ蜉
                    </button>
                  </div>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex gap-4">
                          <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              鬆・岼蜷・<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="鬆・岼蜷阪ｒ蜈･蜉・
                            />
                          </div>
                          <div className="w-16">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              謨ｰ驥・
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="w-36">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              蜊倅ｾ｡・亥・・・
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              驥鷹｡・
                            </label>
                            <input
                              type="text"
                              value={`ﾂ･${item.amount.toLocaleString()}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="text-sm text-gray-600">驥鷹｡・ </span>
                            <span className="font-medium">ﾂ･{item.amount.toLocaleString()}</span>
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

                {/* 驥鷹｡崎ｨ育ｮ・*/}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">驥鷹｡崎ｨ育ｮ・/h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">蟆剰ｨ・</span>
                        <span className="font-medium">ﾂ･{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">豸郁ｲｻ遞趣ｼ・formData.taxRate * 100}%・・</span>
                        <span className="font-medium">ﾂ･{taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-blue-600 border-t border-gray-200 pt-3">
                        <span>蜷郁ｨ・</span>
                        <span>ﾂ･{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 蛯呵・*/}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">蛯呵・/h3>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="蛯呵・′縺ゅｌ縺ｰ蜈･蜉帙＠縺ｦ縺上□縺輔＞"
                  />
                </div>

                {/* 騾∽ｿ｡繝懊ち繝ｳ */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    繧ｭ繝｣繝ｳ繧ｻ繝ｫ
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    隲区ｱよ嶌繧剃ｽ懈・
                  </button>
                </div>
              </form>
            </div>

            {/* 繝励Ξ繝薙Η繝ｼ */}
            {showPreview && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">繝励Ξ繝薙Η繝ｼ</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.client || '鬘ｧ螳｢蜷・}</h4>
                    <p className="text-sm text-gray-600">{formData.project || '譯井ｻｶ蜷・}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">逋ｺ陦梧律: </span>
                      <span className="font-medium">{formData.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">謾ｯ謇墓悄譌･: </span>
                      <span className="font-medium">{formData.dueDate}</span>
                    </div>
                  </div>
                  {items.some(item => item.description) && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">隲区ｱる・岼</h5>
                      <div className="space-y-2">
                        {items.filter(item => item.description).map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{item.description}</span>
                            <span className="text-gray-600 ml-2">
                              {item.quantity} ﾃ・ﾂ･{item.unitPrice.toLocaleString()} = ﾂ･{item.amount.toLocaleString()}
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
                          <span>蟆剰ｨ・/span>
                          <span>ﾂ･{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>豸郁ｲｻ遞・/span>
                          <span>ﾂ･{taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-gray-200 pt-1">
                          <span>蜷郁ｨ・/span>
                          <span className="text-blue-600">ﾂ･{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {formData.notes && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">蛯呵・/h5>
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
