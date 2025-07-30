'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUser } from '@/contexts/UserContext'

interface User {
  id: string
  name: string
  furigana: string
  email: string
  password: string
  department: 'sales' | 'consulting' | 'regional' | 'accounting'
  role: 'user' | 'admin'
  status: 'active' | 'inactive'
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  onSave: (user: User) => void
}

const departments = [
  { value: 'sales', label: '営業部' },
  { value: 'consulting', label: 'コンサルティング事業部' },
  { value: 'regional', label: '地方創生事業部' },
  { value: 'accounting', label: '経理部' }
]

const roles = [
  { value: 'user', label: '一般' },
  { value: 'admin', label: '管理者' }
]

const statuses = [
  { value: 'active', label: '有効' },
  { value: 'inactive', label: '無効' }
]

export default function UserModal({ isOpen, onClose, user, onSave }: UserModalProps) {
  const { isAdmin } = useUser()
  
  const [formData, setFormData] = useState({
    name: '',
    furigana: '',
    email: '',
    password: '',
    department: 'sales' as const,
    role: 'user' as const,
    status: 'active' as const
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 編集時は既存データを設定
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        furigana: user.furigana,
        email: user.email,
        password: '', // パスワードは表示しない
        department: user.department,
        role: user.role,
        status: user.status
      })
    } else {
      // 新規作成時は空のフォーム
      setFormData({
        name: '',
        furigana: '',
        email: '',
        password: '',
        department: 'sales',
        role: 'user',
        status: 'active'
      })
    }
    setErrors({})
  }, [user, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です'
    }

    if (!formData.furigana.trim()) {
      newErrors.furigana = 'ふりがなは必須です'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = 'パスワードは必須です'
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const userData: User = {
      id: user?.id || Date.now().toString(),
      name: formData.name.trim(),
      furigana: formData.furigana.trim(),
      email: formData.email.trim(),
      password: formData.password,
      department: formData.department,
      role: formData.role,
      status: formData.status
    }

    onSave(userData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {user ? 'ユーザー編集' : '新規ユーザー登録'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 氏名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              氏名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="田中太郎"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* ふりがな */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ふりがな <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.furigana}
              onChange={(e) => handleInputChange('furigana', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.furigana ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="たなかたろう"
            />
            {errors.furigana && (
              <p className="text-red-500 text-xs mt-1">{errors.furigana}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="tanaka@festal.co.jp"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード {!user && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={user ? '変更する場合のみ入力' : '8文字以上で入力'}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {user && (
              <p className="text-gray-500 text-xs mt-1">
                パスワードを変更しない場合は空欄のままにしてください
              </p>
            )}
          </div>

          {/* 部署 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              部署 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* 権限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              権限 <span className="text-red-500">*</span>
              {!isAdmin && (
                <span className="text-orange-600 text-xs ml-2">（管理者のみ変更可能）</span>
              )}
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              disabled={!isAdmin}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {!isAdmin && (
              <p className="text-gray-500 text-xs mt-1">
                権限の変更は管理者のみ可能です
              </p>
            )}
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス <span className="text-red-500">*</span>
              {!isAdmin && (
                <span className="text-orange-600 text-xs ml-2">（管理者のみ変更可能）</span>
              )}
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={!isAdmin}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {!isAdmin && (
              <p className="text-gray-500 text-xs mt-1">
                ステータスの変更は管理者のみ可能です
              </p>
            )}
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {user ? '更新' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 