import { Order } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getStatusLabel, getStatusColor, formatDate } from '@/lib/validators'
import { Package, MapPin, Calendar, Barcode, Scales } from '@phosphor-icons/react'

interface OrderDetailDialogProps {
  order: Order
  open: boolean
  onClose: () => void
}

export function OrderDetailDialog({ order, open, onClose }: OrderDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package size={24} weight="bold" />
            {order.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Статус</span>
            <Badge className={`${getStatusColor(order.status)} text-xs font-semibold uppercase tracking-wide`}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Barcode size={20} className="text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Трек-номер</p>
                <p className="font-medium font-mono">{order.trackingNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Маршрут</p>
                <p className="font-medium">{order.from} → {order.to}</p>
              </div>
            </div>

            {order.weight && (
              <div className="flex items-start gap-3">
                <Scales size={20} className="text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Вес</p>
                  <p className="font-medium">{order.weight}</p>
                </div>
              </div>
            )}

            {order.description && (
              <div className="flex items-start gap-3">
                <Package size={20} className="text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Описание</p>
                  <p className="font-medium">{order.description}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar size={18} weight="bold" />
              История статусов
            </h4>
            <div className="space-y-2 pl-6">
              {order.statusHistory.map((entry, index) => (
                <div key={index} className="relative pb-2">
                  {index !== order.statusHistory.length - 1 && (
                    <div className="absolute left-[-16px] top-2 bottom-0 w-0.5 bg-border" />
                  )}
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      entry.status === 'delivered' ? 'bg-[oklch(0.65_0.15_145)]' :
                      entry.status === 'warehouse' ? 'bg-[oklch(0.60_0.12_250)]' :
                      'bg-[oklch(0.65_0.15_45)]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{getStatusLabel(entry.status)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Создан: {formatDate(order.createdAt)}</span>
            <span>Обновлен: {formatDate(order.updatedAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
