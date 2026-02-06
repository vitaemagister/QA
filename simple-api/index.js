import express from "express";
import pkg from "pg";          // імпорт всього пакету
import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const { Pool } = pkg;         // витягуємо Pool один раз

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger конфігурація
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple API',
      version: '1.0.0',
      description: 'REST API для управління користувачами з підтримкою PostgreSQL',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Унікальний ідентифікатор користувача',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email користувача',
              example: 'user@example.com',
            },
            password_hash: {
              type: 'string',
              description: 'Хеш пароля',
              example: 'hashed_password_123',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата створення запису',
              example: '2026-02-06T10:00:00.000Z',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['email', 'password_hash'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email користувача',
              example: 'user@example.com',
            },
            password_hash: {
              type: 'string',
              description: 'Хеш пароля',
              example: 'hashed_password_123',
            },
          },
        },
        UserPartialInput: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email користувача (опціонально)',
              example: 'newemail@example.com',
            },
            password_hash: {
              type: 'string',
              description: 'Хеш пароля (опціонально)',
              example: 'new_hashed_password',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Повідомлення про помилку',
              example: 'User not found',
            },
          },
        },
      },
    },
  },
  apis: ['./index.js'], // шлях до файлів з анотаціями
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS для доступу з фронтенду
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Головна сторінка / Home page
 *     description: Повертає веб-інтерфейс для управління користувачами / Returns web interface for user management
 *     responses:
 *       200:
 *         description: HTML сторінка / HTML page
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Отримати всіх користувачів / Get all users
 *     description: Повертає список усіх користувачів упорядкований за ID / Returns list of all users ordered by ID
 *     responses:
 *       200:
 *         description: Успішно отримано список користувачів / Successfully retrieved users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Помилка бази даних / Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id;");
    res.json(result.rows); // Повертає масив користувачів у JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Отримати користувача за ID / Get user by ID
 *     description: Повертає інформацію про конкретного користувача / Returns information about specific user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача / User ID
 *     responses:
 *       200:
 *         description: Успішно отримано дані користувача / Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувача не знайдено / User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Помилка бази даних / Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id; // отримуємо ID з URL
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]); // повертаємо одного користувача
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Створити нового користувача / Create new user
 *     description: Додає нового користувача до бази даних / Adds new user to database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Користувача успішно створено / User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Невірні дані або email вже існує / Invalid data or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Помилка бази даних / Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/users", async (req, res) => {
  try {
    const { email, password_hash } = req.body; // отримуємо дані з тіла запиту

    if (!email || !password_hash) {
      return res.status(400).json({ error: "Email і password_hash — обов'язкові" });
    }

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *;",
      [email, password_hash]
    );

    res.status(201).json(result.rows[0]); // повертаємо створеного користувача
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      res.status(400).json({ error: "Email уже існує" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Повне оновлення користувача / Full user update
 *     description: Оновлює всі поля користувача (email і password_hash обов'язкові) / Updates all user fields (email and password_hash required)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача / User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Користувача успішно оновлено / User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувача не знайдено / User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Помилка бази даних / Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password_hash } = req.body;

    const result = await pool.query(
      "UPDATE users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING *;",
      [email, password_hash, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Часткове оновлення користувача / Partial user update
 *     description: Оновлює лише вказані поля (email і/або password_hash) / Updates only specified fields (email and/or password_hash)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача / User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPartialInput'
 *     responses:
 *       200:
 *         description: Користувача успішно оновлено / User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувача не знайдено / User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Помилка бази даних / Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password_hash } = req.body;

    // Отримуємо поточні дані користувача
    const existing = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Якщо нове поле не передано — залишаємо старе
    const newEmail = email || existing.rows[0].email;
    const newPassword = password_hash || existing.rows[0].password_hash;

    // Оновлюємо лише ті, що змінилися
    const result = await pool.query(
      "UPDATE users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING *;",
      [newEmail, newPassword, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Видалити користувача / Delete user
 *     description: Видаляє користувача з бази даних за ID / Deletes user from database by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача / User ID
 *     responses:
 *       200:
 *         description: Користувача успішно видалено / User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 deleted:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Користувача не знайдено / User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Помилка бази даних / Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *;", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000, '0.0.0.0', () => console.log("API running on port 3000"));
