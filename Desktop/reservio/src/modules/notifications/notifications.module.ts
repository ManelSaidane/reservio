import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from 'prisma/prisma.module'; // Adjust the path as per your project structure

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController], // Ensure NotificationsController is listed as a controller
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
