# Next Cargo - Firebase Integration

## Что изменилось

Приложение полностью переведено с `AsyncStorage` (spark.kv) на **Firebase Firestore**.

### Основные изменения:

1. **Новые файлы**:
   - `src/lib/firebase.ts` - конфигурация Firebase
   - `src/lib/firebaseService.ts` - сервисный слой для работы с Firestore
   - `.env.example` - пример файла с переменными окружения
   - `FIREBASE_SETUP.md` - полная инструкция по настройке (RU + EN)

2. **Обновленные компоненты**:
   - `App.tsx` - использует FirebaseService вместо spark.kv
   - `AuthScreen.tsx` - аутентификация через Firestore
   - `OrderList.tsx` - загрузка заказов из Firestore
   - `AdminPanel.tsx` - управление заказами через Firestore
   - `lib/seedData.ts` - создание демо-данных в Firestore

3. **Зависимости**:
   - Добавлен пакет `firebase` (уже установлен)

## Быстрый старт

### 1. Настройка Firebase

Следуйте подробной инструкции в файле **`FIREBASE_SETUP.md`**

Краткая версия:
1. Создайте проект на [Firebase Console](https://console.firebase.google.com/)
2. Добавьте веб-приложение
3. Включите Firestore Database
4. Скопируйте конфигурационные данные

### 2. Создайте файл .env

Создайте файл `.env` в корне проекта:

```env
VITE_FIREBASE_API_KEY=ваш-api-key
VITE_FIREBASE_AUTH_DOMAIN=ваш-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ваш-project-id
VITE_FIREBASE_STORAGE_BUCKET=ваш-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ваш-sender-id
VITE_FIREBASE_APP_ID=ваш-app-id
```

### 3. Запустите приложение

```bash
npm install
npm run dev
```

## Структура данных в Firestore

После запуска в вашей базе Firestore будут созданы следующие коллекции:

### Collections (Коллекции)

1. **users** - пользователи системы
   ```typescript
   {
     id: string
     firstName: string
     lastName: string
     finCode: string
     isAdmin: boolean
   }
   ```

2. **passwords** - пароли пользователей
   ```typescript
   {
     password: string
   }
   ```

3. **orders** - заказы
   ```typescript
   {
     id: string
     userId: string
     trackingNumber: string
     status: 'in-transit' | 'warehouse' | 'delivered'
     title: string
     description: string
     weight?: string
     from: string
     to: string
     createdAt: number
     updatedAt: number
     statusHistory: Array<{
       status: string
       timestamp: number
       note?: string
     }>
   }
   ```

4. **notifications** - уведомления
   ```typescript
   {
     id: string
     userId: string
     orderId: string
     message: string
     read: boolean
     createdAt: number
   }
   ```

5. **sessions** - текущая сессия пользователя
   ```typescript
   {
     userId: string
   }
   ```

## Архитектура

### FirebaseService API

Все операции с базой данных выполняются через `FirebaseService`:

```typescript
import { FirebaseService } from '@/lib/firebaseService'

// Пользователи
await FirebaseService.users.getAll()
await FirebaseService.users.getById(userId)
await FirebaseService.users.getByFinCode(finCode)
await FirebaseService.users.create(userId, userData)
await FirebaseService.users.update(userId, partialData)

// Пароли
await FirebaseService.passwords.get(userId)
await FirebaseService.passwords.set(userId, password)

// Заказы
await FirebaseService.orders.getAll()
await FirebaseService.orders.getById(orderId)
await FirebaseService.orders.getByUserId(userId)
await FirebaseService.orders.create(orderId, orderData)
await FirebaseService.orders.update(orderId, partialData)
await FirebaseService.orders.delete(orderId)

// Уведомления
await FirebaseService.notifications.getByUserId(userId)
await FirebaseService.notifications.create(notifId, notifData)
await FirebaseService.notifications.markAsRead(notifId)

// Сессия
await FirebaseService.session.getCurrentUserId()
await FirebaseService.session.setCurrentUserId(userId)
await FirebaseService.session.clear()
```

## Безопасность

⚠️ **ВАЖНО**: Текущие правила Firestore настроены для разработки и разрешают полный доступ.

Для продакшена настройте более строгие правила в Firebase Console -> Firestore Database -> Rules.

Пример безопасных правил приведен в файле `FIREBASE_SETUP.md`.

## Демо данные

При первом запуске автоматически создаются:

**Админ аккаунт:**
- FIN код: `ADMIN01`
- Пароль: `admin123`

**3 демо заказа** с разными статусами

## Поддержка

Если возникли проблемы:
1. Проверьте консоль браузера (F12)
2. Убедитесь что все переменные в `.env` правильные
3. Проверьте что Firestore Database включен в Firebase Console
4. Проверьте правила безопасности Firestore

## Что дальше?

Для улучшения безопасности рекомендуется:
1. Добавить Firebase Authentication
2. Настроить строгие правила Firestore
3. Шифровать пароли (использовать Firebase Auth вместо plaintext)
4. Добавить rate limiting для API запросов
