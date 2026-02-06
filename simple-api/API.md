# Simple API + Web UI + Swagger

Повноцінна система управління користувачами з REST API, веб-інтерфейсом та Swagger документацією.

## 🚀 Швидкий старт

```bash
cd simple-api
docker compose up -d
```

Все запуститься:
- 🌐 **Web UI**: http://localhost:3000
- 📚 **Swagger UI**: http://localhost:3000/api-docs
- 🔌 **API**: http://localhost:3000/users
- 🗄️ **PostgreSQL**: localhost:5432

## 📚 Swagger документація

Відкрийте http://localhost:3000/api-docs для інтерактивної API документації.
Swagger UI дозволяє:
- Переглядати всі доступні endpoints
- Тестувати API запити безпосередньо з браузера
- Бачити схеми request/response

## 📋 API Endpoints

### Get All Users
```
GET /users
Response: [{ id, email, password_hash, created_at }, ...]
```

### Get User by ID
```
GET /users/:id
Response: { id, email, password_hash, created_at }
```

### Create User
```
POST /users
Body: { "email": "user@example.com", "password_hash": "hash" }
Response: { id, email, password_hash, created_at }
```

### Update User
```
PUT /users/:id
Body: { "email": "newemail@example.com", "password_hash": "newhash" }
Response: { id, email, password_hash, created_at }
```

### Partial Update
```
PATCH /users/:id
Body: { "email": "optional@example.com" }  // можна оновити лише деякі поля
Response: { id, email, password_hash, created_at }
```

### Delete User
```
DELETE /users/:id
Response: { message: "User deleted successfully", deleted: {...} }
```

## 🔌 Тестування в Postman

Імпортуйте колекцію з `postman_collection/my_api.postman.collection.json`

## 🗄️ Доступ до БД

```bash
docker exec -it pg psql -U appuser -d appdb
```

Корисні команди SQL:
```sql
SELECT * FROM users;
SELECT * FROM users WHERE id = 1;
INSERT INTO users (email, password_hash) VALUES ('test@example.com', 'hash123');
UPDATE users SET email = 'new@example.com' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

## 🛑 Зупинення

```bash
docker compose down
```

## 📝 Файли

- `index.js` - API сервер (Express)
- `public/index.html` - Веб-інтерфейс
- `public/app.js` - JavaScript для роботи з API
- `public/style.css` - Стилі
- `init.sql` - Ініціалізація БД
- `docker-compose.yml` - Конфігурація контейнерів
