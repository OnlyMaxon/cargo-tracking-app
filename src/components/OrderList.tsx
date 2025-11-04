import { useState, useEffect } from 'react'
import { Order } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusColor, formatDate } from '@/lib/validators'
import { Package, Truck, Warehouse, CheckCircle } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { OrderDetailDialog } from './OrderDetailDialog'

interface OrderListProps {
  userId: string
}

export function OrderList({ userId }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [userId])

  const loadOrders = async () => {
    try {
      const allOrders = (await window.spark.kv.get<Record<string, Order>>('orders')) || {}
      const userOrders = Object.values(allOrders)
        .filter(order => order.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt)
      setOrders(userOrders)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Truck size={20} weight="bold" />
      case 'warehouse':
        return <Warehouse size={20} weight="bold" />
      case 'delivered':
        return <CheckCircle size={20} weight="bold" />
      default:
        return <Package size={20} weight="bold" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <Package size={48} className="mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <Package size={64} className="mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Нет заказов</h3>
              <p className="text-muted-foreground">
                У вас пока нет отслеживаемых посылок. Заказы появятся здесь после добавления.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5">{getStatusIcon(order.status)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{order.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.trackingNumber}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} shrink-0 text-xs font-semibold uppercase tracking-wide`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-3 pb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Откуда:</span>
                  <span className="font-medium">{order.from}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Куда:</span>
                  <span className="font-medium">{order.to}</span>
                </div>
                <div className="flex justify-between text-sm mt-2 pt-2 border-t">
                  <span className="text-muted-foreground">Обновлено:</span>
                  <span className="text-xs">{formatDate(order.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}
