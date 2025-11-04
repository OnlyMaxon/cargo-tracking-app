import { useState, useEffect } from 'react'
import { Order, User, OrderStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getStatusLabel, getStatusColor, formatDate, generateId } from '@/lib/validators'
import { MagnifyingGlass, Bell, Package } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<Record<string, User>>({})
  const [searchFIN, setSearchFIN] = useState('')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchFIN.trim()) {
      const userIds = Object.values(users)
        .filter(u => u.finCode.includes(searchFIN.toUpperCase()))
        .map(u => u.id)
      
      setFilteredOrders(orders.filter(o => userIds.includes(o.userId)))
    } else {
      setFilteredOrders(orders)
    }
  }, [searchFIN, orders, users])

  const loadData = async () => {
    try {
      const allOrders = (await window.spark.kv.get<Record<string, Order>>('orders')) || {}
      const allUsers = (await window.spark.kv.get<Record<string, User>>('users')) || {}
      
      const orderList = Object.values(allOrders).sort((a, b) => b.updatedAt - a.updatedAt)
      setOrders(orderList)
      setFilteredOrders(orderList)
      setUsers(allUsers)
    } catch (err) {
      console.error('Failed to load data:', err)
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    try {
      const allOrders = (await window.spark.kv.get<Record<string, Order>>('orders')) || {}
      const order = allOrders[orderId]
      
      if (!order) {
        toast.error('Заказ не найден')
        return
      }

      const now = Date.now()
      order.status = newStatus
      order.updatedAt = now
      order.statusHistory.push({
        status: newStatus,
        timestamp: now,
        note
      })

      allOrders[orderId] = order
      await window.spark.kv.set('orders', allOrders)

      await sendNotification(order.userId, orderId, `Статус заказа изменен: ${getStatusLabel(newStatus)}`)

      loadData()
      toast.success('Статус успешно обновлен')
    } catch (err) {
      console.error('Failed to update status:', err)
      toast.error('Ошибка обновления статуса')
    }
  }

  const sendNotification = async (userId: string, orderId: string, message: string) => {
    try {
      const notifications = (await window.spark.kv.get<Record<string, any>>('notifications')) || {}
      const notifId = generateId()
      
      notifications[notifId] = {
        id: notifId,
        userId,
        orderId,
        message,
        read: false,
        createdAt: Date.now()
      }

      await window.spark.kv.set('notifications', notifications)
    } catch (err) {
      console.error('Failed to send notification:', err)
    }
  }

  const getUserInfo = (userId: string) => {
    const user = users[userId]
    return user ? `${user.firstName} ${user.lastName} (${user.finCode})` : 'Неизвестный'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-2">
          <Package size={48} className="mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Панель администратора</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Поиск по FIN коду..."
                value={searchFIN}
                onChange={(e) => setSearchFIN(e.target.value.toUpperCase())}
                className="pl-10 uppercase"
              />
            </div>
            <Button onClick={loadData} variant="outline">
              Обновить
            </Button>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div>Всего заказов: <span className="font-bold">{orders.length}</span></div>
            <Separator orientation="vertical" className="h-5" />
            <div>В поиске: <span className="font-bold">{filteredOrders.length}</span></div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">{order.title}</h3>
                        <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-xs font-semibold uppercase tracking-wide`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Клиент:</span>{' '}
                        <span className="font-medium">{getUserInfo(order.userId)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Маршрут:</span>{' '}
                        <span className="font-medium">{order.from} → {order.to}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Создан:</span>{' '}
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Обновлен:</span>{' '}
                        <span>{formatDate(order.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden lg:block" />

                  <div className="lg:w-80 space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Изменить статус
                      </label>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-transit">В пути</SelectItem>
                          <SelectItem value="warehouse">На складе</SelectItem>
                          <SelectItem value="delivered">Доставлен</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const message = `Обновление по заказу ${order.trackingNumber}`
                        sendNotification(order.userId, order.id, message)
                        toast.success('Уведомление отправлено')
                      }}
                    >
                      <Bell size={16} className="mr-2" />
                      Отправить уведомление
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchFIN ? 'Заказы не найдены' : 'Нет заказов в системе'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
