import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { MailerService } from 'common/interfaces/mail.service';
import { StripeController } from './stripe.controller';
import { WebhooksController } from './WebhooksController.controller';
import { JwtMiddleware } from 'src/modules/auth/jwt.middleware';
import { UsersService } from 'src/modules/users/users.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  controllers: [StripeController, WebhooksController],
  providers: [StripeService, MailerService, UsersService],
  exports: [StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(StripeController);
  }
}
