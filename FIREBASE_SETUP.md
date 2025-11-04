# Firebase Setup Guide / Инструкция по настройке Firebase

## Русский 🇷🇺

### Шаг 1: Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Добавить проект"** (Add project)
3. Введите имя проекта (например, "next-cargo")
4. Отключите Google Analytics (не требуется для этого проекта)
5. Нажмите **"Создать проект"**

### Шаг 2: Регистрация веб-приложения

1. В консоли Firebase выберите ваш проект
2. Нажмите на иконку **"</>"** (Web) чтобы добавить веб-приложение
3. Введите имя приложения (например, "Next Cargo Web")
4. **НЕ устанавливайте** Firebase Hosting (не требуется)
5. Нажмите **"Зарегистрировать приложение"**

### Шаг 3: Получение конфигурации

После регистрации вы увидите объект `firebaseConfig`. Скопируйте следующие значения:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // <- Скопируйте это
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

### Шаг 4: Настройка Firestore Database

1. В левом меню выберите **"Firestore Database"**
2. Нажмите **"Создать базу данных"** (Create database)
3. Выберите местоположение (например, `europe-west1` для Европы)
4. Выберите **"Начать в тестовом режиме"** (Start in test mode)
5. Нажмите **"Включить"** (Enable)

### Шаг 5: Настройка правил безопасности Firestore

1. В Firestore Database перейдите на вкладку **"Правила"** (Rules)
2. Замените правила на следующие:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
    
    match /passwords/{userId} {
      allow read, write: if true;
    }
    
    match /orders/{orderId} {
      allow read, write: if true;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if true;
    }
    
    match /sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
```

3. Нажмите **"Опубликовать"** (Publish)

⚠️ **ВАЖНО**: Эти правила разрешают полный доступ для разработки. Для продакшена настройте более строгие правила безопасности!

### Шаг 6: Создание файла .env

1. Создайте файл `.env` в корне проекта (рядом с `package.json`)
2. Скопируйте содержимое из `.env.example`
3. Замените значения на ваши из Firebase Config:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

### Шаг 7: Запуск приложения

```bash
npm install
npm run dev
```

Приложение должно запуститься и автоматически создать демо-данные при первом запуске.

### Демо данные для входа

После первого запуска будет создан админ аккаунт:
- **FIN код**: `ADMIN01`
- **Пароль**: `admin123`

---

## English 🇬🇧

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "next-cargo")
4. Disable Google Analytics (not required)
5. Click **"Create project"**

### Step 2: Register Web App

1. In Firebase console, select your project
2. Click on **"</>"** (Web) icon to add a web app
3. Enter app name (e.g., "Next Cargo Web")
4. **DO NOT** set up Firebase Hosting (not required)
5. Click **"Register app"**

### Step 3: Get Configuration

After registration, you'll see the `firebaseConfig` object. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // <- Copy this
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

### Step 4: Set up Firestore Database

1. In left menu, select **"Firestore Database"**
2. Click **"Create database"**
3. Choose location (e.g., `europe-west1` for Europe)
4. Select **"Start in test mode"**
5. Click **"Enable"**

### Step 5: Configure Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace rules with the following:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
    
    match /passwords/{userId} {
      allow read, write: if true;
    }
    
    match /orders/{orderId} {
      allow read, write: if true;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if true;
    }
    
    match /sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

⚠️ **IMPORTANT**: These rules allow full access for development. For production, configure stricter security rules!

### Step 6: Create .env File

1. Create `.env` file in project root (next to `package.json`)
2. Copy contents from `.env.example`
3. Replace values with yours from Firebase Config:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

### Step 7: Run Application

```bash
npm install
npm run dev
```

The app should start and automatically create demo data on first run.

### Demo Login Credentials

After first run, an admin account will be created:
- **FIN code**: `ADMIN01`
- **Password**: `admin123`

---

## Troubleshooting / Решение проблем

### Ошибка: "Firebase: Error (auth/...)"
- Проверьте правильность API ключей в `.env`
- Убедитесь, что файл `.env` находится в корне проекта
- Перезапустите dev сервер после изменения `.env`

### Ошибка: "Missing or insufficient permissions"
- Проверьте правила безопасности Firestore
- Убедитесь что правила опубликованы

### Данные не сохраняются
- Откройте Firebase Console -> Firestore Database
- Проверьте, создаются ли коллекции и документы
- Проверьте консоль браузера на ошибки

---

## Production Security Rules / Правила безопасности для продакшена

Для продакшен версии замените правила Firestore на более безопасные:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    match /passwords/{userId} {
      allow read: if false;
      allow write: if false;
    }
    
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    match /notifications/{notificationId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    match /sessions/{sessionId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

⚠️ **ПРИМЕЧАНИЕ**: Текущая реализация не использует Firebase Authentication для простоты. Для продакшена рекомендуется добавить Firebase Auth.
