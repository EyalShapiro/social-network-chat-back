import { MESSAGES_TABLE } from '../src/constants/tableName';
import db from '../src/db';

// Create table if it doesn't exist
(async () => {
  try {
    const query = `CREATE TABLE IF NOT EXISTS ${MESSAGES_TABLE} (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`;
    const result = await db.query(query);
    console.log(`Table '${MESSAGES_TABLE}' is ready.`);
  } catch (err) {
    console.error(`Error creating or get items '${MESSAGES_TABLE}' table:`, err);
  }
})();
