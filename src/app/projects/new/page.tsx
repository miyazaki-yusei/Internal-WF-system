'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    type: 'farm',
    status: 'planning',
    startDate: '',
    endDate: '',
    revenue: '',
    cost: '',
    description: '',
    members: [{ id: 1, name: '', role: '' }]
  })
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      members: newMembers
    }))
  }

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { id: Date.now(), name: '', role: '' }]
    }))
  }

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        members: newMembers
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここでAPIに送信
    console.log('Form submitted:', formData)
    router.push('/projects')
  }

  const profit = Number(formData.revenue) - Number(formData.cost)
  const profitRate = Number(formData.revenue) > 0 ? (profit / Number(formData.revenue)) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">新規案件作成</h1>
              <p className="text-gray-600 mt-1">新しい案件の情報を入力してください</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
            >
              {showPreview ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {showPreview ? 'プレビュー非表示' : 'プレビュー表示'}
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* フォーム */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">案件情報</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* 基本情報 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        案件名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="案件名を入力"
                      />
                    </div>
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
                        案件種別 <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="farm">ファーム案件</option>
                        <option value="prime">プライム案件</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ステータス <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="planning">計画中</option>
                        <option value="active">進行中</option>
                        <option value="completed">完了</option>
                        <option value="cancelled">中止</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        開始日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        終了日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 収益情報 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">収益情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        売上（円）
                      </label>
                      <input
                        type="number"
                        value={formData.revenue}
                        onChange={(e) => handleInputChange('revenue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        原価（円）
                      </label>
                      <input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => handleInputChange('cost', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  {(Number(formData.revenue) > 0 || Number(formData.cost) > 0) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">売上: </span>
                          <span className="font-medium">¥{Number(formData.revenue).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">原価: </span>
                          <span className="font-medium">¥{Number(formData.cost).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">利益: </span>
                          <span className="font-medium text-green-600">¥{profit.toLocaleString()}</span>
                          <span className="text-gray-600 ml-2">({profitRate.toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 案件概要 */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">案件概要</h3>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="案件の概要を入力してください"
                  />
                </div>

                {/* メンバー */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">メンバー</h3>
                    <button
                      type="button"
                      onClick={addMember}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      メンバー追加
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.members.map((member, index) => (
                      <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            placeholder="メンバー名"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          />
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                            placeholder="役割"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {formData.members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 送信ボタン */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    案件を作成
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* プレビュー */}
          {showPreview && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">プレビュー</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{formData.name || '案件名'}</h4>
                  <p className="text-sm text-gray-600">{formData.client || '顧客名'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">種別: </span>
                    <span className="font-medium">
                      {formData.type === 'farm' ? 'ファーム案件' : 'プライム案件'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">期間: </span>
                    <span className="font-medium">
                      {formData.startDate} 〜 {formData.endDate}
                    </span>
                  </div>
                </div>
                {Number(formData.revenue) > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>売上</span>
                        <span>¥{Number(formData.revenue).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>原価</span>
                        <span>¥{Number(formData.cost).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>利益</span>
                        <span className="text-green-600">¥{profit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
                {formData.description && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">概要</h5>
                    <p className="text-sm text-gray-600">{formData.description}</p>
                  </div>
                )}
                {formData.members.some(m => m.name) && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">メンバー</h5>
                    <div className="space-y-2">
                      {formData.members.filter(m => m.name).map((member, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{member.name}</span>
                          {member.role && <span className="text-gray-600 ml-2">({member.role})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 