'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function BillingRejectPage() {
  const params = useParams();
  const router = useRouter();
  const [billing, setBilling] = useState<BillingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reply, setReply] = useState('');

  // サンプルデータ
  const mockRejectedBilling: BillingApplication = {
    id: '3',
    projectName: 'コンサルファームC 設備導入',
    clientName: 'コンサルファームC有限会社',
    billingNumber: 'BILL-3-202401',
    amount: 200000,
    status: 'rejected',
    appliedAt: '2024-08-01',
    appliedBy: '山田次郎',
    rejectedAt: '2024-10-01',
    rejectedBy: '経理担当者B',
    comment: '請求書の明細が不正確です。修正して再申請してください。',
    billingDate: '2024-08-01',
    dueDate: '2024-09-01',
    taxRate: 10,
    notes: '設備導入に関する請求書です。',
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
  };

  useEffect(() => {
    const billingId = params.id as string;
    // 実際の実装ではAPIからデータを取得
    if (billingId === '3') {
      setBilling(mockRejectedBilling);
    }
    setLoading(false);
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (data: any) => {
    console.log('修正・再申請:', data);
    // 修正・再申請処理
    alert('修正・再申請が完了しました。');
    
    // 申請一覧ページへ遷移
    router.push('/billing/apply');
  };

  const handleReplySubmit = () => {
    if (!reply.trim()) {
      alert('経理からのコメントに対するリプライを入力してください。');
      return;
    }

    // リプライ送信処理
    console.log('リプライ送信:', billing?.id, reply);
    alert('リプライを送信しました。');
    
    // 申請一覧ページへ遷移
    router.push('/billing/apply');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">差戻し案件が見つかりません</h1>
            <p className="text-gray-600 mb-6">指定された差戻し案件は存在しません。</p>
            <Link
              href="/billing/apply"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              申請一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/billing/apply"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-4"
          >
            ← 申請一覧に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">差戻し案件修正</h1>
          <p className="text-gray-600 mt-1">経理からのコメントを確認し、修正して再申請してください</p>
        </div>

        <div className="space-y-6">
          {/* 差戻しコメント */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">差戻しコメント</h3>
                <p className="text-sm text-red-800 mt-2">
                  <strong>差戻し担当者:</strong> {billing.rejectedBy}
                </p>
                <p className="text-sm text-red-800 mt-2">
                  <strong>差戻し日:</strong> {billing.rejectedAt}
                </p>
                <p className="text-sm text-red-800 mt-2">
                  {billing.comment}
                </p>
              </div>
            </div>
          </div>

          {/* 請求書情報 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">請求書情報</h2>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  請求書を編集
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">請求書番号</label>
                  <p className="text-gray-900">{billing.billingNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">案件名</label>
                  <p className="text-gray-900">{billing.projectName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">顧客名</label>
                  <p className="text-gray-900">{billing.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">申請者</label>
                  <p className="text-gray-900">{billing.appliedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">請求日</label>
                  <p className="text-gray-900">{billing.billingDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支払期限</label>
                  <p className="text-gray-900">{billing.dueDate}</p>
                </div>
              </div>

              {/* 請求項目 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">請求項目</h3>
                <div className="space-y-4">
                  {billing.items?.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">項目名</label>
                          <p className="text-gray-900">{item.summary}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                          <p className="text-gray-900">{item.quantity}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">単価</label>
                          <p className="text-gray-900">{formatCurrency(item.unitPrice)}</p>
                        </div>
                      </div>
                      <div className="mt-4 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          小計: {formatCurrency(item.amount)}
                        </span>
                      </div>
                      {item.remarks && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                          <p className="text-gray-900 text-sm">{item.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 合計金額 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">合計金額</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(billing.amount)}</span>
                </div>
              </div>

              {/* 備考 */}
              {billing.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
                  <p className="text-gray-900">{billing.notes}</p>
                </div>
              )}

              {/* リプライ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  経理からのコメントに対するリプライ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="修正内容や対応状況を入力してください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/billing/apply"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </Link>
            <button
              onClick={handleReplySubmit}
              disabled={!reply.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              修正・再申請
            </button>
          </div>
        </div>

        {/* 統一モーダル */}
        <UnifiedBillingModal
          isOpen={showModal}
          onClose={handleCloseModal}
          mode="edit"
          billing={billing}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 