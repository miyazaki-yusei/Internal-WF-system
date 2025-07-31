import React, { useState } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import { CurrencyYenIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

// プライム集計データ（上半期、下半期、通年）
const primeData = {
  2024: {
    firstHalf: { sales: 3000000, outsourcing: 0, grossProfit: 3000000, grossProfitRate: 100.0 },
    secondHalf: { sales: 12000000, outsourcing: 6100000, grossProfit: 5900000, grossProfitRate: 49.2 },
    fullYear: { sales: 15000000, outsourcing: 6100000, grossProfit: 8900000, grossProfitRate: 59.3 },
  },
  2025: {
    firstHalf: { sales: 18000000, outsourcing: 7600000, grossProfit: 10400000, grossProfitRate: 57.8 },
    secondHalf: { sales: 27000000, outsourcing: 13600000, grossProfit: 13400000, grossProfitRate: 49.6 },
    fullYear: { sales: 45000000, outsourcing: 21200000, grossProfit: 23800000, grossProfitRate: 52.9 },
  },
  2026: {
    firstHalf: { sales: 21000000, outsourcing: 8400000, grossProfit: 12600000, grossProfitRate: 60.0 },
    secondHalf: { sales: 32000000, outsourcing: 16000000, grossProfit: 16000000, grossProfitRate: 50.0 },
    fullYear: { sales: 53000000, outsourcing: 24400000, grossProfit: 28600000, grossProfitRate: 54.0 },
  },
}

// 各期間の詳細データ - プライム事業部
const periodDetailData = {
  '2024年上半期': {
    projectName: 'A社基幹システム開発',
    startDate: '2024年4月',
    deliveryDate: '2024年6月',
    sales: 3000000,
    outsourcing: {},
    grossProfit: 3000000,
    grossProfitRate: 100.0,
    assignees: {
      'PM': '田中'
    }
  },
  '2024年下半期': {
    projectName: 'A社基幹システム開発',
    startDate: '2024年10月',
    deliveryDate: '2024年3月',
    sales: 12000000,
    outsourcing: {
      'E社': { description: '開発業務委託', amount: 6000000 },
      'AWS': { description: '開発サーバー', amount: 100000 }
    },
    grossProfit: 5900000,
    grossProfitRate: 49.2,
    assignees: {
      'PM': '田中',
      'メンバー': '佐藤'
    }
  },
  '2024年通年': {
    projectName: 'A社基幹システム開発',
    startDate: '2024年4月',
    deliveryDate: '2024年12月',
    sales: 15000000,
    outsourcing: {
      'E社': { description: '開発業務委託', amount: 6000000 },
      'AWS': { description: '開発サーバー', amount: 100000 }
    },
    grossProfit: 8900000,
    grossProfitRate: 59.3,
    assignees: {
      'PM': '田中',
      'メンバー': '佐藤'
    }
  },
  '2025年上半期': {
    projects: [
      {
        projectName: 'A社基幹システム開発',
        startDate: '2025年4月',
        deliveryDate: '2025年3月',
        sales: 15000000,
        outsourcing: {
          'E社': { description: '開発業務委託', amount: 7500000 },
          'AWS': { description: '開発サーバー', amount: 100000 }
        },
        grossProfit: 7400000,
        grossProfitRate: 49.3,
        assignees: {
          'PM': '田中',
          'メンバー': '佐藤、高橋'
        }
      },
      {
        projectName: 'B社業務コンサル',
        startDate: '2025年4月',
        deliveryDate: '2025年6月',
        sales: 3000000,
        outsourcing: {},
        grossProfit: 3000000,
        grossProfitRate: 100.0,
        assignees: {
          'PM': '田中'
        }
      }
    ]
  },
  '2025年下半期': {
    projects: [
      {
        projectName: 'A社基幹システム開発',
        startDate: '2025年10月',
        deliveryDate: '2025年9月',
        sales: 15000000,
        outsourcing: {
          'E社': { description: '開発業務委託', amount: 7500000 },
          'AWS': { description: '開発サーバー', amount: 150000 }
        },
        grossProfit: 7350000,
        grossProfitRate: 49.0,
        assignees: {
          'PM': '田中',
          'メンバー': '佐藤、高橋、鈴木'
        }
      },
      {
        projectName: 'C社○○ツール開発',
        startDate: '2025年10月',
        deliveryDate: '2025年3月',
        sales: 12000000,
        outsourcing: {
          'E社': { description: '開発業務委託', amount: 6000000 },
          'AWS': { description: '開発サーバー', amount: 100000 }
        },
        grossProfit: 5900000,
        grossProfitRate: 49.2,
        assignees: {
          'PM': '田中',
          'メンバー': '佐藤'
        }
      }
    ]
  },
  '2025年通年': {
    projectName: 'A社基幹システム開発',
    startDate: '2025年4月',
    deliveryDate: '2025年12月',
    sales: 45000000,
    outsourcing: {
      'E社': { description: '開発業務委託', amount: 22500000 },
      'AWS': { description: '開発サーバー', amount: 250000 }
    },
    grossProfit: 22250000,
    grossProfitRate: 49.4,
    assignees: {
      'PM': '田中',
      'メンバー': '佐藤、高橋、鈴木、山田'
    }
  },
  '2026年上半期': {
    projectName: 'A社基幹システム開発',
    startDate: '2026年4月',
    deliveryDate: '2026年3月',
    sales: 21000000,
    outsourcing: {
      'E社': { description: '開発業務委託', amount: 10500000 },
      'AWS': { description: '開発サーバー', amount: 100000 }
    },
    grossProfit: 10400000,
    grossProfitRate: 49.5,
    assignees: {
      'PM': '田中',
      'メンバー': '佐藤、高橋、鈴木'
    }
  },
  '2026年下半期': {
    projectName: 'A社基幹システム開発',
    startDate: '2026年10月',
    deliveryDate: '2026年9月',
    sales: 32000000,
    outsourcing: {
      'E社': { description: '開発業務委託', amount: 16000000 },
      'AWS': { description: '開発サーバー', amount: 200000 }
    },
    grossProfit: 15800000,
    grossProfitRate: 49.4,
    assignees: {
      'PM': '田中',
      'メンバー': '佐藤、高橋、鈴木、山田、中村'
    }
  },
  '2026年通年': {
    projectName: 'A社基幹システム開発',
    startDate: '2026年4月',
    deliveryDate: '2026年12月',
    sales: 53000000,
    outsourcing: {
      'E社': { description: '開発業務委託', amount: 26500000 },
      'AWS': { description: '開発サーバー', amount: 300000 }
    },
    grossProfit: 26200000,
    grossProfitRate: 49.4,
    assignees: {
      'PM': '田中',
      'メンバー': '佐藤、高橋、鈴木、山田、中村'
    }
  },
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PrimeSummary() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedPeriod, setSelectedPeriod] = useState('上半期')

  // 選択された年のデータを取得
  const yearData = primeData[selectedYear as '2024' | '2025' | '2026'] || primeData['2025']
  
  // 選択された期間の詳細データを取得
  const periodKey = `${selectedYear}年${selectedPeriod}`
  const selectedPeriodDetailData = periodDetailData[periodKey as keyof typeof periodDetailData] || {}
  
  // 複数案件か単一案件かを判定
  const hasMultipleProjects = 'projects' in selectedPeriodDetailData
  
  // 選択された期間の合計を計算
  let selectedPeriodTotalSales = 0
  let selectedPeriodTotalOutsourcing = 0
  let selectedPeriodTotalGrossProfit = 0
  let selectedPeriodTotalGrossProfitRate = 0
  
  if (hasMultipleProjects) {
    // 複数案件の場合
    const projects = selectedPeriodDetailData.projects || []
    selectedPeriodTotalSales = projects.reduce((sum: number, project: any) => sum + (project.sales || 0), 0)
    selectedPeriodTotalOutsourcing = projects.reduce((sum: number, project: any) => {
      return sum + Object.values(project.outsourcing || {}).reduce((projectSum: number, item: any) => projectSum + item.amount, 0)
    }, 0)
    selectedPeriodTotalGrossProfit = projects.reduce((sum: number, project: any) => sum + (project.grossProfit || 0), 0)
    selectedPeriodTotalGrossProfitRate = selectedPeriodTotalSales > 0 ? (selectedPeriodTotalGrossProfit / selectedPeriodTotalSales) * 100 : 0
  } else {
    // 単一案件の場合（従来の構造）
    selectedPeriodTotalSales = selectedPeriodDetailData.sales || 0
    selectedPeriodTotalOutsourcing = Object.values(selectedPeriodDetailData.outsourcing || {}).reduce((sum: number, item: any) => sum + item.amount, 0)
    selectedPeriodTotalGrossProfit = selectedPeriodDetailData.grossProfit || 0
    selectedPeriodTotalGrossProfitRate = selectedPeriodDetailData.grossProfitRate || 0
  }

  return (
    <div className="space-y-8">
      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="売上合計"
          value={formatCurrency(yearData.fullYear.sales)}
          icon={CurrencyYenIcon}
          color="blue"
        />
        <KPICard
          title="粗利合計"
          value={formatCurrency(yearData.fullYear.grossProfit)}
          icon={ArrowTrendingUpIcon}
          color="green"
        />
        <KPICard
          title="粗利率(%)"
          value={`${yearData.fullYear.grossProfitRate}%`}
          icon={ArrowTrendingUpIcon}
          color="yellow"
        />
      </div>

      {/* プライム集計表 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">プライム集計表</h3>
            <p className="text-sm text-gray-600">{selectedYear}年の上半期・下半期・通年の売上・外注費・粗利を確認できます</p>
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
                 <th className="w-1/4 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                 <th className={`w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 ${
                   selectedPeriod === '上半期' ? 'bg-blue-50' : 'bg-gray-50'
                 }`}>
                   <button
                     className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium cursor-pointer ${
                       selectedPeriod === '上半期' 
                         ? 'text-blue-700' 
                         : 'hover:bg-blue-50 hover:text-blue-700'
                     }`}
                     onClick={() => setSelectedPeriod('上半期')}
                   >
                     {selectedYear}年上半期
                   </button>
                 </th>
                 <th className={`w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 ${
                   selectedPeriod === '下半期' ? 'bg-blue-50' : 'bg-gray-50'
                 }`}>
                   <button
                     className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium cursor-pointer ${
                       selectedPeriod === '下半期' 
                         ? 'text-blue-700' 
                         : 'hover:bg-blue-50 hover:text-blue-700'
                     }`}
                     onClick={() => setSelectedPeriod('下半期')}
                   >
                     {selectedYear}年下半期
                   </button>
                 </th>
                 <th className={`w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 ${
                   selectedPeriod === '通年' ? 'bg-blue-50' : 'bg-gray-50'
                 }`}>
                   <button
                     className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium cursor-pointer ${
                       selectedPeriod === '通年' 
                         ? 'text-blue-700' 
                         : 'hover:bg-blue-50 hover:text-blue-700'
                     }`}
                     onClick={() => setSelectedPeriod('通年')}
                   >
                     通年
                   </button>
                 </th>
               </tr>
             </thead>
                         <tbody className="bg-white">
               <tr className="border-b border-gray-200">
                 <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">売上</td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '上半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {formatCurrency(yearData.firstHalf.sales)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {formatCurrency(yearData.secondHalf.sales)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('通年')}
                 >
                   {formatCurrency(yearData.fullYear.sales)}
                 </td>
               </tr>
               <tr className="border-b border-gray-200">
                 <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">外注費</td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '上半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {formatCurrency(yearData.firstHalf.outsourcing)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {formatCurrency(yearData.secondHalf.outsourcing)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('通年')}
                 >
                   {formatCurrency(yearData.fullYear.outsourcing)}
                 </td>
               </tr>
               <tr className="border-b border-gray-200 hover:border-blue-200 transition-colors duration-200">
                 <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利</td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '上半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {formatCurrency(yearData.firstHalf.grossProfit)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {formatCurrency(yearData.secondHalf.grossProfit)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('通年')}
                 >
                   {formatCurrency(yearData.fullYear.grossProfit)}
                 </td>
               </tr>
               <tr className="border-b border-gray-200">
                 <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利率</td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '上半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {yearData.firstHalf.grossProfitRate}%
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {yearData.secondHalf.grossProfitRate}%
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-blue-50 hover:text-blue-700'
                   }`}
                   onClick={() => setSelectedPeriod('通年')}
                 >
                   {yearData.fullYear.grossProfitRate}%
                 </td>
               </tr>
             </tbody>
          </table>
        </div>
      </div>

      {/* 選択された期間の内訳テーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedYear}年{selectedPeriod}内訳</h3>
          <p className="text-sm text-gray-600">選択された期間の詳細な売上・外注費・粗利の内訳を確認できます</p>
        </div>
                                   <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 hover:border-green-300 transition-colors duration-200">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="w-1/3 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                  <th className="w-2/3 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50">内容</th>
                </tr>
              </thead>
                                         <tbody className="bg-white">
                {hasMultipleProjects ? (
                  // 複数案件の場合
                  (selectedPeriodDetailData.projects || []).map((project: any, projectIndex: number) => (
                    <React.Fragment key={projectIndex}>
                      {projectIndex > 0 && (
                        <tr className="border-b-2 border-gray-300">
                          <td colSpan={2} className="px-6 py-3 bg-gray-100">
                            <div className="text-center text-sm font-semibold text-gray-700">次の案件</div>
                          </td>
                        </tr>
                      )}
                                             <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">案件名</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                           {project.projectName}
                         </td>
                       </tr>
                                             <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">開始年月</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.startDate}
                         </td>
                       </tr>
                       <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">納品予定</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.deliveryDate}
                         </td>
                       </tr>
                       <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">売上</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium text-left">
                           {formatCurrency(project.sales || 0)}
                         </td>
                       </tr>
                       {Object.keys(project.outsourcing || {}).length > 0 ? (
                         Object.entries(project.outsourcing || {}).map(([company, data]: [string, any], index: number) => (
                           <tr key={`outsourcing-${index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                             <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                               {index === 0 ? '外注費' : ''}
                             </td>
                             <td className="px-4 py-4 text-sm text-gray-900 text-left">
                               <div className="flex justify-between items-center">
                                 <span className="text-gray-700">{company}: {data.description}</span>
                                 <span className="text-gray-900 font-medium">{formatCurrency(data.amount)}</span>
                               </div>
                             </td>
                           </tr>
                         ))
                       ) : (
                         <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">外注費</td>
                           <td className="px-4 py-4 text-sm text-gray-500 font-medium text-left">
                             外注費なし
                           </td>
                         </tr>
                       )}
                       <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium text-left">
                           {formatCurrency(project.grossProfit || 0)}
                         </td>
                       </tr>
                       <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利率</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.grossProfitRate || 0}%
                         </td>
                       </tr>
                       {Object.entries(project.assignees || {}).map(([role, name], index: number) => (
                         <tr key={`assignee-${index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                             {index === 0 ? 'アサイン' : ''}
                           </td>
                           <td className="px-4 py-4 text-sm text-gray-900 text-left">
                             <div className="flex justify-between items-center">
                               <span className="text-gray-700 font-medium">{role}</span>
                               <span className="text-gray-900">{name}</span>
                             </div>
                           </td>
                         </tr>
                       ))}
                    </React.Fragment>
                  ))
                ) : (
                  // 単一案件の場合（従来の構造）
                  <>
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">案件名</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {selectedPeriodDetailData.projectName}
                      </td>
                    </tr>
                                         <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">開始年月</td>
                       <td className="px-4 py-4 text-sm text-gray-900 text-left">
                         {selectedPeriodDetailData.startDate}
                       </td>
                     </tr>
                     <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">納品予定</td>
                       <td className="px-4 py-4 text-sm text-gray-900 text-left">
                         {selectedPeriodDetailData.deliveryDate}
                       </td>
                     </tr>
                     <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">売上</td>
                       <td className="px-4 py-4 text-sm text-gray-900 font-medium text-left">
                         {formatCurrency(selectedPeriodDetailData.sales || 0)}
                       </td>
                     </tr>
                     {Object.keys(selectedPeriodDetailData.outsourcing || {}).length > 0 ? (
                       Object.entries(selectedPeriodDetailData.outsourcing || {}).map(([company, data]: [string, any], index: number) => (
                         <tr key={`outsourcing-${index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                             {index === 0 ? '外注費' : ''}
                           </td>
                           <td className="px-4 py-4 text-sm text-gray-900 text-left">
                             <div className="flex justify-between items-center">
                               <span className="text-gray-700">{company}: {data.description}</span>
                               <span className="text-gray-900 font-medium">{formatCurrency(data.amount)}</span>
                             </div>
                           </td>
                         </tr>
                       ))
                     ) : (
                       <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">外注費</td>
                         <td className="px-4 py-4 text-sm text-gray-500 font-medium text-left">
                           外注費なし
                         </td>
                       </tr>
                     )}
                     <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利</td>
                       <td className="px-4 py-4 text-sm text-gray-900 font-medium text-left">
                         {formatCurrency(selectedPeriodDetailData.grossProfit || 0)}
                       </td>
                     </tr>
                     <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利率</td>
                       <td className="px-4 py-4 text-sm text-gray-900 text-left">
                         {selectedPeriodDetailData.grossProfitRate || 0}%
                       </td>
                     </tr>
                     {Object.entries(selectedPeriodDetailData.assignees || {}).map(([role, name], index: number) => (
                       <tr key={`assignee-${index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                           {index === 0 ? 'アサイン' : ''}
                         </td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           <div className="flex justify-between items-center">
                             <span className="text-gray-700 font-medium">{role}</span>
                             <span className="text-gray-900">{name}</span>
                           </div>
                         </td>
                       </tr>
                     ))}
                  </>
                )}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  )
} 