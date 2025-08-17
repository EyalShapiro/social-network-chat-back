import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { CLIENT_URL, PORT } from "./config/server";
import socketConnection from "./socket";
import routers from "./api";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { handleError } from "./middlewares/handleError";

const app = express();
// Middleware
app.use(morgan("dev")); // Logging middleware
app.use("api/", routers);
app.use(express.json());
// Enable CORS for the frontend URL (http://localhost:5173)
app.use(cors({ origin: CLIENT_URL || "*" }));
app.use(cookieParser());
app.use(bodyParser.json());

const httpServer = createServer(app);

app.use(handleError);
// Socket.IO setup
const io = new Server(httpServer, { cors: { origin: CLIENT_URL }, path: "/socket" });

// Handle socket connection
io.on("connection", socketConnection);
io.close();

// Start server
httpServer.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`Socket.IO server running on http://localhost:${PORT}/socket`);
});
io.attach(httpServer);
