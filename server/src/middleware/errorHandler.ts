import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('API Error:', err.message || err);
  res.status(500).json({
    success: false,
    message: err.message || 'An internal server error occurred.'
  });
};
