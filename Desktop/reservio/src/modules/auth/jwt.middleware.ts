import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: { id: number };
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.substring(7);
      try {
        const decoded: any = jwt.verify(token, 'secretKey');
        req.user = { id: decoded.id };
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
    next();
  }
}
