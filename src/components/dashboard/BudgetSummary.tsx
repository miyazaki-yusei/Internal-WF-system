import React, { useState } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import { CurrencyYenIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

// 予算集計データ（上半期、下半期、通年）
const budgetData = {
  2024: {
    firstHalf: { 
      sales: 60000000, 
      expenses: 25000000, 
      grossProfit: 35000000, 
      salesBudget: 3000000, 
      miscBudget: 600000, 
      incentiveBudget: 870000 
    },
    secondHalf: { 
      sales: 72000000, 
      expenses: 30000000, 
      grossProfit: 42000000, 
      salesBudget: 4400000, 
      miscBudget: 880000, 
      incentiveBudget: 996000 
    },
    fullYear: { 
      sales: 132000000, 
      expenses: 55000000, 
      grossProfit: 77000000, 
      salesBudget: 7400000, 
      miscBudget: 1480000, 
      incentiveBudget: 1866000 
    },
  },
  2025: {
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
    },
  },
  2026: {
    firstHalf: { 
      sales: 72600000, 
      expenses: 30250000, 
      grossProfit: 42350000, 
      salesBudget: 3630000, 
      miscBudget: 726000, 
      incentiveBudget: 1052700 
    },
    secondHalf: { 
      sales: 87120000, 
      expenses: 36300000, 
      grossProfit: 50820000, 
      salesBudget: 5324000, 
      miscBudget: 1064800, 
      incentiveBudget: 1205160 
    },
    fullYear: { 
      sales: 159720000, 
      expenses: 66550000, 
      grossProfit: 93170000, 
      salesBudget: 8954000, 
      miscBudget: 1790800, 
      incentiveBudget: 2257860 
    },
  },
}

// 内訳データ
const detailData = {
  farm: {
    2024: {
      firstHalf: { sales: 30000000, expenses: 10000000, grossProfit: 20000000, incentiveBudget: 600000 },
      secondHalf: { sales: 30000000, expenses: 10000000, grossProfit: 20000000, incentiveBudget: 600000 },
      fullYear: { sales: 60000000, expenses: 20000000, grossProfit: 40000000, incentiveBudget: 1200000 },
    },
    2025: {
      firstHalf: { sales: 33000000, expenses: 11000000, grossProfit: 22000000, incentiveBudget: 660000 },
      secondHalf: { sales: 33000000, expenses: 11000000, grossProfit: 22000000, incentiveBudget: 660000 },
      fullYear: { sales: 66000000, expenses: 22000000, grossProfit: 44000000, incentiveBudget: 1320000 },
    },
    2026: {
      firstHalf: { sales: 36300000, expenses: 12100000, grossProfit: 24200000, incentiveBudget: 726000 },
      secondHalf: { sales: 36300000, expenses: 12100000, grossProfit: 24200000, incentiveBudget: 726000 },
      fullYear: { sales: 72600000, expenses: 24200000, grossProfit: 48400000, incentiveBudget: 1452000 },
    },
  },
  prime: {
    2024: {
      firstHalf: { sales: 30000000, expenses: 15000000, grossProfit: 15000000, salesBudget: 3000000, miscBudget: 600000, incentiveBudget: 270000 },
      secondHalf: { sales: 42000000, expenses: 20000000, grossProfit: 22000000, salesBudget: 4400000, miscBudget: 880000, incentiveBudget: 396000 },
      fullYear: { sales: 72000000, expenses: 35000000, grossProfit: 37000000, salesBudget: 7400000, miscBudget: 1480000, incentiveBudget: 666000 },
    },
    2025: {
      firstHalf: { sales: 33000000, expenses: 16500000, grossProfit: 16500000, salesBudget: 3300000, miscBudget: 660000, incentiveBudget: 297000 },
      secondHalf: { sales: 46200000, expenses: 22000000, grossProfit: 24200000, salesBudget: 4840000, miscBudget: 968000, incentiveBudget: 435600 },
      fullYear: { sales: 79200000, expenses: 38500000, grossProfit: 40700000, salesBudget: 8140000, miscBudget: 1628000, incentiveBudget: 732600 },
    },
    2026: {
      firstHalf: { sales: 36300000, expenses: 18150000, grossProfit: 18150000, salesBudget: 3630000, miscBudget: 726000, incentiveBudget: 326700 },
      secondHalf: { sales: 50820000, expenses: 24200000, grossProfit: 26620000, salesBudget: 5324000, miscBudget: 1064800, incentiveBudget: 479160 },
      fullYear: { sales: 87120000, expenses: 42350000, grossProfit: 44770000, salesBudget: 8954000, miscBudget: 1790800, incentiveBudget: 805860 },
    },
  },
}

// 営業予算の内訳データ
const salesBudgetDetail = {
  2024: {
    firstHalf: [
      { category: '広告費', amount: 1200000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 800000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 600000, description: '営業活動の交通費' },
      { category: '接待費', amount: 400000, description: '顧客接待費用' }
    ],
    secondHalf: [
      { category: '広告費', amount: 1760000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 1200000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 880000, description: '営業活動の交通費' },
      { category: '接待費', amount: 560000, description: '顧客接待費用' }
    ],
    fullYear: [
      { category: '広告費', amount: 2960000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 2000000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 1480000, description: '営業活動の交通費' },
      { category: '接待費', amount: 960000, description: '顧客接待費用' }
    ]
  },
  2025: {
    firstHalf: [
      { category: '広告費', amount: 1320000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 880000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 660000, description: '営業活動の交通費' },
      { category: '接待費', amount: 440000, description: '顧客接待費用' }
    ],
    secondHalf: [
      { category: '広告費', amount: 1936000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 1320000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 968000, description: '営業活動の交通費' },
      { category: '接待費', amount: 616000, description: '顧客接待費用' }
    ],
    fullYear: [
      { category: '広告費', amount: 3256000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 2200000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 1628000, description: '営業活動の交通費' },
      { category: '接待費', amount: 1056000, description: '顧客接待費用' }
    ]
  },
  2026: {
    firstHalf: [
      { category: '広告費', amount: 1452000, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 968000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 726000, description: '営業活動の交通費' },
      { category: '接待費', amount: 484000, description: '顧客接待費用' }
    ],
    secondHalf: [
      { category: '広告費', amount: 2129600, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 1452000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 1064800, description: '営業活動の交通費' },
      { category: '接待費', amount: 677600, description: '顧客接待費用' }
    ],
    fullYear: [
      { category: '広告費', amount: 3581600, description: 'Web広告、印刷物広告' },
      { category: 'イベント費', amount: 2420000, description: '展示会、セミナー参加費' },
      { category: '交通費', amount: 1790800, description: '営業活動の交通費' },
      { category: '接待費', amount: 1161600, description: '顧客接待費用' }
    ]
  }
}

// 雑費予算の内訳データ
const miscBudgetDetail = {
  2024: {
    firstHalf: [
      { category: '事務用品費', amount: 180000, description: '文具、消耗品' },
      { category: '通信費', amount: 150000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 120000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 90000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 60000, description: 'その他の雑費' }
    ],
    secondHalf: [
      { category: '事務用品費', amount: 264000, description: '文具、消耗品' },
      { category: '通信費', amount: 220000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 176000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 132000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 88000, description: 'その他の雑費' }
    ],
    fullYear: [
      { category: '事務用品費', amount: 444000, description: '文具、消耗品' },
      { category: '通信費', amount: 370000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 296000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 222000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 148000, description: 'その他の雑費' }
    ]
  },
  2025: {
    firstHalf: [
      { category: '事務用品費', amount: 198000, description: '文具、消耗品' },
      { category: '通信費', amount: 165000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 132000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 99000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 66000, description: 'その他の雑費' }
    ],
    secondHalf: [
      { category: '事務用品費', amount: 290400, description: '文具、消耗品' },
      { category: '通信費', amount: 242000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 193600, description: '電気、ガス、水道' },
      { category: '保険料', amount: 145200, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 96800, description: 'その他の雑費' }
    ],
    fullYear: [
      { category: '事務用品費', amount: 488400, description: '文具、消耗品' },
      { category: '通信費', amount: 407000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 325600, description: '電気、ガス、水道' },
      { category: '保険料', amount: 244200, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 162800, description: 'その他の雑費' }
    ]
  },
  2026: {
    firstHalf: [
      { category: '事務用品費', amount: 217800, description: '文具、消耗品' },
      { category: '通信費', amount: 181500, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 145200, description: '電気、ガス、水道' },
      { category: '保険料', amount: 108900, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 72600, description: 'その他の雑費' }
    ],
    secondHalf: [
      { category: '事務用品費', amount: 319440, description: '文具、消耗品' },
      { category: '通信費', amount: 266200, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 212960, description: '電気、ガス、水道' },
      { category: '保険料', amount: 159720, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 106480, description: 'その他の雑費' }
    ],
    fullYear: [
      { category: '事務用品費', amount: 537240, description: '文具、消耗品' },
      { category: '通信費', amount: 447700, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 358160, description: '電気、ガス、水道' },
      { category: '保険料', amount: 268620, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 179080, description: 'その他の雑費' }
    ]
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function BudgetSummary() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedPeriod, setSelectedPeriod] = useState('上半期')

  // 選択された年のデータを取得
  const yearData = budgetData[selectedYear as '2024' | '2025' | '2026'] || budgetData['2025']
  
  // 選択された期間のデータを取得
  const periodKey = selectedPeriod === '上半期' ? 'firstHalf' : selectedPeriod === '下半期' ? 'secondHalf' : 'fullYear'
  const selectedPeriodData = yearData[periodKey as 'firstHalf' | 'secondHalf' | 'fullYear']

  return (
    <div className="space-y-8">
      {/* 予算集計表 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">売上・支出・利益・各種予算</h3>
            <p className="text-sm text-gray-600">{selectedYear}年の上半期・下半期・通年の予算を確認できます</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">年:</label>
            <select
              id="year-select"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-blue-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/7 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">期間</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上見込み</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支出見込み</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">粗利</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">営業予算</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">雑費予算</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">インセンティブ予算</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-200">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年上半期</td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.firstHalf.sales)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.firstHalf.expenses)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.firstHalf.grossProfit)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.firstHalf.salesBudget)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.firstHalf.miscBudget)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(yearData.firstHalf.incentiveBudget)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年下半期</td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.secondHalf.sales)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.secondHalf.expenses)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.secondHalf.grossProfit)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.secondHalf.salesBudget)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.secondHalf.miscBudget)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(yearData.secondHalf.incentiveBudget)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">通年</td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.fullYear.sales)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.fullYear.expenses)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.fullYear.grossProfit)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.fullYear.salesBudget)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                  {formatCurrency(yearData.fullYear.miscBudget)}
                </td>
                <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(yearData.fullYear.incentiveBudget)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 内訳テーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">内訳</h3>
          <p className="text-sm text-gray-600">ファーム案件とプライム案件の詳細な予算内訳を確認できます</p>
        </div>
        
        {/* ファーム案件 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">ファーム案件</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 hover:border-green-300 transition-colors duration-200">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="w-1/5 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">期間</th>
                  <th className="w-1/5 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上見込み</th>
                  <th className="w-1/5 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支出見込み</th>
                  <th className="w-1/5 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">粗利</th>
                  <th className="w-1/5 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">インセンティブ予算</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年上半期</td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].firstHalf.sales)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].firstHalf.expenses)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].firstHalf.grossProfit)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].firstHalf.incentiveBudget)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年下半期</td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].secondHalf.sales)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].secondHalf.expenses)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].secondHalf.grossProfit)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].secondHalf.incentiveBudget)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">通年</td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].fullYear.sales)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].fullYear.expenses)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].fullYear.grossProfit)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(detailData.farm[selectedYear as '2024' | '2025' | '2026'].fullYear.incentiveBudget)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* プライム案件 */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">プライム案件</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 hover:border-green-300 transition-colors duration-200">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="w-1/7 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">期間</th>
                  <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上見込み</th>
                  <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支出見込み</th>
                  <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">粗利</th>
                  <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">営業予算</th>
                  <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">雑費予算</th>
                  <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">インセンティブ予算</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年上半期</td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].firstHalf.sales)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].firstHalf.expenses)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].firstHalf.grossProfit)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].firstHalf.salesBudget)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].firstHalf.miscBudget)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].firstHalf.incentiveBudget)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年下半期</td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].secondHalf.sales)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].secondHalf.expenses)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].secondHalf.grossProfit)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].secondHalf.salesBudget)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].secondHalf.miscBudget)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].secondHalf.incentiveBudget)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">通年</td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].fullYear.sales)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].fullYear.expenses)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].fullYear.grossProfit)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].fullYear.salesBudget)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].fullYear.miscBudget)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(detailData.prime[selectedYear as '2024' | '2025' | '2026'].fullYear.incentiveBudget)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 営業予算の内訳テーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">営業予算の内訳</h3>
          <p className="text-sm text-gray-600">{selectedYear}年の営業予算の詳細な内訳を確認できます</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-purple-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/4 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                <th className="w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">金額</th>
                <th className="w-1/2 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50">説明</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {item.description}
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                  合計
                </td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0))}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 雑費予算の内訳テーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">雑費予算の内訳</h3>
          <p className="text-sm text-gray-600">{selectedYear}年の雑費予算の詳細な内訳を確認できます</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-orange-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/4 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                <th className="w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">金額</th>
                <th className="w-1/2 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50">説明</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {item.description}
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                  合計
                </td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0))}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 