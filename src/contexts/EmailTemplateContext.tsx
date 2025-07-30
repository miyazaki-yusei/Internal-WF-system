'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'farm' | 'prime' | 'general'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EmailTemplateContextType {
  templates: EmailTemplate[]
  addTemplate: (template: EmailTemplate) => void
  updateTemplate: (template: EmailTemplate) => void
  deleteTemplate: (id: string) => void
  getTemplateByType: (type: 'farm' | 'prime' | 'general') => EmailTemplate | undefined
  getActiveTemplates: () => EmailTemplate[]
}

const EmailTemplateContext = createContext<EmailTemplateContextType | undefined>(undefined)

export function EmailTemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'ファーム案件用テンプレート',
      subject: '【{{clientName}}】請求書の件',
      body: '{{clientName}}様\n\n平素より格別のご高配を賜り、厚く御礼申し上げます。\n\n下記の通り請求書を発行いたします。\n\n【請求内容】\n{{billingContent}}\n\n【請求金額】\n{{amount}}円\n\nご確認のほど、よろしくお願いいたします。\n\n{{additionalMessage}}\n\n敬具',
      type: 'farm',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'プライム案件用テンプレート',
      subject: '【{{clientName}}】請求書の件',
      body: '{{clientName}}様\n\n平素より格別のご高配を賜り、厚く御礼申し上げます。\n\n下記の通り請求書を発行いたします。\n\n【請求内容】\n{{billingContent}}\n\n【請求金額】\n{{amount}}円\n\nご確認のほど、よろしくお願いいたします。\n\n{{additionalMessage}}\n\n敬具',
      type: 'prime',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      name: '一般案件用テンプレート',
      subject: '【{{clientName}}】請求書の件',
      body: '{{clientName}}様\n\n平素より格別のご高配を賜り、厚く御礼申し上げます。\n\n下記の通り請求書を発行いたします。\n\n【請求内容】\n{{billingContent}}\n\n【請求金額】\n{{amount}}円\n\nご確認のほど、よろしくお願いいたします。\n\n{{additionalMessage}}\n\n敬具',
      type: 'general',
      isActive: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-05'
    }
  ])

  const addTemplate = (template: EmailTemplate) => {
    setTemplates(prev => [...prev, template])
  }

  const updateTemplate = (template: EmailTemplate) => {
    setTemplates(prev => prev.map(t => t.id === template.id ? template : t))
  }

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  const getTemplateByType = (type: 'farm' | 'prime' | 'general') => {
    return templates.find(t => t.type === type && t.isActive)
  }

  const getActiveTemplates = () => {
    return templates.filter(t => t.isActive)
  }

  return (
    <EmailTemplateContext.Provider value={{
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      getTemplateByType,
      getActiveTemplates
    }}>
      {children}
    </EmailTemplateContext.Provider>
  )
}

export function useEmailTemplates() {
  const context = useContext(EmailTemplateContext)
  if (context === undefined) {
    throw new Error('useEmailTemplates must be used within an EmailTemplateProvider')
  }
  return context
} 