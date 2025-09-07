import { Pool, QueryResult, QueryResultRow } from 'pg';
import { dbConfig } from '../config/dbConfig';
import { IS_PROD } from '../config';
import logger from '../config/logger';
/**
 * A class for managing database connections and queries using a PostgreSQL connection pool.
 */
export default class db {
  public static readonly DB_CONFIG = dbConfig;
  private static pool = new Pool(this.DB_CONFIG);
  public static isConnected = false;

  /**
   * Connects to the database and verifies the connection.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the connection is successful, `false` otherwise.
   * @throws Error if the connection fails.
   */
  static async connect() {
    try {
      const client = await this.pool.connect();
      const dbConfig = this.DB_CONFIG;
      logger.info(`Connected to database: ${dbConfig.database} at ${dbConfig.host}:${dbConfig.port}`);
      client.release();
      this.isConnected = true;
      return this.isConnected;
    } catch (error: Error | unknown) {
      logger.error('Database connection error:', error);
      this.isConnected = false;

      // Check if the error is an object and has a 'code' property of type string
      // This safely narrows the type to allow access to the 'code' property
      if (error && error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
        logger.error(
          'Failed to connect to the database. Please check your configuration.\n go to readme for docker setup instructions. in local dev.'
        );
      }
      throw error;
    }
  }

  /**
   * Closes the database connection pool.
   * @returns A promise that resolves when the pool is successfully closed.
   * @throws Error if closing the pool fails.
   */
  static async close(): Promise<void> {
    try {
      await this.pool.end();
      this.isConnected = false;
      logger.info('Database connection pool closed');
    } catch (error) {
      logger.error('Error closing database connection pool:', error);
      throw error;
    }
  }
  /**
   * Executes a SQL query using the connection pool.
   * @template RT - The expected row type of the query result (must extend `QueryResultRow`).
   * @param {string} queryText - The SQL query string to execute.
   * @param {unknown[]} params  - Optional query parameters (defaults to an empty array).
   * @returns {Promise<QueryResult<RT>>} A promise that resolves to a `QueryResult` containing rows of type `RT`.
   * @throws Error if the database query fails.
   * @example
   * ```typescript
   * const result = await db.query<{ id: number; name: string }>('SELECT id, name FROM users WHERE id = $1', [1]);
   * console.info(result.rows);
   * ```
   */
  static async query<RT extends QueryResultRow>(queryText: string, params: unknown[] = []): Promise<QueryResult<RT>> {
    try {
      if (!this.isConnected) await this.connect();

      const start = Date.now();
      const result = await this.pool.query<RT>(queryText, params);
      const duration = Date.now() - start;
      if (!IS_PROD) {
        logger.info('Executed query', { queryText, duration, rows: result.rowCount });
      }
      return result;
    } catch (error) {
      logger.error('DB Query Error:', queryText, params, error);
      throw new Error(`Database query failed: ${(error as Error).message}`);
    }
  }
}
