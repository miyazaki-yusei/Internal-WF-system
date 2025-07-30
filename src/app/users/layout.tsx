import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <Sidebar />
      
      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <Header />
        
        {/* ページコンテンツ */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 