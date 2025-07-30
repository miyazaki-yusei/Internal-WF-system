'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BillingCreateModal from '@/components/billing/BillingCreateModal';
import BillingRejectModal from '@/components/billing/BillingRejectModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BillingApplication {
  id: string;
  projectName: string;
  clientName: string;
  billingNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'resubmitted';
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

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [currentApplication, setCurrentApplication] = useState<BillingApplication | null>(null);
  const [showBillingCreateModal, setShowBillingCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBillingRejectModal, setShowBillingRejectModal] = useState(false);
  const [selectedRejectedBilling, setSelectedRejectedBilling] = useState<BillingApplication | null>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);

  // 検索・フィルター用のstate
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // タブ定義（ロール別に表示制御）
  const tabs = [
    { id: 'create', name: '案件一覧', showForAll: true },
    { id: 'reject', name: '差戻一覧', showForAll: true },
    { id: 'approved', name: '承認済一覧', showForAll: true },
    { id: 'approve', name: '承認・差戻し', showForAll: false } // 経理担当者のみ
  ];

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
    },
    {
      id: '4',
      projectName: '農場D システム保守',
      clientName: '農場D株式会社',
      billingNumber: 'BILL-4-202401',
      amount: 120000,
      status: 'resubmitted',
      appliedAt: '2024-01-20',
      appliedBy: '鈴木一郎'
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '申請済', color: 'bg-blue-100 text-blue-800' },
      approved: { text: '承認済', color: 'bg-green-100 text-green-800' },
      rejected: { text: '差戻', color: 'bg-red-100 text-red-800' },
      resubmitted: { text: '再申請済', color: 'bg-blue-100 text-blue-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    
    // undefinedチェックを追加
    if (!config) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getProjectStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: '進行中', color: 'bg-blue-100 text-blue-800' },
      completed: { text: '完了', color: 'bg-green-100 text-green-800' },
      pending: { text: '保留', color: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    
    // undefinedチェックを追加
    if (!config) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
    
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
    
    // undefinedチェックを追加
    if (!config) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {type}
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // フィルタリング関数
  const filterProjects = (projects: Project[]) => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || project.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const filterApplications = (applications: BillingApplication[]) => {
    return applications.filter(application => {
      const matchesSearch = searchTerm === '' || 
        application.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.billingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.appliedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
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
      default:
        break;
    }
  };

  const handleApprove = (application: BillingApplication) => {
    // 承認処理
    console.log('承認処理:', application.id);
    
    // ステータスを承認済に変更
    const updatedApplications = applications.map(app => 
      app.id === application.id 
        ? { 
            ...app, 
            status: 'approved' as const,
            approvedBy: getCurrentUser().name,
            approvedAt: new Date().toISOString()
          }
        : app
    );
    setApplications(updatedApplications);
    
    // SharePoint連携のプレースホルダー
    // TODO: 承認後にSharePointに保存し、メール送信する処理を実装
    console.log('SharePoint連携: 承認された請求書をSharePointに保存');
    console.log('メール送信: 承認された請求書をメールに添付して送信');
    
    alert('承認しました。請求書がSharePointに保存され、メールで送信されます。');
    
    // 選択状態をリセット
    if (selectedItems.includes(application.id)) {
      setSelectedItems(selectedItems.filter(id => id !== application.id));
    }
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
      alert('選択された項目がありません');
      return;
    }
    
    // 一括承認処理
    console.log('一括承認:', selectedItems);
    
    // 選択された申請のステータスを承認済に変更
    const updatedApplications = applications.map(app => 
      selectedItems.includes(app.id) 
        ? { 
            ...app, 
            status: 'approved' as const,
            approvedBy: getCurrentUser().name,
            approvedAt: new Date().toISOString()
          }
        : app
    );
    setApplications(updatedApplications);
    
    // SharePoint連携のプレースホルダー
    console.log('SharePoint連携: 一括承認された請求書をSharePointに保存');
    console.log('メール送信: 一括承認された請求書をメールに添付して送信');
    
    alert(`${selectedItems.length}件を承認しました。請求書がSharePointに保存され、メールで送信されます。`);
    setSelectedItems([]);
  };

  const handleReject = (application: BillingApplication) => {
    setCurrentApplication(application);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectComment.trim()) {
      alert('差戻し理由を入力してください');
      return;
    }
    
    console.log('差戻し処理:', currentApplication?.id, rejectComment);
    setShowRejectModal(false);
    setRejectComment('');
    setCurrentApplication(null);
    alert('差戻し処理が完了しました');
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

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getCurrentUser = () => {
    // 経理担当者を返すように変更
    return users[3]; // 山田次郎（経理担当者）
  };

  const canApprove = (user: User) => {
    return user.department === 'accounting' && user.role === 'admin';
  };

  const currentUser = getCurrentUser();
  const isAccountingUser = canApprove(currentUser);

  // 検索・フィルターコンポーネント
  const SearchAndFilterSection = ({ 
    showTypeFilter = false, 
    showStatusFilter = true,
    statusOptions = []
  }: {
    showTypeFilter?: boolean;
    showStatusFilter?: boolean;
    statusOptions?: { value: string; label: string }[];
  }) => (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex flex-wrap gap-4 items-center">
        {/* 検索ボックス */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* タイプフィルター */}
        {showTypeFilter && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">タイプ:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべて</option>
              <option value="farm">ファーム案件</option>
              <option value="prime">プライム案件</option>
            </select>
          </div>
        )}

        {/* ステータスフィルター */}
        {showStatusFilter && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">ステータス:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべて</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* クリアボタン */}
        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            クリア
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">請求管理</h1>
        <p className="text-gray-600 mt-1">請求書の作成、申請、承認・差戻しを行います</p>
      </div>

      {/* メインコンテンツ */}
      <div className="p-6">
        {/* タブ（ダッシュボードページと同様のデザイン） */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-2">
            {tabs.map((tab) => {
              // ロール別の表示制御
              if (!tab.showForAll && !isAccountingUser) {
                return null;
              }
              
              return (
                <button
                  key={tab.id}
                  className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700 bg-white'
                      : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">案件一覧</h2>
                  <p className="text-gray-600 mt-1">請求書作成対象の案件一覧</p>
                </div>
                <button
                  onClick={() => setShowBillingModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  請求書作成
                </button>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showTypeFilter={true}
                showStatusFilter={true}
                statusOptions={[
                  { value: 'active', label: '進行中' },
                  { value: 'completed', label: '完了' },
                  { value: 'pending', label: '保留' }
                ]}
              />
              
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
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterProjects(projects).map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getProjectStatusBadge(project.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleCreateBilling(project)}
                            className="text-blue-600 hover:text-blue-900"
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
          </div>
        )}

        {activeTab === 'reject' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">差戻一覧</h2>
                  <p className="text-gray-600 mt-1">申請済み・差戻し・再申請済みの請求書一覧</p>
                </div>
                <button
                  onClick={() => setShowBillingModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  請求書作成
                </button>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showStatusFilter={true}
                statusOptions={[
                  { value: 'pending', label: '申請済' },
                  { value: 'rejected', label: '差戻' },
                  { value: 'resubmitted', label: '再申請済' }
                ]}
              />
              
              {filterApplications(applications.filter(app => 
                app.status === 'pending' || 
                app.status === 'rejected' || 
                app.status === 'resubmitted'
              )).length > 0 ? (
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
                          請求金額
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
                      {filterApplications(applications.filter(app => 
                        app.status === 'pending' || 
                        app.status === 'rejected' || 
                        app.status === 'resubmitted'
                      )).map((application) => (
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
                            <div className="text-sm text-gray-900">
                              {formatCurrency(application.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.appliedBy}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(application.appliedAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(application.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {application.status === 'rejected' ? (
                              <button
                                onClick={() => handleRejectBilling(application)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                修正
                              </button>
                            ) : (application.status === 'pending' || application.status === 'resubmitted') && isAccountingUser ? (
                              <button
                                onClick={() => handleActionSelect(application, 'detail')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                確認
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">請求書がありません</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">承認済一覧</h2>
                  <p className="text-gray-600 mt-1">承認済みの請求書履歴を確認できます</p>
                </div>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showStatusFilter={false}
              />
              
              {filterApplications(applications.filter(app => app.status === 'approved')).length > 0 ? (
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
                          承認者
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          承認日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterApplications(applications.filter(app => app.status === 'approved')).map((application) => (
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
                            <div className="text-sm text-gray-900">{formatDate(application.appliedAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.approvedBy || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(application.approvedAt || '')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(application.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">承認済みの請求書がありません</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approve' && isAccountingUser && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">承認・差戻し</h2>
                  <p className="text-gray-600 mt-1">申請された請求書の承認・差戻しを行います</p>
                </div>
                <button
                  onClick={() => setShowBillingModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  請求書作成
                </button>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showStatusFilter={true}
                statusOptions={[
                  { value: 'pending', label: '申請中' }
                ]}
              />
              
              {/* 一括操作ボタン */}
              {filterApplications(applications.filter(app => app.status === 'pending')).length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filterApplications(applications.filter(app => app.status === 'pending')).length}
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
              
              {filterApplications(applications.filter(app => app.status === 'pending')).length > 0 ? (
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
                      {filterApplications(applications.filter(app => app.status === 'pending')).map((application) => (
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
                            <div className="text-sm text-gray-900">{formatDate(application.appliedAt)}</div>
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
                  <div className="text-gray-500 text-lg">承認待ちの請求書がありません</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* モーダル */}
        {showBillingCreateModal && (
          <BillingCreateModal
            isOpen={showBillingCreateModal}
            onClose={handleCloseBillingModal}
            selectedProject={selectedProject}
            projects={projects}
          />
        )}

        {showBillingRejectModal && selectedRejectedBilling && (
          <BillingRejectModal
            isOpen={showBillingRejectModal}
            onClose={handleCloseRejectModal}
            application={selectedRejectedBilling}
          />
        )}

        {/* 差戻しモーダル */}
        {showRejectModal && currentApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">差戻し理由</h3>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="差戻し理由を入力してください"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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