# 🚀 Quick Setup Card / Быстрая настройка

## 📋 Чек-лист настройки

### 1. Firebase Console
- [ ] Создать проект на https://console.firebase.google.com/
- [ ] Добавить Web App (иконка </>) 
- [ ] Включить Firestore Database (Start in test mode)
- [ ] Скопировать конфигурацию

### 2. Firestore Rules
Вставьте в Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
Нажмите **Publish**

### 3. Создать .env файл
```bash
# В корне проекта создайте файл .env
VITE_FIREBASE_API_KEY=вставьте_ваш_ключ
VITE_FIREBASE_AUTH_DOMAIN=ваш-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ваш-project-id
VITE_FIREBASE_STORAGE_BUCKET=ваш-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ваш-sender-id
VITE_FIREBASE_APP_ID=ваш-app-id
```

### 4. Запуск
```bash
npm install
npm run dev
```

### 5. Тест
- Откройте http://localhost:5173
- Войдите как админ: **ADMIN01** / **admin123**

---

## 🔍 Где найти Firebase Config

Firebase Console → Project Settings (⚙️) → Your apps → Web app

Скопируйте значения из этого блока:
```javascript
const firebaseConfig = {
  apiKey: "...",           // VITE_FIREBASE_API_KEY
  authDomain: "...",       // VITE_FIREBASE_AUTH_DOMAIN
  projectId: "...",        // VITE_FIREBASE_PROJECT_ID
  storageBucket: "...",    // VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...", // VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "..."             // VITE_FIREBASE_APP_ID
};
```

---

## ❌ Частые ошибки

### "Firebase: Error (auth/invalid-api-key)"
✅ Проверьте правильность API ключа в `.env`

### "Missing or insufficient permissions"
✅ Настройте правила Firestore (см. выше)

### ".env файл не работает"
✅ Убедитесь что файл называется `.env` (не `.env.txt`)
✅ Перезапустите `npm run dev` после создания `.env`

### "Cannot find module 'firebase'"
✅ Выполните `npm install`

---

## 📖 Полная документация

Подробная инструкция: **FIREBASE_SETUP.md**
