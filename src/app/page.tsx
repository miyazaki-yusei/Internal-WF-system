import Link from 'next/link'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Festal基幹システム
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            売上管理・成績・請求書作成・経理台帳の一気通貫システム
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* ダッシュボード */}
            <Link href="/dashboard" className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <ChartBarIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ダッシュボード</h3>
                <p className="text-gray-600 text-sm">全体の状況を一覧で確認できます</p>
              </div>
            </Link>

            {/* 案件管理 */}
            <Link href="/projects" className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <DocumentTextIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">案件管理</h3>
                <p className="text-gray-600 text-sm">案件の一覧・詳細・作成・編集</p>
              </div>
            </Link>

            {/* 請求管理 */}
            <Link href="/dashboard" className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <CreditCardIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">請求管理</h3>
                <p className="text-gray-600 text-sm">請求書作成・申請・承認・差戻し管理</p>
              </div>
            </Link>



            {/* 顧客管理 */}
            <Link href="/masters/customers" className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <BuildingOfficeIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">顧客管理</h3>
                <p className="text-gray-600 text-sm">顧客情報の一覧・登録・編集</p>
              </div>
            </Link>

            {/* シフト管理 */}
            <Link href="/shifts" className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <UserGroupIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">シフト管理</h3>
                <p className="text-gray-600 text-sm">稼働管理・シフト作成・編集</p>
              </div>
            </Link>

            {/* マスタ設定 */}
            <Link href="/masters" className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                  <Cog6ToothIcon className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">マスタ設定</h3>
                <p className="text-gray-600 text-sm">各種マスタデータの管理</p>
              </div>
            </Link>
          </div>

          {/* 新機能のお知らせ */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎉 新機能リリース</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">✨ 請求書作成モーダル</h3>
                <p className="text-sm text-blue-700">
                  ページ遷移なしで請求書を作成できるモーダル機能を追加しました。
                  リアルタイムプレビューで入力内容を確認できます。
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">📊 案件管理システム</h3>
                <p className="text-sm text-green-700">
                  案件の一覧表示、詳細確認、新規作成機能を実装しました。
                  検索・フィルター機能で効率的に案件を管理できます。
                </p>
              </div>
            </div>
          </div>

          {/* クイックアクセス */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクセス</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                請求管理
              </Link>

              <Link 
                href="/projects" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                案件一覧
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                ダッシュボード
              </Link>
              <Link 
                href="/masters/customers" 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                顧客管理
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 