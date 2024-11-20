import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Favoris, User } from '@prisma/client';
import { CreateFavoriteDto } from './DTOfAV/CreateFavoriteDto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { ID: userId },
    });
  }

  async create(data: CreateFavoriteDto, userId: number): Promise<Favoris> {
    console.log('UserID received in create method:', data.userId);

    const user = await this.findUserById(data.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    console.log('User found:', user);
    const createdfav = await this.prisma.favoris.create({
      data: {
        userId: userId,
        serviceId: data.serviceId,
      },
    });
    console.log('Service created:', createdfav);

    return createdfav;
  }

  async findByUser(userId: number): Promise<Favoris[]> {
    return this.prisma.favoris.findMany({
      where: { userId: userId },
      include: {
        service: {
          include: {
            // Include the user who created the service
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Favoris | null> {
    return this.prisma.favoris.findUnique({ where: { ID: id } });
  }

  async update(
    id: number,
    data: Partial<Favoris>,
    userId: number,
  ): Promise<Favoris> {
    const favori = await this.findOne(id);

    // if (!favori) {
    // //   throw new NotFoundException(`Favorite with ID ${id} not found`);
    // }

    if (favori.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this favorite',
      );
    }

    return this.prisma.favoris.update({
      where: { ID: id },
      data,
    });
  }

  async remove(id: number, userId: number): Promise<Favoris> {
    const favori = await this.findOne(id);

    if (!favori) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    if (favori.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this favorite',
      );
    }

    return this.prisma.favoris.delete({ where: { ID: favori.ID } });
  }
}
