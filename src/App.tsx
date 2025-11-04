import { useState, useEffect } from 'react'
import { User } from '@/types'
import { AuthScreen } from '@/components/AuthScreen'
import { MainApp } from '@/components/MainApp'
import { Toaster } from '@/components/ui/sonner'
import { seedDemoData } from '@/lib/seedData'
import { Package } from '@phosphor-icons/react'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg mx-auto w-fit">
            <Package size={48} weight="bold" className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex gap-1 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-muted-foreground font-medium">Загрузка...</p>
          </div>
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