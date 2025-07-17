'use client';

import { useState, useEffect } fromreact';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface BillingForm {
  projectId: string;
  billingNumber: string;
  billingDate: string;
  dueDate: string;
  items: BillingItemotalAmount: number;
  remarks: string;
}

interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function BillingConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState<BillingForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setForm(parsedData);
      } catch (error) {
        console.error('データの解析に失敗しました:', error);
      }
    }
    setLoading(false);
  }, searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style:currency,
      currency: 'JPY'
    }).format(amount);
  };

  const handleSubmit = () => {
    // 申請処理
    console.log('申請データ:', form);
    
    // 成功メッセージを表示
    alert('申請が完了しました。');
    
    // 申請一覧ページへ遷移
    router.push('/billing/apply');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12rder-b-2der-blue-600</div>
          <p className="mt-4t-gray-600込み中...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50    <div className=max-w-4xl mx-auto px-4:px-68py-8    <div className="text-center>     <h1 className="text-2ont-bold text-gray-90mb-4>データが見つかりません</h1>
            <p className=text-gray-60 mb-6>請求書データを正しく取得できませんでした。</p>
            <Link
              href="/billing"
              className=inline-flex items-center px-42lue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              請求管理に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=max-w-4xl mx-auto px-4sm:px-6x-8 py-8>
        {/* ヘッダー */}
        <div className=mb-8>
          <Link
            href="/billing"
            className=text-blue-600over:text-blue-800 inline-flex items-center mb-4"
          >
            ← 請求管理に戻る
          </Link>
          <h1 className="text-3ont-bold text-gray-900">申請確認</h1>
          <p className=text-gray-60 mt-1">請求書の内容を確認して申請してください</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4rder-b border-gray-200>     <h2 className="text-lg font-semibold text-gray-900">請求書内容確認</h2          </div>

          <div className="p-6 space-y-6>
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6              <div>
                <label className="block text-sm font-medium text-gray-700mb-2l>
                <p className="text-gray-900form.billingNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700mb-2">請求日</label>
                <p className="text-gray-900>{form.billingDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">支払期限</label>
                <p className="text-gray-900>{form.dueDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">案件ID</label>
                <p className="text-gray-900[object Object]form.projectId}</p>
              </div>
            </div>

            {/* 請求項目 */}
            <div>
              <h3 className="text-lg font-medium text-gray-90</h3
              <div className="border border-gray-200 rounded-lg overflow-hidden>
                <table className=min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        項目名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        数量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金額
                      </th>
                    </tr>
                  </thead>
                  <tbody className=bg-white divide-y divide-gray-200">
                    {form.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6y-4 whitespace-nowrap text-sm text-gray-900">
                         [object Object]item.description}
                        </td>
                        <td className="px-6y-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6y-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-6y-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 合計金額 */}
            <div className="border-t border-gray-200 pt-4              <div className="flex justify-between items-center>
                <span className="text-lg font-medium text-gray-900n>
                <span className="text-2ont-bold text-gray-900ormatCurrency(form.totalAmount)}</span>
              </div>
            </div>

            {/* 備考 */}
          [object Object]form.remarks && (
              <div>
                <label className="block text-sm font-medium text-gray-70 mb-2">備考</label>
                <p className="text-gray-900>{form.remarks}</p>
              </div>
            )}

            {/* 注意事項 */}
            <div className="bg-yellow-50rder border-yellow-200 rounded-lg p-4>              <div className="flex>
                <div className="flex-shrink-0">
                  <svg className="h-5-5t-yellow-400viewBox=0 0 2020fill="currentColor">
                    <path fillRule="evenodd d=M80.257 399c0.765-1.36 2.722-1.36 30.486 00.58.92c.75 1.334-0.213 298-10.742 2.984.421.53-2.493-10.646-174320.98l5.58-992zM11 13a110 11-2 0 1 1 0 12 0zm-1-8a1 1000-1 1v3a1 10 002 01001 clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">申請前の確認</h3
                  <div className=mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>請求金額が正しいことを確認してください</li>
                      <li>請求項目の内容が正確であることを確認してください</li>
                      <li>申請後は経理担当者が内容を確認し、承認または差戻しを行います</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4 pt-6rder-t border-gray-20             <Link
                href={`/billing/new/${form.projectId}`}
                className="px-6t-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors>
                修正する
              </Link>
              <button
                onClick={handleSubmit}
                className=px-62lue-600 text-white rounded-md hover:bg-blue-700 transition-colors>
                申請する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 