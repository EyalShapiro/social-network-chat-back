import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { Pool } from "pg";
import { MessageDataType } from "./types/MessageType";
import { MESSAGES_TABLE } from "./constants/tableName";
import cors from "cors";
// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

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
// Enable CORS for the frontend URL (http://localhost:5173)

app.use(cors({ origin: CLIENT_URL || "*" }));
// Create table if it doesn't exist
(async () => {
	try {
		const query = `CREATE TABLE IF NOT EXISTS ${MESSAGES_TABLE} (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`;
		const result = await pool.query(query);
		console.log(`Table '${MESSAGES_TABLE}' is ready.`);
	} catch (err) {
		console.error(`Error creating '${MESSAGES_TABLE}' table:`, err);
	}
})();

// RESTful API to fetch messages
app.get("/messages", async (req, res) => {
	try {
		const query = `SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at`;
		const result = await pool.query(query);
		// console.log(result.rows);
		const sendedResult = result.rows || [];
		res.json(sendedResult);
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
// RESTful API to fetch messages with pagination
app.get("/messages/paginated", async (req, res) => {
	try {
		//TODO: Implement pagination
		//TODO: is not get latest items
		//TODO: If you don't see it, please refetch the data in frotend

		//  Get page and limit from query parameters with default values
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 50;

		// Calculate the offset for the SQL query
		const offset = (page - 1) * limit;
		console.log({ page, limit, offset });

		// Fetch messages from the database
		const query = `SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

		const result = await pool.query(query, [limit, offset]);

		// Fetch the total number of messages
		const countQuery = `SELECT COUNT(*) FROM ${MESSAGES_TABLE}`;
		const countResult = await pool.query(countQuery);
		const totalCount = parseInt(countResult.rows[0].count, 10);

		const data = {
			messages: result.rows.reverse(),
			totalCount,
			page,
			limit,
		};
		// Send the paginated response
		res.json(data);
	} catch (err) {
		console.error("Error fetching paginated messages:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
const methods = ["GET", "POST", "PUT", "DELETE"];
// Socket.IO setup
const socketIoServer = new Server(httpServer, {
	cors: { origin: CLIENT_URL, methods },
});

// Handle socket connection
socketIoServer.on("connection", async (socket) => {
	console.log("\nA user connected");

	try {
		const result = await pool.query<MessageDataType[]>(`SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at ASC`);
		const sendBack = result.rows || [];
		socket.emit("previous messages", sendBack); // Emit previous messages to new users
	} catch (err) {
		console.error("Error fetching previous messages:", err);
	}

	// Handle incoming chat messages
	socket.on("chat message", async (msg: MessageDataType) => {
		console.log(`userName:${msg.sender}\n sent-message: ${msg.message}\n-----------------`);

		try {
			// Save message to database
			const result = await pool.query<MessageDataType[]>(
				`INSERT INTO ${MESSAGES_TABLE} (sender, message) VALUES ($1, $2) RETURNING *`,
				[msg.sender, msg.message]
			);
			const savedMessage = result.rows[0] || msg;

			// Emit the saved message to all clients
			socketIoServer.emit("chat message", savedMessage);
		} catch (err) {
			console.error("Error saving message to database:", err);
			socket.emit("error", { error: "Failed to save message" });
		}
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

// Start server
httpServer.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
