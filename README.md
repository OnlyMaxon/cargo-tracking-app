# 📦 Next Cargo

Система отслеживания международных грузов

## Установка

```bash
npm install
npm run dev
```

## Настройка Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Создайте Firestore Database в тестовом режиме
3. Создайте файл `.env` в корне проекта:

```env
VITE_FIREBASE_API_KEY=ваш_api_key
VITE_FIREBASE_AUTH_DOMAIN=ваш_проект.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ваш_project_id
VITE_FIREBASE_STORAGE_BUCKET=ваш_проект.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
VITE_FIREBASE_APP_ID=ваш_app_id
```

## Первый вход

Админ аккаунт:
- **FIN код**: `ADMIN01`
- **Пароль**: `admin123`
