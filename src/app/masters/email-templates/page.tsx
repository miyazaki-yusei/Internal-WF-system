'use client'

import { useState } from 'react'
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useEmailTemplates } from '@/contexts/EmailTemplateContext'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'farm' | 'prime' | 'general'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EmailTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)

  // EmailTemplateContextを使用
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useEmailTemplates()

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      farm: { text: 'ファーム', color: 'bg-green-100 text-green-800' },
      prime: { text: 'プライム', color: 'bg-blue-100 text-blue-800' },
      general: { text: '一般', color: 'bg-gray-100 text-gray-800' }
    }
    const config = typeConfig[type as keyof typeof typeConfig]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? '有効' : '無効'}
      </span>
    )
  }

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setShowModal(true)
  }

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template)
  }

  const handleDelete = (id: string) => {
    if (confirm('このテンプレートを削除しますか？')) {
      deleteTemplate(id)
    }
  }

  const handleSave = (template: EmailTemplate) => {
    if (editingTemplate) {
      // 編集
      updateTemplate({
        ...template,
        updatedAt: new Date().toISOString().split('T')[0]
      })
    } else {
      // 新規作成
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      addTemplate(newTemplate)
    }
    setShowModal(false)
    setEditingTemplate(null)
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || template.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">メールテンプレートマスタ</h1>
        <p className="text-gray-600 mt-1">メールテンプレートの登録、編集、管理を行います</p>
      </div>

      {/* 検索・操作 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="テンプレート名、件名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全ての種別</option>
              <option value="farm">ファーム</option>
              <option value="prime">プライム</option>
              <option value="general">一般</option>
            </select>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              新規登録
            </button>
          </div>
        </div>
      </div>

      {/* テンプレート一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  テンプレート名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(template.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{template.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(template.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{template.updatedAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="text-blue-600 hover:text-blue-900"
                        title="プレビュー"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="編集"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-900"
                        title="削除"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 編集・新規作成モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTemplate ? 'テンプレート編集' : '新規テンプレート作成'}
              </h3>
              
              <EmailTemplateForm
                template={editingTemplate}
                onSave={handleSave}
                onCancel={() => {
                  setShowModal(false)
                  setEditingTemplate(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* プレビューモーダル */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">テンプレートプレビュー</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">テンプレート名</label>
                  <div className="text-sm text-gray-900">{previewTemplate.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">種別</label>
                  <div>{getTypeBadge(previewTemplate.type)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                  <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{previewTemplate.subject}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                  <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {previewTemplate.body}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// テンプレート編集フォームコンポーネント
interface EmailTemplateFormProps {
  template?: EmailTemplate | null
  onSave: (template: EmailTemplate) => void
  onCancel: () => void
}

function EmailTemplateForm({ template, onSave, onCancel }: EmailTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    body: template?.body || '',
    type: template?.type || 'general',
    isActive: template?.isActive ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: template?.id || '',
      ...formData,
      createdAt: template?.createdAt || '',
      updatedAt: template?.updatedAt || ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          テンプレート名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          種別 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'farm' | 'prime' | 'general' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="farm">ファーム</option>
          <option value="prime">プライム</option>
          <option value="general">一般</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          使用可能な変数: {{clientName}}, {{billingContent}}, {{amount}}, {{additionalMessage}}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          本文 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          使用可能な変数: {{clientName}}, {{billingContent}}, {{amount}}, {{additionalMessage}}
        </p>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">有効にする</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {template ? '更新' : '作成'}
        </button>
      </div>
    </form>
  )
} 