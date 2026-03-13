require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, message, created_at FROM portfolio_messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/messages", async (req, res) => {
  const { name, email, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    await pool.query(
      "INSERT INTO portfolio_messages (name, email, message) VALUES ($1,$2,$3)",
      [name || null, email || null, message]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});