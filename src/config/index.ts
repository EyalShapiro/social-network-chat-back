export const NODE_ENV = process.env.NODE_ENV || 'development';
export const isProduction = NODE_ENV === 'production';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const PORT = Number(isProduction ? 8080 : process.env.PORT || 3000);
