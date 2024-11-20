import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationsService } from '../notifications/notifications.service';
import { MailerService } from 'common/interfaces/mail.service';
import { ReservationController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from 'common/helpers/EventsGateway';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    NotificationsService,
    MailerService,
    ConfigModule,
    EventsGateway,
  ],
  exports: [ReservationService],
})
export class ReservationsModule {}
