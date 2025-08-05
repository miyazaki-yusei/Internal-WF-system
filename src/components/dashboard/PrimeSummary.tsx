import React, { useState, useEffect } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import { CurrencyYenIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'

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

// 売上見込みデータ（年別・月別）
const salesForecastData = {
  2024: [
    { month: '1月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '2月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '3月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '4月', forecast: 3000000, actual: 3000000, variance: 0, varianceRate: 0 },
    { month: '5月', forecast: 3000000, actual: 3000000, variance: 0, varianceRate: 0 },
    { month: '6月', forecast: 3000000, actual: 3000000, variance: 0, varianceRate: 0 },
    { month: '7月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '8月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '9月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '10月', forecast: 4000000, actual: 4000000, variance: 0, varianceRate: 0 },
    { month: '11月', forecast: 4000000, actual: 4000000, variance: 0, varianceRate: 0 },
    { month: '12月', forecast: 4000000, actual: 4000000, variance: 0, varianceRate: 0 },
  ],
  2025: [
    { month: '1月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '2月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '3月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '4月', forecast: 5000000, actual: 5000000, variance: 0, varianceRate: 0 },
    { month: '5月', forecast: 5000000, actual: 5000000, variance: 0, varianceRate: 0 },
    { month: '6月', forecast: 5000000, actual: 5000000, variance: 0, varianceRate: 0 },
    { month: '7月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '8月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '9月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '10月', forecast: 6000000, actual: 6000000, variance: 0, varianceRate: 0 },
    { month: '11月', forecast: 6000000, actual: 6000000, variance: 0, varianceRate: 0 },
    { month: '12月', forecast: 6000000, actual: 6000000, variance: 0, varianceRate: 0 },
  ],
  2026: [
    { month: '1月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '2月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '3月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '4月', forecast: 7000000, actual: 7000000, variance: 0, varianceRate: 0 },
    { month: '5月', forecast: 7000000, actual: 7000000, variance: 0, varianceRate: 0 },
    { month: '6月', forecast: 7000000, actual: 7000000, variance: 0, varianceRate: 0 },
    { month: '7月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '8月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '9月', forecast: 0, actual: 0, variance: 0, varianceRate: 0 },
    { month: '10月', forecast: 8000000, actual: 8000000, variance: 0, varianceRate: 0 },
    { month: '11月', forecast: 8000000, actual: 8000000, variance: 0, varianceRate: 0 },
    { month: '12月', forecast: 8000000, actual: 8000000, variance: 0, varianceRate: 0 },
  ],
}

// 各期間の詳細データ - プライム事業部
const periodDetailData = {
  '2024年上半期': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
    startDate: '2024年4月',
    deliveryDate: '2024年6月',
    sales: 3000000,
    outsourcing: {},
    grossProfit: 3000000,
    grossProfitRate: 100.0,
    assignees: {
      'PM': '田中'
    },
    revenueRecognitionMonth: '2024年6月'
  },
  '2024年下半期': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
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
    },
    revenueRecognitionMonth: '2024年12月'
  },
  '2024年通年': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
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
    },
    revenueRecognitionMonth: '2024年12月'
  },
  '2025年上半期': {
    projects: [
      {
        projectName: 'A社基幹システム開発',
        customerName: 'A社',
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
        },
        revenueRecognitionMonth: '2025年3月'
      },
      {
        projectName: 'B社業務コンサル',
        customerName: 'B社',
        startDate: '2025年4月',
        deliveryDate: '2025年6月',
        sales: 3000000,
        outsourcing: {},
        grossProfit: 3000000,
        grossProfitRate: 100.0,
        assignees: {
          'PM': '鈴木'
        },
        revenueRecognitionMonth: '2025年6月'
      }
    ]
  },
  '2025年下半期': {
    projects: [
      {
        projectName: 'A社基幹システム開発',
        customerName: 'A社',
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
        },
        revenueRecognitionMonth: '2025年9月'
      },
      {
        projectName: 'C社○○ツール開発',
        customerName: 'C社',
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
        },
        revenueRecognitionMonth: '2025年3月'
      }
    ]
  },
  '2025年通年': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
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
    },
    revenueRecognitionMonth: '2025年12月'
  },
  '2026年上半期': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
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
    },
    revenueRecognitionMonth: '2026年3月'
  },
  '2026年下半期': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
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
    },
    revenueRecognitionMonth: '2026年9月'
  },
  '2026年通年': {
    projectName: 'A社基幹システム開発',
    customerName: 'A社',
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
    },
    revenueRecognitionMonth: '2026年12月'
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
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  // ローカルストレージからプロジェクトを読み込み
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

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
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">プライム集計表</h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{selectedYear}年</span>
            の上半期・下半期・通年の売上・外注費・粗利を確認できます
          </p>
          
          {/* 期間設定エリア */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 w-fit">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">期間設定</label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">年:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
                 <div className="overflow-x-auto">
           <table className="w-full border border-gray-200 hover:border-blue-300 transition-colors duration-200">
             <thead>
               <tr className="border-b-2 border-gray-300">
                 <th className="w-1/4 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                 <th 
                   className={`w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 transition-all duration-200 cursor-pointer ${
                     selectedPeriod === '上半期' ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   <div className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium ${
                     selectedPeriod === '上半期' 
                       ? 'text-blue-700' 
                       : 'text-gray-900'
                   }`}>
                     {selectedYear}年上半期
                   </div>
                 </th>
                 <th 
                   className={`w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 transition-all duration-200 cursor-pointer ${
                     selectedPeriod === '下半期' ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   <div className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium ${
                     selectedPeriod === '下半期' 
                       ? 'text-blue-700' 
                       : 'text-gray-900'
                   }`}>
                     {selectedYear}年下半期
                   </div>
                 </th>
                 <th 
                   className={`w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 transition-all duration-200 cursor-pointer ${
                     selectedPeriod === '通年' ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('通年')}
                 >
                   <div className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium ${
                     selectedPeriod === '通年' 
                       ? 'text-blue-700' 
                       : 'text-gray-900'
                   }`}>
                     通年
                   </div>
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
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {formatCurrency(yearData.firstHalf.sales)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {formatCurrency(yearData.secondHalf.sales)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
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
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {formatCurrency(yearData.firstHalf.outsourcing)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {formatCurrency(yearData.secondHalf.outsourcing)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
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
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {formatCurrency(yearData.firstHalf.grossProfit)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {formatCurrency(yearData.secondHalf.grossProfit)}
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
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
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('上半期')}
                 >
                   {yearData.firstHalf.grossProfitRate}%
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '下半期' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
                   }`}
                   onClick={() => setSelectedPeriod('下半期')}
                 >
                   {yearData.secondHalf.grossProfitRate}%
                 </td>
                 <td 
                   className={`px-4 py-4 text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                     selectedPeriod === '通年' 
                       ? 'bg-blue-50 text-blue-700' 
                       : 'text-gray-900 hover:bg-gray-100'
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
                                             <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">案件名</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                           {project.projectName}
                         </td>
                       </tr>
                       <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">顧客名</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                           {project.customerName}
                         </td>
                       </tr>
                                             <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">開始年月</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.startDate}
                         </td>
                       </tr>
                       <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">納品予定</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.deliveryDate}
                         </td>
                       </tr>
                       <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">売上計上予定月</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.revenueRecognitionMonth}
                         </td>
                       </tr>
                       <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">売上</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium text-left">
                           {formatCurrency(project.sales || 0)}
                         </td>
                       </tr>
                       {Object.keys(project.outsourcing || {}).length > 0 ? (
                         Object.entries(project.outsourcing || {}).map(([company, data]: [string, any], index: number) => (
                           <tr 
                             key={`outsourcing-${index}`} 
                             className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                             onClick={() => {
                               // ローカルストレージから対応する案件データを取得
                               const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                               if (projectData) {
                                 setSelectedProject(projectData)
                               } else {
                                 // 案件データが見つからない場合は、内訳データを使用
                                 setSelectedProject({
                                   type: 'prime',
                                   formData: {
                                     name: project.projectName,
                                     customer: project.customerName || '-',
                                     startDate: project.startDate,
                                     deliveryDate: project.deliveryDate,
                                     revenueMonth: project.revenueRecognitionMonth,
                                     revenue: formatCurrency(project.sales || 0),
                                     expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                     laborCost: '0',
                                     memo: ''
                                   },
                                   teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                     id: role,
                                     role: role === 'PM' ? 'leader' : 'member',
                                     name: name as string,
                                     utilizationRate: '100',
                                     unitPrice: '0',
                                     incentive: '10'
                                   })),
                                   payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                     id: company,
                                     recipient: company,
                                     item: data.description,
                                     amount: formatCurrency(data.amount)
                                   })),
                                   budgetRatio: {
                                     salesBudget: '20',
                                     miscellaneousBudget: '4',
                                     incentiveBudget: '1.8'
                                   },
                                   budgetAmounts: {
                                     salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                     miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                     incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                                   }
                                 })
                               }
                               setShowProjectDetailModal(true)
                             }}
                           >
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
                         <tr 
                           className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => {
                             // ローカルストレージから対応する案件データを取得
                             const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                             if (projectData) {
                               setSelectedProject(projectData)
                             } else {
                               // 案件データが見つからない場合は、内訳データを使用
                               setSelectedProject({
                                 type: 'prime',
                                 formData: {
                                   name: project.projectName,
                                   customer: project.customerName || '-',
                                   startDate: project.startDate,
                                   deliveryDate: project.deliveryDate,
                                   revenueMonth: project.revenueRecognitionMonth,
                                   revenue: formatCurrency(project.sales || 0),
                                   expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                   laborCost: '0',
                                   memo: ''
                                 },
                                 teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                   id: role,
                                   role: role === 'PM' ? 'leader' : 'member',
                                   name: name as string,
                                   utilizationRate: '100',
                                   unitPrice: '0',
                                   incentive: '10'
                                 })),
                                 payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                   id: company,
                                   recipient: company,
                                   item: data.description,
                                   amount: formatCurrency(data.amount)
                                 })),
                                 budgetRatio: {
                                   salesBudget: '20',
                                   miscellaneousBudget: '4',
                                   incentiveBudget: '1.8'
                                 },
                                 budgetAmounts: {
                                   salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                   miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                   incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                                 }
                               })
                             }
                             setShowProjectDetailModal(true)
                           }}
                         >
                           <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">外注費</td>
                           <td className="px-4 py-4 text-sm text-gray-500 font-medium text-left">
                             外注費なし
                           </td>
                         </tr>
                       )}
                       <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利</td>
                         <td className="px-4 py-4 text-sm text-gray-900 font-medium text-left">
                           {formatCurrency(project.grossProfit || 0)}
                         </td>
                       </tr>
                       <tr 
                         className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           // ローカルストレージから対応する案件データを取得
                           const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                           if (projectData) {
                             setSelectedProject(projectData)
                           } else {
                             // 案件データが見つからない場合は、内訳データを使用
                             setSelectedProject({
                               type: 'prime',
                               formData: {
                                 name: project.projectName,
                                 customer: project.customerName || '-',
                                 startDate: project.startDate,
                                 deliveryDate: project.deliveryDate,
                                 revenueMonth: project.revenueRecognitionMonth,
                                 revenue: formatCurrency(project.sales || 0),
                                 expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                 laborCost: '0',
                                 memo: ''
                               },
                               teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                 id: role,
                                 role: role === 'PM' ? 'leader' : 'member',
                                 name: name as string,
                                 utilizationRate: '100',
                                 unitPrice: '0',
                                 incentive: '10'
                               })),
                               payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                 id: company,
                                 recipient: company,
                                 item: data.description,
                                 amount: formatCurrency(data.amount)
                               })),
                               budgetRatio: {
                                 salesBudget: '20',
                                 miscellaneousBudget: '4',
                                 incentiveBudget: '1.8'
                               },
                               budgetAmounts: {
                                 salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                 miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                 incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                               }
                             })
                           }
                           setShowProjectDetailModal(true)
                         }}
                       >
                         <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">粗利率</td>
                         <td className="px-4 py-4 text-sm text-gray-900 text-left">
                           {project.grossProfitRate || 0}%
                         </td>
                       </tr>
                       {Object.entries(project.assignees || {}).map(([role, name], index: number) => (
                         <tr 
                           key={`assignee-${index}`} 
                           className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => {
                             // ローカルストレージから対応する案件データを取得
                             const projectData = projects.find(p => p.formData.name === project.projectName && p.type === 'prime')
                             if (projectData) {
                               setSelectedProject(projectData)
                             } else {
                               // 案件データが見つからない場合は、内訳データを使用
                               setSelectedProject({
                                 type: 'prime',
                                 formData: {
                                   name: project.projectName,
                                   customer: project.customerName || '-',
                                   startDate: project.startDate,
                                   deliveryDate: project.deliveryDate,
                                   revenueMonth: project.revenueRecognitionMonth,
                                   revenue: formatCurrency(project.sales || 0),
                                   expenses: formatCurrency(Object.values(project.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                                   laborCost: '0',
                                   memo: ''
                                 },
                                 teamMembers: Object.entries(project.assignees || {}).map(([role, name]) => ({
                                   id: role,
                                   role: role === 'PM' ? 'leader' : 'member',
                                   name: name as string,
                                   utilizationRate: '100',
                                   unitPrice: '0',
                                   incentive: '10'
                                 })),
                                 payments: Object.entries(project.outsourcing || {}).map(([company, data]: [string, any]) => ({
                                   id: company,
                                   recipient: company,
                                   item: data.description,
                                   amount: formatCurrency(data.amount)
                                 })),
                                 budgetRatio: {
                                   salesBudget: '20',
                                   miscellaneousBudget: '4',
                                   incentiveBudget: '1.8'
                                 },
                                 budgetAmounts: {
                                   salesBudgetAmount: formatCurrency((project.sales || 0) * 0.2),
                                   miscellaneousBudgetAmount: formatCurrency((project.sales || 0) * 0.04),
                                   incentiveBudgetAmount: formatCurrency((project.sales || 0) * 0.018)
                                 }
                               })
                             }
                             setShowProjectDetailModal(true)
                           }}
                         >
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
                    <tr 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        // ローカルストレージから対応する案件データを取得
                        const projectData = projects.find(p => p.formData.name === selectedPeriodDetailData.projectName && p.type === 'prime')
                        if (projectData) {
                          setSelectedProject(projectData)
                        } else {
                          // 案件データが見つからない場合は、内訳データを使用
                          setSelectedProject({
                            type: 'prime',
                            formData: {
                              name: selectedPeriodDetailData.projectName,
                              customer: selectedPeriodDetailData.customerName || '-',
                              startDate: selectedPeriodDetailData.startDate,
                              deliveryDate: selectedPeriodDetailData.deliveryDate,
                              revenueMonth: selectedPeriodDetailData.revenueRecognitionMonth,
                              revenue: formatCurrency(selectedPeriodDetailData.sales || 0),
                              expenses: formatCurrency(Object.values(selectedPeriodDetailData.outsourcing || {}).reduce((sum: number, data: any) => sum + data.amount, 0)),
                              laborCost: '0',
                              memo: ''
                            },
                            teamMembers: Object.entries(selectedPeriodDetailData.assignees || {}).map(([role, name]) => ({
                              id: role,
                              role: role === 'PM' ? 'leader' : 'member',
                              name: name as string,
                              utilizationRate: '100',
                              unitPrice: '0',
                              incentive: '10'
                            })),
                            payments: Object.entries(selectedPeriodDetailData.outsourcing || {}).map(([company, data]: [string, any]) => ({
                              id: company,
                              recipient: company,
                              item: data.description,
                              amount: formatCurrency(data.amount)
                            })),
                            budgetRatio: {
                              salesBudget: '20',
                              miscellaneousBudget: '4',
                              incentiveBudget: '1.8'
                            },
                            budgetAmounts: {
                              salesBudgetAmount: formatCurrency((selectedPeriodDetailData.sales || 0) * 0.2),
                              miscellaneousBudgetAmount: formatCurrency((selectedPeriodDetailData.sales || 0) * 0.04),
                              incentiveBudgetAmount: formatCurrency((selectedPeriodDetailData.sales || 0) * 0.018)
                            }
                          })
                        }
                        setShowProjectDetailModal(true)
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">案件名</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {selectedPeriodDetailData.projectName}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">顧客名</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {String((selectedPeriodDetailData as any).customerName || '-')}
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
                       <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">売上計上予定月</td>
                       <td className="px-4 py-4 text-sm text-gray-900 text-left">
                         {(selectedPeriodDetailData as any).revenueRecognitionMonth || '-'}
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

      {/* 売上見込みテーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">売上見込み vs 実績</h3>
            <p className="text-sm text-gray-600">{selectedYear}年の月別売上見込みと実績の比較を確認できます</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="forecast-year-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">年:</label>
            <select
              id="forecast-year-select"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
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
          <table className="w-full border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">月</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上見込み</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">実績</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">差異</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">差異率</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">達成率</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {salesForecastData[selectedYear as '2024' | '2025' | '2026'].map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {item.month}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(item.forecast)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(item.actual)}
                  </td>
                  <td className={`px-4 py-4 text-sm text-right font-medium border-r border-gray-200 ${
                    item.variance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
                  </td>
                  <td className={`px-4 py-4 text-sm text-right font-medium border-r border-gray-200 ${
                    item.varianceRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.varianceRate >= 0 ? '+' : ''}{item.varianceRate}%
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {item.forecast > 0 ? ((item.actual / item.forecast) * 100).toFixed(1) : '-'}%
                  </td>
                </tr>
              ))}
              {/* 年間合計行 */}
              <tr className="bg-gray-50 border-t-2 border-gray-300">
                <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">年間合計</td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0))}
                </td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.actual, 0))}
                </td>
                <td className={`px-4 py-4 text-sm text-right font-bold border-r border-gray-200 ${
                  salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) >= 0 ? '+' : ''}
                  {formatCurrency(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0))}
                </td>
                <td className={`px-4 py-4 text-sm text-right font-bold border-r border-gray-200 ${
                  (salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) / Math.max(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0), 1) * 100) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) / Math.max(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0), 1) * 100) >= 0 ? '+' : ''}
                  {(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) / Math.max(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0), 1) * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                  {salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0) > 0 ? 
                    ((salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.actual, 0) / salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0)) * 100).toFixed(1) : '-'}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* プロジェクト詳細モーダル */}
      {showProjectDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">
                  プライム案件詳細
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // プロジェクトデータをローカルストレージに保存して編集ページに渡す
                      const editData = {
                        id: selectedProject.id || 'temp-id',
                        type: selectedProject.type,
                        formData: selectedProject.formData,
                        teamMembers: selectedProject.teamMembers,
                        payments: selectedProject.payments,
                        budgetRatio: selectedProject.budgetRatio,
                        budgetAmounts: selectedProject.budgetAmounts
                      };
                      localStorage.setItem('editProjectData', JSON.stringify(editData));
                      
                      // プライム案件登録ページに遷移
                      window.location.href = '/projects/new/prime';
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    編集
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    onClick={() => {
                      setShowProjectDetailModal(false);
                      setSelectedProject(null);
                    }}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
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
                      <span className="ml-3 text-gray-900">{selectedProject.formData.name}</span>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">顧客名:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.customer}</span>
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
                      <span className="font-medium text-gray-700 w-24">開始年月日:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.startDate}</span>
                    </div>
                    {selectedProject.formData.deliveryDate && (
                      <div className="flex items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 w-24">納品予定日:</span>
                        <span className="ml-3 text-gray-900">{selectedProject.formData.deliveryDate}</span>
                      </div>
                    )}
                    {selectedProject.formData.revenueMonth && (
                      <div className="flex items-center py-2">
                        <span className="font-medium text-gray-700 w-24">売上計上予定月:</span>
                        <span className="ml-3 text-gray-900">{selectedProject.formData.revenueMonth}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* アサイン情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    アサイン情報
                  </h4>
                  <div className="space-y-3">
                    {selectedProject.teamMembers.map((member: any, index: number) => (
                      <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">役割:</span>
                            <span className="ml-2 text-gray-900">
                              {member.role === 'leader' ? 'リーダー' : member.role === 'member' ? 'メンバー' : '外注'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">名前:</span>
                            <span className="ml-2 text-gray-900">{member.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">単価:</span>
                            <span className="ml-2 text-gray-900">{member.unitPrice}円</span>
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
                        <span className="ml-2 text-gray-900 font-semibold">{selectedProject.formData.revenue}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">労務費（概算）:</span>
                        <span className="ml-2 text-gray-900">{selectedProject.formData.laborCost}円</span>
                      </div>
                    </div>
                    
                    {/* その他支出項目 */}
                    {selectedProject.payments.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600 block mb-2">その他支出項目:</span>
                        <div className="space-y-2">
                          {selectedProject.payments.map((payment: any, index: number) => (
                            <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="font-medium text-gray-600">{payment.item}:</span>
                              <span className="text-gray-900">{payment.amount}円</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">支出合計:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{selectedProject.formData.expenses}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">粗利:</span>
                        <span className="ml-2 text-gray-900 font-semibold">
                          {(parseInt(selectedProject.formData.revenue.replace(/[^\d]/g, '')) - parseInt(selectedProject.formData.expenses.replace(/[^\d]/g, ''))).toLocaleString()}円
                        </span>
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
                        <span className="text-gray-600">{selectedProject.budgetRatio.salesBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.salesBudgetAmount}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">雑費予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.miscellaneousBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.miscellaneousBudgetAmount}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">インセンティブ予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.incentiveBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.incentiveBudgetAmount}円)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* メモ欄 */}
                {selectedProject.formData.memo && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      メモ欄
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                      <span className="whitespace-pre-wrap text-gray-900">{selectedProject.formData.memo}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-6 space-x-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowProjectDetailModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 