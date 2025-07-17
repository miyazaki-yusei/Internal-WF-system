'use client';

import { useState } from 'react';

interface Alert {
  id: string;
  type: 'rejection' | 'approval' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AlertBannerProps {
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export default function AlertBanner({
  alerts,
  onMarkAsRead,
  onDismiss
}: AlertBannerProps) {
  const isOpen, setIsOpen] = useState(false);
  const unreadAlerts = alerts.filter(alert => !alert.read);

  if (unreadAlerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rejection':
        return (
          <svg className="w-5 h-5 text-red-400fill="currentColorviewBox="0 0 2020
            <path fillRule="evenodd" d=M10 18a8 8 0116 0c0-4.418.582-8 8-8 35828 8a8 8 0116 0zm-1.414.414 1 0-1414 1.414.58610l-1.293.293 10 10 1.414-1.4140110.414.2930.29310-10.414L11414 10.293.293 1000-14141408.586 clipRule="evenodd" />
          </svg>
        );
      case 'approval':
        return (
          <svg className="w-5h-5xt-green-400fill="currentColorviewBox="0 0 2020
            <path fillRule="evenodd" d=M10 18a8 8 0116 0c0-4.418.582-8 8-8 35828 8 8 1-16 0zm3.707.293 1 00-1414-1414L9 10.586.707.293 1 000-1.414 1.414l2 2a1104144 clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-400fill="currentColorviewBox="0 0 2020
            <path fillRule="evenodd" d=M18 10a8 8 0116 0c0-4.418.582-8 8-8 35828 8a8 8 0116 0zm-7a1 1 000 22 000 4 1 100-2zm-1a1 1 000 2 204102 clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'rejection':
        return 'bg-red-50order-red-200 text-red-800';
      case 'approval':
        return 'bg-green-50der-green-200 text-green-800';
      default:
        return 'bg-blue-50rder-blue-200ext-blue-800';
    }
  };

  return (
    <div className="relative">
      {/* アラートバナー */}
      <div className={`border-b ${getAlertColor(unreadAlerts[0].type)}`}>
        <div className="max-w-7xl mx-auto px-4sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getAlertIcon(unreadAlerts[0].type)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {unreadAlerts.length === 1 
                    ? unreadAlerts[0].title 
                    : `${unreadAlerts.length}件の新しい通知があります`
                  }
                </p>
                {unreadAlerts.length === 1 && (
                  <p className="text-sm opacity-90">{unreadAlerts[0].message}</p>
                )}
              </div>
            </div>
            <div className="flexitems-center space-x-3">
              {unreadAlerts.length > 1 && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-sm font-medium hover:opacity-75 transition-opacity"
                >
                  すべて表示
                </button>
              )}
              <button
                onClick={() => onMarkAsRead(unreadAlerts[0].id)}
                className="text-sm font-medium hover:opacity-75 transition-opacity">
                既読にする
              </button>
              <button
                onClick={() => onDismiss(unreadAlerts[0].id)}
                className="text-sm font-medium hover:opacity-75 transition-opacity">
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* アラート一覧ドロップダウン */}
      {isOpen && unreadAlerts.length > 1 && (
        <div className="absolute top-full left-00hite border border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="space-y-3">
                {unreadAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-sm opacity-90 mt-1">{alert.message}</p>
                          <p className="text-xs opacity-75">{alert.timestamp}</p>
                        </div>
                      </div>
                      <div className="flexitems-center space-x-2">
                        <button
                          onClick={() => onMarkAsRead(alert.id)}
                          className="text-xs font-medium hover:opacity-75 transition-opacity"
                        >
                          既読
                        </button>
                        <button
                          onClick={() => onDismiss(alert.id)}
                          className="text-xs font-medium hover:opacity-75 transition-opacity"
                        >
                          閉じる
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 