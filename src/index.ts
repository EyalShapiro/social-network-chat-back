import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PORT } from './config';
import socketConnection from './socket';
import routers from './api';
import { corsOptions } from './middlewares/cors';
import db from './db';
import { handleError } from './middlewares/handleError';
import http from 'http';

const app = express();

// Middleware
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors(corsOptions)); // CORS configuration
app.use('/api', routers); // Mount API routes

// Error handling middleware (must be last)
app.use(handleError);

// Create HTTP server
const httpServer = http.createServer(app);

// Socket.IO setup
const io = new Server(httpServer, { cors: corsOptions, path: '/socket' });
io.use((socket, next) => {
  console.log(`Socket connected: ${socket.id}`); // Log socket ID only
  next();
});

// Handle socket connections
io.on('connection', socketConnection);

// Start server with database connection
httpServer.listen(PORT, async () => {
  try {
    await db.pool.connect();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Socket.IO server running on http://localhost:${PORT}/socket`);
    console.log(`Connected to the database ${db.dbConfig.database} ${db.dbConfig.host}:${db.dbConfig.port}`);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});
