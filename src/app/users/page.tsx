'use client';

import { useState } from 'react';
import UserModal from '@/components/users/UserModal';
import { useUser } from '@/contexts/UserContext';

interface User {
  id: string;
  name: string;
  furigana: string;
  email: string;
  password: string;
  department: 'sales' | 'consulting' | 'regional' | 'accounting';
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function UsersPage() {
  const { isAdmin } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // サンプルデータ
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: '田中太郎',
      furigana: 'たなかたろう',
      email: 'tanaka@festal.co.jp',
      password: '',
      department: 'sales',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-15 09:30'
    },
    {
      id: '2',
      name: '佐藤花子',
      furigana: 'さとうはなこ',
      email: 'sato@festal.co.jp',
      password: '',
      department: 'consulting',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-15 08:45'
    },
    {
      id: '3',
      name: '鈴木一郎',
      furigana: 'すずきいちろう',
      email: 'suzuki@festal.co.jp',
      password: '',
      department: 'regional',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-14 17:20'
    },
    {
      id: '4',
      name: '山田次郎',
      furigana: 'やまだじろう',
      email: 'yamada@festal.co.jp',
      password: '',
      department: 'accounting',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 10:15'
    }
  ]);

  const getDepartmentName = (department: string) => {
    const departmentNames = {
      sales: '営業部',
      consulting: 'コンサルティング事業部',
      regional: '地方創生事業部',
      accounting: '経理部'
    };
    return departmentNames[department as keyof typeof departmentNames] || department;
  };

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
      admin: { color: 'bg-purple-100 text-purple-800' },
      user: { color: 'bg-blue-100 text-blue-800' }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || { color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {role === 'admin' ? '管理者' : '一般'}
      </span>
    );
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('このユーザーを削除しますか？')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      // 編集
      setUsers(users.map(user => 
        user.id === userData.id ? { ...userData, lastLogin: user.lastLogin } : user
      ));
    } else {
      // 新規作成
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        lastLogin: '-'
      };
      setUsers([...users, newUser]);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.furigana.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="text-gray-600 mt-1">システムユーザーの登録、編集、権限管理を行います</p>
        {!isAdmin && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>注意：</strong>権限とステータスの変更は管理者のみ可能です。
            </p>
          </div>
        )}
      </div>

      {/* 検索・操作 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ユーザー名、メールアドレス、ふりがなで検索..."
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
            {isAdmin && (
              <button 
                onClick={handleNewUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ユーザー登録
              </button>
            )}
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
                  ふりがな
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
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.furigana}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getDepartmentName(user.department)}</div>
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
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        編集
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ユーザー登録・編集モーダル */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
} 