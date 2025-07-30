'use client';

import { useState } from 'react';

interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  lastGenerated: string;
  status: 'available' | 'generating' | 'error';
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('');

  // サンプルデータ
  const reports: Report[] = [
    {
      id: '1',
      name: '売上レポート',
      type: 'sales',
      description: '月次売上と利益の詳細レポート',
      lastGenerated: '2024-01-15 10:30',
      status: 'available'
    },
    {
      id: '2',
      name: '案件進捗レポート',
      type: 'projects',
      description: '案件の進捗状況と完了率のレポート',
      lastGenerated: '2024-01-14 16:45',
      status: 'available'
    },
    {
      id: '3',
      name: '請求書一覧',
      type: 'billing',
      description: '発行済み請求書の一覧レポート',
      lastGenerated: '2024-01-15 09:15',
      status: 'available'
    },
    {
      id: '4',
      name: 'シフト勤務表',
      type: 'shifts',
      description: '従業員の勤務時間とシフト表',
      lastGenerated: '2024-01-13 14:20',
      status: 'generating'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { text: '利用可能', color: 'bg-green-100 text-green-800' },
      generating: { text: '生成中', color: 'bg-yellow-100 text-yellow-800' },
      error: { text: 'エラー', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">帳票出力</h1>
        <p className="text-gray-600 mt-1">各種レポートの生成と出力を行います</p>
      </div>

      {/* フィルター・操作 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全ての種類</option>
              <option value="sales">売上レポート</option>
              <option value="projects">案件レポート</option>
              <option value="billing">請求書レポート</option>
              <option value="shifts">シフトレポート</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              一括生成
            </button>
          </div>
        </div>
      </div>

      {/* レポート一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                {getStatusBadge(report.status)}
              </div>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                最終生成: {report.lastGenerated}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  生成
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  ダウンロード
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 最近の生成履歴 */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">最近の生成履歴</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    レポート名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    生成日時
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    生成者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">売上レポート</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2024-01-15 10:30</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">田中太郎</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge('available')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      ダウンロード
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">案件進捗レポート</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2024-01-14 16:45</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">佐藤花子</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge('available')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      ダウンロード
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 