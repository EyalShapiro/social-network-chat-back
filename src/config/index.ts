export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const PORT = Number(IS_PRODUCTION ? 8080 : process.env.PORT || 3000);
