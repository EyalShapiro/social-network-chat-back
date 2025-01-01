import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { Pool } from "pg";
import { MessageDataType, SendMsgType } from "./types/MessageType";
import { MESSAGES_TABLE } from "./constants/tableName";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// PostgreSQL setup
const pool = new Pool({
	user: process.env.POSTGRES_USER || "myuser",
	host: process.env.POSTGRES_HOST || "localhost",
	database: process.env.POSTGRES_DB || "mydb",
	password: process.env.POSTGRES_PASSWORD || "mypassword",
	port: Number(process.env.POSTGRES_PORT || 5432),
});

// Middleware
app.use(express.json());

// Create table if it doesn't exist
(async () => {
	try {
		const result = await pool.query(`
			CREATE TABLE IF NOT EXISTS ${MESSAGES_TABLE} (
				id SERIAL PRIMARY KEY,
				sender VARCHAR(255) NOT NULL,
				message TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
		`);

		console.log(`Table '${MESSAGES_TABLE}' is ready.`);
		console.log(result);
	} catch (err) {
		console.error(`Error creating '${MESSAGES_TABLE}' table:`, err);
	}
})();

// RESTful API
app.get("/messages", async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at DESC`);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Socket.IO setup
const socketIo = new Server(httpServer, {
	cors: {
		origin: FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
	},
});
socketIo.on("connection", async (socket) => {
	console.log("A user connected");
	try {
		const result = await pool.query<MessageDataType[]>(`SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at ASC`);
		console.log(result);

		socket.emit("previous messages", result.rows);
	} catch (err) {
		console.error("Error fetching previous messages:", err);
	}
	// Handle incoming chat messages
	socket.on("chat message", async (msg: SendMsgType) => {
		console.log(`${msg.sender}: ${msg.message}`);

		try {
			// Save message to database
			const result = await pool.query<MessageDataType[]>(
				`INSERT INTO ${MESSAGES_TABLE} (sender, message) VALUES ($1, $2) RETURNING *`,
				[msg.sender, msg.message]
			);
			const savedMessage = result.rows[0];

			// Emit the saved message to all clients
			socketIo.emit("chat message", savedMessage);
		} catch (err) {
			console.error("Error saving message to database:", err);
			socket.emit("error", { error: "Failed to save message" });
		}
	});

	socket.on("disconnect", async () => {
		console.log("A user disconnected");
	});
});

// Start server
httpServer.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
