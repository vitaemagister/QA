# Email Server with MailHog + Gmail

Test email server with local sending support (MailHog) and global sending via Gmail SMTP.

## 🚀 Quick Start

```bash
cd email_server
docker compose up -d
```

- 📧 **API**: http://localhost:3001
- 📬 **MailHog UI**: http://localhost:8025

## 📋 API Endpoints

### 1. Send via MailHog (Local Testing)
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

### 2. Send via Gmail (Global/Production)
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

## 🔐 Gmail SMTP Configuration

To send emails through Gmail:

### Step 1: Create App Password in Google Account
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Navigate to **App passwords**: https://myaccount.google.com/apppasswords
4. Create a new App Password for "Mail"
5. Copy the generated 16-character password

### Step 2: Add credentials to .env file

Create a `.env` file in the `email_server` directory:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

**Note:** Remove spaces from the App Password (should be 16 characters without spaces)

The `docker-compose.yml` is already configured to use these variables via `${GMAIL_USER}` and `${GMAIL_APP_PASSWORD}`.

### Step 3: Restart containers
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
Testing

### Local sending
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
Check the email at http://localhost:8025

### Sending via
## 📝 Приклади використання

### З Postman
Імпортуйте ці запити або створіть колекцію:

- Send Email via MailHog (Local)
- Send Email via Gmail (Global)
- Send HTML Email with Custom From
- Send Plain Text Email
- Send Email with Multiple Recipients
- Error handling test cases

### Node.js Example

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

## Local sending
await axios.post('http://localhost:3001/send-email', {
  to: 'test@example.com',
  subject: 'Test',
  html: '<h1>Hello</h1>'
});

// Sending viaазує листи
- Відкрийте http://localhost:8025
- Перевірте, що контейнери запущені: `docker ps`
- Перевірте логи: `docker logs mailhog`

## 🔄 Альтернативи

### Варіант 1: Використовувати ngrok для отримання листів ззовні
Якщо потрібно приймати листи з інтернету на локальний SMTP сервер:
```bash
ngrok tcp sending not working
- Make sure you're using an **App Password**, not your regular password
- Verify 2-Step Verification is enabled
- Check logs: `docker logs mailhog-api`
- Ensure no spaces in the App Password in `.env` file

### MailHog not showing emails
- Open http://localhost:8025
- Check containers are running: `docker ps`
- Check logs: `docker logs mailhog`

### TLS handshake timeout during build
- Check internet connection
- Try again: `docker compose build`
- Restart Docker: `sudo systemctl restart docker`
- Configure Docker DNS in `/etc/docker/daemon.json`:
  ```json
  {
    "dns": ["8.8.8.8", "8.8.4.4"]
  }
  ```

## 📂 Project Structure            # Container configuration
├── Dockerfile                      # Docker image for API
├── server.js                       # Express API with endpoints
├── package.json                    # Dependencies
├── .env                           # Environment variables (not in git)
├── .env.example                   # Example env file
├── README.md                      # Documentation
└── postman_collection/
    └── email_server.postman_collection.json  # Postman collection
```

## 📚 API Documentation

### POST /send-email
Sends email to local MailHog SMTP server for testing.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "text": "Plain text content (optional)",
  "html": "HTML content (optional)"
}
```

**Response (200):**
```json
{
  "message": "Email sent to MailHog",
  "info": { ... }
}
```

### POST /send-email-gmail
Sends email through Gmail SMTP server globally.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "text": "Plain text content (optional)",
  "html": "HTML content (optional)",
  "from": "Custom Sender <sender@gmail.com> (optional)"
}
```

**Response (200):**
```json
{
  "message": "Email sent via Gmail",
  "messageId": "<unique-message-id>"
}
```

**Error Responses:**
- `400` - Missing required fields (to, subject)
- `500` - Gmail credentials not configured / Send failed