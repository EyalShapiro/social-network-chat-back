import { Request, Response, NextFunction } from 'express';
import { IS_PROD } from '../config';
import logger from '../config/logger';

// A single function to create a standardized error response object
const createErrorResponse = (statusCode: number, message: string, req: Request, error?: Error) => {
  const originalUrl = req?.originalUrl;
  const timestamp = new Date().toISOString(); //todo: if used liber use

  const errObj = { message, statusCode, timestamp, originalUrl, error: IS_PROD ? undefined : error };

  // Log the error for debugging in development
  if (!IS_PROD) logger.error(errObj);

  return errObj;
};

/**
 * Middleware for handling 500 and general server errors.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const message = err?.message || 'Internal Server Error 500';
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const errObj = createErrorResponse(statusCode, message, req, err);

  if (res.headersSent) next(err);
  else res.status(statusCode).json(errObj);
}
/**
 * Middleware for handling 404 Not Found errors.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export function handleNotFound404(req: Request, res: Response, _next: NextFunction) {
  const message = `Not Found: '${req.originalUrl}'`;

  const errorObj = createErrorResponse(404, message, req); //{ message, originalUrl: req.originalUrl, status: 404, timestamp: new Date().toISOString() };

  res.status(404).json(errorObj);
}
