// user.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role, User } from '@prisma/client';
import { AdminService } from './admin.service';

@Controller('users')
export class AdminController {
  constructor(private readonly userService: AdminService) {}

  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    createAdminDto.role = Role.CLIENT;

    return this.userService.createAdmin(createAdminDto);
  }
}
