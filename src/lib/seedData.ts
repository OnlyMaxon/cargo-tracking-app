import { Order, User, OrderStatus } from '@/types'
import { generateId } from './validators'

export async function seedDemoData() {
  try {
    const users = (await window.spark.kv.get<Record<string, User>>('users')) || {}
    
    if (Object.keys(users).length === 0) {
      const adminId = generateId()
      const admin: User = {
        id: adminId,
        firstName: 'Админ',
        lastName: 'Система',
        finCode: 'ADMIN01',
        isAdmin: true
      }
      
      users[adminId] = admin
      await window.spark.kv.set('users', users)
      
      const passwords = (await window.spark.kv.get<Record<string, string>>('passwords')) || {}
      passwords[adminId] = 'admin123'
      await window.spark.kv.set('passwords', passwords)

      console.log('✅ Demo admin created: FIN: ADMIN01, Password: admin123')
    }

    const orders = (await window.spark.kv.get<Record<string, Order>>('orders')) || {}
    
    if (Object.keys(orders).length === 0 && Object.keys(users).length > 0) {
      const userId = Object.keys(users)[0]
      const now = Date.now()

      const demoOrders: Order[] = [
        {
          id: generateId(),
          userId,
          trackingNumber: 'TRK-2024-001',
          status: 'in-transit' as OrderStatus,
          title: 'Электроника из Amazon',
          description: 'Ноутбук Apple MacBook Pro 14"',
          weight: '2.5 кг',
          from: 'США, Нью-Йорк',
          to: 'Баку, Азербайджан',
          createdAt: now - 86400000 * 5,
          updatedAt: now - 86400000 * 1,
          statusHistory: [
            { status: 'in-transit' as OrderStatus, timestamp: now - 86400000 * 5 }
          ]
        },
        {
          id: generateId(),
          userId,
          trackingNumber: 'TRK-2024-002',
          status: 'warehouse' as OrderStatus,
          title: 'Одежда с Allegro',
          description: 'Зимняя куртка и аксессуары',
          weight: '1.2 кг',
          from: 'Польша, Варшава',
          to: 'Баку, Азербайджан',
          createdAt: now - 86400000 * 10,
          updatedAt: now - 86400000 * 2,
          statusHistory: [
            { status: 'in-transit' as OrderStatus, timestamp: now - 86400000 * 10 },
            { status: 'warehouse' as OrderStatus, timestamp: now - 86400000 * 2, note: 'Прибыл на склад в Баку' }
          ]
        },
        {
          id: generateId(),
          userId,
          trackingNumber: 'TRK-2024-003',
          status: 'delivered' as OrderStatus,
          title: 'Книги с Amazon',
          description: 'Учебная литература',
          weight: '0.8 кг',
          from: 'Германия, Берлин',
          to: 'Баку, Азербайджан',
          createdAt: now - 86400000 * 20,
          updatedAt: now - 86400000 * 3,
          statusHistory: [
            { status: 'in-transit' as OrderStatus, timestamp: now - 86400000 * 20 },
            { status: 'warehouse' as OrderStatus, timestamp: now - 86400000 * 5, note: 'На складе' },
            { status: 'delivered' as OrderStatus, timestamp: now - 86400000 * 3, note: 'Доставлен получателю' }
          ]
        }
      ]

      demoOrders.forEach(order => {
        orders[order.id] = order
      })

      await window.spark.kv.set('orders', orders)
      console.log('✅ Demo orders created')
    }

    return true
  } catch (err) {
    console.error('Failed to seed demo data:', err)
    return false
  }
}
