import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
    try {
      return await this.prisma.notification.create({ data });
    } catch (error) {
      throw new Error(`Could not create notification: ${error.message}`);
    }
  }

  async createForUser(userId: number, message: string): Promise<Notification> {
    try {
      return await this.prisma.notification.create({
        data: {
          message,
          userId,
        },
      });
    } catch (error) {
      throw new Error(
        `Could not create notification for user ${userId}: ${error.message}`,
      );
    }
  }

  async findNotificationsByUserId(userId: number): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
      });
    } catch (error) {
      throw new Error(
        `Could not fetch notifications for user ${userId}: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany();
    } catch (error) {
      // Handle error
      throw new Error(`Could not fetch notifications: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Notification | null> {
    try {
      return await this.prisma.notification.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(
        `Could not find notification with ID ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<Notification> {
    try {
      return await this.prisma.notification.delete({ where: { id } });
    } catch (error) {
      throw new Error(
        `Could not delete notification with ID ${id}: ${error.message}`,
      );
    }
  }
}
