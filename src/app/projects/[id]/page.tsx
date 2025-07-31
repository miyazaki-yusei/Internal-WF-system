'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string;
  name: string;
  type: 'farm' | 'prime';
  status: 'active' | 'completed' | 'pending';
  client: string;
  amount: number;
  startDate: string;
  endDate: string;
  description: string;
  members: string[];
  progress: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // サンプルデータ
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'コンサルファームA システム開発',
      type: 'farm',
      status: 'active',
      client: 'コンサルファームA株式会社',
      amount: 1500000,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      description: 'コンサルファーム管理システムの開発プロジェクト。生産管理、在庫管理、販売管理機能を実装。',
      members: ['田中太郎', '佐藤花子'],
      progress: 65
    },
    {
      id: '2',
      name: 'プライム案件B 保守運用',
      type: 'prime',
      status: 'active',
      client: 'プライム企業B',
      amount: 800000,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      description: '既存システムの保守運用業務。定期メンテナンス、障害対応、機能改善を実施。',
      members: ['山田次郎', '鈴木三郎'],
      progress: 45
    }
  ];

  useEffect(() => {
    const projectId = params.id as string;
    const foundProject = mockProjects.find(p => p.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
    }
    setLoading(false);
  }, [params.id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">案件が見つかりません</h1>
          <p className="text-gray-600 mb-6">指定された案件は存在しません。</p>
          <Link
            href="/projects"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            案件一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/projects"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                ← 案件一覧に戻る
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                {getTypeBadge(project.type)}
                {getStatusBadge(project.status)}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/billing/new/${project.id}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                請求書作成
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 案件概要 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900">案件概要</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案件名</label>
                  <p className="text-gray-900">{project.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">顧客</label>
                  <p className="text-gray-900">{project.client}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案件金額</label>
                  <p className="text-gray-900 font-semibold">{formatCurrency(project.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
                  <p className="text-gray-900">{project.startDate} 〜 {project.endDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                  <p className="text-gray-900">{project.description}</p>
                </div>
              </div>
            </div>

            {/* 進捗状況 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900">進捗状況</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>進捗率</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メンバー</label>
                  <div className="flex flex-wrap gap-2">
                    {project.members.map((member, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* クイックアクション */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <Link
                  href={`/billing/new/${project.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  請求書作成
                </Link>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  案件編集
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  進捗更新
                </button>
              </div>
            </div>

            {/* 案件情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">案件情報</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">案件ID</span>
                  <span className="font-medium">{project.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">案件種別</span>
                  <span className="font-medium">{project.type === 'farm' ? 'ファーム案件' : 'プライム案件'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">案件状態</span>
                  <span className="font-medium">{project.status === 'active' ? '進行中' : project.status === 'completed' ? '完了' : 'その他'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 