'use client'

import { useState } from 'react'
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  type: 'farm' | 'prime';
  status: 'active' | 'completed' | 'pending';
  client: string;
  amount: number;
  startDate: string;
  endDate: string;
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'farm' | 'prime'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // サンプルデータ
  const projects: Project[] = [
    {
      id: '1',
      name: '農場A システム開発',
      type: 'farm',
      status: 'active',
      client: '農場A株式会社',
      amount: 1500,
      startDate: '2024-11-15',
      endDate: '2024-06-30'
    },
    {
      id: '2',
      name: 'プライム案件B 保守運用',
      type: 'prime',
      status: 'active',
      client: 'プライム企業B',
      amount: 800,
      startDate: '2024-02-01',
      endDate: '2024-12-31'
    },
    {
      id: '3',
      name: '農場C 設備導入',
      type: 'farm',
      status: 'completed',
      client: '農場C有限会社',
      amount: 2000,
      startDate: '2023-10-01',
      endDate: '2024-03-31'
    },
    {
      id: '4',
      name: 'プライム案件D システム構築',
      type: 'prime',
      status: 'pending',
      client: 'プライム企業D',
      amount: 3000,
      startDate: '2024-04-01',
      endDate: '2024-09-30'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.type === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: '進行中', color: 'bg-green-100 text-green-800' },
      completed: { text: '完了', color: 'bg-blue-100 text-blue-800' },
      pending: { text: '待機中', color: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      farm: { text: 'ファーム案件', color: 'bg-orange-100 text-orange-800' },
      prime: { text: 'プライム案件', color: 'bg-purple-100 text-purple-800' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">案件一覧</h1>
          <p className="text-gray-600 mt-1">案件を選択して請求書を作成できます</p>
        </div>

        {/* フィルターと検索 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                案件タイプ
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'farm' | 'prime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべての案件</option>
                <option value="farm">ファーム案件</option>
                <option value="prime">プライム案件</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                検索
              </label>
              <input
                type="text"
                placeholder="案件名またはクライアント名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 案件一覧 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    クライアント
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期間
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
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(project.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(project.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {project.startDate} 〜 {project.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/billing/new?projectId=${project.id}`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                      >
                        請求書作成
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-50 text-lg font-medium text-gray-900 mb-2">該当する案件が見つかりません</div>
          </div>
        )}
      </div>
    </div>
  );
} 