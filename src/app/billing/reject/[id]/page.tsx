'use client';

import { useState, useEffect } fromreact';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface RejectedBilling {
  id: string;
  projectName: string;
  clientName: string;
  billingNumber: string;
  amount: number;
  appliedAt: string;
  appliedBy: string;
  rejectedAt: string;
  rejectedBy: string;
  rejectComment: string;
  items: BillingItememarks: string;
}

interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function BillingRejectPage() [object Object]const params = useParams();
  const router = useRouter();
  const [billing, setBilling] = useState<RejectedBilling | null>(null);
  const [loading, setLoading] = useState(true);
  constreply, setReply] = useState();

  // サンプルデータ
  const mockRejectedBilling: RejectedBilling = {
    id: '3,
    projectName: '農場C 設備導入,
    clientName: '農場C有限会社',
    billingNumber:BILL-3-202401,
    amount: 2000,
    appliedAt:2024-0801,
    appliedBy: '山田次郎,
    rejectedAt:2024-1001,
    rejectedBy: '経理担当者B',
    rejectComment: 請求書の明細が不正確です。修正して再申請してください。',
    items:    [object Object]
        id: '1',
        description: '農場C 設備導入',
        quantity: 1,
        unitPrice: 20000,
        amount:2000      }
    ],
    remarks: 設備導入に関する請求書です。'
  };

  useEffect(() => {
    const billingId = params.id as string;
    // 実際の実装ではAPIからデータを取得
    if (billingId ===3[object Object]      setBilling(mockRejectedBilling);
    }
    setLoading(false);
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style:currency,
      currency: 'JPY'
    }).format(amount);
  };

  const updateItem = (index: number, field: keyof BillingItem, value: any) => [object Object]
    if (!billing) return;
    
    const newItems = [...billing.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // 金額を再計算
    newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount,0   
    setBilling(prev => prev ?[object Object]    ...prev,
      items: newItems,
      amount: totalAmount
    } : null);
  };

  const handleSubmit = () => {
    if (!reply.trim())[object Object]      alert(経理からのコメントに対するリプライを入力してください。);
      return;
    }

    // 修正・再申請処理
    console.log(修正・再申請:', billing?.id, reply);
    alert(修正・再申請が完了しました。);
    
    // 申請一覧ページへ遷移
    router.push('/billing/apply');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12er-b-2er-blue-60</div>
          <p className=mt-4t-gray-600込み中...</p>
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="min-h-screen bg-gray-50    <div className=max-w-4xl mx-auto px-4:px-68py-8    <div className="text-center>     <h1 className="text-2ont-bold text-gray-90mb-4>差戻し案件が見つかりません</h1>
            <p className=text-gray-60mb-6>指定された差戻し案件は存在しません。</p>
            <Link
              href="/billing/apply"
              className=inline-flex items-center px-42lue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      <div className=max-w-4xl mx-auto px-4sm:px-6x-8 py-8>
        {/* ヘッダー */}
        <div className=mb-8>
          <Link
            href="/billing/apply"
            className=text-blue-600over:text-blue-800 inline-flex items-center mb-4"
          >
            ← 申請一覧に戻る
          </Link>
          <h1 className="text-3ont-bold text-gray-900件修正</h1>
          <p className=text-gray-60mt-1>経理からのコメントを確認し、修正して再申請してください</p>
        </div>

        <div className="space-y-6>
          {/* 差戻しコメント */}
          <div className="bg-red-50der border-red-200 rounded-lg p-6>
            <div className="flex items-start>              <div className="flex-shrink-0>
                <svg className=w-55text-red-400fill="currentColorviewBox="0 0 2020">
                  <path fillRule=evenodd d=M10 18880116 0c00.418.582-8-8 358288880116 0-1.41441410-141410.4140.58610l-1.293.29310 10.414-10.4140110.414.29302931000.414L114140.293.2931000-14141408586 clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3>
                <h3 className="text-lg font-medium text-red-8003
                <p className=text-sm text-red-800 mt-2">
                  <strong>差戻し担当者:</strong>[object Object]billing.rejectedBy}
                </p>
                <p className=text-sm text-red-800 mt-2">
                  <strong>差戻し日:</strong>[object Object]billing.rejectedAt}
                </p>
                <p className=text-sm text-red-800 mt-2">
                  {billing.rejectComment}
                </p>
              </div>
            </div>
          </div>

          {/* 請求書情報 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4rder-b border-gray-200>     <h2 className="text-lg font-semibold text-gray-900">請求書情報</h2          </div>

            <div className="p-6 space-y-6>
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6              <div>
                  <label className="block text-sm font-medium text-gray-70 mb-2
                  <p className=text-gray-900>{billing.billingNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-70mb-2">案件名</label>
                  <p className=text-gray-900>{billing.projectName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-70mb-2">顧客名</label>
                  <p className=text-gray-900billing.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-70mb-2">申請者</label>
                  <p className=text-gray-900>{billing.appliedBy}</p>
                </div>
              </div>

              {/* 請求項目 */}
              <div>
                <h3 className="text-lg font-medium text-gray-90h3
                <div className="space-y-4">
                  {billing.items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-70mb-2">項目名</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-70 mb-2">数量</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-70 mb-2">単価</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-70 mb-2">金額</label>
                          <input
                            type="text"
                            value={formatCurrency(item.amount)}
                            className="w-full px-3 py-2 border border-gray-300rounded-md bg-gray-50"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 合計金額 */}
              <div className="border-t border-gray-200 pt-4              <div className="flex justify-between items-center>
                <span className="text-lg font-medium text-gray-90n>
                <span className="text-2ont-bold text-gray-90atCurrency(billing.amount)}</span>
              </div>
            </div>

            {/* 備考 */}
            <div className="px-6 pb-6>            <label className="block text-sm font-medium text-gray-70 mb-2">備考</label>
              <textarea
                value={billing.remarks}
                onChange=[object Object](e) => setBilling(prev => prev ? [object Object] ...prev, remarks: e.target.value } : null)}
                rows={4         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500       placeholder="備考があれば入力してください"
              />
            </div>
          </div>

          {/* リプライ */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4rder-b border-gray-200>     <h2 className="text-lg font-semibold text-gray-900のリプライ</h2</div>
            <div className="p-6>              <div className="bg-blue-50er border-blue-200 rounded-lg p-4 mb-4>
                <p className=text-sm text-blue-800">
                  経理からのコメントに対して、必ずリプライを入力してください。
                </p>
              </div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder=経理からのコメントに対するリプライを入力してください..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500              rows={4          required
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end space-x-4 pt-6>             <Link
                href="/billing/apply"
                className=px-6t-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                キャンセル
              </Link>
              <button
                onClick={handleSubmit}
                disabled={!reply.trim()}
                className=px-62lue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-30isabled:cursor-not-allowed transition-colors">
                修正・再申請
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 