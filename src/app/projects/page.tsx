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
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">案件管理</h1>
        <p className="text-gray-600 mt-1">案件の登録、編集、進捗管理を行います</p>
      </div>

      {/* 検索・フィルター */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="案件名、クライアント名で検索..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全てのステータス</option>
              <option value="active">進行中</option>
              <option value="completed">完了</option>
              <option value="pending">未開始</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全ての種別</option>
              <option value="farm">ファーム案件</option>
              <option value="prime">プライム案件</option>
            </select>
            <Link
              href="/projects/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              新規案件登録
            </Link>
          </div>
        </div>
      </div>

      {/* 案件一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">案件一覧</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クライアント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  開始日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  終了予定日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(project.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.startDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(project.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 