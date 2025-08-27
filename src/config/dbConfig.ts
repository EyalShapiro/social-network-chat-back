import { PoolConfig } from 'pg';

export const dbConfig: PoolConfig = {
  user: process.env.POSTGRES_USER || 'myuser',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'mydb',
  password: process.env.POSTGRES_PASSWORD || 'mypassword',
  port: Number(process.env.POSTGRES_PORT || 5432),
};
