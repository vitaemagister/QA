# Email Server з MailHog + Gmail

Тестовий email сервер з підтримкою локальної відправки (MailHog) та глобальної відправки через Gmail.

## 🚀 Швидкий старт

```bash
cd email_server
docker compose up -d
```

- 📧 **API**: http://localhost:3001
- 📬 **MailHog UI**: http://localhost:8025

## 📋 Endpoints

### 1. Відправка через MailHog (локально)
```bash
POST http://localhost:3001/send-email
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test Email",
  "text": "This is a test email",
  "html": "<h1>Test Email</h1><p>This is a test</p>"
}
```

### 2. Відправка через Gmail (глобально)
```bash
POST http://localhost:3001/send-email-gmail
Content-Type: application/json

{
  "to": "real-email@example.com",
  "subject": "Test from Gmail",
  "text": "This will be sent via Gmail SMTP",
  "html": "<h1>Real Email</h1>"
}
```

## 🔐 Налаштування Gmail SMTP

Щоб відправляти листи через Gmail:

### Крок 1: Створіть App Password в Google Account
1. Перейдіть на https://myaccount.google.com/security
2. Увімкніть **2-Step Verification** (якщо ще не увімкнено)
3. Перейдіть до **App passwords**: https://myaccount.google.com/apppasswords
4. Створіть новий App Password для "Mail"
5. Скопіюйте згенерований 16-символьний пароль

### Крок 2: Додайте credentials до docker-compose.yml

Відредагуйте `docker-compose.yml` та розкоментуйте рядки:

```yaml
environment:
  - GMAIL_USER=your-email@gmail.com
  - GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Або створіть `.env` файл:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

І оновіть `docker-compose.yml`:
```yaml
environment:
  - SMTP_HOST=mailhog
  - SMTP_PORT=1025
  - GMAIL_USER=${GMAIL_USER}
  - GMAIL_APP_PASSWORD=${GMAIL_APP_PASSWORD}
```

### Крок 3: Перезапустіть контейнери
```bash
docker compose down
docker compose up --build -d
```

## 🧪 Тестування

### Локальна відправка (MailHog):
```bash
curl -X POST http://localhost:3001/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Local Test",
    "text": "This goes to MailHog"
  }'
```

Перевірте лист на http://localhost:8025

### Відправка через Gmail:
```bash
curl -X POST http://localhost:3001/send-email-gmail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "real-email@gmail.com",
    "subject": "Real Email Test",
    "text": "This is sent via Gmail SMTP"
  }'
```

Лист прийде на реальну адресу.

## 📝 Приклади використання

### З Postman
Імпортуйте ці запити або створіть колекцію:

**Local Email:**
- Method: `POST`
- URL: `http://localhost:3001/send-email`
- Body (JSON):
  ```json
  {
    "to": "test@test.com",
    "subject": "Test",
    "html": "<h1>Hello</h1>"
  }
  ```

**Gmail Email:**
- Method: `POST`
- URL: `http://localhost:3001/send-email-gmail`
- Body (JSON):
  ```json
  {
    "to": "recipient@gmail.com",
    "subject": "Real Test",
    "text": "Real email content"
  }
  ```

### З Node.js
```javascript
const axios = require('axios');

// Локальна відправка
await axios.post('http://localhost:3001/send-email', {
  to: 'test@example.com',
  subject: 'Test',
  html: '<h1>Hello</h1>'
});

// Відправка через Gmail
await axios.post('http://localhost:3001/send-email-gmail', {
  to: 'real@gmail.com',
  subject: 'Production Email',
  html: '<h1>Important</h1>'
});
```

## 🛠️ Troubleshooting

### Gmail відправка не працює
- Переконайтеся, що ви використовуєте **App Password**, а не звичайний пароль
- Перевірте, що 2-Step Verification увімкнено
- Перевірте логи: `docker logs mailhog-api`

### MailHog не показує листи
- Відкрийте http://localhost:8025
- Перевірте, що контейнери запущені: `docker ps`
- Перевірте логи: `docker logs mailhog`

## 🔄 Альтернативи

### Варіант 1: Використовувати ngrok для отримання листів ззовні
Якщо потрібно приймати листи з інтернету на локальний SMTP сервер:
```bash
ngrok tcp 1025
```

### Варіант 2: Використовувати SendGrid/Mailgun API
Замість Gmail можна налаштувати інші SMTP провайдери.

## 📂 Структура проекту
```
email_server/
├── docker-compose.yml  # Конфігурація контейнерів
├── Dockerfile          # Docker image для API
├── server.js           # Express API з endpoints
├── package.json        # Dependencies
└── README.md          # Документація
```
