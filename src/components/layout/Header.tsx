'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  department: 'sales' | 'consulting' | 'regional' | 'accounting';
  role: 'user' | 'admin';
  email: string;
}

const getDepartmentName = (department: string) => {
  const departmentNames = {
    sales: '営業部',
    consulting: 'コンサルティング事業部',
    regional: '地方創生事業部',
    accounting: '経理部'
  };
  return departmentNames[department as keyof typeof departmentNames] || department;
};

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 仮のユーザー情報（実際の実装では認証システムから取得）
  const currentUser: User = {
    id: '1',
    name: '田中太郎',
    department: 'sales',
    role: 'user',
    email: 'tanaka@festal.co.jp'
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Festal基幹システム
            </Link>
          </div>

          {/* ユーザーメニュー */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-500">{getDepartmentName(currentUser.department)}</div>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{currentUser.email}</div>
                  <div className="text-xs text-gray-500">{getDepartmentName(currentUser.department)}</div>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  プロフィール設定
                </Link>
                <button
                  onClick={() => {
                    // ログアウト処理
                    console.log('ログアウト');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 