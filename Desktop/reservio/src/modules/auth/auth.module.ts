import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
// import { PaymentsModule } from '../payments/payments.module';
import { MailerService } from '../../../common/interfaces/mail.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './authController';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    // forwardRef(() => PaymentsModule),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  providers: [AuthService, JwtStrategy, MailerService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
