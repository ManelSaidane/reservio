// favorites.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favoris } from '@prisma/client';
import { CreateFavoriteDto } from './DTOfAV/CreateFavoriteDto';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Req() req: RequestWithUser,
  ): Promise<Favoris> {
    const userId = req.user?.id; // Récupère l'ID d'utilisateur à partir de req.user

    if (!userId) {
      throw new UnauthorizedException('User ID is missing.');
    }

    createFavoriteDto.userId = userId; // Assurez-vous que userId est défini dans createFavoriteDto

    return this.favoritesService.create(createFavoriteDto, userId);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<Favoris[]> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.favoritesService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Favoris> {
    return this.favoritesService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: Partial<Favoris>,
    @Req() req: RequestWithUser,
  ): Promise<Favoris> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.favoritesService.update(+id, updateFavoriteDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Favoris> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.favoritesService.remove(+id, userId);
  }
}
