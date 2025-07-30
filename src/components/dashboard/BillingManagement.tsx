'use client';

import { useState } from 'react';
import Link from 'next/link';
import BillingCreateModal from '@/components/billing/BillingCreateModal';
import BillingRejectModal from '@/components/billing/BillingRejectModal';

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

interface User {
  id: string;
  name: string;
  department: 'sales' | 'consulting' | 'regional' | 'accounting';
  role: 'user' | 'admin';
  email: string;
}

// ユーザー設定
const users: User[] = [
  {
    id: '1',
    name: '田中太郎',
    department: 'sales',
    role: 'user',
    email: 'tanaka@festal.co.jp'
  },
  {
    id: '2',
    name: '佐藤花子',
    department: 'consulting',
    role: 'user',
    email: 'sato@festal.co.jp'
  },
  {
    id: '3',
    name: '鈴木一郎',
    department: 'regional',
    role: 'user',
    email: 'suzuki@festal.co.jp'
  },
  {
    id: '4',
    name: '山田次郎',
    department: 'accounting',
    role: 'admin',
    email: 'yamada@festal.co.jp'
  }
];

const getDepartmentName = (department: string) => {
  const departmentNames = {
    sales: '営業部',
    consulting: 'コンサルティング事業部',
    regional: '地方創生事業部',
    accounting: '経理部'
  };
  return departmentNames[department as keyof typeof departmentNames] || department;
};

interface Project {
  id: string;
  name: string;
  type: 'farm' | 'prime';
  status: 'active' | 'completed' | 'pending';
  client: string;
  amount: number;
}

interface BillingManagementProps {
  activeTab: string;
}

export default function BillingManagement({ activeTab }: BillingManagementProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [currentApplication, setCurrentApplication] = useState<BillingApplication | null>(null);
  const [showBillingCreateModal, setShowBillingCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBillingRejectModal, setShowBillingRejectModal] = useState(false);
  const [selectedRejectedBilling, setSelectedRejectedBilling] = useState<BillingApplication | null>(null);

  // サンプルデータ
  const applications: BillingApplication[] = [
    {
      id: '1',
      projectName: '農場A システム開発',
      clientName: '農場A株式会社',
      billingNumber: 'BILL-1-202401',
      amount: 150000,
      status: 'pending',
      appliedAt: '2024-01-15',
      appliedBy: '田中太郎'
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
      approvedAt: '2024-01-12'
    },
    {
      id: '3',
      projectName: '農場C 設備導入',
      clientName: '農場C有限会社',
      billingNumber: 'BILL-3-202401',
      amount: 200000,
      status: 'rejected',
      appliedAt: '2024-08-01',
      appliedBy: '山田次郎',
      approvedBy: '経理担当者B',
      approvedAt: '2024-10-01',
      comment: '請求書の明細が不正確です。修正して再申請してください。'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: '農場A システム開発',
      type: 'farm',
      status: 'active',
      client: '農場A株式会社',
      amount: 150000
    },
    {
      id: '2',
      name: 'プライム案件B 保守運用',
      type: 'prime',
      status: 'active',
      client: 'プライム企業B',
      amount: 80000
    },
    {
      id: '3',
      name: '農場C 設備導入',
      type: 'farm',
      status: 'completed',
      client: '農場C有限会社',
      amount: 200000
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

  const handleSelectAll = () => {
    const filteredApplications = applications.filter(app => app.status === 'pending');
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
    console.log('一括承認:', selectedItems);
    alert(`${selectedItems.length}件の申請を承認しました。`);
    setSelectedItems([]);
  };

  const handleReject = (application: BillingApplication) => {
    setCurrentApplication(application);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectComment.trim()) {
      alert('差戻し理由を入力してください。');
      return;
    }
    console.log('差戻し:', currentApplication?.id, rejectComment);
    alert('申請を差戻しました。');
    setShowRejectModal(false);
    setRejectComment('');
    setCurrentApplication(null);
  };

  const handleCreateBilling = (project?: Project) => {
    setSelectedProject(project || null);
    setShowBillingCreateModal(true);
  };

  const handleCloseBillingModal = () => {
    setShowBillingCreateModal(false);
    setSelectedProject(null);
  };

  const handleRejectBilling = (application: BillingApplication) => {
    setSelectedRejectedBilling(application);
    setShowBillingRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowBillingRejectModal(false);
    setSelectedRejectedBilling(null);
  };

  const handleActionSelect = (application: BillingApplication, action: string) => {
    switch (action) {
      case 'detail':
        console.log('詳細確認:', application.id);
        // 詳細確認の処理
        break;
      case 'approve':
        console.log('承認:', application.id);
        handleApprove(application);
        break;
      case 'reject':
        handleReject(application);
        break;
      case 'reject_billing':
        handleRejectBilling(application);
        break;
      default:
        break;
    }
  };

  const handleApprove = (application: BillingApplication) => {
    // 承認処理
    console.log('承認処理:', application.id);
    
    // SharePoint連携のプレースホルダー
    // TODO: 承認後にSharePointに保存し、メール送信する処理を実装
    console.log('SharePoint連携: 承認された請求書をSharePointに保存');
    console.log('メール送信: 承認された請求書をメールに添付して送信');
    
    alert('承認しました。請求書がSharePointに保存され、メールで送信されます。');
  };

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId) || null;
  };

  const getCurrentUser = () => {
    // 実際の実装では認証システムから取得
    return users[0]; // 仮に最初のユーザーを返す
  };

  const canApprove = (user: User) => {
    return user.department === 'accounting' && user.role === 'admin';
  };

  // 請求書作成タブ
  if (activeTab === 'create') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">請求書作成</h2>
              <p className="text-gray-600 mt-1">案件を選択して請求書を作成できます</p>
            </div>
            <button
              onClick={() => handleCreateBilling()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              新規請求書作成
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    クライアント
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
                      <div className="text-sm font-medium text-gray-900">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(project.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(project.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleCreateBilling(project)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                      >
                        請求書作成
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 請求書作成モーダル */}
        <BillingCreateModal
          isOpen={showBillingCreateModal}
          onClose={handleCloseBillingModal}
          selectedProject={selectedProject}
          projects={projects}
        />
      </div>
    );
  }

  // 申請一覧タブ
  if (activeTab === 'apply') {
    const pendingApplications = applications.filter(app => app.status === 'pending');
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">申請一覧</h2>
              <p className="text-gray-600 mt-1">申請中の請求書一覧</p>
            </div>
            <button
              onClick={() => handleCreateBilling()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              請求書作成
            </button>
          </div>
          
          {pendingApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                  {pendingApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
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
                        <select
                          onChange={(e) => handleActionSelect(application, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          defaultValue=""
                        >
                          <option value="">選択</option>
                          <option value="detail">詳細確認</option>
                          <option value="approve">承認</option>
                          <option value="reject">差戻し</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">申請中の請求書がありません</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 承認・差戻しタブ（経理担当者のみ）
  if (activeTab === 'approve') {
    const pendingApplications = applications.filter(app => app.status === 'pending');
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">承認・差戻し</h2>
              <p className="text-gray-600 mt-1">申請された請求書の承認・差戻しを行います</p>
            </div>
            <button
              onClick={() => handleCreateBilling()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              請求書作成
            </button>
          </div>
          
          {/* 一括操作ボタン */}
          {pendingApplications.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === pendingApplications.length}
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
          
          {pendingApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === pendingApplications.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
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
                  {pendingApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(application.id)}
                          onChange={() => handleSelectItem(application.id)}
                          className="rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
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
                        <select
                          onChange={(e) => handleActionSelect(application, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          defaultValue=""
                        >
                          <option value="">選択</option>
                          <option value="detail">詳細確認</option>
                          <option value="approve">承認</option>
                          <option value="reject">差戻し</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">承認待ちの申請がありません</div>
            </div>
          )}
        </div>

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
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    差戻し
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 差戻し案件タブ
  if (activeTab === 'reject') {
    const rejectedApplications = applications.filter(app => app.status === 'rejected');
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">差戻し案件</h2>
              <p className="text-gray-600 mt-1">差戻された請求書の修正・再申請を行います</p>
            </div>
            <button
              onClick={() => handleCreateBilling()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              請求書作成
            </button>
          </div>
          
          {rejectedApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      差戻し日
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
                  {rejectedApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
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
                        <div className="text-sm text-gray-900">{application.approvedAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          onChange={(e) => handleActionSelect(application, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          defaultValue=""
                        >
                          <option value="">選択</option>
                          <option value="detail">詳細確認</option>
                          <option value="reject_billing">修正・再申請</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">差戻し案件がありません</div>
            </div>
          )}
        </div>

        {/* 請求書作成モーダル */}
        <BillingCreateModal
          isOpen={showBillingCreateModal}
          onClose={handleCloseBillingModal}
          selectedProject={selectedProject}
          projects={projects}
        />

        {/* 修正・再申請モーダル */}
        <BillingRejectModal
          isOpen={showBillingRejectModal}
          onClose={handleCloseRejectModal}
          billing={selectedRejectedBilling}
        />
      </div>
    );
  }

  return null;
} 