'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string;
  name: string;
  type: 'farm' | 'prime';
  status: 'active' | 'completed' | 'pending';
  client: string;
  amount: number;
}

interface BillingCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: Project;
  projects: Project[];
}

export default function BillingCreateModal({ 
  isOpen, 
  onClose, 
  selectedProject, 
  projects 
}: BillingCreateModalProps) {
  const [formData, setFormData] = useState({
    projectId: selectedProject?.id || '',
    projectName: selectedProject?.name || '',
    clientName: selectedProject?.client || '',
    billingNumber: '',
    amount: selectedProject?.amount || 0,
    description: '',
    billingDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: 10,
    notes: ''
  });

  const [projectSelectionMode, setProjectSelectionMode] = useState<'existing' | 'new'>(
    selectedProject ? 'existing' : 'new'
  );
  const [showProjectList, setShowProjectList] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      setFormData(prev => ({
        ...prev,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        clientName: selectedProject.client,
        amount: selectedProject.amount
      }));
      setProjectSelectionMode('existing');
    }
  }, [selectedProject]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectSelect = (project: Project) => {
    setFormData(prev => ({
      ...prev,
      projectId: project.id,
      projectName: project.name,
      clientName: project.client,
      amount: project.amount
    }));
    setProjectSelectionMode('existing');
    setShowProjectList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('請求書作成:', formData);
    alert('請求書を作成しました。');
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const calculateTaxAmount = () => {
    return Math.round(formData.amount * (formData.taxRate / 100));
  };

  const calculateTotalAmount = () => {
    return formData.amount + calculateTaxAmount();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">請求書作成</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* 案件選択セクション */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">案件情報</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                案件選択方法
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="existing"
                    checked={projectSelectionMode === 'existing'}
                    onChange={(e) => setProjectSelectionMode(e.target.value as 'existing' | 'new')}
                    className="mr-2"
                  />
                  既存案件から選択
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="new"
                    checked={projectSelectionMode === 'new'}
                    onChange={(e) => setProjectSelectionMode(e.target.value as 'existing' | 'new')}
                    className="mr-2"
                  />
                  新規案件入力
                </label>
              </div>
            </div>

            {projectSelectionMode === 'existing' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案件選択
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    onClick={() => setShowProjectList(true)}
                    placeholder="案件を選択してください"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                  {showProjectList && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        >
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-gray-600">{project.client}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {projectSelectionMode === 'new' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    案件名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    クライアント名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* 請求書詳細セクション */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">請求書詳細</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  請求書番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.billingNumber}
                  onChange={(e) => handleInputChange('billingNumber', e.target.value)}
                  placeholder="BILL-XXX-YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  請求金額 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  請求日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.billingDate}
                  onChange={(e) => handleInputChange('billingDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  支払期限
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                請求内容の詳細
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="請求内容の詳細を入力してください..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="備考があれば入力してください..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>
          </div>

          {/* 金額計算セクション */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">金額計算</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    税率 (%)
                  </label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">税抜金額:</span>
                  <span className="font-medium">{formatCurrency(formData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">消費税 ({formData.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(calculateTaxAmount())}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>税込合計:</span>
                  <span className="text-blue-600">{formatCurrency(calculateTotalAmount())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              請求書作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 