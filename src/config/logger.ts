// import { createLogger, format, transports } from 'winston';
// import path from 'path';
// import fs from 'fs';

// // Ensure logs directory exists
// const logsDir = path.join(__dirname, '../../logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir, { recursive: true });
// }

// // Custom format: timestamp + level + context + message
// const customFormat = format.printf(({ level, message, timestamp, stack, context }) => {
//   return `[${level}] [${timestamp}] [${context || 'GENERAL'}] ${message}${stack ? `\n${stack}` : ''}`;
// });

// // Create logger
// const logger = createLogger({
//   level: 'debug',
//   format: format.combine(
//     format.timestamp(),
//     format.errors({ stack: true }), // automatically include stack
//     format.splat(),
//     format.colorize(),
//     format.json(),
//     customFormat
//   ),
//   transports: [
//     new transports.Console({
//       format: format.combine(format.timestamp(), format.colorize(), format.json(), customFormat),
//     }),
//     new transports.File({
//       filename: path.join(logsDir, 'logsError.log'),
//       level: 'error',
//       format: format.combine(format.timestamp(), format.colorize(), customFormat),
//     }),
//     new transports.File({
//       filename: path.join(logsDir, 'logsInfo.log'),
//       level: 'info',
//       format: format.combine(format.timestamp(), format.colorize(), customFormat),
//     }),

//   ],
// });

// // Context wrapper
// logger.withContext = (context) => ({
//   info: (message, ...args) => logger.info(message, { context, ...args }),
//   error: (message, ...args) => logger.error(message, { context, ...args }),
//   debug: (message, ...args) => logger.debug(message, { context, ...args }),
//   warn: (message, ...args) => logger.warn(message, { context, ...args }),
// });

// module.exports = logger;

const logger = console; // todo:Replace with actual logger import

export default logger;
