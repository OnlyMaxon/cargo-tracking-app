import { useState, useEffect } from 'react'
import { User, OrderStatus } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FirebaseService } from '@/lib/firebaseService'
import { generateId } from '@/lib/validators'
import { MagnifyingGlass, User as UserIcon, Package, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AddOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrderAdded: () => void
}

export function AddOrderDialog({ open, onOpenChange, onOrderAdded }: AddOrderDialogProps) {
  const [searchFIN, setSearchFIN] = useState('')
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    trackingNumber: '',
    title: '',
    description: '',
    weight: '',
    from: '',
    to: '',
    status: 'in-transit' as OrderStatus
  })

  useEffect(() => {
    if (open) {
      loadUsers()
      resetForm()
    }
  }, [open])

  useEffect(() => {
    if (searchFIN.trim()) {
      const filtered = allUsers.filter(user => 
        user.finCode.includes(searchFIN.toUpperCase()) ||
        user.firstName.toLowerCase().includes(searchFIN.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchFIN.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(allUsers)
    }
  }, [searchFIN, allUsers])

  const loadUsers = async () => {
    try {
      const usersData = await FirebaseService.users.getAll()
      const usersList = Object.values(usersData).filter(u => !u.isAdmin)
      setAllUsers(usersList)
      setFilteredUsers(usersList)
    } catch (err) {
      console.error('Failed to load users:', err)
      toast.error('Ошибка загрузки пользователей')
    }
  }

  const resetForm = () => {
    setSearchFIN('')
    setSelectedUser(null)
    setFormData({
      trackingNumber: '',
      title: '',
      description: '',
      weight: '',
      from: '',
      to: '',
      status: 'in-transit'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) {
      toast.error('Выберите пользователя')
      return
    }

    if (!formData.trackingNumber || !formData.title || !formData.from || !formData.to) {
      toast.error('Заполните все обязательные поля')
      return
    }

    setLoading(true)

    try {
      const orderId = generateId()
      const now = Date.now()

      await FirebaseService.orders.create(orderId, {
        id: orderId,
        userId: selectedUser.id,
        trackingNumber: formData.trackingNumber,
        title: formData.title,
        description: formData.description,
        weight: formData.weight,
        from: formData.from,
        to: formData.to,
        status: formData.status,
        createdAt: now,
        updatedAt: now,
        statusHistory: [{
          status: formData.status,
          timestamp: now,
          note: 'Заказ создан администратором'
        }]
      })

      const notifId = generateId()
      await FirebaseService.notifications.create(notifId, {
        id: notifId,
        userId: selectedUser.id,
        orderId,
        message: `Новый заказ ${formData.trackingNumber} добавлен в систему`,
        read: false,
        createdAt: now
      })

      toast.success('Заказ успешно добавлен')
      onOrderAdded()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to create order:', err)
      toast.error('Ошибка создания заказа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Добавить новый заказ</DialogTitle>
          <DialogDescription>
            Найдите пользователя по FIN коду и добавьте информацию о заказе
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-hidden flex-1">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">1. Выберите пользователя</Label>
              
              {!selectedUser ? (
                <div className="space-y-3">
                  <div className="relative">
                    <MagnifyingGlass
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Поиск по FIN коду, имени или фамилии..."
                      value={searchFIN}
                      onChange={(e) => setSearchFIN(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="h-40 border rounded-lg p-2">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <UserIcon size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Пользователи не найдены</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredUsers.map(user => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              setSelectedUser(user)
                              setSearchFIN('')
                            }}
                            className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors flex items-center gap-3"
                          >
                            <UserIcon size={20} className="text-primary" />
                            <div className="flex-1">
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">FIN: {user.finCode}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              ) : (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full">
                      <UserIcon size={24} weight="bold" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{selectedUser.firstName} {selectedUser.lastName}</div>
                      <div className="text-sm text-muted-foreground">FIN: {selectedUser.finCode}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    <XCircle size={20} />
                  </Button>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <Label className="text-base font-semibold mb-3 block">2. Информация о заказе</Label>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trackingNumber">Трек-номер *</Label>
                    <Input
                      id="trackingNumber"
                      placeholder="TR123456789"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as OrderStatus }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-transit">🚚 В пути</SelectItem>
                        <SelectItem value="warehouse">📦 На складе</SelectItem>
                        <SelectItem value="delivered">✅ Доставлен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Название товара *</Label>
                  <Input
                    id="title"
                    placeholder="Например: Ноутбук Apple MacBook Pro"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Дополнительная информация о товаре..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Вес (кг)</Label>
                  <Input
                    id="weight"
                    placeholder="2.5"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">Откуда *</Label>
                    <Input
                      id="from"
                      placeholder="Например: Москва"
                      value={formData.from}
                      onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">Куда *</Label>
                    <Input
                      id="to"
                      placeholder="Например: Баку"
                      value={formData.to}
                      onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-auto pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={!selectedUser || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Создание...
                </>
              ) : (
                <>
                  <Package size={18} className="mr-2" />
                  Создать заказ
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
