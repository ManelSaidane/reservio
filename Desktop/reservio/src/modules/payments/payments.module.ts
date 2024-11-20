import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthService } from '../auth/auth.service';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { EventsGateway } from 'common/helpers/EventsGateway';

@Module({
  imports: [forwardRef(() => UsersModule), PrismaModule],
  providers: [AuthService, PaymentService, EventsGateway],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentsModule {}
