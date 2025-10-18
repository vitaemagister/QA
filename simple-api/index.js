import express from "express";
import pkg from "pg";          // імпорт всього пакету
const { Pool } = pkg;         // витягуємо Pool один раз

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

// 🔹 API — отримати всіх користувачів
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id;");
    res.json(result.rows); // Повертає масив користувачів у JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


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

// 🔹 Створити нового користувача
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
