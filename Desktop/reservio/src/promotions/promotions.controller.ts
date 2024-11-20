import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Promotion } from '@prisma/client';
import { ServicesService } from 'src/modules/services/services.service';

@Controller('promotions')
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Get()
  async findAll(): Promise<Promotion[]> {
    return this.promotionsService.findAllPromotions();
  }

  @Post('promotion')
  async createPromotion(
    @Body()
    body: {
      discount: number;
      startDate: string;
      endDate: string;
      isGlobal?: boolean;
      serviceId?: number;
    },
  ): Promise<Promotion> {
    return this.promotionsService.createPromotion(body);
  }

  @Get(':id')
  async getPromotionById(@Param('id') id: number): Promise<Promotion> {
    return this.promotionsService.findPromotionById(id);
  }

  @Put(':id')
  async updatePromotion(
    @Param('id') id: number,
    @Body() body: Partial<Promotion>,
  ): Promise<Promotion> {
    return this.promotionsService.updatePromotion(id, body);
  }

  @Delete(':id')
  async deletePromotion(@Param('id') id: number): Promise<Promotion> {
    return this.promotionsService.deletePromotion(id);
  }
}
