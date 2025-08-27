import { Request, NextFunction } from 'express';
import { CorsOptions } from 'cors';

import { ORIGINALS_OPTION } from '../config/origins';
import { getUrlOrigins } from '../utils/getUrlOrigins';
import { CustomResponse } from '../types/customResponse';

/**
 * CORS configuration object
 * @typedef {Object} CorsOptions
 * @property {CustomOrigin} origin - Function to validate request origin
 * @property {number} optionsSuccessStatus - Status code to return for successful OPTIONS requests
 */

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (ORIGINALS_OPTION.includes(getUrlOrigins(origin))) {
      callback(null, true);
    } else {
      console.warn(`CORS policy does not allow access from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export const corsHeaders = (req: Request, res: CustomResponse, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};
