'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CurrentUser {
  id: string
  name: string
  email: string
  department: 'sales' | 'consulting' | 'regional' | 'accounting'
  role: 'user' | 'admin'
  status: 'active' | 'inactive'
}

interface UserContextType {
  currentUser: CurrentUser
  setCurrentUser: (user: CurrentUser) => void
  isAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: '4',
    name: '山田次郎',
    email: 'yamada@festal.co.jp',
    department: 'accounting',
    role: 'admin',
    status: 'active'
  })

  const isAdmin = currentUser.role === 'admin'

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      isAdmin
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 