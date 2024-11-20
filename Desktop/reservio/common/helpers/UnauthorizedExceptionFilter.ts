import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception.message); // Affiche "Invalid email or password."
    console.log(exception.stack); // Affiche la pile d'exécution de l'erreur

    response.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: exception.message,
    });
  }
}
