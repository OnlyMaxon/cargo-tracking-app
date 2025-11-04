import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { User, Order, Notification } from '@/types'

export const FirebaseService = {
  users: {
    async getAll(): Promise<Record<string, User>> {
      const snapshot = await getDocs(collection(db, 'users'))
      const users: Record<string, User> = {}
      snapshot.forEach(doc => {
        users[doc.id] = doc.data() as User
      })
      return users
    },

    async getById(userId: string): Promise<User | null> {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? (docSnap.data() as User) : null
    },

    async getByFinCode(finCode: string): Promise<User | null> {
      const q = query(collection(db, 'users'), where('finCode', '==', finCode.toUpperCase()))
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      return snapshot.docs[0].data() as User
    },

    async create(userId: string, user: User): Promise<void> {
      await setDoc(doc(db, 'users', userId), user)
    },

    async update(userId: string, data: Partial<User>): Promise<void> {
      await updateDoc(doc(db, 'users', userId), data)
    }
  },

  passwords: {
    async get(userId: string): Promise<string | null> {
      const docRef = doc(db, 'passwords', userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? docSnap.data().password : null
    },

    async set(userId: string, password: string): Promise<void> {
      await setDoc(doc(db, 'passwords', userId), { password })
    }
  },

  orders: {
    async getAll(): Promise<Record<string, Order>> {
      const snapshot = await getDocs(collection(db, 'orders'))
      const orders: Record<string, Order> = {}
      snapshot.forEach(doc => {
        orders[doc.id] = doc.data() as Order
      })
      return orders
    },

    async getById(orderId: string): Promise<Order | null> {
      const docRef = doc(db, 'orders', orderId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? (docSnap.data() as Order) : null
    },

    async getByUserId(userId: string): Promise<Order[]> {
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => doc.data() as Order)
    },

    async create(orderId: string, order: Order): Promise<void> {
      await setDoc(doc(db, 'orders', orderId), order)
    },

    async update(orderId: string, data: Partial<Order>): Promise<void> {
      await updateDoc(doc(db, 'orders', orderId), data)
    },

    async delete(orderId: string): Promise<void> {
      await deleteDoc(doc(db, 'orders', orderId))
    }
  },

  notifications: {
    async getByUserId(userId: string): Promise<Notification[]> {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => doc.data() as Notification)
    },

    async create(notificationId: string, notification: Notification): Promise<void> {
      await setDoc(doc(db, 'notifications', notificationId), notification)
    },

    async markAsRead(notificationId: string): Promise<void> {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true })
    }
  },

  session: {
    async getCurrentUserId(): Promise<string | null> {
      const docRef = doc(db, 'sessions', 'current')
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? docSnap.data().userId : null
    },

    async setCurrentUserId(userId: string): Promise<void> {
      await setDoc(doc(db, 'sessions', 'current'), { userId })
    },

    async clear(): Promise<void> {
      await deleteDoc(doc(db, 'sessions', 'current'))
    }
  }
}
