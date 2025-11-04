import { User } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SignOut, User as UserIcon, IdentificationCard } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'

interface ProfileTabProps {
  user: User
  onLogout: () => void
}

export function ProfileTab({ user, onLogout }: ProfileTabProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {user.isAdmin && <span className="text-accent font-semibold">Администратор</span>}
                {!user.isAdmin && <span>Пользователь</span>}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <UserIcon size={24} className="text-muted-foreground" weight="bold" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Имя</p>
              <p className="font-medium">{user.firstName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <UserIcon size={24} className="text-muted-foreground" weight="bold" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Фамилия</p>
              <p className="font-medium">{user.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <IdentificationCard size={24} className="text-muted-foreground" weight="bold" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">FIN код</p>
              <p className="font-medium font-mono">{user.finCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Информация об аккаунте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>ID аккаунта: <span className="font-mono">{user.id}</span></p>
          <Separator />
          <p className="text-xs">
            Для изменения личных данных обратитесь в службу поддержки.
          </p>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full"
        size="lg"
        onClick={onLogout}
      >
        <SignOut size={20} weight="bold" className="mr-2" />
        Выйти из аккаунта
      </Button>
    </div>
  )
}
