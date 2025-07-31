'use client'

import { useState, useEffect } from 'react'
import { 
  CurrencyYenIcon, 
  PlusIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface BudgetItem {
  id: string
  category: string
  budget: number
  actual: number
  forecast: number
  month: string
  year: number
  notes?: string
}

const budgetCategories = [
  '人件費',
  '材料費',
  '外注費',
  '経費',
  '設備投資',
  'その他'
]

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const [newBudget, setNewBudget] = useState({
    category: '',
    budget: 0,
    actual: 0,
    forecast: 0,
    notes: ''
  })

  const [editBudget, setEditBudget] = useState({
    category: '',
    budget: 0,
    actual: 0,
    forecast: 0,
    notes: ''
  })

  // サンプルデータの初期化
  useEffect(() => {
    const sampleData: BudgetItem[] = [
      {
        id: '1',
        category: '人件費',
        budget: 5000000,
        actual: 4800000,
        forecast: 5200000,
        month: '1',
        year: 2024,
        notes: '基本給・残業代'
      },
      {
        id: '2',
        category: '材料費',
        budget: 2000000,
        actual: 1800000,
        forecast: 2200000,
        month: '1',
        year: 2024,
        notes: '原材料・消耗品'
      },
      {
        id: '3',
        category: '外注費',
        budget: 1000000,
        actual: 950000,
        forecast: 1100000,
        month: '1',
        year: 2024,
        notes: 'システム開発費'
      }
    ]
    setBudgets(sampleData)
  }, [])

  const handleAddBudget = () => {
    if (!newBudget.category) return

    const budgetItem: BudgetItem = {
      id: Date.now().toString(),
      category: newBudget.category,
      budget: newBudget.budget,
      actual: newBudget.actual,
      forecast: newBudget.forecast,
      month: selectedMonth.toString(),
      year: selectedYear,
      notes: newBudget.notes
    }

    setBudgets([...budgets, budgetItem])
    setNewBudget({
      category: '',
      budget: 0,
      actual: 0,
      forecast: 0,
      notes: ''
    })
    setIsAdding(false)
  }

  const handleEditBudget = (id: string) => {
    const budget = budgets.find(b => b.id === id)
    if (budget) {
      setEditBudget({
        category: budget.category,
        budget: budget.budget,
        actual: budget.actual,
        forecast: budget.forecast,
        notes: budget.notes || ''
      })
      setEditingId(id)
    }
  }

  const handleSaveEdit = () => {
    if (!editingId) return

    setBudgets(budgets.map(budget => 
      budget.id === editingId 
        ? {
            ...budget,
            category: editBudget.category,
            budget: editBudget.budget,
            actual: editBudget.actual,
            forecast: editBudget.forecast,
            notes: editBudget.notes
          }
        : budget
    ))
    setEditingId(null)
  }

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id))
  }

  const filteredBudgets = budgets.filter(
    budget => budget.year === selectedYear && budget.month === selectedMonth.toString()
  )

  const totalBudget = filteredBudgets.reduce((sum, item) => sum + item.budget, 0)
  const totalActual = filteredBudgets.reduce((sum, item) => sum + item.actual, 0)
  const totalForecast = filteredBudgets.reduce((sum, item) => sum + item.forecast, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount)
  }

  const getVarianceColor = (actual: number, budget: number) => {
    const variance = ((actual - budget) / budget) * 100
    if (variance > 10) return 'text-red-600'
    if (variance < -10) return 'text-green-600'
    return 'text-gray-600'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">予算管理</h1>
            <p className="text-gray-600 mt-1">予算の実績値と見込み値を管理します</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            予算追加
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6 flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month}月</option>
            ))}
          </select>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyYenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">予算合計</p>
              <p className="text-2xl font-bold text-gray-900">¥{formatCurrency(totalBudget)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyYenIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">実績合計</p>
              <p className="text-2xl font-bold text-gray-900">¥{formatCurrency(totalActual)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CurrencyYenIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">見込み合計</p>
              <p className="text-2xl font-bold text-gray-900">¥{formatCurrency(totalForecast)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 予算追加フォーム */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">予算追加</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {budgetCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">予算</label>
              <input
                type="number"
                value={newBudget.budget}
                onChange={(e) => setNewBudget({...newBudget, budget: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">実績</label>
              <input
                type="number"
                value={newBudget.actual}
                onChange={(e) => setNewBudget({...newBudget, actual: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">見込み</label>
              <input
                type="number"
                value={newBudget.forecast}
                onChange={(e) => setNewBudget({...newBudget, forecast: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <input
              type="text"
              value={newBudget.notes}
              onChange={(e) => setNewBudget({...newBudget, notes: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="備考を入力"
            />
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleAddBudget}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              追加
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 予算一覧 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">予算一覧</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  予算
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  実績
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  見込み
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  差異
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  備考
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.map((budget) => (
                <tr key={budget.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingId === budget.id ? (
                      <select
                        value={editBudget.category}
                        onChange={(e) => setEditBudget({...editBudget, category: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {budgetCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    ) : (
                      budget.category
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === budget.id ? (
                      <input
                        type="number"
                        value={editBudget.budget}
                        onChange={(e) => setEditBudget({...editBudget, budget: Number(e.target.value)})}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                      />
                    ) : (
                      `¥${formatCurrency(budget.budget)}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === budget.id ? (
                      <input
                        type="number"
                        value={editBudget.actual}
                        onChange={(e) => setEditBudget({...editBudget, actual: Number(e.target.value)})}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                      />
                    ) : (
                      <span className={getVarianceColor(budget.actual, budget.budget)}>
                        ¥{formatCurrency(budget.actual)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === budget.id ? (
                      <input
                        type="number"
                        value={editBudget.forecast}
                        onChange={(e) => setEditBudget({...editBudget, forecast: Number(e.target.value)})}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                      />
                    ) : (
                      `¥${formatCurrency(budget.forecast)}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getVarianceColor(budget.actual, budget.budget)}>
                      {((budget.actual - budget.budget) / budget.budget * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === budget.id ? (
                      <input
                        type="text"
                        value={editBudget.notes}
                        onChange={(e) => setEditBudget({...editBudget, notes: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      budget.notes || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === budget.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBudget(budget.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 