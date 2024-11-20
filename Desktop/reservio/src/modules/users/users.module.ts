import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
// import { PaymentsService } from '../payments/payments.service';
// import { PaymentsModule } from '../payments/payments.module';
import { AuthService } from '../auth/auth.service';
import { EventsGateway } from 'common/helpers/EventsGateway';

@Module({
  imports: [PrismaModule], //forwardRef(() => PaymentsModule)
  controllers: [UsersController],
  providers: [PrismaService, UsersService, AuthService, EventsGateway], //PaymentsService
  exports: [UsersService],
})
export class UsersModule {}
