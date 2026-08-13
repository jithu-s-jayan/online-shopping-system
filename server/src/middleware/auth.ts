import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Guest checkout / guest session fallback: allow seamless guest operations
    req.user = { id: 'usr-guest-session', role: 'CUSTOMER' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxora_super_secret_jwt_key_2026_modern_ecommerce') as {
      id: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    // If token expired or invalid, fall back to guest session instead of throwing 401 error
    req.user = { id: 'usr-guest-session', role: 'CUSTOMER' };
    next();
  }
};
