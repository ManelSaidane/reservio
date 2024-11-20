import {
  Injectable,
  Dependencies,
  forwardRef,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
@Dependencies(forwardRef(() => AuthService))
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly authService: AuthService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async createServiceWithUser(
    data: Prisma.ServiceCreateInput,
    userId: number,
    userRole: string,
    categoryId: number,
  ) {
    return this.service.create({
      data: {
        ...data,
        user: { connect: { ID: userId } },
        categorie: { connect: { ID: categoryId } },
      },
    });
  }
}
