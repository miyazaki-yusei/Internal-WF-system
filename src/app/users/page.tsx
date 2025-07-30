'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // サンプルデータ
  const users: User[] = [
    {
      id: '1',
      name: '田中太郎',
      email: 'tanaka@festal.co.jp',
      department: '営業部',
      role: '一般ユーザー',
      status: 'active',
      lastLogin: '2024-01-15 09:30'
    },
    {
      id: '2',
      name: '佐藤花子',
      email: 'sato@festal.co.jp',
      department: 'コンサルティング事業部',
      role: '一般ユーザー',
      status: 'active',
      lastLogin: '2024-01-15 08:45'
    },
    {
      id: '3',
      name: '鈴木一郎',
      email: 'suzuki@festal.co.jp',
      department: '地方創生事業部',
      role: '一般ユーザー',
      status: 'active',
      lastLogin: '2024-01-14 17:20'
    },
    {
      id: '4',
      name: '山田次郎',
      email: 'yamada@festal.co.jp',
      department: '経理部',
      role: '管理者',
      status: 'active',
      lastLogin: '2024-01-15 10:15'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: '有効', color: 'bg-green-100 text-green-800' },
      inactive: { text: '無効', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      '管理者': { color: 'bg-purple-100 text-purple-800' },
      '一般ユーザー': { color: 'bg-blue-100 text-blue-800' }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || { color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="text-gray-600 mt-1">システムユーザーの登録、編集、権限管理を行います</p>
      </div>

      {/* 検索・操作 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ユーザー名、メールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全ての部署</option>
              <option value="sales">営業部</option>
              <option value="consulting">コンサルティング事業部</option>
              <option value="regional">地方創生事業部</option>
              <option value="accounting">経理部</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全てのステータス</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              ユーザー登録
            </button>
          </div>
        </div>
      </div>

      {/* ユーザー一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ユーザー一覧</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ユーザー名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終ログイン
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.lastLogin}</div>
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