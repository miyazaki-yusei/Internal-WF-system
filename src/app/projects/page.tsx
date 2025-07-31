'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'

interface TeamMember {
  id: string;
  role: 'leader' | 'member' | 'outsource';
  name: string;
  utilizationRate: string;
  unitPrice: string;
  incentive: string;
}

interface Payment {
  id: string;
  recipient: string;
  item: string;
  amount: string;
}

interface BudgetRatio {
  salesBudget: string;
  miscellaneousBudget: string;
  incentiveBudget: string;
}

interface Project {
  id: string;
  name: string;
  type: 'farm' | 'prime';
  status: 'active' | 'completed' | 'pending';
  client: string;
  amount: number;
  startDate: string;
  endDate: string;
  deliveryDate?: string;
  revenueMonth?: string;
  // 詳細情報を追加
  formData: {
    name: string;
    customer: string;
    startDate: string;
    deliveryDate?: string;
    revenueMonth?: string;
    revenue: string;
    expenses: string;
    laborCost: string;
    memo: string;
  };
  teamMembers: TeamMember[];
  payments: Payment[];
  budgetRatio: BudgetRatio;
  budgetAmounts: {
    salesBudgetAmount: string;
    miscellaneousBudgetAmount: string;
    incentiveBudgetAmount: string;
  };
}

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'farm' | 'prime'>('farm');

  // ローカルストレージからプロジェクトを読み込み
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // 例として5つの案件を追加
      const sampleProjects: Project[] = [
        {
          id: '1',
          name: 'ECサイトリニューアル',
          type: 'farm',
          status: 'active',
          client: '株式会社ABC',
          amount: 2500000,
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          formData: {
            name: 'ECサイトリニューアル',
            customer: '株式会社ABC',
            startDate: '2024-01-15',
            revenue: '2,500,000',
            expenses: '1,800,000',
            laborCost: '1,500,000',
            memo: '既存ECサイトのUI/UX改善と機能追加'
          },
          teamMembers: [
            {
              id: '1-1',
              role: 'leader',
              name: '田中太郎',
              utilizationRate: '100',
              unitPrice: '80,000',
              incentive: '15'
            },
            {
              id: '1-2',
              role: 'member',
              name: '佐藤花子',
              utilizationRate: '80',
              unitPrice: '60,000',
              incentive: '10'
            }
          ],
          payments: [
            {
              id: '1-p1',
              recipient: 'クラウドサービス',
              item: 'サーバー費用',
              amount: '300,000'
            }
          ],
          budgetRatio: {
            salesBudget: '10',
            miscellaneousBudget: '5',
            incentiveBudget: '8'
          },
          budgetAmounts: {
            salesBudgetAmount: '250,000',
            miscellaneousBudgetAmount: '125,000',
            incentiveBudgetAmount: '200,000'
          }
        },
        {
          id: '2',
          name: '社内システム開発',
          type: 'farm',
          status: 'active',
          client: '株式会社XYZ',
          amount: 1800000,
          startDate: '2024-02-01',
          endDate: '2024-08-31',
          formData: {
            name: '社内システム開発',
            customer: '株式会社XYZ',
            startDate: '2024-02-01',
            revenue: '1,800,000',
            expenses: '1,200,000',
            laborCost: '1,000,000',
            memo: '人事管理システムの新規開発'
          },
          teamMembers: [
            {
              id: '2-1',
              role: 'leader',
              name: '山田次郎',
              utilizationRate: '100',
              unitPrice: '75,000',
              incentive: '12'
            },
            {
              id: '2-2',
              role: 'member',
              name: '鈴木一郎',
              utilizationRate: '90',
              unitPrice: '55,000',
              incentive: '8'
            }
          ],
          payments: [
            {
              id: '2-p1',
              recipient: 'データベース',
              item: 'ライセンス費用',
              amount: '200,000'
            }
          ],
          budgetRatio: {
            salesBudget: '8',
            miscellaneousBudget: '3',
            incentiveBudget: '6'
          },
          budgetAmounts: {
            salesBudgetAmount: '144,000',
            miscellaneousBudgetAmount: '54,000',
            incentiveBudgetAmount: '108,000'
          }
        },
        {
          id: '3',
          name: 'モバイルアプリ開発',
          type: 'farm',
          status: 'completed',
          client: '株式会社DEF',
          amount: 3200000,
          startDate: '2023-10-01',
          endDate: '2024-03-31',
          formData: {
            name: 'モバイルアプリ開発',
            customer: '株式会社DEF',
            startDate: '2023-10-01',
            revenue: '3,200,000',
            expenses: '2,400,000',
            laborCost: '2,000,000',
            memo: 'iOS/Android対応のフィットネスアプリ開発'
          },
          teamMembers: [
            {
              id: '3-1',
              role: 'leader',
              name: '高橋美咲',
              utilizationRate: '100',
              unitPrice: '85,000',
              incentive: '18'
            },
            {
              id: '3-2',
              role: 'member',
              name: '伊藤健太',
              utilizationRate: '85',
              unitPrice: '65,000',
              incentive: '12'
            },
            {
              id: '3-3',
              role: 'outsource',
              name: '外注デザイナー',
              utilizationRate: '60',
              unitPrice: '50,000',
              incentive: '5'
            }
          ],
          payments: [
            {
              id: '3-p1',
              recipient: 'デザイン会社',
              item: 'UIデザイン',
              amount: '400,000'
            }
          ],
          budgetRatio: {
            salesBudget: '12',
            miscellaneousBudget: '6',
            incentiveBudget: '10'
          },
          budgetAmounts: {
            salesBudgetAmount: '384,000',
            miscellaneousBudgetAmount: '192,000',
            incentiveBudgetAmount: '320,000'
          }
        },
        {
          id: '4',
          name: 'AI分析システム構築',
          type: 'prime',
          status: 'active',
          client: '株式会社GHI',
          amount: 5000000,
          startDate: '2024-03-01',
          endDate: '2024-12-31',
          deliveryDate: '2024-12-15',
          revenueMonth: '2024-12',
          formData: {
            name: 'AI分析システム構築',
            customer: '株式会社GHI',
            startDate: '2024-03-01',
            deliveryDate: '2024-12-15',
            revenueMonth: '2024-12',
            revenue: '5,000,000',
            expenses: '3,500,000',
            laborCost: '2,800,000',
            memo: '機械学習を用いたデータ分析システムの構築'
          },
          teamMembers: [
            {
              id: '4-1',
              role: 'leader',
              name: '渡辺智子',
              utilizationRate: '100',
              unitPrice: '100,000',
              incentive: '20'
            },
            {
              id: '4-2',
              role: 'member',
              name: '中村大輔',
              utilizationRate: '90',
              unitPrice: '80,000',
              incentive: '15'
            },
            {
              id: '4-3',
              role: 'member',
              name: '小林恵子',
              utilizationRate: '80',
              unitPrice: '70,000',
              incentive: '12'
            }
          ],
          payments: [
            {
              id: '4-p1',
              recipient: 'AIサービス',
              item: 'API利用料',
              amount: '700,000'
            }
          ],
          budgetRatio: {
            salesBudget: '15',
            miscellaneousBudget: '8',
            incentiveBudget: '12'
          },
          budgetAmounts: {
            salesBudgetAmount: '750,000',
            miscellaneousBudgetAmount: '400,000',
            incentiveBudgetAmount: '600,000'
          }
        },
        {
          id: '5',
          name: 'クラウド移行プロジェクト',
          type: 'prime',
          status: 'pending',
          client: '株式会社JKL',
          amount: 4200000,
          startDate: '2024-05-01',
          endDate: '2025-02-28',
          deliveryDate: '2025-02-15',
          revenueMonth: '2025-02',
          formData: {
            name: 'クラウド移行プロジェクト',
            customer: '株式会社JKL',
            startDate: '2024-05-01',
            deliveryDate: '2025-02-15',
            revenueMonth: '2025-02',
            revenue: '4,200,000',
            expenses: '2,800,000',
            laborCost: '2,200,000',
            memo: 'オンプレミスシステムからAWSへの移行'
          },
          teamMembers: [
            {
              id: '5-1',
              role: 'leader',
              name: '加藤正義',
              utilizationRate: '100',
              unitPrice: '90,000',
              incentive: '18'
            },
            {
              id: '5-2',
              role: 'member',
              name: '斎藤真理',
              utilizationRate: '85',
              unitPrice: '70,000',
              incentive: '12'
            },
            {
              id: '5-3',
              role: 'outsource',
              name: 'クラウド専門家',
              utilizationRate: '70',
              unitPrice: '60,000',
              incentive: '8'
            }
          ],
          payments: [
            {
              id: '5-p1',
              recipient: 'AWS',
              item: 'クラウド費用',
              amount: '600,000'
            }
          ],
          budgetRatio: {
            salesBudget: '10',
            miscellaneousBudget: '5',
            incentiveBudget: '8'
          },
          budgetAmounts: {
            salesBudgetAmount: '420,000',
            miscellaneousBudgetAmount: '210,000',
            incentiveBudgetAmount: '336,000'
          }
        }
      ];
      
      setProjects(sampleProjects);
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }
  }, []);

  // プロジェクトをローカルストレージに保存
  const saveProjects = (newProjects: Project[]) => {
    localStorage.setItem('projects', JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  // 新規プロジェクトを追加
  const addProject = (projectData: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.formData.name,
      type: projectData.type,
      status: 'active',
      client: projectData.formData.customer,
      amount: parseInt(projectData.formData.revenue.replace(/[^\d]/g, '')) || 0,
      startDate: projectData.formData.startDate,
      endDate: projectData.formData.deliveryDate || '',
      formData: projectData.formData,
      teamMembers: projectData.teamMembers,
      payments: projectData.payments,
      budgetRatio: projectData.budgetRatio,
      budgetAmounts: projectData.budgetAmounts,
    };
    
    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
  };

  // プロジェクトを更新
  const updateProject = (projectId: string, updatedData: any) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            name: updatedData.formData.name,
            client: updatedData.formData.customer,
            amount: parseInt(updatedData.formData.revenue.replace(/[^\d]/g, '')) || 0,
            formData: updatedData.formData,
            teamMembers: updatedData.teamMembers,
            payments: updatedData.payments,
            budgetRatio: updatedData.budgetRatio,
            budgetAmounts: updatedData.budgetAmounts
          }
        : project
    );
    saveProjects(updatedProjects);
  };

  // プロジェクト詳細を表示
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetailModal(true);
  };

  // プロジェクト編集を開始
  const handleEditProject = () => {
    if (selectedProject) {
      // プロジェクトデータをローカルストレージに保存して編集ページに渡す
      const editData = {
        id: selectedProject.id,
        type: selectedProject.type,
        formData: selectedProject.formData,
        teamMembers: selectedProject.teamMembers,
        payments: selectedProject.payments,
        budgetRatio: selectedProject.budgetRatio,
        budgetAmounts: selectedProject.budgetAmounts
      };
      localStorage.setItem('editProjectData', JSON.stringify(editData));
      
      // 該当する案件登録ページに遷移
      window.location.href = `/projects/new/${selectedProject.type}`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: '進行中', color: 'bg-green-100 text-green-800' },
      completed: { text: '完了', color: 'bg-blue-100 text-blue-800' },
      pending: { text: '待機中', color: 'bg-yellow-100 text-yellow-800' }
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

  const handleProjectTypeSelect = (type: 'farm' | 'prime') => {
    setIsModalOpen(false);
    // 選択されたタイプに応じて登録画面に移動
    window.location.href = `/projects/new/${type}`;
  };

  // プロジェクト登録・更新完了時のコールバックを設定
  useEffect(() => {
    // グローバルイベントリスナーを設定
    const handleProjectRegistered = (event: CustomEvent) => {
      addProject(event.detail);
    };

    const handleProjectUpdated = (event: CustomEvent) => {
      updateProject(event.detail.id, event.detail);
    };

    window.addEventListener('projectRegistered', handleProjectRegistered as EventListener);
    window.addEventListener('projectUpdated', handleProjectUpdated as EventListener);
    
    return () => {
      window.removeEventListener('projectRegistered', handleProjectRegistered as EventListener);
      window.removeEventListener('projectUpdated', handleProjectUpdated as EventListener);
    };
  }, []);

  // アクティブなタブに基づいてプロジェクトをフィルタリング
  const filteredProjects = projects.filter(project => project.type === activeTab);

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">案件管理</h1>
        <p className="text-gray-600 mt-1">案件の登録、編集、進捗管理を行います</p>
      </div>

      {/* 新規案件登録・検索・フィルター */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 新規案件登録ボタン（一番左） */}
          <div className="lg:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規案件登録
            </button>
          </div>
          
          {/* 検索・フィルター（右側） */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <input
                type="text"
                placeholder="案件名、クライアント名で検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">全てのステータス</option>
                <option value="active">進行中</option>
                <option value="completed">完了</option>
                <option value="pending">未開始</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 inline-block">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('farm')}
              className={`w-48 py-4 px-6 text-center font-semibold text-base transition-all duration-200 ${
                activeTab === 'farm'
                  ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-25'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${activeTab === 'farm' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                <span>ファーム案件</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === 'farm' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {projects.filter(p => p.type === 'farm').length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('prime')}
              className={`w-48 py-4 px-6 text-center font-semibold text-base transition-all duration-200 ${
                activeTab === 'prime'
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-25'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${activeTab === 'prime' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span>プライム案件</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === 'prime' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {projects.filter(p => p.type === 'prime').length}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* 案件一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === 'farm' ? 'ファーム案件' : 'プライム案件'}一覧
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クライアント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  開始日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  終了予定日
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
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {activeTab === 'farm' ? 'ファーム案件' : 'プライム案件'}が登録されていません。新規案件を登録してください。
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleProjectClick(project)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.startDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.endDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(project.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新規案件登録モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">案件種別を選択</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleProjectTypeSelect('farm')}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="font-medium text-gray-900">ファーム案件</div>
                </div>
              </button>
              
              <button
                onClick={() => handleProjectTypeSelect('prime')}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="font-medium text-gray-900">プライム案件</div>
                </div>
              </button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* プロジェクト詳細モーダル */}
      {showProjectDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">
                  案件詳細
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEditProject}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    編集
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    onClick={() => {
                      setShowProjectDetailModal(false);
                      setSelectedProject(null);
                    }}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-8">
                {/* 案件情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className={`w-2 h-2 ${selectedProject.type === 'farm' ? 'bg-orange-500' : 'bg-purple-500'} rounded-full mr-3`}></div>
                    案件情報
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">案件名:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.name}</span>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">顧客名:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.customer}</span>
                    </div>
                    <div className="flex items-center py-2">
                      <span className="font-medium text-gray-700 w-24">案件種別:</span>
                      <span className="ml-3 text-gray-900">
                        {selectedProject.type === 'farm' ? 'ファーム案件' : 'プライム案件'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* スケジュール情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className={`w-2 h-2 ${selectedProject.type === 'farm' ? 'bg-orange-500' : 'bg-purple-500'} rounded-full mr-3`}></div>
                    スケジュール情報
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">開始年月日:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.startDate}</span>
                    </div>
                    {selectedProject.formData.deliveryDate && (
                      <div className="flex items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 w-24">納品予定日:</span>
                        <span className="ml-3 text-gray-900">{selectedProject.formData.deliveryDate}</span>
                      </div>
                    )}
                    {selectedProject.formData.revenueMonth && (
                      <div className="flex items-center py-2">
                        <span className="font-medium text-gray-700 w-24">売上計上予定月:</span>
                        <span className="ml-3 text-gray-900">{selectedProject.formData.revenueMonth}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* アサイン情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className={`w-2 h-2 ${selectedProject.type === 'farm' ? 'bg-orange-500' : 'bg-purple-500'} rounded-full mr-3`}></div>
                    アサイン情報
                  </h4>
                  <div className="space-y-3">
                    {selectedProject.teamMembers.map((member, index) => (
                      <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">役割:</span>
                            <span className="ml-2 text-gray-900">
                              {member.role === 'leader' ? 'リーダー' : member.role === 'member' ? 'メンバー' : '外注'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">名前:</span>
                            <span className="ml-2 text-gray-900">{member.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">単価:</span>
                            <span className="ml-2 text-gray-900">{member.unitPrice}円</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">インセンティブ:</span>
                            <span className="ml-2 text-gray-900">{member.incentive}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 財務情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className={`w-2 h-2 ${selectedProject.type === 'farm' ? 'bg-orange-500' : 'bg-purple-500'} rounded-full mr-3`}></div>
                    財務情報
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">売上（自動計算）:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{selectedProject.formData.revenue}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">労務費（概算）:</span>
                        <span className="ml-2 text-gray-900">{selectedProject.formData.laborCost}円</span>
                      </div>
                    </div>
                    
                    {/* その他支出項目 */}
                    {selectedProject.payments.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600 block mb-2">その他支出項目:</span>
                        <div className="space-y-2">
                          {selectedProject.payments.map((payment, index) => (
                            <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="font-medium text-gray-600">{payment.item}:</span>
                              <span className="text-gray-900">{payment.amount}円</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">支出合計:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{selectedProject.formData.expenses}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">粗利:</span>
                        <span className="ml-2 text-gray-900 font-semibold">
                          {(parseInt(selectedProject.formData.revenue.replace(/[^\d]/g, '')) - parseInt(selectedProject.formData.expenses.replace(/[^\d]/g, ''))).toLocaleString()}円
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 予算情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className={`w-2 h-2 ${selectedProject.type === 'farm' ? 'bg-orange-500' : 'bg-purple-500'} rounded-full mr-3`}></div>
                    予算情報
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">営業予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.salesBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.salesBudgetAmount}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">雑費予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.miscellaneousBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.miscellaneousBudgetAmount}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">インセンティブ予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.incentiveBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.incentiveBudgetAmount}円)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* メモ欄 */}
                {selectedProject.formData.memo && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className={`w-2 h-2 ${selectedProject.type === 'farm' ? 'bg-orange-500' : 'bg-purple-500'} rounded-full mr-3`}></div>
                      メモ欄
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                      <span className="whitespace-pre-wrap text-gray-900">{selectedProject.formData.memo}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-6 space-x-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowProjectDetailModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 