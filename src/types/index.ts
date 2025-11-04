export type OrderStatus = 'in-transit' | 'warehouse' | 'delivered'

export interface User {
  id: string
  firstName: string
  lastName: string
  finCode: string
  isAdmin: boolean
}

export interface Order {
  id: string
  userId: string
  trackingNumber: string
  status: OrderStatus
  title: string
  description: string
  weight?: string
  from: string
  to: string
  createdAt: number
  updatedAt: number
  statusHistory: StatusHistoryEntry[]
}

export interface StatusHistoryEntry {
  status: OrderStatus
  timestamp: number
  note?: string
}

export interface Notification {
  id: string
  userId: string
  orderId: string
  message: string
  read: boolean
  createdAt: number
}

export interface ShoppingApp {
  id: string
  name: string
  url: string
  icon: string
  description: string
}
