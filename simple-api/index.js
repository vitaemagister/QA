const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// 🔹 Підключення до PostgreSQL
const pool = new Pool({
  user: "appuser",
  password: "strongpassword",
  host: "localhost",
  port: 5432,
  database: "appdb"
});

// 🔹 API — отримати всіх користувачів
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id;");
    res.json(result.rows); // Повертає масив користувачів у JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
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



// 🔹 Запуск сервера
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
