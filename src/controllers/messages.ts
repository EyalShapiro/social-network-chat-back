import { Request } from 'express';
import { MESSAGES_TABLE } from '../constants/tableName';
import db from '../db';
import { CustomResponse } from '../types/customResponse';

export async function getMessages(req: Request, res: CustomResponse) {
  try {
    const query = `SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at`;
    const result = await db.query(query);
    // console.log(result.rows);
    const sendedResult = result.rows || [];
    res.json(sendedResult);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export async function getMessagesByPage(req: Request, res: CustomResponse) {
  try {
    //TODO: Implement pagination
    //TODO: is not get latest items
    //TODO: If you don't see it, please refetch the data in frotend
    console.log(req.query);

    //  Get page and limit from query parameters with default values
    const queryParams = req.query;
    const page = +(queryParams?.page || 1);
    const limit = +(queryParams?.limit || 50);

    // Calculate the offset for the SQL query
    const offset = (page - 1) * limit;
    console.log({ page, limit, offset });

    // Fetch messages from the database
    const query = `SELECT * FROM ${MESSAGES_TABLE} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

    const result = await db.query(query, [limit, offset]);

    // Fetch the total number of messages
    const countQuery = `SELECT COUNT(*) FROM ${MESSAGES_TABLE}`;
    const countResult = await db.query(countQuery);
    const totalCount = +countResult.rows[0].count;

    const data = {
      messages: result.rows.reverse(),
      totalCount,
      page,
      limit,
    };
    // Send the paginated response
    res.json(data);
  } catch (err) {
    console.error('Error fetching paginated messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
