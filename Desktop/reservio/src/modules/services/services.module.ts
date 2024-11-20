import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { JwtMiddleware } from '../auth/jwt.middleware';
import { ReviewModule } from '../Review/review.module';
import { ReviewService } from '../Review/review.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { MulterConfigService } from 'src/config/MulterConfigService';
import { EventsGateway } from 'common/helpers/EventsGateway';
import { MailerService } from 'common/interfaces/mail.service';
@Module({
  imports: [PrismaModule, ReviewModule],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    JwtMiddleware,
    ReviewService,
    CategoriesService,
    UsersService,
    AuthService,
    MulterConfigService,
    EventsGateway,
    MailerService,
  ],
})
export class ServicesModule {}
