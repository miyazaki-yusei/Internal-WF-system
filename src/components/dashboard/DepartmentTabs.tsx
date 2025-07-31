'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const departments = [
  { key: 'all', label: '全体' },
  { key: 'consulting', label: 'コンサル事業部' },
  { key: 'telecom', label: '通信事業部' },
  { key: 'regional', label: '地方創生事業部' },
]

const consultingTabs = [
  { key: 'farm', label: 'ファーム集計' },
  { key: 'prime', label: 'プライム集計' },
  { key: 'budget', label: '予算集計' },
]

interface DepartmentTabsProps {
  department: string
  setDepartment: (key: string) => void
  consultingTab: string
  setConsultingTab: (key: string) => void
}

export default function DepartmentTabs({ 
  department, 
  setDepartment, 
  consultingTab, 
  setConsultingTab
}: DepartmentTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment)
    if (newDepartment === 'consulting') {
      // コンサル事業部に切り替えた場合、デフォルトでファーム集計を表示
      const params = new URLSearchParams(searchParams)
      params.delete('tab')
      router.push(`/dashboard?${params.toString()}`)
    } else {
      // 他の部門に切り替えた場合、タブパラメータを削除
      const params = new URLSearchParams(searchParams)
      params.delete('tab')
      router.push(`/dashboard?${params.toString()}`)
    }
  }

  const handleConsultingTabChange = (newTab: string) => {
    setConsultingTab(newTab)
    // すべてのタブでURLパラメータを削除（成績表はサイドバーからアクセス）
    const params = new URLSearchParams(searchParams)
    params.delete('tab')
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <div className="mb-6">
      {/* 部門タブ */}
      <div className="flex space-x-2 mb-2">
        {departments.map((d) => (
          <button
            key={d.key}
            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${
              department === d.key
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
            }`}
            onClick={() => handleDepartmentChange(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* コンサル事業部サブタブ */}
      {department === 'consulting' && (
        <div className="flex space-x-2 border-b mb-4">
          {consultingTabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                consultingTab === tab.key
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
              }`}
              onClick={() => handleConsultingTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 