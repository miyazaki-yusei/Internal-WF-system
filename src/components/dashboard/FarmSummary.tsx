import { useState } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts'
import { CurrencyYenIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

const kpi = {
  sales: 12000000,
  profit: 4000000,
  profitRate: 33.3,
}

const monthlyData = [
  { month: '1月', sales: 1000000, profit: 300000, profitRate: 28 },
  { month: '2月', sales: 1200000, profit: 400000, profitRate: 33 },
  { month: '3月', sales: 1100000, profit: 350000, profitRate: 31 },
  { month: '4月', sales: 1300000, profit: 400000, profitRate: 29 },
  { month: '5月', sales: 1400000, profit: 450000, profitRate: 32 },
  { month: '6月', sales: 1500000, profit: 500000, profitRate: 35 },
  { month: '7月', sales: 1600000, profit: 500000, profitRate: 38 },
  { month: '8月', sales: 1700000, profit: 500000, profitRate: 36 },
  { month: '9月', sales: 1800000, profit: 500000, profitRate: 34 },
  { month: '10月', sales: 1900000, profit: 500000, profitRate: 30 },
  { month: '11月', sales: 2000000, profit: 500000, profitRate: 27 },
  { month: '12月', sales: 2100000, profit: 500000, profitRate: 25 },
]

const detailsData: Record<string, Array<{
  customer: string
  member: string
  sales: number
  expense: number
  profit: number
}>> = {
  '1月': [
    { customer: 'A社', member: '田中', sales: 600000, expense: 400000, profit: 200000 },
    { customer: 'B社', member: '佐藤', sales: 400000, expense: 300000, profit: 100000 },
  ],
  '2月': [
    { customer: 'A社', member: '田中', sales: 700000, expense: 500000, profit: 200000 },
    { customer: 'C社', member: '鈴木', sales: 500000, expense: 300000, profit: 200000 },
  ],
  '3月': [
    { customer: 'B社', member: '佐藤', sales: 600000, expense: 400000, profit: 200000 },
    { customer: 'C社', member: '鈴木', sales: 500000, expense: 350000, profit: 150000 },
  ],
  // ...他の月も同様にダミーデータを追加
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function FarmSummary() {
  console.log('monthlyData:', monthlyData);
  const [selectedMonth, setSelectedMonth] = useState('1月')

  return (
    <div>
      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="売上合計"
          value={formatCurrency(kpi.sales)}
          icon={CurrencyYenIcon}
          color="blue"
        />
        <KPICard
          title="営業利益合計"
          value={formatCurrency(kpi.profit)}
          icon={ArrowTrendingUpIcon}
          color="green"
        />
        <KPICard
          title="営業利益率(%)"
          value={`${kpi.profitRate.toFixed(1)}%`}
          icon={ArrowTrendingUpIcon}
          color="yellow"
        />
      </div>

      {/* 売上高・営業利益の2本棒＋営業利益率折れ線グラフ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">月別 売上高・営業利益・営業利益率</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} label={{ value: '金額（円）', angle: -90, position: 'outsideLeft', dx: -28, dy: 0, fill: '#6b7280', fontSize: 12, textAnchor: 'middle' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#2563eb" fontSize={12} tickFormatter={(v) => `${v}%`} domain={[0, 40]} label={{ value: '営業利益率（%）', angle: 90, position: 'insideRight', fill: '#2563eb' }} />
              <Tooltip 
                formatter={(value: number, name: string, props) => {
                  if (props && props.dataKey === 'profitRate') return [`${value}%`, '営業利益率']
                  if (props && props.dataKey === 'sales') return [formatCurrency(value), '売上高']
                  if (props && props.dataKey === 'profit') return [formatCurrency(value), '営業利益']
                  return [value, name]
                }}
              />
              <Legend verticalAlign="top" height={36}
                formatter={(value) => {
                  if (value === 'sales') return <span style={{color:'#3b82f6'}}>売上高</span>;
                  if (value === 'profit') return <span style={{color:'#10b981'}}>営業利益</span>;
                  if (value === 'profitRate') return <span style={{color:'#2563eb'}}>営業利益率</span>;
                  return value;
                }}
                payload={[
                  { value: '売上高', type: 'rect', id: 'sales', color: '#3b82f6' },
                  { value: '営業利益', type: 'rect', id: 'profit', color: '#10b981' },
                  { value: '営業利益率', type: 'line', id: 'profitRate', color: '#2563eb' },
                ]}
              />
              <Bar yAxisId="left" dataKey="sales" name="売上高" fill="#3b82f6" barSize={20} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="sales" position="top" formatter={formatCurrency} fontSize={10} />
              </Bar>
              <Bar yAxisId="left" dataKey="profit" name="営業利益" fill="#10b981" barSize={20} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="profit" position="top" formatter={formatCurrency} fontSize={10} />
              </Bar>
              <Line
                yAxisId="right"
                type="linear"
                dataKey="profitRate"
                name="営業利益率"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#fff', stroke: '#2563eb', strokeWidth: 3 }}
                isAnimationActive={false}
                connectNulls={true}
                strokeDasharray="4 2"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 月選択＋内訳テーブル */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mr-4">月別内訳</h3>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {monthlyData.map((m) => (
              <option key={m.month} value={m.month}>{m.month}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">顧客名</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">アサインメンバー</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">売上</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">支出</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">営業利益</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {(detailsData[selectedMonth] || []).map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 whitespace-nowrap">{row.customer}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.member}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">{formatCurrency(row.sales)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">{formatCurrency(row.expense)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">{formatCurrency(row.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 