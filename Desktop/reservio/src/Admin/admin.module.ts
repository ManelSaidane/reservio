import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AdminController } from './admin.controller';
import { AuthService } from 'src/modules/auth/auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, AuthService],
})
export class AdminModule {}
