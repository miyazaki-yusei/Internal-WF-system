import { ClockIcon } from '@heroicons/react/24/outline'

interface Activity {
  id: number
  type: 'sale' | 'billing' | 'payment' | 'user'
  title: string
  description: string
  time: string
  user: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

const activityIcons = {
  sale: '💰',
  billing: '📄',
  payment: '✅',
  user: '👤'
}

const activityColors = {
  sale: 'bg-green-100 text-green-800',
  billing: 'bg-blue-100 text-blue-800',
  payment: 'bg-purple-100 text-purple-800',
  user: 'bg-gray-100 text-gray-800'
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">直近のアクティビティ</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          すべて表示
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activityColors[activity.type]}`}>
              {activityIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <div className="flex items-center mt-1">
                <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">{activity.time}</span>
                <span className="text-xs text-gray-400 mx-1">•</span>
                <span className="text-xs text-gray-500">{activity.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 