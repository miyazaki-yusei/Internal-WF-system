import {
  PlusIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const quickActions: QuickAction[] = [
  {
    id: 'new-sale',
    title: '新規案件登録',
    description: '新しい売上案件を登録',
    icon: PlusIcon,
    href: '/sales/new',
    color: 'blue'
  },
  {
    id: 'new-billing',
    title: '請求書発行',
    description: '請求書を新規作成',
    icon: DocumentTextIcon,
    href: '/billing/new',
    color: 'green'
  },
  {
    id: 'payment-check',
    title: '入金確認',
    description: '入金状況を確認',
    icon: CreditCardIcon,
    href: '/billing/payments',
    color: 'purple'
  },
  {
    id: 'new-user',
    title: 'ユーザー追加',
    description: '新しいユーザーを登録',
    icon: UserPlusIcon,
    href: '/users/new',
    color: 'orange'
  }
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
}

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${colorClasses[action.color]}`}
          >
            <div className="flex items-center space-x-3">
              <action.icon className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs opacity-75">{action.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
} 