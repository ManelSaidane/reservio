import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class BaseService<T> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly model: keyof PrismaService,
  ) {}

  async create(data: Prisma.UserCreateInput): Promise<T> {
    return (this.prismaService[this.model] as any).create({ data });
  }

  async findAll(): Promise<T[]> {
    return (this.prismaService[this.model] as any).findMany();
  }

  async findOne(id: number): Promise<T | null> {
    return (this.prismaService[this.model] as any).findUnique({
      where: { ID: id },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<T> {
    return (this.prismaService[this.model] as any).update({
      where: { ID: id },
      data,
    });
  }

  async delete(id: number): Promise<T> {
    return (this.prismaService[this.model] as any).delete({
      where: { ID: id },
    });
  }
}
