'use client'

import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

// ファーム案件マスタ
interface FarmProject {
  id: string
  projectName: string
  customerName: string
  projectType: string
  startDate: string
  status: '未開始' | '進行中' | '完了'
  role: string
  name: string
  utilizationRate: string
  unitPrice: string
  incentive: string
  revenue: string
  laborCost: string
  paymentRecipient: string
  expenseItem: string
  expenseAmount: string
  totalExpense: string
  grossProfit: string
  salesBudgetPercent: string
  salesBudgetAmount: string
  miscellaneousBudgetPercent: string
  miscellaneousBudgetAmount: string
  incentiveBudgetPercent: string
  incentiveBudgetAmount: string
  memo: string
}

// プライム案件マスタ
interface PrimeProject {
  id: string
  projectName: string
  customerName: string
  projectType: string
  startDate: string
  deliveryDate: string
  revenueMonth: string
  status: '未開始' | '進行中' | '完了'
  role: string
  name: string
  utilizationRate: string
  unitPrice: string
  incentive: string
  revenue: string
  laborCost: string
  paymentRecipient: string
  expenseItem: string
  expenseAmount: string
  totalExpense: string
  grossProfit: string
  salesBudgetPercent: string
  salesBudgetAmount: string
  miscellaneousBudgetPercent: string
  miscellaneousBudgetAmount: string
  incentiveBudgetPercent: string
  incentiveBudgetAmount: string
  memo: string
}

// 顧客マスタ
interface Customer {
  id: string
  customerId: string
  customerName: string
  postalCode: string
  address: string
  phoneNumber: string
  email: string
  closingDate: string
  paymentTerms: string
  paymentMethod: string
  invoiceEmail: string
  internalContact: string
}

// 役職マスタ
interface Role {
  id: string
  roleName: string
}

// ユーザーマスタ
interface User {
  id: string
  userId: string
  fullName: string
  fullNameKana: string
  email: string
  phoneNumber: string
  laborCost: string
}

// 支出項目マスタ
interface ExpenseItem {
  id: string
  expenseName: string
}

// 予算比率マスタ
interface BudgetRatio {
  id: string
  salesBudgetRatio: string
  miscellaneousBudgetRatio: string
  incentiveBudgetRatio: string
}

export default function MasterPage() {
  const [activeTab, setActiveTab] = useState<'farmProjects' | 'primeProjects' | 'customers' | 'roles' | 'users' | 'expenseItems' | 'budgetRatios'>('farmProjects')
  
  // ファーム案件マスタ
  const [farmProjects, setFarmProjects] = useState<FarmProject[]>([])
  const [newFarmProject, setNewFarmProject] = useState<Partial<FarmProject>>({})
  const [editingFarmProjectId, setEditingFarmProjectId] = useState<string | null>(null)
  const [editingFarmProject, setEditingFarmProject] = useState<Partial<FarmProject>>({})

  // プライム案件マスタ
  const [primeProjects, setPrimeProjects] = useState<PrimeProject[]>([])
  const [newPrimeProject, setNewPrimeProject] = useState<Partial<PrimeProject>>({})
  const [editingPrimeProjectId, setEditingPrimeProjectId] = useState<string | null>(null)
  const [editingPrimeProject, setEditingPrimeProject] = useState<Partial<PrimeProject>>({})

  // 顧客マスタ
  const [customers, setCustomers] = useState<Customer[]>([])
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({})

  // 役職マスタ
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', roleName: 'リーダー' },
    { id: '2', roleName: 'メンバー' },
    { id: '3', roleName: '外注' }
  ])
  const [newRoleName, setNewRoleName] = useState('')
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [editingRoleName, setEditingRoleName] = useState('')

  // ユーザーマスタ
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<Partial<User>>({})
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<Partial<User>>({})

  // 支出項目マスタ
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([
    { id: '1', expenseName: '人件費' },
    { id: '2', expenseName: '外注費' },
    { id: '3', expenseName: '営業支援費' },
    { id: '4', expenseName: 'システム利用料' },
    { id: '5', expenseName: '交通費' },
    { id: '6', expenseName: 'その他' }
  ])
  const [newExpenseItemName, setNewExpenseItemName] = useState('')
  const [editingExpenseItemId, setEditingExpenseItemId] = useState<string | null>(null)
  const [editingExpenseItemName, setEditingExpenseItemName] = useState('')

  // 予算比率マスタ
  const [budgetRatios, setBudgetRatios] = useState<BudgetRatio[]>([
    { id: '1', salesBudgetRatio: '20', miscellaneousBudgetRatio: '4', incentiveBudgetRatio: '1.8' }
  ])
  const [newBudgetRatio, setNewBudgetRatio] = useState<Partial<BudgetRatio>>({})
  const [editingBudgetRatioId, setEditingBudgetRatioId] = useState<string | null>(null)
  const [editingBudgetRatio, setEditingBudgetRatio] = useState<Partial<BudgetRatio>>({})

  // ファーム案件マスタ関数
  const addFarmProject = () => {
    if (newFarmProject.projectName?.trim()) {
      const newProject: FarmProject = {
        id: Date.now().toString(),
        projectName: newFarmProject.projectName.trim(),
        customerName: newFarmProject.customerName || '',
        projectType: newFarmProject.projectType || '',
        startDate: newFarmProject.startDate || '',
        status: '未開始',
        role: newFarmProject.role || '',
        name: newFarmProject.name || '',
        utilizationRate: newFarmProject.utilizationRate || '',
        unitPrice: newFarmProject.unitPrice || '',
        incentive: newFarmProject.incentive || '',
        revenue: newFarmProject.revenue || '',
        laborCost: newFarmProject.laborCost || '',
        paymentRecipient: newFarmProject.paymentRecipient || '',
        expenseItem: newFarmProject.expenseItem || '',
        expenseAmount: newFarmProject.expenseAmount || '',
        totalExpense: newFarmProject.totalExpense || '',
        grossProfit: newFarmProject.grossProfit || '',
        salesBudgetPercent: newFarmProject.salesBudgetPercent || '',
        salesBudgetAmount: newFarmProject.salesBudgetAmount || '',
        miscellaneousBudgetPercent: newFarmProject.miscellaneousBudgetPercent || '',
        miscellaneousBudgetAmount: newFarmProject.miscellaneousBudgetAmount || '',
        incentiveBudgetPercent: newFarmProject.incentiveBudgetPercent || '',
        incentiveBudgetAmount: newFarmProject.incentiveBudgetAmount || '',
        memo: newFarmProject.memo || ''
      }
      setFarmProjects(prev => [...prev, newProject])
      setNewFarmProject({})
    }
  }

  const startEditFarmProject = (project: FarmProject) => {
    setEditingFarmProjectId(project.id)
    setEditingFarmProject(project)
  }

  const saveEditFarmProject = () => {
    if (editingFarmProject.projectName?.trim() && editingFarmProjectId) {
      setFarmProjects(prev => prev.map(project => 
        project.id === editingFarmProjectId 
          ? { ...project, ...editingFarmProject }
          : project
      ))
      setEditingFarmProjectId(null)
      setEditingFarmProject({})
    }
  }

  const cancelEditFarmProject = () => {
    setEditingFarmProjectId(null)
    setEditingFarmProject({})
  }

  const deleteFarmProject = (projectId: string) => {
    setFarmProjects(prev => prev.filter(project => project.id !== projectId))
  }

  // プライム案件マスタ関数
  const addPrimeProject = () => {
    if (newPrimeProject.projectName?.trim()) {
      const newProject: PrimeProject = {
        id: Date.now().toString(),
        projectName: newPrimeProject.projectName.trim(),
        customerName: newPrimeProject.customerName || '',
        projectType: newPrimeProject.projectType || '',
        startDate: newPrimeProject.startDate || '',
        deliveryDate: newPrimeProject.deliveryDate || '',
        revenueMonth: newPrimeProject.revenueMonth || '',
        status: '未開始',
        role: newPrimeProject.role || '',
        name: newPrimeProject.name || '',
        utilizationRate: newPrimeProject.utilizationRate || '',
        unitPrice: newPrimeProject.unitPrice || '',
        incentive: newPrimeProject.incentive || '',
        revenue: newPrimeProject.revenue || '',
        laborCost: newPrimeProject.laborCost || '',
        paymentRecipient: newPrimeProject.paymentRecipient || '',
        expenseItem: newPrimeProject.expenseItem || '',
        expenseAmount: newPrimeProject.expenseAmount || '',
        totalExpense: newPrimeProject.totalExpense || '',
        grossProfit: newPrimeProject.grossProfit || '',
        salesBudgetPercent: newPrimeProject.salesBudgetPercent || '',
        salesBudgetAmount: newPrimeProject.salesBudgetAmount || '',
        miscellaneousBudgetPercent: newPrimeProject.miscellaneousBudgetPercent || '',
        miscellaneousBudgetAmount: newPrimeProject.miscellaneousBudgetAmount || '',
        incentiveBudgetPercent: newPrimeProject.incentiveBudgetPercent || '',
        incentiveBudgetAmount: newPrimeProject.incentiveBudgetAmount || '',
        memo: newPrimeProject.memo || ''
      }
      setPrimeProjects(prev => [...prev, newProject])
      setNewPrimeProject({})
    }
  }

  const startEditPrimeProject = (project: PrimeProject) => {
    setEditingPrimeProjectId(project.id)
    setEditingPrimeProject(project)
  }

  const saveEditPrimeProject = () => {
    if (editingPrimeProject.projectName?.trim() && editingPrimeProjectId) {
      setPrimeProjects(prev => prev.map(project => 
        project.id === editingPrimeProjectId 
          ? { ...project, ...editingPrimeProject }
          : project
      ))
      setEditingPrimeProjectId(null)
      setEditingPrimeProject({})
    }
  }

  const cancelEditPrimeProject = () => {
    setEditingPrimeProjectId(null)
    setEditingPrimeProject({})
  }

  const deletePrimeProject = (projectId: string) => {
    setPrimeProjects(prev => prev.filter(project => project.id !== projectId))
  }

  // 顧客マスタ関数
  const addCustomer = () => {
    if (newCustomer.customerName?.trim()) {
      const newCustomerData: Customer = {
        id: Date.now().toString(),
        customerId: newCustomer.customerId || '',
        customerName: newCustomer.customerName.trim(),
        postalCode: newCustomer.postalCode || '',
        address: newCustomer.address || '',
        phoneNumber: newCustomer.phoneNumber || '',
        email: newCustomer.email || '',
        closingDate: newCustomer.closingDate || '',
        paymentTerms: newCustomer.paymentTerms || '',
        paymentMethod: newCustomer.paymentMethod || '',
        invoiceEmail: newCustomer.invoiceEmail || '',
        internalContact: newCustomer.internalContact || ''
      }
      setCustomers(prev => [...prev, newCustomerData])
      setNewCustomer({})
    }
  }

  const startEditCustomer = (customer: Customer) => {
    setEditingCustomerId(customer.id)
    setEditingCustomer(customer)
  }

  const saveEditCustomer = () => {
    if (editingCustomer.customerName?.trim() && editingCustomerId) {
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomerId 
          ? { ...customer, ...editingCustomer }
          : customer
      ))
      setEditingCustomerId(null)
      setEditingCustomer({})
    }
  }

  const cancelEditCustomer = () => {
    setEditingCustomerId(null)
    setEditingCustomer({})
  }

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId))
  }

  // 役職マスタ関数
  const addRole = () => {
    if (newRoleName.trim()) {
      const newRole: Role = {
        id: Date.now().toString(),
        roleName: newRoleName.trim()
      }
      setRoles(prev => [...prev, newRole])
      setNewRoleName('')
    }
  }

  const startEditRole = (role: Role) => {
    setEditingRoleId(role.id)
    setEditingRoleName(role.roleName)
  }

  const saveEditRole = () => {
    if (editingRoleName.trim() && editingRoleId) {
      setRoles(prev => prev.map(role => 
        role.id === editingRoleId 
          ? { ...role, roleName: editingRoleName.trim() }
          : role
      ))
      setEditingRoleId(null)
      setEditingRoleName('')
    }
  }

  const cancelEditRole = () => {
    setEditingRoleId(null)
    setEditingRoleName('')
  }

  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId))
  }

  // ユーザーマスタ関数
  const addUser = () => {
    if (newUser.fullName?.trim()) {
      const newUserData: User = {
        id: Date.now().toString(),
        userId: newUser.userId || '',
        fullName: newUser.fullName.trim(),
        fullNameKana: newUser.fullNameKana || '',
        email: newUser.email || '',
        phoneNumber: newUser.phoneNumber || '',
        laborCost: newUser.laborCost || ''
      }
      setUsers(prev => [...prev, newUserData])
      setNewUser({})
    }
  }

  const startEditUser = (user: User) => {
    setEditingUserId(user.id)
    setEditingUser(user)
  }

  const saveEditUser = () => {
    if (editingUser.fullName?.trim() && editingUserId) {
      setUsers(prev => prev.map(user => 
        user.id === editingUserId 
          ? { ...user, ...editingUser }
          : user
      ))
      setEditingUserId(null)
      setEditingUser({})
    }
  }

  const cancelEditUser = () => {
    setEditingUserId(null)
    setEditingUser({})
  }

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  // 支出項目マスタ関数
  const addExpenseItem = () => {
    if (newExpenseItemName.trim()) {
      const newExpenseItem: ExpenseItem = {
        id: Date.now().toString(),
        expenseName: newExpenseItemName.trim()
      }
      setExpenseItems(prev => [...prev, newExpenseItem])
      setNewExpenseItemName('')
    }
  }

  const startEditExpenseItem = (expenseItem: ExpenseItem) => {
    setEditingExpenseItemId(expenseItem.id)
    setEditingExpenseItemName(expenseItem.expenseName)
  }

  const saveEditExpenseItem = () => {
    if (editingExpenseItemName.trim() && editingExpenseItemId) {
      setExpenseItems(prev => prev.map(expenseItem => 
        expenseItem.id === editingExpenseItemId 
          ? { ...expenseItem, expenseName: editingExpenseItemName.trim() }
          : expenseItem
      ))
      setEditingExpenseItemId(null)
      setEditingExpenseItemName('')
    }
  }

  const cancelEditExpenseItem = () => {
    setEditingExpenseItemId(null)
    setEditingExpenseItemName('')
  }

  const deleteExpenseItem = (expenseItemId: string) => {
    setExpenseItems(prev => prev.filter(expenseItem => expenseItem.id !== expenseItemId))
  }

  // 予算比率マスタ関数
  const addBudgetRatio = () => {
    if (newBudgetRatio.salesBudgetRatio?.trim()) {
      const newBudgetRatioData: BudgetRatio = {
        id: Date.now().toString(),
        salesBudgetRatio: newBudgetRatio.salesBudgetRatio.trim(),
        miscellaneousBudgetRatio: newBudgetRatio.miscellaneousBudgetRatio || '',
        incentiveBudgetRatio: newBudgetRatio.incentiveBudgetRatio || ''
      }
      setBudgetRatios(prev => [...prev, newBudgetRatioData])
      setNewBudgetRatio({})
    }
  }

  const startEditBudgetRatio = (budgetRatio: BudgetRatio) => {
    setEditingBudgetRatioId(budgetRatio.id)
    setEditingBudgetRatio(budgetRatio)
  }

  const saveEditBudgetRatio = () => {
    if (editingBudgetRatio.salesBudgetRatio?.trim() && editingBudgetRatioId) {
      setBudgetRatios(prev => prev.map(budgetRatio => 
        budgetRatio.id === editingBudgetRatioId 
          ? { ...budgetRatio, ...editingBudgetRatio }
          : budgetRatio
      ))
      setEditingBudgetRatioId(null)
      setEditingBudgetRatio({})
    }
  }

  const cancelEditBudgetRatio = () => {
    setEditingBudgetRatioId(null)
    setEditingBudgetRatio({})
  }

  const deleteBudgetRatio = (budgetRatioId: string) => {
    setBudgetRatios(prev => prev.filter(budgetRatio => budgetRatio.id !== budgetRatioId))
  }

  const tabs = [
    { id: 'farmProjects', name: 'ファーム案件マスタ' },
    { id: 'primeProjects', name: 'プライム案件マスタ' },
    { id: 'customers', name: '顧客マスタ' },
    { id: 'roles', name: '役職マスタ' },
    { id: 'users', name: 'ユーザーマスタ' },
    { id: 'expenseItems', name: '支出項目マスタ' },
    { id: 'budgetRatios', name: '予算比率マスタ' }
  ] as const

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">マスター管理</h1>
      </div>

      <div className="bg-white rounded-lg shadow flex">
        {/* タブナビゲーション */}
        <div className="w-64 border-r border-gray-200">
          <nav className="p-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full text-left py-3 px-4 mb-2 rounded-lg font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="flex-1 p-6">
          {/* ファーム案件マスタ */}
          {activeTab === 'farmProjects' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">ファーム案件マスタ</h2>
                <p className="text-sm text-gray-600">ファーム案件の情報を管理します。</p>
              </div>

              {/* ファーム案件リスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-6">案件名</div>
                    <div className="col-span-2">顧客名</div>
                    <div className="col-span-2">ステータス</div>
                    <div className="col-span-1">編集</div>
                  </div>
                  
                  {farmProjects.map((project) => (
                    <div key={project.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <span className="text-gray-900">{project.projectName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">{project.customerName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === '未開始' ? 'bg-gray-100 text-gray-600' :
                          project.status === '進行中' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="col-span-1 flex space-x-2">
                        <button
                          onClick={() => startEditFarmProject(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFarmProject(project.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規ファーム案件追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newFarmProject.projectName || ''}
                  onChange={(e) => setNewFarmProject(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="新規案件名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addFarmProject()
                  }}
                />
                <button
                  onClick={addFarmProject}
                  disabled={!newFarmProject.projectName?.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}

          {/* プライム案件マスタ */}
          {activeTab === 'primeProjects' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">プライム案件マスタ</h2>
                <p className="text-sm text-gray-600">プライム案件の情報を管理します。</p>
              </div>

              {/* プライム案件リスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-6">案件名</div>
                    <div className="col-span-2">顧客名</div>
                    <div className="col-span-2">ステータス</div>
                    <div className="col-span-1">編集</div>
                  </div>
                  
                  {primeProjects.map((project) => (
                    <div key={project.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <span className="text-gray-900">{project.projectName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">{project.customerName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === '未開始' ? 'bg-gray-100 text-gray-600' :
                          project.status === '進行中' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="col-span-1 flex space-x-2">
                        <button
                          onClick={() => startEditPrimeProject(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePrimeProject(project.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規プライム案件追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newPrimeProject.projectName || ''}
                  onChange={(e) => setNewPrimeProject(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="新規案件名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addPrimeProject()
                  }}
                />
                <button
                  onClick={addPrimeProject}
                  disabled={!newPrimeProject.projectName?.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}

          {/* 顧客マスタ */}
          {activeTab === 'customers' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">顧客マスタ</h2>
                <p className="text-sm text-gray-600">プロジェクトで使用する顧客情報を管理します。</p>
              </div>

              {/* 顧客リスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-3">顧客ID</div>
                    <div className="col-span-5">顧客名</div>
                    <div className="col-span-2">電話番号</div>
                    <div className="col-span-1">編集</div>
                  </div>
                  
                  {customers.map((customer) => (
                    <div key={customer.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-900">{customer.customerId}</span>
                      </div>
                      <div className="col-span-5">
                        <span className="text-gray-900">{customer.customerName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">{customer.phoneNumber}</span>
                      </div>
                      <div className="col-span-1 flex space-x-2">
                        <button
                          onClick={() => startEditCustomer(customer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規顧客追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newCustomer.customerName || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="新規顧客名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addCustomer()
                  }}
                />
                <button
                  onClick={addCustomer}
                  disabled={!newCustomer.customerName?.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}

          {/* 役職マスタ */}
          {activeTab === 'roles' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">役職マスタ</h2>
                <p className="text-sm text-gray-600">プロジェクトで使用する役職を管理します。</p>
              </div>

              {/* 役職リスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-9">役職名</div>
                    <div className="col-span-2">編集</div>
                  </div>
                  
                  {roles.map((role) => (
                    <div key={role.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-9">
                        {editingRoleId === role.id ? (
                          <input
                            type="text"
                            value={editingRoleName}
                            onChange={(e) => setEditingRoleName(e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveEditRole()
                            }}
                          />
                        ) : (
                          <span className="text-gray-900">{role.roleName}</span>
                        )}
                      </div>
                      <div className="col-span-2 flex space-x-2">
                        {editingRoleId === role.id ? (
                          <>
                            <button
                              onClick={saveEditRole}
                              className="text-green-600 hover:text-green-800"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditRole}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditRole(role)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRole(role.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規役職追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="新規役職名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addRole()
                  }}
                />
                <button
                  onClick={addRole}
                  disabled={!newRoleName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}

          {/* ユーザーマスタ */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">ユーザーマスタ</h2>
                <p className="text-sm text-gray-600">プロジェクトで使用するユーザー情報を管理します。</p>
              </div>

              {/* ユーザーリスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-2">ユーザーID</div>
                    <div className="col-span-4">氏名</div>
                    <div className="col-span-3">メールアドレス</div>
                    <div className="col-span-1">労務費</div>
                    <div className="col-span-1">編集</div>
                  </div>
                  
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-900">{user.userId}</span>
                      </div>
                      <div className="col-span-4">
                        <span className="text-gray-900">{user.fullName}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-gray-600">{user.laborCost}</span>
                      </div>
                      <div className="col-span-1 flex space-x-2">
                        <button
                          onClick={() => startEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規ユーザー追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newUser.fullName || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="新規ユーザー名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addUser()
                  }}
                />
                <button
                  onClick={addUser}
                  disabled={!newUser.fullName?.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}

          {/* 支出項目マスタ */}
          {activeTab === 'expenseItems' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">支出項目マスタ</h2>
                <p className="text-sm text-gray-600">プロジェクトで使用する支出項目を管理します。</p>
              </div>

              {/* 支出項目リスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-9">支出項目名</div>
                    <div className="col-span-2">編集</div>
                  </div>
                  
                  {expenseItems.map((expenseItem) => (
                    <div key={expenseItem.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-9">
                        {editingExpenseItemId === expenseItem.id ? (
                          <input
                            type="text"
                            value={editingExpenseItemName}
                            onChange={(e) => setEditingExpenseItemName(e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveEditExpenseItem()
                            }}
                          />
                        ) : (
                          <span className="text-gray-900">{expenseItem.expenseName}</span>
                        )}
                      </div>
                      <div className="col-span-2 flex space-x-2">
                        {editingExpenseItemId === expenseItem.id ? (
                          <>
                            <button
                              onClick={saveEditExpenseItem}
                              className="text-green-600 hover:text-green-800"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditExpenseItem}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditExpenseItem(expenseItem)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteExpenseItem(expenseItem.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規支出項目追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newExpenseItemName}
                  onChange={(e) => setNewExpenseItemName(e.target.value)}
                  placeholder="新規支出項目名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addExpenseItem()
                  }}
                />
                <button
                  onClick={addExpenseItem}
                  disabled={!newExpenseItemName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}

          {/* 予算比率マスタ */}
          {activeTab === 'budgetRatios' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">予算比率マスタ</h2>
                <p className="text-sm text-gray-600">プロジェクトで使用する予算比率を管理します。</p>
              </div>

              {/* 予算比率リスト */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-4 items-center mb-3 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-3">営業予算比率</div>
                    <div className="col-span-3">雑費予算比率</div>
                    <div className="col-span-3">インセンティブ予算比率</div>
                    <div className="col-span-2">編集</div>
                  </div>
                  
                  {budgetRatios.map((budgetRatio) => (
                    <div key={budgetRatio.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-b-0">
                      <div className="col-span-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-900">{budgetRatio.salesBudgetRatio}%</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-900">{budgetRatio.miscellaneousBudgetRatio}%</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-900">{budgetRatio.incentiveBudgetRatio}%</span>
                      </div>
                      <div className="col-span-2 flex space-x-2">
                        <button
                          onClick={() => startEditBudgetRatio(budgetRatio)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBudgetRatio(budgetRatio.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新規予算比率追加 */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newBudgetRatio.salesBudgetRatio || ''}
                  onChange={(e) => setNewBudgetRatio(prev => ({ ...prev, salesBudgetRatio: e.target.value }))}
                  placeholder="営業予算比率..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addBudgetRatio()
                  }}
                />
                <button
                  onClick={addBudgetRatio}
                  disabled={!newBudgetRatio.salesBudgetRatio?.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">※利用されているデータは削除できません。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 