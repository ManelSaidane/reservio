import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  providers: [PrismaService, AuthService, UsersService],
  exports: [PrismaService],
})
export class PrismaModule {}
