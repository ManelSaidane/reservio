import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('test')
  testCors() {
    return { message: 'CORS is working!' };
  }
}
