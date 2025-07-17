'use client';

import { useState, useEffect } fromreact';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  type: 'farm' | 'prime';
  client: string;
  amount: number;
}

interface BillingForm {
  projectId: string;
  billingNumber: string;
  billingDate: string;
  dueDate: string;
  items: BillingItem[];
  totalAmount: number;
  remarks: string;
}

interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function BillingNewPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<BillingForm>({
    projectId: '',
    billingNumber: '',
    billingDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [],
    totalAmount: 0,
    remarks: '',
  });

  // サンプルデータ
  const mockProjects: Project[] = [
    { id: '1', name: '農場A システム開発', type: 'farm', client: '農場A株式会社', amount: 1500 },
    { id: '2', name: 'プライム案件B 保守運用', type: 'prime', client: 'プライム企業B', amount: 800 },
  ];

  useEffect(() => {
    const projectId = params.projectId as string;
    const foundProject = mockProjects.find(p => p.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
      setForm(prev => ({
        ...prev,
        projectId,
        billingNumber: `BILL-${projectId}-${new Date().getFullYear()}${String(new Date().getMonth() +1).padStart(2)}`,
        items: [
          {
            id: '1',
            description: foundProject.name,
            quantity: 1,
            unitPrice: foundProject.amount,
            amount: foundProject.amount
          }
        ],
        totalAmount: foundProject.amount
      }));
    }
    setLoading(false);
  }, [params.projectId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const updateItem = (index: number, field: keyof BillingItem, value: any) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // 金額を再計算
    newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);
    
    setForm(prev => ({
      ...prev,
      items: newItems,
      totalAmount
    }));
  };

  const addItem = () => {
    const newItem: BillingItem = {
      id: String(form.items.length + 1),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount:0
    };
    
    setForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);
    
    setForm(prev => ({
      ...prev,
      items: newItems,
      totalAmount
    }));
  };

  const handleSubmit = () => {
    // バリデーション
    if (!form.billingNumber || !form.billingDate || !form.dueDate) {
      alert('必須項目を入力してください。');
      return;
    }

    if (form.items.length === 0) {
      alert('請求項目を入力してください。');
      return;
    }

    // 申請確認ページへ遷移
    router.push(`/billing/apply/confirm?data=${encodeURIComponent(JSON.stringify(form))}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 border-b-2order-blue-600"></div>
          <p className="mt-4 text-gray-600込み中...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50    <div className=max-w-7xl mx-auto px-4sm:px-68py-8    <div className="text-center>     <h1 className="text-2ont-bold text-gray-900mb-4>案件が見つかりません</h1>
            <p className=text-gray-600 mb-6>指定された案件は存在しません。</p>
            <Link
              href="/projects"
              className=inline-flex items-center px-42lue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              案件一覧に戻る
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
        <div className="mb-8>
          <Link
            href={`/projects/${project.id}`}
            className="text-blue-600over:text-blue-800 inline-flex items-center mb-4"
          >
            ← 案件詳細に戻る
          </Link>
          <h1 className="text-3ont-bold text-gray-900">請求書作成</h1>
          <p className=text-gray-600 mt-1">案件:[object Object]project.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4rder-b border-gray-200>     <h2 className="text-lg font-semibold text-gray-900">請求書情報</h2          </div>

          <div className="p-6 space-y-6>
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  請求書番号 <span className=text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.billingNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, billingNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  請求日 <span className=text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.billingDate}
                  onChange={(e) => setForm(prev => ({ ...prev, billingDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  支払期限 <span className=text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm(prev => ([object Object] ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  顧客名
                </label>
                <input
                  type="text"
                  value={project.client}
                  className="w-full px-3 py-2 border border-gray-300rounded-md bg-gray-50"
                  disabled
                />
              </div>
            </div>

            {/* 請求項目 */}
            <div>
              <div className=flex items-center justify-between mb-4>
                <h3 className="text-lg font-medium text-gray-900">請求項目</h3
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  項目追加
                </button>
              </div>

              <div className="space-y-4>
                {form.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          項目名
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          数量
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          単価
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          金額
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(item.amount)}
                          className="w-full px-3 py-2 border border-gray-300rounded-md bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                    {form.items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className=mt-2text-red-60hover:text-red-800 text-sm"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 合計金額 */}
            <div className="border-t border-gray-200 pt-4>              <div className="flex justify-between items-center>
                <span className="text-lg font-medium text-gray-900n>
                <span className="text-2ont-bold text-gray-900ormatCurrency(form.totalAmount)}</span>
              </div>
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                value={form.remarks}
                onChange={(e) => setForm(prev => ([object Object] ...prev, remarks: e.target.value }))}
                rows={4         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2ocus:ring-blue-500 focus:border-blue-500       placeholder="備考があれば入力してください"
              />
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4 pt-6rder-t border-gray-20>             <Link
                href={`/projects/${project.id}`}
                className="px-6py-2t-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors>
                キャンセル
              </Link>
              <button
                onClick={handleSubmit}
                className=px-62lue-600 text-white rounded-md hover:bg-blue-700 transition-colors>
                経理へ申請
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 