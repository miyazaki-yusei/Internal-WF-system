'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BillingCreateModal from '@/components/billing/BillingCreateModal';
import BillingRejectModal from '@/components/billing/BillingRejectModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEmailTemplates } from '@/contexts/EmailTemplateContext';

// ステータス定義
type UserStatus = 'before_application' | 'applied' | 'resubmitted' | 'rejected' | 'approved';
type AccountingStatus = UserStatus | 'pending_send' | 'sent';

interface BillingApplication {
  id: string;
  projectName: string;
  clientName: string;
  billingNumber: string;
  amount: number;
  status: AccountingStatus;
  appliedAt: string;
  appliedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  comment?: string;
  scheduledSendAt?: string; // 自動送信予定日時
  sentAt?: string; // 実際の送信日時
  savedAt?: string; // 一時保存日時
}

// 新しい業務フロー用のインターフェース
interface BillingFlow {
  step: 'project-selection' | 'content-confirmation' | 'content-input' | 'email-confirmation' | 'preview' | 'accounting-application' | 'billing-edit' | 'email-edit' | 'prime-billing-input' | 'prime-billing-preview' | 'prime-email-preview' | 'prime-final-preview' | 'prime-email-edit';
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
  // プライム案件用の詳細請求情報
  primeBillingContent?: {
    billingNumber: string;
    billingDate: string;
    paymentDueDate: string;
    items: {
      id: string;
      itemName: string;
      unitPrice: number;
      quantity: number;
      amount: number;
    }[];
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    breakdown: string;
    remarks: string;
    attachments: string;
  };
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
  userStatus: UserStatus; // 担当者側から見たステータス
  accountingStatus: AccountingStatus; // 経理側から見たステータス
}

export default function BillingPage() {
  // 現在のユーザーを取得する関数を最初に定義
  const getCurrentUser = () => {
    return {
      id: '4',
      name: '山田次郎',
      department: 'accounting' as const,
      role: 'admin' as const,
      email: 'yamada@festal.co.jp'
    };
  };

  // ユーザー情報
  const currentUser = getCurrentUser();
  const isAccountingUser = currentUser.department === 'accounting';

  // 状態管理
  const [activeTab, setActiveTab] = useState('create');
  const [activeSubTab, setActiveSubTab] = useState('farm');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'コンサルファームA システム開発',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームA株式会社',
      amount: 150000,
      userStatus: 'before_application',
      accountingStatus: 'before_application'
    },
    {
      id: '2',
      name: 'プライム案件B 保守運用',
      type: 'prime',
      status: 'active',
      client: 'プライム企業B',
      amount: 80000,
      userStatus: 'before_application',
      accountingStatus: 'before_application'
    },
    {
      id: '3',
      name: 'コンサルファームC 設備導入',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームC有限会社',
      amount: 200000,
      userStatus: 'rejected',
      accountingStatus: 'rejected'
    }
  ]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewApplication, setPreviewApplication] = useState<BillingApplication | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'apply' | null>(null);
  const [confirmApplication, setConfirmApplication] = useState<BillingApplication | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showBillingRejectModal, setShowBillingRejectModal] = useState(false);
  const [selectedRejectedBilling, setSelectedRejectedBilling] = useState<BillingApplication | null>(null);
  const [showFinalPreviewModal, setShowFinalPreviewModal] = useState(false);
  const [finalPreviewApplication, setFinalPreviewApplication] = useState<BillingApplication | null>(null);
  const [finalBillingContent, setFinalBillingContent] = useState<any>(null);
  const [finalEmailContent, setFinalEmailContent] = useState<any>(null);
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);
  const [showBulkApproveConfirmModal, setShowBulkApproveConfirmModal] = useState(false);
  const [showAutoSendModal, setShowAutoSendModal] = useState(false);
  const [showBulkAutoSendModal, setShowBulkAutoSendModal] = useState(false);
  const [selectedAutoSendApplication, setSelectedAutoSendApplication] = useState<BillingApplication | null>(null);

  // 請求フロー状態
  const [billingFlow, setBillingFlow] = useState<BillingFlow>({
    step: 'project-selection'
  });

  // メールテンプレートコンテキストを使用
  const { getTemplateByType } = useEmailTemplates();

  // タブ定義（ロール別に表示制御）
  const tabs = [
    { id: 'create', name: '請求一覧', showForAll: true },
    { id: 'reject', name: '差戻修正', showForAll: true },
    { id: 'approve', name: '承認・差戻', showForAll: false }, // 経理担当者のみ
    { id: 'pending_send', name: '送信待ち', showForAll: false } // 経理担当者のみ
  ];

  // サブタブ定義
  const subTabs = [
    { id: 'farm', name: 'ファーム' },
    { id: 'prime', name: 'プライム' }
  ];

  // サンプルデータ
  const [applications, setApplications] = useState<BillingApplication[]>([
    {
      id: '1',
      projectName: 'コンサルファームA システム開発',
      clientName: 'コンサルファームA株式会社',
      billingNumber: 'BILL-1-202401',
      amount: 150000,
      status: 'before_application',
      appliedAt: '2024-01-15',
      appliedBy: '田中太郎'
    },
    {
      id: '2',
      projectName: 'プライム案件B 保守運用',
      clientName: 'プライム企業B',
      billingNumber: 'BILL-2-202401',
      amount: 80000,
      status: 'before_application',
      appliedAt: '2024-01-10',
      appliedBy: '佐藤花子'
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
      rejectedBy: '山田次郎',
      rejectedAt: '2024-10-01',
      comment: '請求内容の詳細を追加してください'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('ja-JP');
    } catch (error) {
      return '-';
    }
  };

  const getStatusBadge = (status: AccountingStatus, isAccountingView: boolean = false) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    if (isAccountingView) {
      // 経理側の表示
      switch (status) {
        case 'before_application':
          return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>申請前</span>;
        case 'applied':
          return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>申請済</span>;
        case 'resubmitted':
          return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>再申請済</span>;
        case 'rejected':
          return <span className={`${baseClasses} bg-red-100 text-red-800`}>差戻</span>;
        case 'approved':
          return <span className={`${baseClasses} bg-green-100 text-green-800`}>承認</span>;
        case 'pending_send':
          return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>送信待ち</span>;
        case 'sent':
          return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>送信済み</span>;
        default:
          return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>不明</span>;
      }
    } else {
      // 担当者側の表示（経理側のステータスを担当者側のステータスに変換）
      let userStatus: UserStatus;
      switch (status) {
        case 'before_application':
        case 'pending_send':
          userStatus = 'before_application';
          break;
        case 'applied':
          userStatus = 'applied';
          break;
        case 'resubmitted':
          userStatus = 'resubmitted';
          break;
        case 'rejected':
          userStatus = 'rejected';
          break;
        case 'approved':
        case 'sent':
          userStatus = 'approved';
          break;
        default:
          userStatus = 'before_application';
      }
      
      switch (userStatus) {
        case 'before_application':
          return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>申請前</span>;
        case 'applied':
          return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>申請済</span>;
        case 'resubmitted':
          return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>再申請済</span>;
        case 'rejected':
          return <span className={`${baseClasses} bg-red-100 text-red-800`}>差戻</span>;
        case 'approved':
          return <span className={`${baseClasses} bg-green-100 text-green-800`}>承認</span>;
        default:
          return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>不明</span>;
      }
    }
  };

  const getProjectStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'before_application':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>申請前</span>;
      case 'applied':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>申請済</span>;
      case 'resubmitted':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>再申請済</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>差戻</span>;
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>承認</span>;
      case 'pending_send':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>送信待ち</span>;
      case 'sent':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>送信済み</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>申請前</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    const config = type === 'farm' 
      ? { text: 'ファーム案件', color: 'bg-blue-100 text-blue-800' }
      : { text: 'プライム案件', color: 'bg-green-100 text-green-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const canApprove = (user: User) => {
    return user.department === 'accounting' && user.role === 'admin';
  };

  // フィルタリング結果を直接計算（useMemoを使用しない）
  const filteredProjects = projects.filter(project => {
    // 案件名検索条件
    const matchesProjectSearch = !projectSearchTerm || 
      project.name.toLowerCase().includes(projectSearchTerm.toLowerCase());
    
    // クライアント名検索条件
    const matchesClientSearch = !clientSearchTerm || 
      project.client.toLowerCase().includes(clientSearchTerm.toLowerCase());
    
    // タイプフィルター
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    // ステータスフィルター（請求ステータスを使用）
    const matchesStatus = statusFilter === 'all' || project.userStatus === statusFilter;
    
    // サブタブフィルター
    let matchesSubTab = true;
    if (activeTab === 'create') {
      matchesSubTab = project.type === activeSubTab;
    }
    
    return matchesProjectSearch && matchesClientSearch && matchesType && matchesStatus && matchesSubTab;
  });

  const filteredApplications = (() => {
    let targetApplications: BillingApplication[] = [];
    
    switch (activeTab) {
      case 'reject':
        targetApplications = applications.filter(app => app.status === 'rejected');
        break;
      case 'approve':
        targetApplications = applications.filter(app => 
          app.status === 'pending' || app.status === 'resubmitted'
        );
        break;
      default:
        return [];
    }
    
    return targetApplications.filter(application => {
      // 案件名検索条件
      const matchesProjectSearch = !searchTerm || 
        application.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // クライアント名検索条件
      const matchesClientSearch = !searchTerm || 
        application.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // ステータスフィルター
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      
      // サブタブフィルター
      let matchesSubTab = true;
      if (activeTab === 'create') {
        const project = projects.find(p => p.name === application.projectName);
        matchesSubTab = project ? project.type === activeSubTab : true;
      }
      
      return matchesProjectSearch && matchesClientSearch && matchesStatus && matchesSubTab;
    });
  })();

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
    
    // 最終プレビュー用のデータを準備
    const project = projects.find(p => p.name === application.projectName);
    
    // プロジェクトが見つからない場合のデフォルト値
    if (!project) {
      console.warn('プロジェクトが見つかりません:', application.projectName);
      // プロジェクトが見つからない場合でも処理を継続
      const defaultProject = {
        id: 'default',
        name: application.projectName,
        type: 'farm' as const,
        status: 'active' as const,
        client: application.clientName,
        amount: application.amount
      };
      
      const billingContent = {
        title: `${application.projectName} 請求書`,
        description: `${application.clientName}様向けの請求書です。`,
        amount: application.amount,
        details: [
          'システム開発費',
          '保守運用費',
          'その他経費'
        ]
      };
      
      const emailTemplate = getEmailTemplate('farm');
      const emailContent = replaceTemplateVariables(emailTemplate, defaultProject, billingContent, '');
      
      // 最終プレビューモーダルを表示
      setFinalPreviewApplication(application);
      setFinalBillingContent(billingContent);
      setFinalEmailContent(emailContent);
      setShowFinalPreviewModal(true);
      
      // 確認モーダルを閉じる
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmApplication(null);
      return;
    }
    
    const billingContent = {
      title: `${application.projectName} 請求書`,
      description: `${application.clientName}様向けの請求書です。`,
      amount: application.amount,
      details: [
        'システム開発費',
        '保守運用費',
        'その他経費'
      ]
    };
    
    const emailTemplate = getEmailTemplate(project.type || 'farm');
    const emailContent = replaceTemplateVariables(emailTemplate, project, billingContent, '');
    
    // 最終プレビューモーダルを表示
    setFinalPreviewApplication(application);
    setFinalBillingContent(billingContent);
    setFinalEmailContent(emailContent);
    setShowFinalPreviewModal(true);
    
    // 確認モーダルを閉じる
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmApplication(null);
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
      alert('選択された項目がありません');
      return;
    }
    
    // 一括承認確認モーダルを表示
    setShowBulkApproveConfirmModal(true);
  };

  const handleBulkApproveConfirm = () => {
    // 一括承認処理
    
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
    
    alert(`${selectedItems.length}件を承認しました。請求書がSharePointに保存され、メールで送信されます。`);
    setSelectedItems([]);
    
    // 確認モーダルを閉じる
    setShowBulkApproveConfirmModal(false);
  };

  const handleReject = (application: BillingApplication) => {
    // 差戻処理を直接実行（確認モーダルで既にコメントを入力済み）
    if (!rejectComment.trim()) {
      alert('差戻理由を入力してください');
      return;
    }
    
    // ステータスを差戻に変更
    const updatedApplications = applications.map(app => 
      app.id === application.id 
        ? { 
            ...app, 
            status: 'rejected' as const,
            rejectedBy: getCurrentUser().name,
            rejectedAt: new Date().toISOString(),
            comment: rejectComment
          }
        : app
    );
    setApplications(updatedApplications);
    
    // モーダルを閉じる
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmApplication(null);
    setRejectComment('');
    
    alert('差戻処理が完了しました');
  };

  const handleCreateBilling = (project?: Project) => {
    setSelectedProject(project || null);
    setShowBillingModal(true);
  };

  const handleCloseBillingModal = () => {
    setShowBillingModal(false);
    setSelectedProject(null);
  };

  const handleRejectBilling = (application: BillingApplication) => {
    setSelectedRejectedBilling(application);
    setShowBillingRejectModal(true);
  };

  const handleRejectBillingSave = (application: BillingApplication, updatedContent: any) => {
    // 差戻修正保存処理
    
    // ステータスを再申請済に変更
    const updatedApplications = applications.map(app => 
      app.id === application.id 
        ? { 
            ...app, 
            status: 'resubmitted' as const,
            comment: updatedContent.correctionComment
          }
        : app
    );
    setApplications(updatedApplications);
    
    // モーダルを閉じる
    setShowBillingRejectModal(false);
    setSelectedRejectedBilling(null);
    
    alert('差戻修正が完了しました。申請は承認・差戻タブで確認できます。');
  };

  const handleCloseRejectModal = () => {
    setShowBillingRejectModal(false);
    setSelectedRejectedBilling(null);
  };

  // 最終プレビュー関連の関数
  const handleFinalPreviewClose = () => {
    setShowFinalPreviewModal(false);
    setFinalPreviewApplication(null);
    setFinalBillingContent(null);
    setFinalEmailContent(null);
  };

  const handleFinalBillingEdit = () => {
    // 請求内容編集モーダルを表示
    const project = projects.find(p => p.name === finalPreviewApplication?.projectName);
    if (!project) {
      console.warn('プロジェクトが見つかりません:', finalPreviewApplication?.projectName);
      // プロジェクトが見つからない場合でも処理を継続
      const defaultProject = {
        id: 'default',
        name: finalPreviewApplication?.projectName || '',
        type: 'farm' as const,
        status: 'active' as const,
        client: finalPreviewApplication?.clientName || '',
        amount: finalPreviewApplication?.amount || 0
      };
      setBillingFlow({
        step: 'billing-edit',
        selectedProject: defaultProject,
        billingContent: finalBillingContent
      });
      return;
    }
    setBillingFlow({
      step: 'billing-edit',
      selectedProject: project,
      billingContent: finalBillingContent
    });
  };

  const handleFinalEmailEdit = () => {
    // メール内容編集モーダルを表示
    const project = projects.find(p => p.name === finalPreviewApplication?.projectName);
    if (!project) {
      console.warn('プロジェクトが見つかりません:', finalPreviewApplication?.projectName);
      // プロジェクトが見つからない場合でも処理を継続
      const defaultProject = {
        id: 'default',
        name: finalPreviewApplication?.projectName || '',
        type: 'farm' as const,
        status: 'active' as const,
        client: finalPreviewApplication?.clientName || '',
        amount: finalPreviewApplication?.amount || 0
      };
      setBillingFlow({
        step: 'email-edit',
        selectedProject: defaultProject,
        billingContent: finalBillingContent,
        emailContent: finalEmailContent
      });
      return;
    }
    setBillingFlow({
      step: 'email-edit',
      selectedProject: project,
      billingContent: finalBillingContent,
      emailContent: finalEmailContent
    });
  };

  const handleFinalBillingSave = (content: any) => {
    setFinalBillingContent(content);
    // 最終プレビューモーダルに戻る
    setBillingFlow({ step: 'preview' });
  };

  const handleFinalEmailSave = (emailContent: any) => {
    setFinalEmailContent(emailContent);
    // 最終プレビューモーダルに戻る
    setBillingFlow({ step: 'preview' });
  };

  const handleFinalConfirm = () => {
    // 最終確認処理
    
    // メール送信確認モーダルを表示
    setShowEmailConfirmModal(true);
  };

  const handleEmailSend = () => {
    // メール送信処理
    
    // 申請のステータスを送信済みに変更
    if (finalPreviewApplication) {
      const updatedApplications = applications.map(app => 
        app.id === finalPreviewApplication.id 
          ? { 
              ...app, 
              status: 'sent' as const,
              approvedBy: getCurrentUser().name,
              approvedAt: new Date().toISOString(),
              sentAt: new Date().toISOString()
            }
          : app
      );
      setApplications(updatedApplications);
    }
    
    // モーダルを閉じる
    setShowEmailConfirmModal(false);
    setShowFinalPreviewModal(false);
    setFinalPreviewApplication(null);
    setFinalBillingContent(null);
    setFinalEmailContent(null);
    
    alert('メール送信が完了しました。請求書がSharePointに保存され、メールで送信されます。');
  };

  // 一時保存機能
  const handleTemporarySave = () => {
    if (finalPreviewApplication) {
      // ステータスを「送信待ち」に更新
      setApplications(prev => prev.map(app => 
        app.id === finalPreviewApplication.id 
          ? { ...app, status: 'pending_send', savedAt: new Date().toISOString() }
          : app
      ));
      
      // モーダルを閉じる
      setShowFinalPreviewModal(false);
      setFinalPreviewApplication(null);
      setFinalEmailContent(null);
      setFinalBillingContent(null);
      
      // 成功メッセージを表示
      alert('一時保存が完了しました。後で自動送信設定ができます。');
    }
  };

  // 自動送信設定
  const handleAutoSendSetting = (application: BillingApplication) => {
    setSelectedAutoSendApplication(application);
    setShowAutoSendModal(true);
  };

  // 自動送信確認
  const handleAutoSendConfirm = (scheduledDate: string, scheduledTime: string) => {
    if (selectedAutoSendApplication) {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;
      
      // 自動送信予定日時を設定
      setApplications(prev => prev.map(app => 
        app.id === selectedAutoSendApplication.id 
          ? { ...app, scheduledSendAt: scheduledDateTime }
          : app
      ));
      
      setSelectedAutoSendApplication(null);
      alert(`自動送信を設定しました。\n予定日時: ${scheduledDate} ${scheduledTime}`);
    }
  };

  // 一括自動送信設定
  const handleBulkAutoSendSetting = () => {
    if (selectedItems.length > 0) {
      setShowBulkAutoSendModal(true);
    } else {
      alert('送信待ちの請求書を選択してください。');
    }
  };

  // 一括自動送信確認
  const handleBulkAutoSendConfirm = (scheduledDate: string, scheduledTime: string) => {
    const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;
    
    // 選択された項目に自動送信予定日時を設定
    setApplications(prev => prev.map(app => 
      selectedItems.includes(app.id)
        ? { ...app, scheduledSendAt: scheduledDateTime }
        : app
    ));
    
    setSelectedItems([]);
    alert(`${selectedItems.length}件の自動送信を設定しました。\n予定日時: ${scheduledDate} ${scheduledTime}`);
  };

  // 新しい業務フロー用の関数
  const handleProjectSelection = (project: Project) => {
    if (project.type === 'prime') {
      // プライム案件の場合：請求内容入力画面に進む
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      
      const defaultPrimeBillingContent = {
        billingNumber: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-001`,
        billingDate: today.toISOString().split('T')[0],
        paymentDueDate: nextMonth.toISOString().split('T')[0],
        items: [
          {
            id: '1',
            itemName: `${project.name} 業務支援報酬`,
            unitPrice: project.amount,
            quantity: 1,
            amount: project.amount
          }
        ],
        subtotal: project.amount,
        taxAmount: Math.floor(project.amount * 0.1),
        totalAmount: project.amount + Math.floor(project.amount * 0.1),
        breakdown: 'コンサルティング報酬',
        remarks: '本請求に関してご不明点がございましたら、お気軽にお問い合わせください。',
        attachments: '作業報告書'
      };

      setBillingFlow({
        step: 'prime-billing-input',
        selectedProject: project,
        primeBillingContent: defaultPrimeBillingContent
      });
    } else {
      // ファーム案件の場合：従来のフロー
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
    }
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
    // 経理申請処理
    
    // 申請のステータスを申請済に変更
    if (billingFlow.selectedProject) {
      const newApplication: BillingApplication = {
        id: Date.now().toString(),
        projectName: billingFlow.selectedProject.name,
        clientName: billingFlow.selectedProject.client,
        billingNumber: `BILL-${Date.now()}`,
        amount: billingFlow.billingContent?.amount || 0,
        status: 'pending',
        appliedAt: new Date().toISOString().split('T')[0],
        appliedBy: getCurrentUser().name
      };
      
      setApplications(prev => [...prev, newApplication]);
    }
    
    // フローをリセット
    setBillingFlow({ step: 'project-selection' });
    
    alert('経理申請が完了しました。');
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
    
            alert('経理申請が完了しました。');
  };

  const getEmailTemplate = (type: 'farm' | 'prime') => {
    return getTemplateByType(type) || getTemplateByType('general');
  };

  const replaceTemplateVariables = (template: EmailTemplate, project: Project, billingContent: any, additionalMessage: string = '') => {
    let subject = template.subject;
    let body = template.body;

    // プロジェクトが存在する場合のみテンプレート変数を置換
    if (project) {
      subject = subject.replace('{{clientName}}', project.client);
      body = body.replace('{{clientName}}', project.client);
    }
    
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
        // 承認・差戻タブ：申請中・再申請済の件数（経理担当者のみ）
        return isAccountingUser ? applications.filter(app => app.status === 'pending' || app.status === 'resubmitted').length : 0;
      default:
        return 0;
    }
  };

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  // 検索・フィルターコンポーネント
  const SearchAndFilterSection = ({ 
    showTypeFilter = false, 
    showStatusFilter = true,
    statusOptions = []
  }: {
    showTypeFilter?: boolean;
    showStatusFilter?: boolean;
    statusOptions?: { value: string; label: string }[];
  }) => {
    // 案件名検索候補を生成
    const getProjectSearchSuggestions = () => {
      if (!projectSearchTerm.trim()) return [];
      
      const suggestions: string[] = [];
      const searchLower = projectSearchTerm.toLowerCase();
      
      // プロジェクト名から候補を生成
      projects.forEach(project => {
        if (project.name.toLowerCase().includes(searchLower)) {
          suggestions.push(project.name);
        }
      });
      
      // 請求申請から候補を生成
      applications.forEach(app => {
        if (app.projectName.toLowerCase().includes(searchLower)) {
          suggestions.push(app.projectName);
        }
      });
      
      // 重複を除去して最大5件まで返す
      return [...new Set(suggestions)].slice(0, 5);
    };
    
    // クライアント名検索候補を生成
    const getClientSearchSuggestions = () => {
      if (!clientSearchTerm.trim()) return [];
      
      const suggestions: string[] = [];
      const searchLower = clientSearchTerm.toLowerCase();
      
      // プロジェクトのクライアント名から候補を生成
      projects.forEach(project => {
        if (project.client.toLowerCase().includes(searchLower)) {
          suggestions.push(project.client);
        }
      });
      
      // 請求申請のクライアント名から候補を生成
      applications.forEach(app => {
        if (app.clientName.toLowerCase().includes(searchLower)) {
          suggestions.push(app.clientName);
        }
      });
      
      // 重複を除去して最大5件まで返す
      return [...new Set(suggestions)].slice(0, 5);
    };
    
    const projectSuggestions = getProjectSearchSuggestions();
    const clientSuggestions = getClientSearchSuggestions();
    
    return (
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* 案件名検索ボックス */}
          <div className="flex-1 min-w-64 relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="案件名で検索..."
                value={projectSearchTerm}
                onChange={(e) => setProjectSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 案件名検索候補ドロップダウン */}
            {projectSearchTerm.trim() && projectSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                {projectSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setProjectSearchTerm(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* クライアント名検索ボックス */}
          <div className="flex-1 min-w-64 relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="クライアント名で検索..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* クライアント名検索候補ドロップダウン */}
            {clientSearchTerm.trim() && clientSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                {clientSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setClientSearchTerm(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
          {(projectSearchTerm || clientSearchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={() => {
                setProjectSearchTerm('');
                setClientSearchTerm('');
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
  };

  // プロジェクトデータ
  const projectData: Project[] = [
    {
      id: '1',
      name: 'コンサルファームA システム開発',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームA株式会社',
      amount: 150000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '2',
      name: 'プライム案件B 保守運用',
      type: 'prime',
      status: 'active',
      client: 'プライム企業B',
      amount: 80000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '3',
      name: 'コンサルファームC 設備導入',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームC有限会社',
      amount: 200000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '4',
      name: 'コンサルファームD システム保守',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームD株式会社',
      amount: 120000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '5',
      name: 'コンサルファームE システム改修',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームE株式会社',
      amount: 180000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '6',
      name: 'コンサルファームD スマート農業システム',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームD株式会社',
      amount: 350000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '7',
      name: 'プライム案件E データ分析',
      type: 'prime',
      status: 'active',
      client: 'プライム企業E',
      amount: 120000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    },
    {
      id: '8',
      name: 'コンサルファームF IoT導入支援',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームF有限会社',
      amount: 280000,
      userStatus: 'before_application',
      accountingStatus: 'pending_send'
    }
  ];

  // 初期化時にprojectsを設定
  useEffect(() => {
    setProjects(projectData);
  }, []);

  // 自動送信設定モーダル
  const AutoSendModal = ({ 
    isOpen, 
    onClose, 
    onConfirm 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: (scheduledDate: string, scheduledTime: string) => void; 
  }) => {
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('09:00');
    
    const handleConfirm = () => {
      if (scheduledDate && scheduledTime) {
        onConfirm(scheduledDate, scheduledTime);
        onClose();
      }
    };
    
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">自動送信設定</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送信予定日
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送信時刻
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>注意:</strong> 設定した日時に自動でメール送信とSharePointへの保存が実行されます。
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              disabled={!scheduledDate || !scheduledTime}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              設定する
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 一括自動送信設定モーダル
  const BulkAutoSendModal = ({ 
    isOpen, 
    onClose, 
    selectedItems,
    onConfirm 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    selectedItems: string[];
    onConfirm: (scheduledDate: string, scheduledTime: string) => void; 
  }) => {
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('09:00');
    
    const handleConfirm = () => {
      if (scheduledDate && scheduledTime) {
        onConfirm(scheduledDate, scheduledTime);
        onClose();
      }
    };
    
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">一括自動送信設定</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              選択された {selectedItems.length} 件の請求書を一括で自動送信します。
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送信予定日
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送信時刻
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="bg-orange-50 p-3 rounded-md">
              <p className="text-sm text-orange-800">
                <strong>注意:</strong> 選択された全ての請求書が指定した日時に一括送信されます。
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              disabled={!scheduledDate || !scheduledTime}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              一括設定する
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">請求管理</h1>
                        <p className="text-gray-600 mt-1">請求書の作成、申請、承認・差戻を行います</p>
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
          
          {/* サブタブ（請求一覧タブが選択されている場合のみ表示） */}
          {activeTab === 'create' && (
            <div className="flex space-x-2 mt-2">
              {subTabs.map((subTab) => (
                <button
                  key={subTab.id}
                  className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors relative ${
                    activeSubTab === subTab.id
                      ? 'border-blue-600 text-blue-700 bg-white'
                      : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveSubTab(subTab.id)}
                >
                  <span className="flex items-center">
                    {subTab.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {billingFlow.step === 'project-selection' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">案件選択</h2>
                    <p className="text-gray-600 mt-1">
                      {activeSubTab === 'farm' ? 'ファーム案件' : 'プライム案件'}の請求書作成対象の案件を選択してください
                    </p>
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
                    { value: 'before_application', label: '申請前' },
                    { value: 'applied', label: '申請済' },
                    { value: 'resubmitted', label: '再申請済' },
                    { value: 'rejected', label: '差戻' },
                    { value: 'approved', label: '承認' }
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
                      {filteredProjects.map((project) => (
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
                            {getProjectStatusBadge(project.userStatus)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {billingFlow.step === 'prime-billing-input' && billingFlow.selectedProject && billingFlow.primeBillingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">請求内容入力</h2>
                    <p className="text-gray-600 mt-1">プライム案件の請求内容を入力してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'project-selection' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">基本情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">請求書番号</label>
                        <input
                          type="text"
                          value={billingFlow.primeBillingContent.billingNumber}
                          onChange={(e) => setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              billingNumber: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">請求日</label>
                        <input
                          type="date"
                          value={billingFlow.primeBillingContent.billingDate}
                          onChange={(e) => setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              billingDate: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">支払期限</label>
                        <input
                          type="date"
                          value={billingFlow.primeBillingContent.paymentDueDate}
                          onChange={(e) => setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              paymentDueDate: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 請求内容 */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">請求内容</h3>
                      <button
                        onClick={() => {
                          const newItem = {
                            id: `${Date.now()}`,
                            itemName: '',
                            unitPrice: 0,
                            quantity: 1,
                            amount: 0
                          };
                          const updatedItems = [...billingFlow.primeBillingContent!.items, newItem];
                          const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
                          const taxAmount = Math.floor(subtotal * 0.1);
                          const totalAmount = subtotal + taxAmount;
                          
                          setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              items: updatedItems,
                              subtotal,
                              taxAmount,
                              totalAmount
                            }
                          }));
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        + 品目追加
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {billingFlow.primeBillingContent.items.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">品目 {index + 1}</h4>
                            {billingFlow.primeBillingContent!.items.length > 1 && (
                              <button
                                onClick={() => {
                                  const updatedItems = billingFlow.primeBillingContent!.items.filter(i => i.id !== item.id);
                                  const subtotal = updatedItems.reduce((sum, i) => sum + i.amount, 0);
                                  const taxAmount = Math.floor(subtotal * 0.1);
                                  const totalAmount = subtotal + taxAmount;
                                  
                                  setBillingFlow(prev => ({
                                    ...prev,
                                    primeBillingContent: {
                                      ...prev.primeBillingContent!,
                                      items: updatedItems,
                                      subtotal,
                                      taxAmount,
                                      totalAmount
                                    }
                                  }));
                                }}
                                className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                削除
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">品目名</label>
                              <input
                                type="text"
                                value={item.itemName}
                                onChange={(e) => {
                                  const updatedItems = billingFlow.primeBillingContent!.items.map(i => 
                                    i.id === item.id ? { ...i, itemName: e.target.value } : i
                                  );
                                  
                                  setBillingFlow(prev => ({
                                    ...prev,
                                    primeBillingContent: {
                                      ...prev.primeBillingContent!,
                                      items: updatedItems
                                    }
                                  }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例：7月度業務支援報酬"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">単価</label>
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => {
                                    const unitPrice = parseInt(e.target.value) || 0;
                                    const quantity = item.quantity;
                                    const amount = unitPrice * quantity;
                                    
                                    const updatedItems = billingFlow.primeBillingContent!.items.map(i => 
                                      i.id === item.id ? { ...i, unitPrice, amount } : i
                                    );
                                    const subtotal = updatedItems.reduce((sum, i) => sum + i.amount, 0);
                                    const taxAmount = Math.floor(subtotal * 0.1);
                                    const totalAmount = subtotal + taxAmount;
                                    
                                    setBillingFlow(prev => ({
                                      ...prev,
                                      primeBillingContent: {
                                        ...prev.primeBillingContent!,
                                        items: updatedItems,
                                        subtotal,
                                        taxAmount,
                                        totalAmount
                                      }
                                    }));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const quantity = parseInt(e.target.value) || 0;
                                    const unitPrice = item.unitPrice;
                                    const amount = unitPrice * quantity;
                                    
                                    const updatedItems = billingFlow.primeBillingContent!.items.map(i => 
                                      i.id === item.id ? { ...i, quantity, amount } : i
                                    );
                                    const subtotal = updatedItems.reduce((sum, i) => sum + i.amount, 0);
                                    const taxAmount = Math.floor(subtotal * 0.1);
                                    const totalAmount = subtotal + taxAmount;
                                    
                                    setBillingFlow(prev => ({
                                      ...prev,
                                      primeBillingContent: {
                                        ...prev.primeBillingContent!,
                                        items: updatedItems,
                                        subtotal,
                                        taxAmount,
                                        totalAmount
                                      }
                                    }));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                  {formatCurrency(item.amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 合計金額 */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">小計（税抜）:</span>
                          <span className="ml-2 font-bold">{formatCurrency(billingFlow.primeBillingContent.subtotal)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">消費税（10%）:</span>
                          <span className="ml-2 font-bold">{formatCurrency(billingFlow.primeBillingContent.taxAmount)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">合計（税込）:</span>
                          <span className="ml-2 font-bold text-blue-600">{formatCurrency(billingFlow.primeBillingContent.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* その他情報 */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">その他情報</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">内訳</label>
                        <input
                          type="text"
                          value={billingFlow.primeBillingContent.breakdown}
                          onChange={(e) => setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              breakdown: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例：コンサルティング報酬"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                        <textarea
                          value={billingFlow.primeBillingContent.remarks}
                          onChange={(e) => setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              remarks: e.target.value
                            }
                          }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="本請求に関してご不明点がございましたら、お気軽にお問い合わせください。"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">添付資料</label>
                        <input
                          type="text"
                          value={billingFlow.primeBillingContent.attachments}
                          onChange={(e) => setBillingFlow(prev => ({
                            ...prev,
                            primeBillingContent: {
                              ...prev.primeBillingContent!,
                              attachments: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例：作業報告書"
                        />
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'project-selection' }))}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      戻る
                    </button>
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-billing-preview' }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      プレビュー
                    </button>
                  </div>
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

            {billingFlow.step === 'prime-email-preview' && billingFlow.selectedProject && billingFlow.primeBillingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">メールプレビュー</h2>
                    <p className="text-gray-600 mt-1">プライム案件のメール内容を確認してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-billing-preview' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-6">
                  {/* メールプレビュー */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">メール設定</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">件名:</span>
                          <span className="ml-2 font-medium">請求書送付のお知らせ - {billingFlow.primeBillingContent.billingNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">宛先:</span>
                          <span className="ml-2 font-medium">{billingFlow.selectedProject.client} 担当者様</span>
                        </div>
                        <div>
                          <span className="text-gray-600">CC:</span>
                          <span className="ml-2 font-medium">（必要に応じて設定）</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">メール本文</h3>
                        <button
                          onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-edit' }))}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          編集
                        </button>
                      </div>
                      <div className="bg-white p-4 border rounded text-sm">
                        <p className="mb-3">
                          {billingFlow.selectedProject.client} 担当者様
                        </p>
                        <p className="mb-3">
                          平素より格別のご高配を賜り、厚く御礼申し上げます。
                        </p>
                        <p className="mb-3">
                          この度、{billingFlow.selectedProject.name}に関する請求書を発行いたしましたので、ご連絡申し上げます。
                        </p>
                        <p className="mb-3">
                          <strong>請求書番号:</strong> {billingFlow.primeBillingContent.billingNumber}<br />
                          <strong>請求金額:</strong> {formatCurrency(billingFlow.primeBillingContent.totalAmount)}（税込）<br />
                          <strong>支払期限:</strong> {formatDate(billingFlow.primeBillingContent.paymentDueDate)}
                        </p>
                        <p className="mb-3">
                          請求書の詳細は添付ファイルをご確認ください。
                        </p>
                        <p className="mb-3">
                          ご不明な点がございましたら、お気軽にお問い合わせください。
                        </p>
                        <p className="mb-3">
                          今後ともよろしくお願いいたします。
                        </p>
                        <p className="mt-6">
                          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br />
                          株式会社フェスタル<br />
                          担当: {getCurrentUser().name}<br />
                          TEL: 03-1234-5678<br />
                          Email: {getCurrentUser().email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-billing-preview' }))}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      戻る
                    </button>
                    <button
                      onClick={() => {
                        // 経理申請の確認モーダルを表示
                        setShowConfirmModal(true);
                        setConfirmAction('apply');
                        setConfirmApplication({
                          id: `billing-${Date.now()}`,
                          projectName: billingFlow.selectedProject!.name,
                          clientName: billingFlow.selectedProject!.client,
                          billingNumber: billingFlow.primeBillingContent!.billingNumber,
                          amount: billingFlow.primeBillingContent!.totalAmount,
                          status: 'pending',
                          appliedAt: new Date().toISOString(),
                          appliedBy: getCurrentUser().name
                        });
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      経理申請
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'prime-email-edit' && billingFlow.selectedProject && billingFlow.primeBillingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">メール編集</h2>
                    <p className="text-gray-600 mt-1">プライム案件のメール内容を編集してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-preview' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-6">
                  {/* メール編集フォーム */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">メール設定</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                        <input
                          type="text"
                          defaultValue={`請求書送付のお知らせ - ${billingFlow.primeBillingContent.billingNumber}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">宛先</label>
                        <input
                          type="text"
                          defaultValue={`${billingFlow.selectedProject.client} 担当者様`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CC（任意）</label>
                        <input
                          type="text"
                          placeholder="CCアドレスを入力"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">メール本文</h3>
                    <textarea
                      rows={15}
                      defaultValue={`${billingFlow.selectedProject.client} 担当者様

平素より格別のご高配を賜り、厚く御礼申し上げます。

この度、${billingFlow.selectedProject.name}に関する請求書を発行いたしましたので、ご連絡申し上げます。

請求書番号: ${billingFlow.primeBillingContent.billingNumber}
請求金額: ${formatCurrency(billingFlow.primeBillingContent.totalAmount)}（税込）
支払期限: ${formatDate(billingFlow.primeBillingContent.paymentDueDate)}

請求書の詳細は添付ファイルをご確認ください。

ご不明な点がございましたら、お気軽にお問い合わせください。

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
株式会社フェスタル
担当: ${getCurrentUser().name}
TEL: 03-1234-5678
Email: ${getCurrentUser().email}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* アクションボタン */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-preview' }))}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      戻る
                    </button>
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-preview' }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'prime-final-preview' && billingFlow.selectedProject && billingFlow.primeBillingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">最終プレビュー</h2>
                    <p className="text-gray-600 mt-1">プライム案件の請求書とメールの最終確認</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-preview' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 請求書とメールの最終確認 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 請求書プレビュー */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">請求書内容</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">請求書番号:</span>
                          <span className="ml-2 font-medium">{billingFlow.primeBillingContent.billingNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">請求金額:</span>
                          <span className="ml-2 font-medium">{formatCurrency(billingFlow.primeBillingContent.totalAmount)}（税込）</span>
                        </div>
                        <div>
                          <span className="text-gray-600">支払期限:</span>
                          <span className="ml-2 font-medium">{formatDate(billingFlow.primeBillingContent.paymentDueDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">品目:</span>
                          <span className="ml-2 font-medium">
                            {billingFlow.primeBillingContent.items.map(item => item.itemName).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* メールプレビュー */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">メール内容</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">件名:</span>
                          <span className="ml-2 font-medium">請求書送付のお知らせ - {billingFlow.primeBillingContent.billingNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">宛先:</span>
                          <span className="ml-2 font-medium">{billingFlow.selectedProject.client} 担当者様</span>
                        </div>
                        <div>
                          <span className="text-gray-600">添付ファイル:</span>
                          <span className="ml-2 font-medium">請求書PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-preview' }))}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      戻る
                    </button>
                    <button
                      onClick={() => {
                        // 経理申請の確認モーダルを表示
                        setShowConfirmModal(true);
                        setConfirmAction('apply');
                        setConfirmApplication({
                          id: `billing-${Date.now()}`,
                          projectName: billingFlow.selectedProject!.name,
                          clientName: billingFlow.selectedProject!.client,
                          billingNumber: billingFlow.primeBillingContent!.billingNumber,
                          amount: billingFlow.primeBillingContent!.totalAmount,
                          status: 'pending',
                          appliedAt: new Date().toISOString(),
                          appliedBy: getCurrentUser().name
                        });
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      経理申請
                    </button>
                  </div>
                </div>
              </div>
            )}

            {billingFlow.step === 'prime-billing-preview' && billingFlow.selectedProject && billingFlow.primeBillingContent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">請求書プレビュー</h2>
                    <p className="text-gray-600 mt-1">プライム案件の請求書内容を確認してください</p>
                  </div>
                  <button
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-billing-input' }))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    戻る
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 請求書プレビュー */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-gray-900">請求書</h1>
                    </div>
                    
                    {/* 基本情報 */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">請求元</h3>
                        <div className="text-sm text-gray-700">
                          <div>株式会社フェスタル</div>
                          <div>代表取締役 田中太郎</div>
                          <div>〒100-0001 東京都千代田区千代田1-1-1</div>
                          <div>TEL: 03-1234-5678</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">請求先</h3>
                        <div className="text-sm text-gray-700">
                          <div>{billingFlow.selectedProject.client}</div>
                          <div>担当者様</div>
                        </div>
                      </div>
                    </div>

                    {/* 請求書詳細 */}
                    <div className="mb-6">
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">請求書番号:</span>
                          <span className="ml-2 font-medium">{billingFlow.primeBillingContent.billingNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">請求日:</span>
                          <span className="ml-2 font-medium">{formatDate(billingFlow.primeBillingContent.billingDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">支払期限:</span>
                          <span className="ml-2 font-medium">{formatDate(billingFlow.primeBillingContent.paymentDueDate)}</span>
                        </div>
                      </div>

                      {/* 請求内容テーブル */}
                      <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">品目</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">単価</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">数量</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">金額</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billingFlow.primeBillingContent.items.map((item) => (
                            <tr key={item.id}>
                              <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right font-medium">小計（税抜）</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-medium">{formatCurrency(billingFlow.primeBillingContent.subtotal)}</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">消費税（10%）</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(billingFlow.primeBillingContent.taxAmount)}</td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right font-bold">合計（税込）</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-bold">{formatCurrency(billingFlow.primeBillingContent.totalAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>

                      {/* 備考 */}
                      {billingFlow.primeBillingContent.remarks && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">備考</h4>
                          <div className="text-sm text-gray-700 bg-white p-3 border rounded">
                            {billingFlow.primeBillingContent.remarks}
                          </div>
                        </div>
                      )}

                      {/* 添付資料 */}
                      {billingFlow.primeBillingContent.attachments && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">添付資料</h4>
                          <div className="text-sm text-gray-700">
                            {billingFlow.primeBillingContent.attachments}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-billing-input' }))}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      戻る
                    </button>
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-billing-input' }))}
                      className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => setBillingFlow(prev => ({ ...prev, step: 'prime-email-preview' }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      メールプレビュー
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
                    onClick={() => setBillingFlow(prev => ({ ...prev, step: 'project-selection' }))}
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
                    onClick={() => {
                      if (showFinalPreviewModal) {
                        // 最終プレビューモーダルから編集モーダルに来た場合は、最終プレビューモーダルに戻る
                        setBillingFlow({ step: 'preview' });
                      } else {
                        // 通常のフローから編集モーダルに来た場合は、プレビューに戻る
                        setBillingFlow(prev => ({ ...prev, step: 'preview' }));
                      }
                    }}
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
                    onClick={() => {
                      if (showFinalPreviewModal) {
                        // 最終プレビューモーダルから編集モーダルに来た場合は、最終プレビューモーダルに戻る
                        setBillingFlow({ step: 'preview' });
                      } else {
                        // 通常のフローから編集モーダルに来た場合は、プレビューに戻る
                        setBillingFlow(prev => ({ ...prev, step: 'preview' }));
                      }
                    }}
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
              
              {filteredApplications.length > 0 ? (
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
                      {filteredApplications.map((application) => (
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
                  <div className="text-gray-500 text-lg">承認・差戻対象の請求書がありません</div>
                </div>
              )}
            </div>
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
              
              {filteredApplications.length > 0 ? (
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
                          差戻者
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          差戻日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((application) => (
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
                            <div className="text-sm text-gray-900">{application.rejectedBy || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.rejectedAt ? formatDate(application.rejectedAt) : '-'}</div>
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
              <div className="mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">承認・差戻</h2>
                  <p className="text-gray-600 mt-1">申請された請求書の承認・差戻を行います</p>
                </div>
              </div>

              {/* 検索・フィルター */}
              <SearchAndFilterSection 
                showStatusFilter={true}
                statusOptions={[
                  { value: 'pending', label: '申請中' },
                  { value: 'resubmitted', label: '再申請済' }
                ]}
              />
              
              {/* 一括操作ボタン */}
              {filteredApplications.length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
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
                    <div className="flex items-center space-x-3">
                      {selectedItems.length > 0 && (
                        <>
                          <button
                            onClick={handleBulkAutoSendSetting}
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                          >
                            一括自動送信設定
                          </button>
                          <button
                            onClick={handleBulkApprove}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            一括承認
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {filteredApplications.length > 0 ? (
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
                      {filteredApplications.map((application) => (
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
        {showBillingModal && (
          <BillingCreateModal
            isOpen={showBillingModal}
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
                  {activeTab === 'approve' 
                    ? previewApplication.status === 'resubmitted' 
                      ? '請求書プレビュー（再申請・承認・差戻）' 
                      : '請求書プレビュー（承認・差戻）' 
                    : '請求書プレビュー（閲覧）'}
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
                    <div>
                      <span className="text-gray-600">ステータス:</span>
                      <span className="ml-2 font-medium">{getStatusBadge(previewApplication.status)}</span>
                    </div>
                  </div>
                </div>

                {/* 修正コメント（再申請済の場合） */}
                {previewApplication.status === 'resubmitted' && previewApplication.comment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">修正コメント</h4>
                    <p className="text-blue-800 text-sm">{previewApplication.comment}</p>
                  </div>
                )}

                {/* PDFプレビューエリア */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">PDFプレビュー</h4>
                  <div className="bg-white border rounded-lg p-6 min-h-96">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>PDFプレビューがここに表示されます</p>
                      <p className="text-sm mt-2">請求書の内容を確認後、承認または差戻を選択してください</p>
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3">
                  {/* デバッグ情報 */}
                  <div className="text-xs text-gray-500 mb-2">
                    isAccountingUser: {isAccountingUser.toString()}, 
                    status: {previewApplication.status},
                    activeTab: {activeTab},
                    canApprove: {(previewApplication.status === 'pending' || previewApplication.status === 'resubmitted').toString()}
                  </div>
                  
                  {/* 承認・差戻タブからのプレビューの場合のみ承認・差戻ボタンを表示 */}
                  {isAccountingUser && (previewApplication.status === 'pending' || previewApplication.status === 'resubmitted') && activeTab === 'approve' && (
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
                   confirmAction === 'reject' ? '差戻確認' : 
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">差戻理由</label>
                    <textarea
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="差戻理由を入力してください"
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

        {/* 最終プレビューモーダル */}
        {showFinalPreviewModal && finalPreviewApplication && finalBillingContent && finalEmailContent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">最終プレビュー（承認後）</h3>
                <button
                  onClick={handleFinalPreviewClose}
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
                      <span className="ml-2 font-medium">{finalPreviewApplication.billingNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">案件名:</span>
                      <span className="ml-2 font-medium">{finalPreviewApplication.projectName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">クライアント:</span>
                      <span className="ml-2 font-medium">{finalPreviewApplication.clientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">請求金額:</span>
                      <span className="ml-2 font-medium">{formatCurrency(finalPreviewApplication.amount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">申請者:</span>
                      <span className="ml-2 font-medium">{finalPreviewApplication.appliedBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">申請日:</span>
                      <span className="ml-2 font-medium">{formatDate(finalPreviewApplication.appliedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* 請求内容 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">請求内容</h4>
                    <button
                      onClick={handleFinalBillingEdit}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      編集
                    </button>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{finalBillingContent.title}</h5>
                    <p className="text-gray-600 mb-3">{finalBillingContent.description}</p>
                    <div className="text-lg font-bold text-gray-900 mb-3">
                      請求金額: {formatCurrency(finalBillingContent.amount)}
                    </div>
                    <div className="space-y-2">
                      {finalBillingContent.details.map((detail: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* メール内容 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">メール内容</h4>
                    <button
                      onClick={handleFinalEmailEdit}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      編集
                    </button>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="mb-3">
                      <span className="text-gray-600 text-sm">件名:</span>
                      <div className="font-medium text-gray-900">{finalEmailContent.subject}</div>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 text-sm">宛先:</span>
                      <div className="font-medium text-gray-900">{finalEmailContent.to}</div>
                    </div>
                    {finalEmailContent.cc && (
                      <div className="mb-3">
                        <span className="text-gray-600 text-sm">CC:</span>
                        <div className="font-medium text-gray-900">{finalEmailContent.cc}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600 text-sm">本文:</span>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-gray-900 whitespace-pre-wrap">
                        {finalEmailContent.body}
                      </div>
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleFinalPreviewClose}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleTemporarySave}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    一時保存
                  </button>
                  <button
                    onClick={handleFinalConfirm}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    メール送信
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 一括承認確認モーダル */}
        {showBulkApproveConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">一括承認確認</h3>
                <p className="text-gray-600 mb-4">
                  選択された{selectedItems.length}件の請求書を一括承認しますか？
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>注意:</strong> 承認後は請求書がSharePointに保存され、メールで送信されます。
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBulkApproveConfirmModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleBulkApproveConfirm}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    承認する
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* メール送信確認モーダル */}
        {showEmailConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">メール送信確認</h3>
                <p className="text-gray-600 mb-4">
                  請求書をメールで送信しますか？
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEmailConfirmModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    いいえ
                  </button>
                  <button
                    onClick={handleEmailSend}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    はい
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