import { Module } from '@nestjs/common';
import { MulterConfigService } from 'src/config/MulterConfigService';
import { MailerService } from 'common/interfaces/mail.service';
import { EventsModule } from 'common/helpers/events.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtMiddleware } from 'src/modules/auth/jwt.middleware';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { ReviewModule } from 'src/modules/Review/review.module';
import { ReviewService } from 'src/modules/Review/review.service';
import { ServicesController } from 'src/modules/services/services.controller';
import { ServicesService } from 'src/modules/services/services.service';
import { UsersService } from 'src/modules/users/users.service';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';

@Module({
  imports: [PrismaModule, ReviewModule, EventsModule],
  controllers: [ServicesController, PromotionsController],
  providers: [
    ServicesService,
    JwtMiddleware,
    ReviewService,
    CategoriesService,
    UsersService,
    AuthService,
    MulterConfigService,
    MailerService,
    PromotionsService,
  ],
})
export class PromotionsModule {}
