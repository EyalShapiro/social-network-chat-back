import { Pool, QueryResultRow } from 'pg';
import { dbConfig } from '../config/dbConfig';
class db {
  static pool = new Pool(dbConfig);
  static dbConfig = dbConfig;
}

/**
 * Executes a SQL query using the connection pool.
 *
 * @template RT - The expected row type of the query result (must extend `QueryResultRow`)
 * @param {string} query - The SQL query string to execute.
 * @param {unknown[]} [params=[]] - Optional query parameters.
 * @returns {Promise<QueryResult<RT>>} A promise that resolves to a `QueryResult`
 * containing rows of type `RT`.
 * @throws {Error} If the database query fails.
 */
async function query<RT extends QueryResultRow>(query: string, params: unknown[] = []) {
  try {
    const start = Date.now();

    const result = await db.pool.query<RT>(query, params);
    const duration = Date.now() - start;
    console.log('executed query', { query, duration, rows: result.rowCount });

    return result;
  } catch (error) {
    console.error('DB Query Error', { query, params, error });
    throw error;
  }
}
db.bind({ query });
export default db;
