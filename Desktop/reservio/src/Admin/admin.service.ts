import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { User, Role } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async createAdmin(dto: CreateAdminDto): Promise<User> {
    try {
      if (!dto.motDePasse) {
        throw new Error('Password is required');
      }

      const saltRounds = 10; // Adjust salt rounds as needed
      const hashedPassword = await bcrypt.hash(dto.motDePasse, saltRounds);

      console.log('Creating admin with password:', dto.motDePasse);
      const date = new Date(dto.dateNaissance);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      const admin = await this.usersService.createUser({
        email: dto.email,
        motDePasse: hashedPassword,
        role: Role.ADMIN,
        nom: dto.nom,
        prenom: dto.prenom,
        num: 0,
        Validation: true,
        dateNaissance: date.toISOString(),
      });

      return admin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async findAllAdmins(): Promise<User[]> {
    const admins = await this.prisma.user.findMany({
      where: { Role: Role.ADMIN },
    });
    return admins;
  }

  async findAdminById(id: number): Promise<User> {
    const admin = await this.prisma.user.findUnique({
      where: { ID: id, Role: Role.ADMIN },
    });
    if (!admin) {
      // Gérer l'erreur si l'administrateur n'est pas trouvé
      throw new Error(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async updateAdmin(id: number, updateDto: Partial<User>): Promise<User> {
    const updatedAdmin = await this.prisma.user.update({
      where: { ID: id, Role: Role.ADMIN },
      data: updateDto,
    });
    return updatedAdmin;
  }

  async deleteAdmin(id: number): Promise<User> {
    const deletedAdmin = await this.prisma.user.delete({
      where: { ID: id, Role: Role.ADMIN },
    });
    return deletedAdmin;
  }

  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password must be provided');
    }
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersService.findUserByEmail(email);
  }

  // async findOneById(userId: number): Promise<User | null> {
  //   return this.usersService.findOneById(userId);
  // }
}
