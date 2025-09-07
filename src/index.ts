import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';

import db from './db';
import { NODE_ENV, PORT } from './config';
import socketConnection from './socket';
import routers from './api';
import { corsOptions } from './middlewares/cors';
import { errorHandler, handleNodFound404 } from './middlewares/handleError';
import logger from './config/logger';

const app = express();
// Middleware
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors(corsOptions)); // CORS configuration
app.use('/api', routers); // Mount API routes

// Error handling middleware (must be last)
app.use(handleNodFound404);
app.use(errorHandler);

// Create HTTP server
const httpServer = http.createServer(app);

// Socket.IO setup
const io = new Server(httpServer, { cors: corsOptions, path: '/socket' });
io.use((socket, next) => {
  logger.info(`Socket connected: ${socket.id}`);
  next();
});

// Handle socket connections
io.on('connection', socketConnection);

// Start server with database connection
httpServer.listen(PORT, async () => {
  try {
    await db.connect();
    logger.warn(`the server is running in ${NODE_ENV} mode`);
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Socket.IO server running on http://localhost:${PORT}/socket`);
  } catch (err) {
    db.close();
    httpServer.close(console.error);
    io.close(console.error);
    process.exit(1);
  }
});
