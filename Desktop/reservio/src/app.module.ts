import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ServicesModule } from './modules/services/services.module';
import { PrismaModule } from 'prisma/prisma.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './Admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtMiddleware } from './modules/auth/jwt.middleware';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './AppController';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ReviewModule } from './modules/Review/review.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './config/MulterConfigService';
import { StripeModule } from './stripe/stripe.module';
import { EventsModule } from 'common/helpers/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PromotionsModule } from './promotions/promotions.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => ReservationsModule),
    forwardRef(() => ServicesModule),
    forwardRef(() => NotificationsModule),
    AdminModule,
    MailerModule,
    ReviewModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      //   exclude: ['/api*'],
    }),
    StripeModule,
    EventsModule,
    ScheduleModule.forRoot(),
    PromotionsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
