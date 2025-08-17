import { Pool } from "pg";
import { MESSAGES_TABLE } from "../constants/tableName";

// PostgreSQL setup
export const pool = new Pool({
	user: process.env.POSTGRES_USER || "myuser",
	host: process.env.POSTGRES_HOST || "localhost",
	database: process.env.POSTGRES_DB || "mydb",
	password: process.env.POSTGRES_PASSWORD || "mypassword",
	port: Number(process.env.POSTGRES_PORT || 5432),
});

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
		console.error(`Error creating or get items '${MESSAGES_TABLE}' table:`, err);
	}
})();
