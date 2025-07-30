'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BillingCreateModal from '@/components/billing/BillingCreateModal';
import BillingRejectModal from '@/components/billing/BillingRejectModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEmailTemplates } from '@/contexts/EmailTemplateContext';

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

// 新しい業務フロー用のインターフェース
interface BillingFlow {
  step: 'project-selection' | 'content-confirmation' | 'content-input' | 'email-confirmation' | 'preview' | 'accounting-application' | 'billing-edit' | 'email-edit';
  selectedProject?: Project;
  billingContent?: {
    title: string;
    description: string;
    amount: number;
    details: string[];
  };
  emailContent?: {
    subject: string;
    body: string;
    to: string;
    cc?: string;
  };
  additionalMessage?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'farm' | 'prime' | 'general';
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

  // 新しい業務フロー用のステート
  const [billingFlow, setBillingFlow] = useState<BillingFlow>({
    step: 'project-selection'
  });

  // メールテンプレートコンテキストを使用
  const { getTemplateByType } = useEmailTemplates();
  const [showBillingRejectModal, setShowBillingRejectModal] = useState(false);
  const [selectedRejectedBilling, setSelectedRejectedBilling] = useState<BillingApplication | null>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  
  // プレビュー・承認・差戻用の状態
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewApplication, setPreviewApplication] = useState<BillingApplication | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [confirmApplication, setConfirmApplication] = useState<BillingApplication | null>(null);

  // 検索・フィルター用のstate
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // タブ定義（ロール別に表示制御）
  const tabs = [
    { id: 'create', name: '案件', showForAll: true },
    { id: 'reject', name: '差戻修正', showForAll: true },
    { id: 'approve', name: '承認・差戻', showForAll: false } // 経理担当者のみ
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
    },
    {
      id: '5',
      projectName: '農場E システム改修（再申請）',
      clientName: '農場E株式会社',
      billingNumber: 'BILL-5-202401',
      amount: 180000,
      status: 'pending',
      appliedAt: '2024-01-25',
      appliedBy: '高橋美咲'
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
    if (action === 'preview') {
      setPreviewApplication(application);
      setShowPreviewModal(true);
    } else if (action === 'approve') {
      setConfirmAction('approve');
      setConfirmApplication(application);
      setShowConfirmModal(true);
    } else if (action === 'reject') {
      setConfirmAction('reject');
      setConfirmApplication(application);
      setShowConfirmModal(true);
    } else if (action === 'edit') {
      handleRejectBilling(application);
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

  const handleRejectBillingSave = (application: BillingApplication, updatedContent: any) => {
    // 差戻修正の保存処理
    console.log('差戻修正保存:', application, updatedContent);
    
    // 修正コメントを取得
    const correctionComment = updatedContent.correctionComment || '';
    
    // 実際の実装では、APIを呼び出してデータを更新
    // ここではサンプルデータを更新
    const updatedApplications = applications.map(app => 
      app.id === application.id 
        ? { 
            ...app, 
            status: 'resubmitted' as const, // 再申請済ステータスに変更
            projectName: updatedContent.title, // 修正されたタイトルを反映
            amount: updatedContent.amount, // 修正された金額を反映
            appliedAt: new Date().toISOString().split('T')[0], // 再申請日を更新
            comment: correctionComment // 修正コメントを保存
          }
        : app
    );
    
    setApplications(updatedApplications);
    
    // 状態を更新（実際の実装では適切な状態管理を使用）
    console.log('申請ステータスを再申請済に更新し、承認・差戻タブに表示');
    console.log('修正コメント:', correctionComment);
    
    // 成功メッセージを表示（実際の実装では適切な通知システムを使用）
    alert('修正完了！再申請が承認・差戻タブに送信されました。');
  };

  const handleCloseRejectModal = () => {
    setShowBillingRejectModal(false);
    setSelectedRejectedBilling(null);
  };

  // 新しい業務フロー用の関数
  const handleProjectSelection = (project: Project) => {
    // 案件選択後、直接プレビュー画面に進む
    const defaultBillingContent = {
      title: `${project.name} システム開発`,
      description: `${project.name}のシステム開発業務を実施いたしました。`,
      amount: project.amount,
      details: ['要件定義', '設計', '開発', 'テスト', '運用支援']
    };

    const template = getEmailTemplate(project.type);
    const emailContent = replaceTemplateVariables(template, project, defaultBillingContent);

    setBillingFlow({
      step: 'preview',
      selectedProject: project,
      billingContent: defaultBillingContent,
      emailContent: emailContent
    });
  };

  const handleContentConfirmation = (content: any) => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'email-confirmation',
      billingContent: content
    }));
  };

  const handleContentInput = (content: any) => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'email-confirmation',
      billingContent: content
    }));
  };

  const handleEmailConfirmation = (emailContent: any) => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'preview',
      emailContent
    }));
  };

  const handlePreview = () => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'accounting-application'
    }));
  };

  const handleEditBillingContent = () => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'billing-edit'
    }));
  };

  const handleEditEmailContent = () => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'email-edit'
    }));
  };

  const handleBillingContentSave = (content: any) => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'preview',
      billingContent: content
    }));
  };

  const handleEmailContentSave = (emailContent: any) => {
    setBillingFlow(prev => ({
      ...prev,
      step: 'preview',
      emailContent: emailContent
    }));
  };

  const handleAccountingApplication = () => {
    // 最終確認モーダルを表示
    setShowConfirmModal(true);
    setConfirmAction('apply');
    setConfirmApplication({
      id: `billing-${Date.now()}`,
      projectName: billingFlow.selectedProject?.name || '',
      clientName: billingFlow.selectedProject?.client || '',
      billingNumber: `BILL-${Date.now()}`,
      amount: billingFlow.billingContent?.amount || 0,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      appliedBy: getCurrentUser().name
    });
  };

  const handleConfirmApply = () => {
    // 実際の申請処理
    console.log('経理申請完了:', billingFlow);
    
    // 新しい請求申請を追加（ステータス：申請済み）
    const newApplication: BillingApplication = {
      id: `billing-${Date.now()}`,
      projectName: billingFlow.selectedProject?.name || '',
      clientName: billingFlow.selectedProject?.client || '',
      billingNumber: `BILL-${Date.now()}`,
      amount: billingFlow.billingContent?.amount || 0,
      status: 'pending', // 申請済みステータス
      appliedAt: new Date().toISOString().split('T')[0],
      appliedBy: getCurrentUser().name
    };
    
    setApplications(prev => [...prev, newApplication]);
    
    // モーダルを閉じて案件選択に戻る
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmApplication(null);
    setBillingFlow({ step: 'project-selection' });
    
    alert('経理申請が完了しました。申請は承認・差戻タブで確認できます。');
  };

  const getEmailTemplate = (type: 'farm' | 'prime') => {
    return getTemplateByType(type) || getTemplateByType('general');
  };

  const replaceTemplateVariables = (template: EmailTemplate, project: Project, billingContent: any, additionalMessage: string = '') => {
    let subject = template.subject;
    let body = template.body;

    // テンプレート変数を置換
    subject = subject.replace('{{clientName}}', project.client);
    body = body.replace('{{clientName}}', project.client);
    body = body.replace('{{billingContent}}', billingContent.description);
    body = body.replace('{{amount}}', formatCurrency(billingContent.amount));
    body = body.replace('{{additionalMessage}}', additionalMessage);

    return { subject, body };
  };

  // 通知件数を計算する関数
  const getNotificationCount = (tabId: string) => {
    switch (tabId) {
      case 'reject':
        // 差戻修正タブ：差戻一覧の件数（rejectedステータスのみ）
        return applications.filter(app => app.status === 'rejected').length;
      case 'approve':
        // 承認・差戻タブ：申請中の件数（経理担当者のみ）
        return isAccountingUser ? applications.filter(app => app.status === 'pending').length : 0;
      default:
        return 0;
    }
  };

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getCurrentUser = () => {
    // 山田次郎（経理部管理者）を確実に返す
    return {
      id: '4',
      name: '山田次郎',
      department: 'accounting',
      role: 'admin',
      email: 'yamada@festal.co.jp'
    };
  };

  const canApprove = (user: User) => {
    return user.department === 'accounting' && user.role === 'admin';
  };

  const currentUser = getCurrentUser();
  const isAccountingUser = canApprove(currentUser);
  
  // デバッグ用ログ
  console.log('Current User:', currentUser);
  console.log('Is Accounting User:', isAccountingUser);

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
                  className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors relative ${
                    activeTab === tab.id
                      ? tab.id === 'approve' 
                        ? 'border-orange-400 text-orange-600 bg-white'
                        : 'border-blue-600 text-blue-700 bg-white'
                      : tab.id === 'approve'
                        ? 'border-transparent text-gray-500 bg-orange-50 hover:text-orange-600'
                        : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="flex items-center">
                    {tab.name}
                    {/* アラートバッジ */}
                    {(tab.id === 'reject' || tab.id === 'approve') && getNotificationCount(tab.id) > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-md px-2 py-1 min-w-[20px] flex items-center justify-center shadow-sm border border-red-600 font-medium">
                        {getNotificationCount(tab.id) > 9 ? '9+' : getNotificationCount(tab.id)}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {billingFlow.step === 'project-selection' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">案件選択</h2>
                    <p className="text-gray-600 mt-1">請求書作成対象の案件を選択してください</p>
                  </div>
                  <button
                    onClick={() => setShowBillingModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    新規請求作成
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
                          アクション
                        </th>
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterProjects(projects).map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleProjectSelection(project)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              請求作成
                            </button>
                          </td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {billingFlow.step === 'content-confirmation' && billingFlow.selectedProject && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">請求内容確認</h2>
                    <p className="text-gray-600 mt-1">ファーム案件の請求内容を確認してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow({ step: 'project-selection' })}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">案件情報</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">案件名:</span>
                        <span className="ml-2">{billingFlow.selectedProject.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">クライアント:</span>
                        <span className="ml-2">{billingFlow.selectedProject.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">金額:</span>
                        <span className="ml-2">{formatCurrency(billingFlow.selectedProject.amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">請求内容</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">タイトル</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={`${billingFlow.selectedProject.name} システム開発`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">詳細</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={4}
                          defaultValue={`${billingFlow.selectedProject.name}のシステム開発業務を実施いたしました。\n\n実施内容:\n- 要件定義\n- 設計\n- 開発\n- テスト\n- 運用支援`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleContentConfirmation({
                        title: `${billingFlow.selectedProject.name} システム開発`,
                        description: `${billingFlow.selectedProject.name}のシステム開発業務を実施いたしました。`,
                        amount: billingFlow.selectedProject.amount,
                        details: ['要件定義', '設計', '開発', 'テスト', '運用支援']
                      })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      次へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'content-input' && billingFlow.selectedProject && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">請求内容入力</h2>
                    <p className="text-gray-600 mt-1">プライム案件の請求内容を入力してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow({ step: 'project-selection' })}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">案件情報</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">案件名:</span>
                        <span className="ml-2">{billingFlow.selectedProject.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">クライアント:</span>
                        <span className="ml-2">{billingFlow.selectedProject.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">金額:</span>
                        <span className="ml-2">{formatCurrency(billingFlow.selectedProject.amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">請求内容</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">タイトル</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="請求書のタイトルを入力"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">詳細</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={4}
                          placeholder="請求内容の詳細を入力"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">金額</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={billingFlow.selectedProject.amount}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleContentInput({
                        title: 'プライム案件 保守運用',
                        description: 'プライム案件の保守運用業務を実施いたしました。',
                        amount: billingFlow.selectedProject.amount,
                        details: ['システム保守', '運用支援', '技術サポート']
                      })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      次へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'email-confirmation' && billingFlow.selectedProject && billingFlow.billingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">メール文章確認</h2>
                    <p className="text-gray-600 mt-1">メールの内容を確認・編集してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: prev.selectedProject?.type === 'farm' ? 'content-confirmation' : 'content-input' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">メール設定</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">宛先</label>
                        <input
                          type="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={`${billingFlow.selectedProject.client.toLowerCase().replace(/\s+/g, '')}@example.com`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CC</label>
                        <input
                          type="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="CCアドレス（任意）"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">メール内容</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">件名</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={replaceTemplateVariables(
                            getEmailTemplate(billingFlow.selectedProject.type),
                            billingFlow.selectedProject,
                            billingFlow.billingContent
                          ).subject}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">本文</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={10}
                          defaultValue={replaceTemplateVariables(
                            getEmailTemplate(billingFlow.selectedProject.type),
                            billingFlow.selectedProject,
                            billingFlow.billingContent
                          ).body}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">追加メッセージ</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={3}
                          placeholder="追加のメッセージがあれば入力してください"
                          onChange={(e) => setBillingFlow(prev => ({ ...prev, additionalMessage: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEmailConfirmation({
                        subject: `【${billingFlow.selectedProject.client}】請求書の件`,
                        body: `メール本文`,
                        to: `${billingFlow.selectedProject.client.toLowerCase().replace(/\s+/g, '')}@example.com`
                      })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      次へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'preview' && billingFlow.selectedProject && billingFlow.billingContent && billingFlow.emailContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">プレビュー</h2>
                    <p className="text-gray-600 mt-1">請求書とメールの最終確認</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'email-confirmation' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">請求書プレビュー</h3>
                      <button
                        onClick={handleEditBillingContent}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        修正
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-medium">{billingFlow.billingContent.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{billingFlow.billingContent.description}</p>
                      <p className="text-lg font-bold mt-2">{formatCurrency(billingFlow.billingContent.amount)}</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">メールプレビュー</h3>
                      <button
                        onClick={handleEditEmailContent}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        修正
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-sm">
                        <p><strong>宛先:</strong> {billingFlow.emailContent.to}</p>
                        <p><strong>件名:</strong> {billingFlow.emailContent.subject}</p>
                        <div className="mt-2">
                          <strong>本文:</strong>
                          <pre className="whitespace-pre-wrap text-sm mt-1">{billingFlow.emailContent.body}</pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'accounting-application' }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      内容確定
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'accounting-application' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">内容確定確認</h2>
                    <p className="text-gray-600 mt-1">請求内容を最終確認して経理に申請してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'preview' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">請求内容</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">案件名:</span>
                        <span className="ml-2">{billingFlow.selectedProject?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">クライアント:</span>
                        <span className="ml-2">{billingFlow.selectedProject?.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">請求金額:</span>
                        <span className="ml-2">{billingFlow.billingContent ? formatCurrency(billingFlow.billingContent.amount) : ''}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">申請者:</span>
                        <span className="ml-2">{getCurrentUser().name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleAccountingApplication}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      経理申請
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 請求内容修正画面 */}
            {billingFlow.step === 'billing-edit' && billingFlow.selectedProject && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">請求内容修正</h2>
                    <p className="text-gray-600 mt-1">請求内容を修正してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'preview' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">請求内容</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">タイトル</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={billingFlow.billingContent?.title || ''}
                          placeholder="請求書のタイトルを入力"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">詳細</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={4}
                          defaultValue={billingFlow.billingContent?.description || ''}
                          placeholder="請求内容の詳細を入力"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">金額</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={billingFlow.billingContent?.amount || billingFlow.selectedProject.amount}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleBillingContentSave({
                        title: '修正された請求書タイトル',
                        description: '修正された請求内容の詳細',
                        amount: billingFlow.billingContent?.amount || billingFlow.selectedProject.amount,
                        details: ['要件定義', '設計', '開発', 'テスト', '運用支援']
                      })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* メール内容修正画面 */}
            {billingFlow.step === 'email-edit' && billingFlow.selectedProject && billingFlow.billingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">メール内容修正</h2>
                    <p className="text-gray-600 mt-1">メールの内容を修正してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'preview' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">メール設定</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">宛先</label>
                        <input
                          type="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={billingFlow.emailContent?.to || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CC</label>
                        <input
                          type="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={billingFlow.emailContent?.cc || ''}
                          placeholder="CCアドレス（任意）"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">メール内容</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">件名</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={billingFlow.emailContent?.subject || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">本文</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          rows={8}
                          defaultValue={billingFlow.emailContent?.body || ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEmailContentSave({
                        to: billingFlow.emailContent?.to || '',
                        cc: billingFlow.emailContent?.cc || '',
                        subject: '修正されたメール件名',
                        body: '修正されたメール本文'
                      })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reject' && (
          <div className="space-y-6">
            {/* 差戻一覧 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">差戻一覧</h2>
                <p className="text-gray-600 mt-1">差戻ステータスの請求書一覧</p>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showStatusFilter={true}
                statusOptions={[
                  { value: 'rejected', label: '差戻' }
                ]}
              />
              
              {filterApplications(applications.filter(app => app.status === 'rejected')).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterApplications(applications.filter(app => app.status === 'rejected')).map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleRejectBilling(application)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 hover:border-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              修正
                            </button>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">差戻の請求書がありません</div>
                </div>
              )}
            </div>

            {/* 申請済一覧 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">申請済一覧</h2>
                  <p className="text-gray-600 mt-1">申請済・再申請済ステータスの請求書一覧</p>
                </div>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showStatusFilter={true}
                statusOptions={[
                  { value: 'pending', label: '申請済' },
                  { value: 'resubmitted', label: '再申請済' }
                ]}
              />
              
              {filterApplications(applications.filter(app => 
                app.status === 'pending' || 
                app.status === 'resubmitted'
              )).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterApplications(applications.filter(app => 
                        app.status === 'pending' || 
                        app.status === 'resubmitted'
                      )).map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleActionSelect(application, 'preview')}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              プレビュー
                            </button>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">申請済の請求書がありません</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approve' && isAccountingUser && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* デバッグ情報 */}
              <div className="text-xs text-gray-500 mb-2">
                isAccountingUser: {isAccountingUser.toString()}, 
                activeTab: {activeTab}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">承認・差戻</h2>
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
                          アクション
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterApplications(applications.filter(app => app.status === 'pending')).map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleActionSelect(application, 'preview')}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              プレビュー
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {application.billingNumber}
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
                            <div className="text-sm text-gray-900">{formatDate(application.appliedAt)}</div>
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
            onSave={handleRejectBillingSave}
          />
        )}

        {/* プレビューモーダル */}
        {showPreviewModal && previewApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {activeTab === 'approve' ? '請求書プレビュー（承認・差戻）' : '請求書プレビュー（閲覧）'}
                </h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* 請求書情報 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">請求書情報</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">請求書番号:</span>
                      <span className="ml-2 font-medium">{previewApplication.billingNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">案件名:</span>
                      <span className="ml-2 font-medium">{previewApplication.projectName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">クライアント:</span>
                      <span className="ml-2 font-medium">{previewApplication.clientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">請求金額:</span>
                      <span className="ml-2 font-medium">{formatCurrency(previewApplication.amount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">申請者:</span>
                      <span className="ml-2 font-medium">{previewApplication.appliedBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">申請日:</span>
                      <span className="ml-2 font-medium">{formatDate(previewApplication.appliedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* PDFプレビューエリア */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">PDFプレビュー</h4>
                  <div className="bg-white border rounded-lg p-6 min-h-96">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>PDFプレビューがここに表示されます</p>
                      <p className="text-sm mt-2">請求書の内容を確認後、承認または差戻しを選択してください</p>
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3">
                  {/* デバッグ情報 */}
                  <div className="text-xs text-gray-500 mb-2">
                    isAccountingUser: {isAccountingUser.toString()}, 
                    status: {previewApplication.status},
                    activeTab: {activeTab}
                  </div>
                  
                  {/* 承認・差戻タブからのプレビューの場合のみ承認・差戻ボタンを表示 */}
                  {isAccountingUser && previewApplication.status === 'pending' && activeTab === 'approve' && (
                    <>
                      <button
                        onClick={() => {
                          setConfirmAction('approve');
                          setConfirmApplication(previewApplication);
                          setShowPreviewModal(false);
                          setShowConfirmModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        承認
                      </button>
                      <button
                        onClick={() => {
                          setConfirmAction('reject');
                          setConfirmApplication(previewApplication);
                          setShowPreviewModal(false);
                          setShowConfirmModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        差戻
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 確認モーダル */}
        {showConfirmModal && confirmApplication && confirmAction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {confirmAction === 'approve' ? '承認確認' : 
                   confirmAction === 'reject' ? '差戻し確認' : 
                   confirmAction === 'apply' ? '経理申請確認' : '確認'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {confirmAction === 'approve' 
                    ? `請求書「${confirmApplication.billingNumber}」を承認しますか？` 
                    : confirmAction === 'reject'
                    ? `請求書「${confirmApplication.billingNumber}」を差戻しますか？`
                    : confirmAction === 'apply'
                    ? `案件「${confirmApplication.projectName}」の請求書を経理に申請しますか？`
                    : '確認してください'
                  }
                </p>
                
                {confirmAction === 'reject' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">差戻し理由</label>
                    <textarea
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="差戻し理由を入力してください"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setConfirmAction(null);
                      setConfirmApplication(null);
                      setRejectComment('');
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    いいえ
                  </button>
                  <button
                    onClick={() => {
                      if (confirmAction === 'approve') {
                        handleApprove(confirmApplication);
                      } else if (confirmAction === 'reject') {
                        handleReject(confirmApplication);
                      } else if (confirmAction === 'apply') {
                        handleConfirmApply();
                      }
                      setShowConfirmModal(false);
                      setConfirmAction(null);
                      setConfirmApplication(null);
                      setRejectComment('');
                    }}
                    className={`px-4 py-2 text-white rounded-md transition-colors ${
                      confirmAction === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : confirmAction === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    はい
                  </button>
                </div>
              </div>
            </div>
          </div>
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

        {/* 請求作成モーダル */}
        {showBillingModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">請求書作成</h3>
                <p className="text-gray-600 mb-4">請求書作成を開始しますか？</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBillingModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      setShowBillingModal(false);
                      setBillingFlow({ step: 'project-selection' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    開始
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