import { useState, useEffect } from 'react'
import { User } from '@/types'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { OrderList } from './OrderList'
import { SupportTab } from './SupportTab'
import { ProfileTab } from './ProfileTab'
import { AppsTab } from './AppsTab'
import { AdminPanel } from './AdminPanel'
import { Package, ChatCircle, User as UserIcon, GridFour, ShieldCheck } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MainAppProps {
  user: User
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('orders')

  const tabs = [
    { id: 'orders', label: 'Список', icon: Package },
    { id: 'support', label: 'Support', icon: ChatCircle },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'apps', label: 'Apps', icon: GridFour },
  ]

  if (user.isAdmin) {
    tabs.push({ id: 'admin', label: 'Админ', icon: ShieldCheck })
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Package size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Cargo Tracking</h1>
              <p className="text-xs text-muted-foreground">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          {user.isAdmin && (
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
              <ShieldCheck size={16} weight="bold" />
              ADMIN
            </div>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <TabsContent value="orders" className="h-full m-0">
            <OrderList userId={user.id} />
          </TabsContent>

          <TabsContent value="support" className="h-full m-0 overflow-auto">
            <SupportTab />
          </TabsContent>

          <TabsContent value="profile" className="h-full m-0 overflow-auto">
            <ProfileTab user={user} onLogout={onLogout} />
          </TabsContent>

          <TabsContent value="apps" className="h-full m-0 overflow-auto">
            <AppsTab />
          </TabsContent>

          {user.isAdmin && (
            <TabsContent value="admin" className="h-full m-0">
              <AdminPanel />
            </TabsContent>
          )}
        </div>

        <nav className="border-t bg-card">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 h-auto py-2 px-2',
                    isActive && 'text-primary bg-primary/10'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={22} weight={isActive ? 'fill' : 'regular'} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>
      </Tabs>
    </div>
  )
}
