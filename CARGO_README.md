# Cargo Tracking System

A comprehensive web-based cargo tracking application for the Azerbaijan market with user authentication, order management, and admin capabilities.

## Features

### User Features
- **Authentication**: Register and login with FIN code (Azerbaijan ID), name, surname, and password
- **Order Tracking**: View all orders with real-time status updates (В пути/На складе/Доставлен)
- **Order Details**: Click on any order to view comprehensive tracking information and status history
- **Support**: Access contact information and FAQs
- **Profile**: View personal information and logout
- **Shopping Apps**: Quick links to popular e-commerce platforms (Allegro, Amazon, eBay, etc.)

### Admin Features
- **Dashboard**: View all orders from all users
- **Search**: Find orders by FIN code
- **Status Management**: Update order statuses with automatic notifications
- **Notifications**: Send updates to users about their orders

## Demo Account

A demo admin account is automatically created on first run:
- **FIN Code**: `ADMIN01`
- **Password**: `admin123`

## Data Structure

### Users Collection
```typescript
{
  id: string
  firstName: string
  lastName: string
  finCode: string (7 characters, alphanumeric)
  isAdmin: boolean
}
```

### Orders Collection
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
    status: OrderStatus
    timestamp: number
    note?: string
  }>
}
```

### Notifications Collection
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

## Validation Rules

- **FIN Code**: Must be exactly 7 alphanumeric characters
- **Password**: Minimum 6 characters
- **Name/Surname**: Minimum 2 characters each
- **Duplicate Registration**: Prevented by FIN code uniqueness check

## Navigation

The application uses a bottom tab bar for easy navigation:
1. **Список** (Orders) - View all your orders
2. **Support** - Contact information and FAQs
3. **Profile** - User information and logout
4. **Apps** - Shopping platform links
5. **Админ** (Admin only) - Order management panel

## Technology Stack

- React + TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Spark KV for persistent storage
- Sonner for toast notifications
- Phosphor Icons

## Status Colors

- **В пути (In Transit)**: Orange
- **На складе (Warehouse)**: Blue
- **Доставлен (Delivered)**: Green
