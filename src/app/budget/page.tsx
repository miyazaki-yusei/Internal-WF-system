'use client'

import { useState, useEffect } from 'react'
import { 
  CurrencyYenIcon, 
  PlusIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

// 基本予算データの型定義
interface BudgetData {
  year: string
  firstHalf: {
    sales: number
    expenses: number
    grossProfit: number
    salesBudget: number
    miscBudget: number
    incentiveBudget: number
  }
  secondHalf: {
    sales: number
    expenses: number
    grossProfit: number
    salesBudget: number
    miscBudget: number
    incentiveBudget: number
  }
  fullYear: {
    sales: number
    expenses: number
    grossProfit: number
    salesBudget: number
    miscBudget: number
    incentiveBudget: number
  }
}

// 営業予算内訳の型定義
interface SalesBudgetItem {
  category: string
  amount: number
  description: string
}

// 雑費予算内訳の型定義
interface MiscBudgetItem {
  category: string
  amount: number
  description: string
}

// 事業部別予算の型定義
interface DivisionBudget {
  farm: {
    firstHalf: { sales: number; expenses: number; grossProfit: number; incentiveBudget: number }
    secondHalf: { sales: number; expenses: number; grossProfit: number; incentiveBudget: number }
    fullYear: { sales: number; expenses: number; grossProfit: number; incentiveBudget: number }
  }
  prime: {
    firstHalf: { sales: number; expenses: number; grossProfit: number; salesBudget: number; miscBudget: number; incentiveBudget: number }
    secondHalf: { sales: number; expenses: number; grossProfit: number; salesBudget: number; miscBudget: number; incentiveBudget: number }
    fullYear: { sales: number; expenses: number; grossProfit: number; salesBudget: number; miscBudget: number; incentiveBudget: number }
  }
}

export default function BudgetPage() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedPeriod, setSelectedPeriod] = useState('fullYear')
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'misc' | 'divisions'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  // 基本予算データ
  const [budgetData, setBudgetData] = useState<BudgetData>({
    year: '2025',
    firstHalf: {
      sales: 66000000,
      expenses: 27500000,
      grossProfit: 38500000,
      salesBudget: 3300000,
      miscBudget: 660000,
      incentiveBudget: 957000
    },
    secondHalf: {
      sales: 79200000,
      expenses: 33000000,
      grossProfit: 46200000,
      salesBudget: 4840000,
      miscBudget: 968000,
      incentiveBudget: 1095600
    },
    fullYear: {
      sales: 145200000,
      expenses: 60500000,
      grossProfit: 84700000,
      salesBudget: 8140000,
      miscBudget: 1628000,
      incentiveBudget: 2052600
    }
  })

  // 営業予算内訳
  const [salesBudgetDetail, setSalesBudgetDetail] = useState<SalesBudgetItem[]>([
    { category: '広告費', amount: 3256000, description: 'Web広告、印刷物広告' },
    { category: 'イベント費', amount: 2200000, description: '展示会、セミナー参加費' },
    { category: '交通費', amount: 1628000, description: '営業活動の交通費' },
    { category: '接待費', amount: 1056000, description: '顧客接待費用' }
  ])

  // 雑費予算内訳
  const [miscBudgetDetail, setMiscBudgetDetail] = useState<MiscBudgetItem[]>([
    { category: '事務用品費', amount: 488400, description: '文具、消耗品' },
    { category: '通信費', amount: 407000, description: '電話、インターネット' },
    { category: '水道光熱費', amount: 325600, description: '電気、ガス、水道' },
    { category: '保険料', amount: 244200, description: '事務所保険、賠償責任保険' },
    { category: 'その他', amount: 162800, description: 'その他の雑費' }
  ])

  // 事業部別予算
  const [divisionBudget, setDivisionBudget] = useState<DivisionBudget>({
    farm: {
      firstHalf: { sales: 33000000, expenses: 11000000, grossProfit: 22000000, incentiveBudget: 660000 },
      secondHalf: { sales: 33000000, expenses: 11000000, grossProfit: 22000000, incentiveBudget: 660000 },
      fullYear: { sales: 66000000, expenses: 22000000, grossProfit: 44000000, incentiveBudget: 1320000 }
    },
    prime: {
      firstHalf: { sales: 33000000, expenses: 16500000, grossProfit: 16500000, salesBudget: 3300000, miscBudget: 660000, incentiveBudget: 297000 },
      secondHalf: { sales: 46200000, expenses: 22000000, grossProfit: 24200000, salesBudget: 4840000, miscBudget: 968000, incentiveBudget: 435600 },
      fullYear: { sales: 79200000, expenses: 38500000, grossProfit: 40700000, salesBudget: 8140000, miscBudget: 1628000, incentiveBudget: 732600 }
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleEditField = (field: string, value: number) => {
    if (!isEditing) return

    const period = selectedPeriod as 'firstHalf' | 'secondHalf' | 'fullYear'
    
    setBudgetData(prev => {
      const currentPeriod = prev[period]
      return {
        ...prev,
        [period]: {
          ...currentPeriod,
          [field]: value,
          grossProfit: field === 'sales' || field === 'expenses' 
            ? (field === 'sales' ? value : currentPeriod.sales) - (field === 'expenses' ? value : currentPeriod.expenses)
            : currentPeriod.grossProfit
        }
      }
    })
  }

  const handleSaveSalesBudget = (index: number, field: keyof SalesBudgetItem, value: string | number) => {
    const newSalesBudget = [...salesBudgetDetail]
    newSalesBudget[index] = { ...newSalesBudget[index], [field]: value }
    setSalesBudgetDetail(newSalesBudget)
  }

  const handleSaveMiscBudget = (index: number, field: keyof MiscBudgetItem, value: string | number) => {
    const newMiscBudget = [...miscBudgetDetail]
    newMiscBudget[index] = { ...newMiscBudget[index], [field]: value }
    setMiscBudgetDetail(newMiscBudget)
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'firstHalf': return '上半期'
      case 'secondHalf': return '下半期'
      case 'fullYear': return '通年'
      default: return period
    }
  }

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">予算管理</h1>
            <p className="text-gray-600 mt-1">ダッシュボードの予算集計データを管理・更新します</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">年:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024">2024年</option>
                <option value="2025">2025年</option>
                <option value="2026">2026年</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">期間:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="firstHalf">上半期</option>
                <option value="secondHalf">下半期</option>
                <option value="fullYear">通年</option>
              </select>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                isEditing 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  編集完了
                </>
              ) : (
                <>
                  <PencilIcon className="h-5 w-5 mr-2" />
                  編集モード
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>基本予算</span>
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'sales'
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>営業予算内訳</span>
          </button>
          <button
            onClick={() => setActiveTab('misc')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'misc'
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>雑費予算内訳</span>
          </button>
          <button
            onClick={() => setActiveTab('divisions')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'divisions'
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BuildingOfficeIcon className="h-5 w-5" />
            <span>事業部別予算</span>
          </button>
        </nav>
      </div>

      {/* 基本予算タブ */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedYear}年{getPeriodLabel(selectedPeriod)}の基本予算
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    項目
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    売上見込み
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                         {isEditing ? (
                       <input
                         type="number"
                         value={budgetData[selectedPeriod as 'firstHalf' | 'secondHalf' | 'fullYear'].sales}
                         onChange={(e) => handleEditField('sales', Number(e.target.value))}
                         className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                       />
                     ) : (
                       formatCurrency(budgetData[selectedPeriod as 'firstHalf' | 'secondHalf' | 'fullYear'].sales)
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    支出見込み
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={budgetData[selectedPeriod as keyof BudgetData].expenses}
                        onChange={(e) => handleEditField('expenses', Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                      />
                    ) : (
                      formatCurrency(budgetData[selectedPeriod as keyof BudgetData].expenses)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    粗利
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(budgetData[selectedPeriod as keyof BudgetData].grossProfit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className="text-gray-400">自動計算</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    営業予算
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={budgetData[selectedPeriod as keyof BudgetData].salesBudget}
                        onChange={(e) => handleEditField('salesBudget', Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                      />
                    ) : (
                      formatCurrency(budgetData[selectedPeriod as keyof BudgetData].salesBudget)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    雑費予算
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={budgetData[selectedPeriod as keyof BudgetData].miscBudget}
                        onChange={(e) => handleEditField('miscBudget', Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                      />
                    ) : (
                      formatCurrency(budgetData[selectedPeriod as keyof BudgetData].miscBudget)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    インセンティブ予算
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={budgetData[selectedPeriod as keyof BudgetData].incentiveBudget}
                        onChange={(e) => handleEditField('incentiveBudget', Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                      />
                    ) : (
                      formatCurrency(budgetData[selectedPeriod as keyof BudgetData].incentiveBudget)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 営業予算内訳タブ */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              営業予算の内訳管理
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    項目
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesBudgetDetail.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleSaveSalesBudget(index, 'category', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-32"
                        />
                      ) : (
                        item.category
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleSaveSalesBudget(index, 'amount', Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                        />
                      ) : (
                        formatCurrency(item.amount)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleSaveSalesBudget(index, 'description', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-48"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {isEditing && (
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    合計
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                    {formatCurrency(salesBudgetDetail.reduce((sum, item) => sum + item.amount, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-green-600 hover:text-green-900">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 雑費予算内訳タブ */}
      {activeTab === 'misc' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              雑費予算の内訳管理
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    項目
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {miscBudgetDetail.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleSaveMiscBudget(index, 'category', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-32"
                        />
                      ) : (
                        item.category
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleSaveMiscBudget(index, 'amount', Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
                        />
                      ) : (
                        formatCurrency(item.amount)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleSaveMiscBudget(index, 'description', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-48"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {isEditing && (
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    合計
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                    {formatCurrency(miscBudgetDetail.reduce((sum, item) => sum + item.amount, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {isEditing && (
                      <button className="text-green-600 hover:text-green-900">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 事業部別予算タブ */}
      {activeTab === 'divisions' && (
        <div className="space-y-6">
          {/* Farm事業部 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Farm事業部予算</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      期間
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      売上
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支出
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      粗利
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      インセンティブ予算
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      上半期
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.firstHalf.sales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.firstHalf.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.firstHalf.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.firstHalf.incentiveBudget)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      下半期
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.secondHalf.sales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.secondHalf.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.secondHalf.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.farm.secondHalf.incentiveBudget)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      通年
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.farm.fullYear.sales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.farm.fullYear.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.farm.fullYear.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.farm.fullYear.incentiveBudget)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Prime事業部 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Prime事業部予算</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      期間
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      売上
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支出
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      粗利
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      営業予算
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      雑費予算
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      インセンティブ予算
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      上半期
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.firstHalf.sales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.firstHalf.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.firstHalf.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.firstHalf.salesBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.firstHalf.miscBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.firstHalf.incentiveBudget)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      下半期
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.secondHalf.sales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.secondHalf.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.secondHalf.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.secondHalf.salesBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.secondHalf.miscBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(divisionBudget.prime.secondHalf.incentiveBudget)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      通年
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.prime.fullYear.sales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.prime.fullYear.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.prime.fullYear.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.prime.fullYear.salesBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.prime.fullYear.miscBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(divisionBudget.prime.fullYear.incentiveBudget)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 