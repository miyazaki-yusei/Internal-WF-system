'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import React from 'react'
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface TeamMember {
  id: string;
  role: 'leader' | 'member' | 'outsource';
  name: string;
  utilizationRate: string;
  unitPrice: string; // 単価を追加
  incentive: string; // インセンティブを追加
}

interface Payment {
  id: string;
  recipient: string;
  item: string;
  amount: string;
}

interface BudgetRatio {
  salesBudget: string; // 営業予算
  miscellaneousBudget: string; // 雑費予算
  incentiveBudget: string; // インセンティブ予算
}

export default function NewPrimeProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    startDate: '',
    deliveryDate: '',
    revenueMonth: '',
    revenue: '',
    expenses: '',
    laborCost: '0',
    memo: '',
  })

  const [budgetRatio, setBudgetRatio] = useState<BudgetRatio>({
    salesBudget: '20',
    miscellaneousBudget: '4',
    incentiveBudget: '1.8'
  })

  const [budgetAmounts, setBudgetAmounts] = useState({
    salesBudgetAmount: '',
    miscellaneousBudgetAmount: '',
    incentiveBudgetAmount: ''
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { 
      id: '1', 
      role: 'leader', 
      name: '', 
      utilizationRate: '100',
      unitPrice: '',
      incentive: ''
    }
  ])

  const [payments, setPayments] = useState<Payment[]>([
    { id: '1', recipient: '', item: '', amount: '' }
  ])

  // 確認モーダルの状態
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // 編集モードの状態
  const [isEditMode, setIsEditMode] = useState(false)
  const [editProjectId, setEditProjectId] = useState<string>('')
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false)

  // 編集データを読み込む
  useEffect(() => {
    const editData = localStorage.getItem('editProjectData')
    if (editData) {
      try {
        const parsedData = JSON.parse(editData)
        if (parsedData.type === 'prime') {
          setIsEditMode(true)
          setEditProjectId(parsedData.id)
          setFormData(parsedData.formData)
          setBudgetRatio(parsedData.budgetRatio)
          setBudgetAmounts(parsedData.budgetAmounts)
          setTeamMembers(parsedData.teamMembers)
          setPayments(parsedData.payments)
          // 編集データを削除
          localStorage.removeItem('editProjectData')
        }
      } catch (error) {
        console.error('編集データの読み込みに失敗しました:', error)
      }
    }
    setHasCheckedLocalStorage(true)
  }, [])

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

  // 支払い項目リスト
  const paymentItems = [
    '人件費',
    '外注費',
    '営業支援費',
    'システム利用料',
    '交通費',
    'その他'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBudgetRatioChange = (field: keyof BudgetRatio, value: string) => {
    // 全角→半角変換を適用
    const normalizedValue = normalizeNumber(value)
    
    setBudgetRatio(prev => ({
      ...prev,
      [field]: normalizedValue
    }))
    
    // 比率が変更されたら金額を更新
    const amount = calculateBudgetAmount(normalizedValue)
    const amountField = `${field}Amount` as keyof typeof budgetAmounts
    setBudgetAmounts(prev => ({
      ...prev,
      [amountField]: formatNumber(amount.toString())
    }))
  }

  const handleBudgetAmountChange = (field: keyof typeof budgetAmounts, value: string) => {
    // 全角→半角変換を適用
    const normalizedValue = normalizeNumber(value)
    
    // 数値のみを抽出
    const numericValue = normalizedValue.replace(/[^\d]/g, '')
    
    // 値を設定
    setBudgetAmounts(prev => ({
      ...prev,
      [field]: normalizedValue
    }))
    
    // 金額が変更されたら比率を更新
    if (numericValue) {
      const ratio = calculateBudgetRatio(numericValue)
      const ratioField = field.replace('Amount', '') as keyof BudgetRatio
      console.log('予算金額変更:', { field, value: normalizedValue, numericValue, ratio, ratioField })
      setBudgetRatio(prev => ({
        ...prev,
        [ratioField]: ratio
      }))
    }
  }

  // 数値入力フィールドのフォーマット（カンマ区切り）
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    if (numericValue) {
      return new Intl.NumberFormat('ja-JP').format(parseInt(numericValue))
    }
    return ''
  }

  // 全角数字を半角数字に変換する関数
  const normalizeNumber = (value: string) => {
    // 全角数字を半角数字に変換
    let normalized = value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    // 全角スペースを半角スペースに変換
    normalized = normalized.replace(/　/g, ' ')
    // 全角カンマを半角カンマに変換
    normalized = normalized.replace(/，/g, ',')
    // 全角ピリオドを半角ピリオドに変換
    normalized = normalized.replace(/．/g, '.')
    
    // デバッグ用ログ（変換が行われた場合のみ）
    if (normalized !== value) {
      console.log('全角→半角変換:', { original: value, normalized })
    }
    
    return normalized
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const formattedValue = formatNumber(value)
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  // 売上の自動計算（メンバーの単価合計）
  const calculateRevenue = () => {
    let totalRevenue = 0
    teamMembers.forEach(member => {
      if (member.unitPrice) {
        const unitPrice = parseInt(member.unitPrice.replace(/[^\d]/g, ''))
        const utilizationRate = parseFloat(member.utilizationRate) / 100
        totalRevenue += unitPrice * utilizationRate
      }
    })
    console.log('売上計算:', { teamMembers, totalRevenue })
    return totalRevenue
  }

  // 労務費の自動計算
  const calculateLaborCost = () => {
    let totalLaborCost = 0
    teamMembers.forEach(member => {
      if (member.role !== 'outsource' && member.name) {
        // 単価から労務費を計算
        if (member.unitPrice) {
          const unitPrice = parseInt(member.unitPrice.replace(/[^\d]/g, ''))
          const utilizationRate = parseFloat(member.utilizationRate) / 100
          totalLaborCost += unitPrice * utilizationRate
        }
      }
    })
    return totalLaborCost
  }

  // 支出の自動計算（労務費 + 支出項目）
  const calculateTotalExpenses = () => {
    const laborCost = calculateLaborCost()
    const paymentAmounts = payments.reduce((total, payment) => {
      return total + (payment.amount ? parseInt(payment.amount.replace(/[^\d]/g, '')) : 0)
    }, 0)
    return laborCost + paymentAmounts
  }

  // 粗利の計算
  const calculateGrossProfit = () => {
    const revenue = calculateRevenue()
    const totalExpenses = calculateTotalExpenses()
    return revenue - totalExpenses
  }

  // 予算比率から金額を計算（粗利ベース）
  const calculateBudgetAmount = (ratio: string) => {
    const grossProfit = calculateGrossProfit()
    const ratioValue = parseFloat(ratio) / 100
    return grossProfit * ratioValue
  }

  // 金額から予算比率を計算（粗利ベース）
  const calculateBudgetRatio = (amount: string) => {
    const grossProfit = calculateGrossProfit()
    if (grossProfit === 0) return '0'
    const amountValue = parseInt(amount || '0')
    const ratio = (amountValue / grossProfit) * 100
    console.log('比率計算:', { amount, grossProfit, amountValue, ratio })
    return ratio.toFixed(1)
  }

  // チームメンバーの追加
  const addTeamMember = () => {
    const newId = (teamMembers.length + 1).toString()
    setTeamMembers(prev => [
      ...prev,
      { 
        id: newId, 
        role: 'member', 
        name: '', 
        utilizationRate: '100',
        unitPrice: '',
        incentive: ''
      }
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
    // 数値フィールドの場合は全角→半角変換を適用
    let normalizedValue = value
    if (field === 'utilizationRate' || field === 'unitPrice' || field === 'incentive') {
      normalizedValue = normalizeNumber(value)
    }
    
    setTeamMembers(prev => prev.map(member => {
      if (member.id === id) {
        const updatedMember = { ...member, [field]: normalizedValue }
        // 役職が外注メンバーに変更された場合、名前と稼働率をクリア
        if (field === 'role' && value === 'outsource') {
          updatedMember.name = ''
          updatedMember.utilizationRate = '100'
          updatedMember.unitPrice = ''
          updatedMember.incentive = ''
        }
        return updatedMember
      }
      return member
    }))
  }

  // 支払先の追加
  const addPayment = () => {
    const newId = (payments.length + 1).toString()
    setPayments(prev => [
      ...prev,
      { id: newId, recipient: '', item: '', amount: '' }
    ])
  }

  // 支払先の削除
  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(prev => prev.filter(payment => payment.id !== id))
    }
  }

  // 支払先の更新
  const updatePayment = (id: string, field: keyof Payment, value: string) => {
    // 金額フィールドの場合は全角→半角変換を適用
    let normalizedValue = value
    if (field === 'amount') {
      normalizedValue = normalizeNumber(value)
    }
    
    setPayments(prev => prev.map(payment => {
      if (payment.id === id) {
        return { ...payment, [field]: normalizedValue }
      }
      return payment
    }))
  }

  // 売上、労務費、支出の自動更新
  React.useEffect(() => {
    const revenue = calculateRevenue()
    const laborCost = calculateLaborCost()
    const totalExpenses = calculateTotalExpenses()
    
    setFormData(prev => ({
      ...prev,
      revenue: new Intl.NumberFormat('ja-JP').format(revenue),
      laborCost: new Intl.NumberFormat('ja-JP').format(laborCost),
      expenses: new Intl.NumberFormat('ja-JP').format(totalExpenses)
    }))

    // 予算金額も更新
    setBudgetAmounts(prev => ({
      salesBudgetAmount: formatNumber(calculateBudgetAmount(budgetRatio.salesBudget).toString()),
      miscellaneousBudgetAmount: formatNumber(calculateBudgetAmount(budgetRatio.miscellaneousBudget).toString()),
      incentiveBudgetAmount: formatNumber(calculateBudgetAmount(budgetRatio.incentiveBudget).toString())
    }))
  }, [teamMembers, payments, budgetRatio])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 確認モーダルを表示
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    // プロジェクトデータを作成
    const projectData = {
      id: editProjectId,
      type: 'prime' as const,
      formData: {
        ...formData,
        revenue: formatNumber(calculateRevenue().toString()),
        expenses: formatNumber(calculateTotalExpenses().toString()),
        laborCost: formatNumber(calculateLaborCost().toString())
      },
      budgetRatio,
      budgetAmounts,
      teamMembers,
      payments
    }
    
    if (isEditMode) {
      // 編集モードの場合は更新イベントを発火
      const event = new CustomEvent('projectUpdated', {
        detail: projectData
      });
      window.dispatchEvent(event);
    } else {
      // 新規登録の場合は登録イベントを発火
      const event = new CustomEvent('projectRegistered', {
        detail: projectData
      });
      window.dispatchEvent(event);
    }
    
    // 確認モーダルを閉じる
    setShowConfirmModal(false)
    
    // 登録完了後、案件一覧ページに戻る
    window.location.href = '/projects'
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
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
            className="text-purple-600 hover:text-purple-800 mr-4"
          >
            ← 案件一覧に戻る
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'プライム案件 編集' : 'プライム案件 新規登録'}
        </h1>
        <div className="w-16 h-1 bg-purple-500 mt-2 rounded"></div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="例: A社基幹システム開発"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">顧客を選択してください</option>
                {customers.map((customer) => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
                     </div>
 
           {/* スケジュール情報 */}
           <div className="border-t border-gray-200 pt-6">
             <div className="mb-4">
               <h3 className="text-lg font-medium text-gray-900">スケジュール情報</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                   開始年月 <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="month"
                   id="startDate"
                   name="startDate"
                   value={formData.startDate}
                   onChange={handleInputChange}
                   required
                   className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                 />
               </div>
               
               <div>
                 <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                   納品予定日 <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="date"
                   id="deliveryDate"
                   name="deliveryDate"
                   value={formData.deliveryDate}
                   onChange={handleInputChange}
                   required
                   className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                 />
               </div>
               
               <div>
                 <label htmlFor="revenueMonth" className="block text-sm font-medium text-gray-700 mb-2">
                   売上計上予定月 <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="month"
                   id="revenueMonth"
                   name="revenueMonth"
                   value={formData.revenueMonth}
                   onChange={handleInputChange}
                   required
                   className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                 />
               </div>
             </div>
           </div>
 
           {/* アサイン */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">アサイン</h3>
            </div>
            
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        役職 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="leader">リーダー</option>
                        <option value="member">メンバー</option>
                        <option value="outsource">外注メンバー</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        名前 <span className="text-red-500">*</span>
                      </label>
                      {member.role === 'outsource' ? (
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="例: 外注先 太郎"
                        />
                      ) : (
                        <select
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">メンバーを選択してください</option>
                          {internalMembers.map((memberName) => (
                            <option key={memberName} value={memberName}>{memberName}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        稼働率 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={member.utilizationRate}
                          onChange={(e) => {
                            const normalizedValue = normalizeNumber(e.target.value)
                            updateTeamMember(member.id, 'utilizationRate', normalizedValue)
                          }}
                          required
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="100"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        単価 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">¥</span>
                        <input
                          type="text"
                          value={member.unitPrice}
                                                     onChange={(e) => {
                             const normalizedValue = normalizeNumber(e.target.value)
                             updateTeamMember(member.id, 'unitPrice', normalizedValue)
                           }}
                          required
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="例: 100,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        インセンティブ
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={member.incentive}
                          onChange={(e) => {
                            const normalizedValue = normalizeNumber(e.target.value)
                            updateTeamMember(member.id, 'incentive', normalizedValue)
                          }}
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="例: 5.0"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                      </div>
                    </div>
                    
                    {teamMembers.length > 1 && (
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeTeamMember(member.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 追加ボタンを中央下に配置 */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={addTeamMember}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                メンバーを追加
              </button>
            </div>
          </div>

          {/* 財務情報 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">財務情報</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
                  売上（自動計算）
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="text"
                    id="revenue"
                    name="revenue"
                    value={formData.revenue}
                    readOnly
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">メンバーの単価合計から自動計算されます</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
              <div>
                <label htmlFor="laborCost" className="block text-sm font-medium text-gray-700 mb-2">
                  労務費（自動計算）
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
                <p className="text-xs text-gray-500 mt-1">メンバーの単価から自動計算されます</p>
              </div>
            </div>
          </div>

          {/* その他支出項目 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">その他支出項目</h3>
              <p className="text-sm text-gray-600">労務費以外の支出項目（外注費含む）を設定してください</p>
            </div>
           
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div key={payment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      支払先 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={payment.recipient}
                      onChange={(e) => updatePayment(payment.id, 'recipient', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="例: 田中太郎 または 株式会社○○"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      項目 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={payment.item}
                      onChange={(e) => updatePayment(payment.id, 'item', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">項目を選択してください</option>
                      {paymentItems.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      金額 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">¥</span>
                      <input
                        type="text"
                        value={payment.amount}
                                                  onChange={(e) => {
                            const normalizedValue = normalizeNumber(e.target.value)
                            updatePayment(payment.id, 'amount', normalizedValue)
                          }}
                        required
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="例: 500,000"
                      />
                    </div>
                  </div>
                  
                  {payments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePayment(payment.id)}
                      className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* 追加ボタンを中央下に配置 */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={addPayment}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                その他支出項目を追加
              </button>
            </div>
          </div>

          {/* 支出合計 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">支出合計</h3>
              <p className="text-sm text-gray-600">すべての支出項目の合計金額</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
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
                <p className="text-xs text-gray-500 mt-1">労務費 + その他支出項目の合計</p>
              </div>
            </div>
          </div>

                      {/* 粗利 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">粗利</h3>
                <p className="text-sm text-gray-600">売上から支出を差し引いた粗利</p>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                                       <input
                       type="text"
                       value={formatNumber(calculateGrossProfit().toString())}
                       readOnly
                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-lg font-semibold"
                       placeholder="0"
                     />
                </div>
                <p className="text-xs text-gray-500 mt-1">売上 - 支出</p>
              </div>
            </div>
          </div>

                      {/* 予算比率 */}
           <div className="border-t border-gray-200 pt-6">
             <div className="mb-4">
               <h3 className="text-lg font-medium text-gray-900">予算比率</h3>
               <p className="text-sm text-gray-600">粗利に対する各予算の比率を設定してください</p>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  営業予算 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budgetRatio.salesBudget}
                    onChange={(e) => {
                      const normalizedValue = e.target.value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                      handleBudgetRatioChange('salesBudget', normalizedValue)
                    }}
                    required
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="2.0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  雑費予算 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budgetRatio.miscellaneousBudget}
                    onChange={(e) => {
                      const normalizedValue = e.target.value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                      handleBudgetRatioChange('miscellaneousBudget', normalizedValue)
                    }}
                    required
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.5"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  インセンティブ予算 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budgetRatio.incentiveBudget}
                    onChange={(e) => {
                      const normalizedValue = e.target.value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                      handleBudgetRatioChange('incentiveBudget', normalizedValue)
                    }}
                    required
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.5"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                
              </div>
            </div>

            {/* 予算金額 */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">予算金額</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    営業予算金額
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">¥</span>
                    <input
                      type="text"
                      value={budgetAmounts.salesBudgetAmount}
                      onChange={(e) => {
                        const normalizedValue = normalizeNumber(e.target.value)
                        handleBudgetAmountChange('salesBudgetAmount', normalizedValue)
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="例: 100,000"
                    />
                  </div>
                  
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    雑費予算金額
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">¥</span>
                    <input
                      type="text"
                      value={budgetAmounts.miscellaneousBudgetAmount}
                      onChange={(e) => {
                        const normalizedValue = normalizeNumber(e.target.value)
                        handleBudgetAmountChange('miscellaneousBudgetAmount', normalizedValue)
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="例: 25,000"
                    />
                  </div>
                  
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    インセンティブ予算金額
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">¥</span>
                    <input
                      type="text"
                      value={budgetAmounts.incentiveBudgetAmount}
                      onChange={(e) => {
                        const normalizedValue = normalizeNumber(e.target.value)
                        handleBudgetAmountChange('incentiveBudgetAmount', normalizedValue)
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="例: 25,000"
                    />
                  </div>
                  
                </div>
              </div>
            </div>
                       </div>
            
            {/* メモ欄 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">メモ欄</h3>
                <p className="text-sm text-gray-600">案件に関する備考や注意事項を記入してください</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
                    メモ
                  </label>
                  <textarea
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="案件に関する備考や注意事項を記入してください"
                  />
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
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              登録する
            </button>
          </div>
        </form>
      </div>

            {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">
                  案件登録確認
                </h3>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                  onClick={handleCancel}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-8">
                {/* 案件情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    案件情報
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">案件名:</span>
                      <span className="ml-3 text-gray-900">{formData.name}</span>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">顧客名:</span>
                      <span className="ml-3 text-gray-900">{formData.customer}</span>
                    </div>
                    <div className="flex items-center py-2">
                      <span className="font-medium text-gray-700 w-24">案件種別:</span>
                      <span className="ml-3 text-gray-900">プライム案件</span>
                    </div>
                  </div>
                </div>

                {/* スケジュール情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    スケジュール情報
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">開始年月:</span>
                      <span className="ml-3 text-gray-900">{formData.startDate}</span>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">納品予定日:</span>
                      <span className="ml-3 text-gray-900">{formData.deliveryDate}</span>
                    </div>
                    <div className="flex items-center py-2">
                      <span className="font-medium text-gray-700 w-24">売上計上予定月:</span>
                      <span className="ml-3 text-gray-900">{formData.revenueMonth}</span>
                    </div>
                  </div>
                </div>

                {/* アサイン情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    アサイン情報
                  </h4>
                  <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">役割:</span>
                            <span className="ml-2 text-gray-900">{getRoleLabel(member.role)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">名前:</span>
                            <span className="ml-2 text-gray-900">{member.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">単価:</span>
                            <span className="ml-2 text-gray-900">{formatNumber(member.unitPrice)}円</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">インセンティブ:</span>
                            <span className="ml-2 text-gray-900">{member.incentive}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 財務情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    財務情報
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">売上（自動計算）:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{formatNumber(calculateRevenue().toString())}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">労務費（概算）:</span>
                        <span className="ml-2 text-gray-900">{formatNumber(calculateLaborCost().toString())}円</span>
                      </div>
                    </div>
                    
                    {/* その他支出項目 */}
                    {payments.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600 block mb-2">その他支出項目:</span>
                        <div className="space-y-2">
                          {payments.map((payment, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="font-medium text-gray-600">{payment.item}:</span>
                              <span className="text-gray-900">{formatNumber(payment.amount)}円</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">支出合計:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{formatNumber(calculateTotalExpenses().toString())}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">粗利:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{formatNumber(calculateGrossProfit().toString())}円</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 予算情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    予算情報
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">営業予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{budgetRatio.salesBudget}%</span>
                        <span className="ml-2 text-gray-900">({formatNumber(calculateBudgetAmount(budgetRatio.salesBudget).toString())}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">雑費予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{budgetRatio.miscellaneousBudget}%</span>
                        <span className="ml-2 text-gray-900">({formatNumber(calculateBudgetAmount(budgetRatio.miscellaneousBudget).toString())}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">インセンティブ予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{budgetRatio.incentiveBudget}%</span>
                        <span className="ml-2 text-gray-900">({formatNumber(calculateBudgetAmount(budgetRatio.incentiveBudget).toString())}円)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* メモ欄 */}
                {formData.memo && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      メモ欄
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                      <span className="whitespace-pre-wrap text-gray-900">{formData.memo}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-6 space-x-3 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  確定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 