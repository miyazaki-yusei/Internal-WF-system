'use client'

import { useState } from 'react'
import Link from 'next/link'
import React from 'react' // Reactを追加

interface TeamMember {
  id: string;
  role: 'leader' | 'member' | 'outsource';
  name: string;
}

export default function NewFarmProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    revenue: '',
    expenses: '',
    laborCost: '0',
    outsourcingCost: '',
    budgetRatio: '3.0'
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', role: 'leader', name: '' }
  ])

  // 顧客リスト（サンプルデータ）
  const customers = [
    'A社',
    'B社',
    'C社',
    'D社',
    'E社'
  ]

  // 社内メンバーリスト（サンプルデータ）
  const internalMembers = [
    '田中太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '渡辺健太',
    '伊藤恵子',
    '山田次郎',
    '中村由美'
  ]

  // メンバーごとの労務費設定（月額）
  const memberLaborCosts: { [key: string]: number } = {
    '田中太郎': 800000,
    '佐藤花子': 750000,
    '鈴木一郎': 900000,
    '高橋美咲': 700000,
    '渡辺健太': 850000,
    '伊藤恵子': 720000,
    '山田次郎': 780000,
    '中村由美': 680000
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 数値入力フィールドのフォーマット（カンマ区切り）
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    if (numericValue) {
      return new Intl.NumberFormat('ja-JP').format(parseInt(numericValue))
    }
    return ''
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const formattedValue = formatNumber(value)
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  // 労務費の自動計算
  const calculateLaborCost = () => {
    let totalLaborCost = 0
    teamMembers.forEach(member => {
      if (member.role !== 'outsource' && member.name && memberLaborCosts[member.name]) {
        totalLaborCost += memberLaborCosts[member.name]
      }
    })
    return totalLaborCost
  }

  // 支出の自動計算（労務費 + 外注費）
  const calculateTotalExpenses = () => {
    const laborCost = calculateLaborCost()
    const outsourcingCost = formData.outsourcingCost ? parseInt(formData.outsourcingCost.replace(/[^\d]/g, '')) : 0
    return laborCost + outsourcingCost
  }

  // チームメンバーの追加
  const addTeamMember = () => {
    const newId = (teamMembers.length + 1).toString()
    setTeamMembers(prev => [
      ...prev,
      { id: newId, role: 'member', name: '' }
    ])
  }

  // チームメンバーの削除
  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(prev => prev.filter(member => member.id !== id))
    }
  }

  // チームメンバーの更新
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => prev.map(member => {
      if (member.id === id) {
        const updatedMember = { ...member, [field]: value }
        // 役職が外注メンバーに変更された場合、名前をクリア
        if (field === 'role' && value === 'outsource') {
          updatedMember.name = ''
        }
        return updatedMember
      }
      return member
    }))
  }

  // 労務費と支出の自動更新
  React.useEffect(() => {
    const laborCost = calculateLaborCost()
    const totalExpenses = calculateTotalExpenses()
    
    setFormData(prev => ({
      ...prev,
      laborCost: new Intl.NumberFormat('ja-JP').format(laborCost),
      expenses: new Intl.NumberFormat('ja-JP').format(totalExpenses)
    }))
  }, [teamMembers, formData.outsourcingCost])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここでフォームデータを送信する処理を実装
    const submitData = {
      ...formData,
      teamMembers
    }
    console.log('ファーム案件登録:', submitData)
    // 登録完了後、案件一覧ページに戻る
    window.location.href = '/projects'
  }

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      leader: 'リーダー',
      member: 'メンバー',
      outsource: '外注メンバー'
    }
    return roleLabels[role as keyof typeof roleLabels] || role
  }

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← 案件一覧に戻る
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">ファーム案件 新規登録</h1>
        <p className="text-gray-600 mt-1">農場・農業関連の案件を登録します</p>
      </div>

      {/* フォーム */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">案件情報</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                案件名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: ○○業務支援システム開発"
              />
            </div>
            
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                顧客名 <span className="text-red-500">*</span>
              </label>
              <select
                id="customer"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">顧客を選択してください</option>
                {customers.map((customer) => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
          </div>

          {/* チームメンバー */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">担当者</h3>
            </div>
            
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      役職 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={member.role}
                      onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="leader">リーダー</option>
                      <option value="member">メンバー</option>
                      <option value="outsource">外注メンバー</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名前 <span className="text-red-500">*</span>
                    </label>
                    {member.role === 'outsource' ? (
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="例: 外注先 太郎"
                      />
                    ) : (
                      <select
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">メンバーを選択してください</option>
                        {internalMembers.map((memberName) => (
                          <option key={memberName} value={memberName}>{memberName}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member.id)}
                      className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* 追加ボタンを中央下に配置 */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={addTeamMember}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                メンバーを追加
              </button>
            </div>
          </div>

          {/* 財務情報 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">財務情報</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
                  売上 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="text"
                    id="revenue"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleNumberInputChange}
                    required
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 5,000,000"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="budgetRatio" className="block text-sm font-medium text-gray-700 mb-2">
                  予算比率 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="budgetRatio"
                    name="budgetRatio"
                    value={formData.budgetRatio}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="3.0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">利益に対する予算比率を入力してください</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label htmlFor="laborCost" className="block text-sm font-medium text-gray-700 mb-2">
                  労務費
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="text"
                    id="laborCost"
                    name="laborCost"
                    value={formData.laborCost}
                    readOnly
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">メンバーの設定から自動計算されます</p>
              </div>
              
              <div>
                <label htmlFor="outsourcingCost" className="block text-sm font-medium text-gray-700 mb-2">
                  外注費
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="text"
                    id="outsourcingCost"
                    name="outsourcingCost"
                    value={formData.outsourcingCost}
                    onChange={handleNumberInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 500,000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">外注メンバーへの費用を入力してください</p>
              </div>
              
              <div>
                <label htmlFor="expenses" className="block text-sm font-medium text-gray-700 mb-2">
                  支出（合計）
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="text"
                    id="expenses"
                    name="expenses"
                    value={formData.expenses}
                    readOnly
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">労務費 + 外注費の合計</p>
              </div>
            </div>
          </div>
          
          {/* ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/projects"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              登録する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 