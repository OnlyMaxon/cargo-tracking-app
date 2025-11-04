import { useState, useEffect } from 'react'
import { User } from '@/types'
import { AuthScreen } from '@/components/AuthScreen'
import { MainApp } from '@/components/MainApp'
import { Toaster } from '@/components/ui/sonner'
import { seedDemoData } from '@/lib/seedData'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      await seedDemoData()
      
      const sessionUserId = await window.spark.kv.get<string>('currentUserId')
      if (sessionUserId) {
        const users = (await window.spark.kv.get<Record<string, User>>('users')) || {}
        const user = users[sessionUserId]
        if (user) {
          setCurrentUser(user)
        }
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (user: User) => {
    setCurrentUser(user)
    await window.spark.kv.set('currentUserId', user.id)
  }

  const handleLogout = async () => {
    setCurrentUser(null)
    await window.spark.kv.delete('currentUserId')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentUser ? (
        <MainApp user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
      <Toaster />
    </>
  )
}

export default App