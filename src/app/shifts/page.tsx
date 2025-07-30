'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Shift {
  id: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export default function ShiftsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // サンプルデータ
  const shifts: Shift[] = [
    {
      id: '1',
      employeeName: '田中太郎',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '17:00',
      project: '農場A システム開発',
      status: 'completed'
    },
    {
      id: '2',
      employeeName: '佐藤花子',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '18:00',
      project: 'プライム案件B 保守運用',
      status: 'in-progress'
    },
    {
      id: '3',
      employeeName: '鈴木一郎',
      date: '2024-01-16',
      startTime: '08:30',
      endTime: '16:30',
      project: '農場C 設備導入',
      status: 'scheduled'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { text: '予定', color: 'bg-blue-100 text-blue-800' },
      'in-progress': { text: '作業中', color: 'bg-yellow-100 text-yellow-800' },
      completed: { text: '完了', color: 'bg-green-100 text-green-800' },
      cancelled: { text: 'キャンセル', color: 'bg-red-100 text-red-800' }
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
        <h1 className="text-3xl font-bold text-gray-900">シフト管理</h1>
        <p className="text-gray-600 mt-1">従業員のシフトスケジュールを管理します</p>
      </div>

      {/* フィルター・操作 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全ての従業員</option>
              <option value="tanaka">田中太郎</option>
              <option value="sato">佐藤花子</option>
              <option value="suzuki">鈴木一郎</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全てのステータス</option>
              <option value="scheduled">予定</option>
              <option value="in-progress">作業中</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              シフト登録
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              一括登録
            </button>
          </div>
        </div>
      </div>

      {/* シフト一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">シフト一覧</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  従業員名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件
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
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{shift.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shift.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shift.startTime} - {shift.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shift.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(shift.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      編集
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      削除
                    </button>
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