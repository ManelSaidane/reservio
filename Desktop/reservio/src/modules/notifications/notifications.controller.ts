import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification, Prisma } from '@prisma/client';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: Prisma.NotificationCreateInput,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }
  @Get('user')
  async findByUserId(@Req() req: RequestWithUser): Promise<Notification[]> {
    const userId = req.user.id;
    return this.notificationsService.findNotificationsByUserId(userId);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.remove(+id);
  }
}
