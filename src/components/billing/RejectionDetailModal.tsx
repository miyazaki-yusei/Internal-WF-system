'use client';

import { useState } from 'react';

interface RejectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    id: string;
    projectName: string;
    clientName: string;
    amount: number;
    appliedAt: string;
    appliedBy: string;
    approvedBy: string;
    approvedAt: string;
    comment: string;
    reply?: string;
  } | null;
  onReply: (id: string, reply: string) => void;
}

export default function RejectionDetailModal({
  isOpen,
  onClose,
  application,
  onReply
}: RejectionDetailModalProps) {
  const [replyText, setReplyText] = useState(application?.reply || '');

  if (!isOpen || !application) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(application.id, replyText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">差戻し詳細</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {/* 案件情報 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">案件情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">案件名</label>
                <p className="text-sm text-gray-900">{application.projectName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
                <p className="text-sm text-gray-900">{application.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">請求金額</label>
                <p className="text-sm text-gray-900">{formatCurrency(application.amount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">申請者</label>
                <p className="text-sm text-gray-900">{application.appliedBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">申請日</label>
                <p className="text-sm text-gray-900">{application.appliedAt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">差戻し日</label>
                <p className="text-sm text-gray-900">{application.approvedAt}</p>
              </div>
            </div>
          </div>

          {/* 差戻しコメント */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">差戻しコメント</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400 fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 001-16 0c0-4.418 3.582-8 8-8s8 3.582 8 8a8 8 001-16 0zm-1.414-3.414a1 1 000-1.414 1.414L8.586 10l-1.293.293 10 10 1.414-1.414L10 11.414l1.293.293 10-10.414L11.414 10l1.293-1.293a1 1 000-1.414-1.414L10 8.586z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    <strong>差戻し担当者:</strong> {application.approvedBy}
                  </p>
                  <p className="text-sm text-red-800 mt-2">
                    {application.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* リプライ */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">リプライ</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                経理からのコメントに対して、必ずリプライを入力してください。
              </p>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="経理からのコメントに対するリプライを入力してください..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
            />
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              リプライ送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 