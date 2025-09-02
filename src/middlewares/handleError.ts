import { Request, Response, NextFunction } from 'express';
import { IS_PRODUCTION } from '../config';
import logger from '../config/logger';

/**
 * Middleware for handling 500 and general server errors.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export function handleError(err: Error, req: Request, res: Response, _next: NextFunction) {
  const message = err?.message || 'Internal Server Error 500';
  const errObj = {
    message,
    error: err,
    timestamp: new Date().toISOString(),
    originalUrl: req.originalUrl,
    status: 500,
  };
  if (!IS_PRODUCTION) {
    logger.error(errObj);
  }

  res.status(500).json(errObj);
}

/**
 * Middleware for handling 404 Not Found errors.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export function handleNodFound404(req: Request, res: Response, _next: NextFunction) {
  const message = `Not Found: '${req.originalUrl}'`;
  const errorObj = { message, originalUrl: req.originalUrl, status: 404, timestamp: new Date().toISOString() };
  if (!IS_PRODUCTION) {
    logger.error(errorObj);
  }

  res.status(404).json(errorObj);
}
