'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BillingApplication {
  id: string;
  projectName: string;
  clientName: string;
  billingNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  appliedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  comment?: string;
}

export default function BillingApprovePage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [currentApplication, setCurrentApplication] = useState<BillingApplication | null>(null);

  // サンプルデータ
  const applications: BillingApplication[] = [
    {
      id: '1',
      projectName: '農場A システム開発',
      clientName: '農場A株式会社',
      billingNumber: 'BILL-1-202401',
      amount: 15000,
      status: 'pending',
      appliedAt: '2024-01-15',
      appliedBy: '田中太郎'
    },
    {
      id: '2',
      projectName: 'プライム案件B 保守運用',
      clientName: 'プライム企業B',
      billingNumber: 'BILL-2-202401',
      amount: 8000,
      status: 'approved',
      appliedAt: '2024-01-10',
      appliedBy: '佐藤花子',
      approvedBy: '経理担当者A',
      approvedAt: '2024-01-12'
    },
    {
      id: '3',
      projectName: '農場C 設備導入',
      clientName: '農場C有限会社',
      billingNumber: 'BILL-3-202401',
      amount: 20000,
      status: 'rejected',
      appliedAt: '2024-08-20',
      appliedBy: '山田次郎',
      approvedBy: '経理担当者B',
      approvedAt: '2024-10-20',
      comment: '請求書の明細が不正確です。修正して再申請してください。'
    }
  ];

  const filteredApplications = applications.filter(app => app.status === activeTab);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '申請中', color: 'bg-yellow-100 text-yellow-800' },
      approved: { text: '承認済み', color: 'bg-green-100 text-green-800' },
      rejected: { text: '差戻し', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredApplications.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredApplications.map(app => app.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedItems.length === 0) {
      alert('承認する申請を選択してください。');
      return;
    }
    
    // 一括承認処理
    console.log('一括承認:', selectedItems);
    alert(`${selectedItems.length}件の申請を承認しました。`);
    setSelectedItems([]);

  const handleReject = (application: BillingApplication) => {
    setCurrentApplication(application);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectComment.trim()) {
      alert('差戻し理由を入力してください。');
      return;
    }

    // 差戻し処理
    console.log('差戻し:', currentApplication?.id, rejectComment);
    alert('申請を差戻しました。');
    
    setShowRejectModal(false);
    setRejectComment('');
    setCurrentApplication(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">経理承認</h1>
          <p className="text-gray-600 mt-1">申請された請求書の承認・差戻しを行います</p>
        </div>

        {/* タブ */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <nav className="flex -mb-px space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 -mb-px border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                申請中 ({applications.filter(app => app.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 -mb-px border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                承認済み ({applications.filter(app => app.status === 'approved').length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 -mb-px border-b-2 font-medium text-sm ${
                  activeTab === 'rejected'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                差戻し ({applications.filter(app => app.status === 'rejected').length})
              </button>
            </nav>
          </div>

          {/* 一括操作ボタン */}
          {activeTab === 'pending' && filteredApplications.length > 0 && (
            <div className="px-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredApplications.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">全て選択</span>
                  </label>
                  {selectedItems.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedItems.length}件選択中
                    </span>
                  )}
                </div>
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    一括承認
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 申請一覧 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'pending' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredApplications.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求書番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    クライアント
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申請者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申請日
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
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(application.id)}
                          onChange={() => handleSelectItem(application.id)}
                          className="rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.billingNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.projectName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.clientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(application.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.appliedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.appliedAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          詳細
                        </button>
                        {activeTab === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-900">
                              承認
                            </button>
                            <button 
                              onClick={() => handleReject(application)}
                              className="text-red-600 hover:text-red-900"
                            >
                              差戻し
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">該当する申請がありません</div>
          </div>
        )}

        {/* 差戻しモーダル */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">差戻し理由</h2>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    差戻し理由 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="差戻し理由を入力してください..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectComment('');
                      setCurrentApplication(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={!rejectComment.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    差戻し
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 