import { DefaultEventsMap } from 'socket.io';
import { MessageDataType } from './types/MessageType';
import { pool } from './config/dbConfig';
import { MESSAGES_TABLE } from './constants/tableName';
import { Socket } from 'socket.io';

export default async function socketConnection(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  console.log('\nA user connected');

  // try {
  // 	const result = await pool.query<MessageDataType[]>(`SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at ASC`);
  // 	const sendBack = result.rows || [];
  // 	socket.emit("previous messages", sendBack); // Emit previous messages to new users
  // } catch (err) {
  // 	console.error("Error fetching previous messages:", err);
  // }
  // Handle incoming chat messages
  socket.on('message', async (msg: MessageDataType) => {
    console.log(`userName:${msg.sender}\n sent-message: ${msg.message}\n-----------------`);

    try {
      // Save message to database
      const result = await pool.query<MessageDataType[]>(
        `INSERT INTO ${MESSAGES_TABLE} (sender, message) VALUES ($1, $2) RETURNING *`,
        [msg.sender, msg.message]
      );
      const savedMessage = result.rows[0] || msg;
      console.log(result);

      // Emit the saved message to all clients
      return socket.emit('message', savedMessage);
    } catch (err) {
      console.error(`Error saving message to database:`, err);
      return socket.emit('error', { error: 'Failed to save message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(reason); // "ping timeout"

    console.log('A user disconnected');
    return;
  });
  return;
}
