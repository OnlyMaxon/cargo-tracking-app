import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateFIN, validatePassword, validateName, formatFIN, generateId } from '@/lib/validators'
import { User } from '@/types'
import { Package } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AuthScreenProps {
  onLogin: (user: User) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [loginFIN, setLoginFIN] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regFIN, setRegFIN] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateFIN(loginFIN)) {
      setError('FIN код должен содержать 7 символов (буквы и цифры)')
      setLoading(false)
      return
    }

    if (!validatePassword(loginPassword)) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    try {
      const users = (await window.spark.kv.get<Record<string, User>>('users')) || {}
      const user = Object.values(users).find(u => u.finCode === loginFIN.toUpperCase())

      if (!user) {
        setError('Пользователь не найден')
        setLoading(false)
        return
      }

      const passwords = (await window.spark.kv.get<Record<string, string>>('passwords')) || {}
      if (passwords[user.id] !== loginPassword) {
        setError('Неверный пароль')
        setLoading(false)
        return
      }

      onLogin(user)
    } catch (err) {
      setError('Ошибка входа. Попробуйте снова.')
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateName(regFirstName)) {
      setError('Введите корректное имя (минимум 2 символа)')
      setLoading(false)
      return
    }

    if (!validateName(regLastName)) {
      setError('Введите корректную фамилию (минимум 2 символа)')
      setLoading(false)
      return
    }

    if (!validateFIN(regFIN)) {
      setError('FIN код должен содержать 7 символов (буквы и цифры)')
      setLoading(false)
      return
    }

    if (!validatePassword(regPassword)) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    try {
      const users = (await window.spark.kv.get<Record<string, User>>('users')) || {}
      const finExists = Object.values(users).some(u => u.finCode === regFIN.toUpperCase())

      if (finExists) {
        setError('Пользователь с таким FIN кодом уже зарегистрирован')
        setLoading(false)
        return
      }

      const userId = generateId()
      const newUser: User = {
        id: userId,
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        finCode: regFIN.toUpperCase(),
        isAdmin: false
      }

      users[userId] = newUser
      await window.spark.kv.set('users', users)

      const passwords = (await window.spark.kv.get<Record<string, string>>('passwords')) || {}
      passwords[userId] = regPassword
      await window.spark.kv.set('passwords', passwords)

      onLogin(newUser)
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте снова.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl">
              <Package size={32} weight="bold" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Cargo Tracking</CardTitle>
          <CardDescription>Система отслеживания грузов</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-fin">FIN код</Label>
                  <Input
                    id="login-fin"
                    placeholder="ABC1234"
                    value={loginFIN}
                    onChange={(e) => setLoginFIN(formatFIN(e.target.value))}
                    maxLength={7}
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-firstname">Имя</Label>
                  <Input
                    id="reg-firstname"
                    placeholder="Иван"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-lastname">Фамилия</Label>
                  <Input
                    id="reg-lastname"
                    placeholder="Иванов"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-fin">FIN код</Label>
                  <Input
                    id="reg-fin"
                    placeholder="ABC1234"
                    value={regFIN}
                    onChange={(e) => setRegFIN(formatFIN(e.target.value))}
                    maxLength={7}
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">
                    7 символов: буквы и цифры
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Пароль</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Минимум 6 символов
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
