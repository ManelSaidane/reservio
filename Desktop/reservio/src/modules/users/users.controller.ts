/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  UnauthorizedException,
  Headers,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './user dto/create-user.dto';
import { UpdateUserDto } from './user dto/update-user.dto';
import { RegisterUserDto } from './user dto/register-user.dto';
import * as jwt from 'jsonwebtoken';
import { UpdateValidationDto } from '../auth/UpdateValidationDto';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id/validation')
  async updateValidation(
    @Param('id') id: string,
    @Body() updateValidationDto: UpdateValidationDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return this.usersService.updateValidation(+id, updateValidationDto);
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Get('service-providers')
  async getServiceProviders(
    @Headers('authorization') authHeader: string,
  ): Promise<User[]> {
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization header missing');
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY);

      if (!decodedToken || decodedToken.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return this.usersService.findServiceProviders();
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Unauthorized');
    }
  }

  @Get('client')
  async getClient(
    @Headers('authorization') authHeader: string,
  ): Promise<User[]> {
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization header missing');
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY);

      if (!decodedToken || decodedToken.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return this.usersService.findClient();
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Unauthorized');
    }
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    const createUserDto: CreateUserDto = {
      nom: registerUserDto.nom,
      prenom: registerUserDto.prenom,
      email: registerUserDto.email,
      motDePasse: registerUserDto.motDePasse,
      role: registerUserDto.role,
      num: 0,
      Validation: true,
      dateNaissance: registerUserDto.DateDeN,
    };
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser): Promise<User | null> {
    const userId = req.user?.id; // Récupération de l'userId à partir de req.user
    if (!userId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    const user = await this.usersService.findUserById(userId);

    return user;
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findUserById(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ): Promise<User> {
    const userId = req.user.id;

    try {
      return await this.usersService.updateUser(userId, updateUserDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(+id);
  }

  @Get('latestsignups')
  async getLatestSignups(): Promise<User[]> {
    try {
      return this.usersService.findLatestSignups(5);
    } catch (error) {
      console.error('Error fetching latest signups:', error);
      throw new Error('Failed to fetch latest signups');
    }
  }

  @Get('userCount')
  async getUserCount(): Promise<number> {
    return this.usersService.getUserCount();
  }

  @Get('serviceCount')
  async getServiceCount(): Promise<number> {
    return this.usersService.getServiceCount();
  }

  @Get('reservationCount')
  async getReservationCount(): Promise<number> {
    return this.usersService.getReservationCount();
  }

  @Delete(':id/image')
  async deleteProfileImage(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    try {
      const updatedUser = await this.usersService.deleteProfileImage(userId);
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const userId = req.user.id;

    try {
      const fileName = file.filename;
      const updatedUser = await this.usersService.uploadProfileImage(
        userId,
        fileName,
      );
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
