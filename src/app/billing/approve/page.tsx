'use client';

import { useState } from 'react';
import UnifiedBillingModal from '@/components/billing/UnifiedBillingModal';

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
  rejectedBy?: string;
  rejectedAt?: string;
  comment?: string;
  reply?: string;
  items?: Array<{
    id: string;
    summary: string;
    unitPrice: number;
    quantity: number;
    amount: number;
    remarks: string;
  }>;
  taxRate?: number;
  billingDate?: string;
  dueDate?: string;
  notes?: string;
}

export default function BillingApprovePage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'approve' | 'reject'>('view');
  const [selectedApplication, setSelectedApplication] = useState<BillingApplication | null>(null);

  // サンプルデータ
  const applications: BillingApplication[] = [
    {
      id: '1',
      projectName: 'コンサルファームA システム開発',
      clientName: 'コンサルファームA株式会社',
      billingNumber: '202508312207',
      amount: 150000,
      status: 'pending',
      appliedAt: '2024-01-15',
      appliedBy: '田中太郎',
      billingDate: '2025-08-06',
      dueDate: '2025-09-06',
      taxRate: 10,
      notes: 'システム開発の請求書です',
      items: [
        {
          id: '1',
          summary: 'システム設計',
          unitPrice: 50000,
          quantity: 2,
          amount: 100000,
          remarks: '基本設計・詳細設計'
        },
        {
          id: '2',
          summary: 'システム開発',
          unitPrice: 25000,
          quantity: 2,
          amount: 50000,
          remarks: 'コーディング・テスト'
        }
      ]
    },
    {
      id: '2',
      projectName: 'プライム案件B 保守運用',
      clientName: 'プライム企業B',
      billingNumber: 'BILL-2-202401',
      amount: 80000,
      status: 'approved',
      appliedAt: '2024-01-10',
      appliedBy: '佐藤花子',
      approvedBy: '経理担当者A',
      approvedAt: '2024-01-12',
      billingDate: '2024-01-10',
      dueDate: '2024-02-10',
      taxRate: 10,
      notes: '保守運用の請求書です',
      items: [
        {
          id: '1',
          summary: '保守運用',
          unitPrice: 40000,
          quantity: 2,
          amount: 80000,
          remarks: '月次保守・運用'
        }
      ]
    },
    {
      id: '3',
      projectName: 'コンサルファームC 設備導入',
      clientName: 'コンサルファームC有限会社',
      billingNumber: 'BILL-3-202401',
      amount: 200000,
      status: 'rejected',
      appliedAt: '2024-08-01',
      appliedBy: '山田次郎',
      rejectedBy: '経理担当者B',
      rejectedAt: '2024-10-01',
      comment: '請求書の明細が不正確です。修正して再申請してください。',
      billingDate: '2024-08-01',
      dueDate: '2024-09-01',
      taxRate: 10,
      notes: '設備導入の請求書です',
      items: [
        {
          id: '1',
          summary: '設備導入',
          unitPrice: 200000,
          quantity: 1,
          amount: 200000,
          remarks: 'サーバー・ネットワーク機器'
        }
      ]
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
      rejected: { text: '差戻', color: 'bg-red-100 text-red-800' }
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
    console.log('一括承認:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkReject = () => {
    console.log('一括差戻:', selectedItems);
    setSelectedItems([]);
  };

  const handleAction = (application: BillingApplication, action: 'detail' | 'approve' | 'reject') => {
    setSelectedApplication(application);
    switch (action) {
      case 'detail':
        setModalMode('view');
        break;
      case 'approve':
        setModalMode('approve');
        break;
      case 'reject':
        setModalMode('reject');
        break;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const handleApprove = (id: string, comment?: string) => {
    console.log('承認:', id, comment);
    // 承認処理のロジック
    handleCloseModal();
  };

  const handleReject = (id: string, comment: string) => {
    console.log('差戻:', id, comment);
    // 差戻処理のロジック
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">請求承認</h1>
          <p className="text-gray-600 mt-1">請求書の承認・差戻を管理できます</p>
        </div>

        {/* タブ */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 -mb-px border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                承認待ち ({applications.filter(app => app.status === 'pending').length})
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
                差戻 ({applications.filter(app => app.status === 'rejected').length})
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
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBulkApprove}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      一括承認
                    </button>
                    <button
                      onClick={handleBulkReject}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      一括差戻
                    </button>
                  </div>
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
                        {application.projectName}
                      </div>
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
                        <button 
                          onClick={() => handleAction(application, 'detail')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          詳細
                        </button>
                        {activeTab === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAction(application, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              承認
                            </button>
                            <button 
                              onClick={() => handleAction(application, 'reject')}
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

        {/* 統一モーダル */}
        <UnifiedBillingModal
          isOpen={showModal}
          onClose={handleCloseModal}
          mode={modalMode}
          billing={selectedApplication}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
} 