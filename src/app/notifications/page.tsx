'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');

  // サンプルデータ
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'システムメンテナンスのお知らせ',
      message: '2024年1月20日（土）22:00〜24:00の間、システムメンテナンスを実施いたします。',
      type: 'info',
      date: '2024-01-15 10:00',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '2',
      title: '請求書承認完了',
      message: '案件「農場A システム開発」の請求書が承認されました。',
      type: 'success',
      date: '2024-01-15 09:30',
      isRead: true,
      priority: 'low'
    },
    {
      id: '3',
      title: '新規案件登録',
      message: '新規案件「プライム企業D システム導入」が登録されました。',
      type: 'info',
      date: '2024-01-14 16:45',
      isRead: false,
      priority: 'high'
    },
    {
      id: '4',
      title: 'シフト変更のお知らせ',
      message: '1月16日のシフトが変更されました。ご確認ください。',
      type: 'warning',
      date: '2024-01-14 14:20',
      isRead: true,
      priority: 'medium'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { text: '低', color: 'bg-gray-100 text-gray-800' },
      medium: { text: '中', color: 'bg-yellow-100 text-yellow-800' },
      high: { text: '高', color: 'bg-red-100 text-red-800' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">お知らせ</h1>
        <p className="text-gray-600 mt-1">システムからのお知らせを確認できます</p>
      </div>

      {/* フィルター・操作 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全てのお知らせ</option>
              <option value="unread">未読のみ</option>
              <option value="info">お知らせ</option>
              <option value="warning">警告</option>
              <option value="error">エラー</option>
              <option value="success">成功</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              全て既読にする
            </button>
          </div>
        </div>
      </div>

      {/* お知らせ一覧 */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
              notification.isRead ? 'border-gray-200' : 'border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`text-lg font-semibold ${notification.isRead ? 'text-gray-900' : 'text-blue-900'}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        未読
                      </span>
                    )}
                    {getPriorityBadge(notification.priority)}
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <div className="text-sm text-gray-500">{notification.date}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm">
                  {notification.isRead ? '既読' : '既読にする'}
                </button>
                <button className="text-gray-600 hover:text-gray-900 text-sm">
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">該当するお知らせがありません</div>
        </div>
      )}
    </div>
  );
} 