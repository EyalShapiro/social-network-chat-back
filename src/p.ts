const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// חיבור ל-PostgreSQL
const pool = new Pool({
	user: "myuser",
	host: "localhost",
	database: "mydb",
	password: "mypassword",
	port: 5432,
});

// Middleware
app.use(bodyParser.json());

// יצירת טבלה אם היא לא קיימת
(async () => {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
		console.log("Table 'messages' is ready.");
	} catch (err) {
		console.error("Error creating table:", err);
	}
})();

// GET: שליפת כל ההודעות
app.get("/messages", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM messages ORDER BY created DESC");
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// GET: שליפת הודעה לפי מזהה
app.get("/messages/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query("SELECT * FROM messages WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Message not found" });
		}
		res.json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching message:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// POST: הוספת הודעה חדשה
app.post("/messages", async (req, res) => {
	const { sender, message } = req.body;

	if (!sender || !message) {
		return res.status(400).json({ error: "Sender and message are required." });
	}

	try {
		const result = await pool.query("INSERT INTO messages (sender, message) VALUES ($1, $2) RETURNING *", [
			sender,
			message,
		]);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error adding message:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// PUT: עדכון הודעה קיימת
app.put("/messages/:id", async (req, res) => {
	const { id } = req.params;
	const { sender, message } = req.body;

	if (!sender || !message) {
		return res.status(400).json({ error: "Sender and message are required." });
	}

	try {
		const result = await pool.query("UPDATE messages SET sender = $1, message = $2 WHERE id = $3 RETURNING *", [
			sender,
			message,
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Message not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error("Error updating message:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// DELETE: מחיקת הודעה לפי מזהה
app.delete("/messages/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query("DELETE FROM messages WHERE id = $1 RETURNING *", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Message not found" });
		}

		res.json({ message: "Message deleted successfully", deletedMessage: result.rows[0] });
	} catch (err) {
		console.error("Error deleting message:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// הפעלת השרת
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
