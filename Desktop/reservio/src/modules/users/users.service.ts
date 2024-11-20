import {
  Injectable,
  Dependencies,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './user dto/create-user.dto';
import { UpdateUserDto } from './user dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterUserDto } from './user dto/register-user.dto';
import { AuthService } from '../auth/auth.service';
import { UpdateValidationDto } from '../auth/UpdateValidationDto';

@Injectable()
@Dependencies(forwardRef(() => PrismaService), forwardRef(() => AuthService))
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}
  async updateValidation(
    userId: number,
    updateValidationDto: UpdateValidationDto,
  ) {
    return this.prisma.user.update({
      where: { ID: userId },
      data: { Validation: updateValidationDto.Validation },
    });
  }
  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const hashedPassword = await this.authService.hashPassword(
  //     createUserDto.motDePasse,
  //   );
  //   return this.prisma.user.create({
  //     data: {
  //       Nom: createUserDto.nom,
  //       Prenom: createUserDto.prenom,
  //       Email: createUserDto.email,
  //       MotDePasse: hashedPassword,
  //       Role: createUserDto.role,
  //       Num: 0,
  //     },
  //   });
  // }

  // async createUser(createUserDto: CreateUserDto) {
  //   try {
  //     const existingUser = await this.findOneByEmail(createUserDto.email);

  //     if (existingUser) {
  //       throw new Error('Email address already exists');
  //     }

  //     const hashedPassword = await this.authService.hashPassword(
  //       createUserDto.motDePasse,
  //     );

  //     const date = new Date(createUserDto.dateNaissance);
  //     if (isNaN(date.getTime())) {
  //       throw new BadRequestException('Invalid date format');
  //     }

  //     const newUser = await this.prisma.user.create({
  //       data: {
  //         Nom: createUserDto.nom,
  //         Prenom: createUserDto.prenom,
  //         MotDePasse: hashedPassword,
  //         Email: createUserDto.email,
  //         Num: createUserDto.num,
  //         Role: createUserDto.role,
  //         Validation: createUserDto.Validation,
  //         DateNaissance: date.toISOString(), // Valeur factice pour DateNaissance
  //       },
  //     });

  //     return newUser;
  //   } catch (error) {
  //     console.error('Error creating user:', error.message);
  //     throw error;
  //   }
  // }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Convertir et vérifier la date de naissance
    const date = new Date(createUserDto.dateNaissance);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // Créer l'utilisateur dans la base de données
    return await this.prisma.user.create({
      data: {
        Nom: createUserDto.nom,
        Prenom: createUserDto.prenom,
        MotDePasse: createUserDto.motDePasse,
        Email: createUserDto.email,
        Num: createUserDto.num,
        Role: createUserDto.role,
        Validation: createUserDto.Validation,
        DateNaissance: date.toISOString(), // Convertir la date au format ISO
      },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUserById(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { ID: userId } });
  }

  // async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  //   try {
  //     const updatedUser = await this.prisma.user.update({
  //       where: { ID: id },
  //       data: {
  //         Nom: updateUserDto.nom,
  //         Prenom: updateUserDto.prenom,
  //         Email: updateUserDto.email,
  //         Num: updateUserDto.Num,
  //         Role: updateUserDto.role,
  //         MotDePasse: updateUserDto.motDePasse,
  //         DateNaissance: updateUserDto.DateNaissance,
  //         Bio: updateUserDto.Bio,
  //         Image: updateUserDto.Image,
  //       },
  //     });
  //     return updatedUser;
  //   } catch (error) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  // }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { ID: id },
      data: updateUserDto,
    });
  }

  async removeUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { ID: id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { Email: email } });
  }

  async findServiceProviders(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        Role: 'SERVICE_PROVIDER',
      },
      include: {
        paiements: true,
      },
    });
  }
  async findClient(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        Role: 'CLIENT',
      },
    });
  }

  async findLatestSignups(limit: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        Role: 'SERVICE_PROVIDER',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { Email: email } });
  }

  // async findOneById(userId: number): Promise<User | null> {
  //   console.log('findOneById called with userId:', userId); // Journalisation
  //   return this.prisma.user.findUnique({
  //     where: {
  //       ID: userId,
  //     },
  //   });
  // }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const date = new Date(registerUserDto.DateDeN);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    const createUserDto: CreateUserDto = {
      nom: registerUserDto.nom,
      prenom: registerUserDto.prenom,
      email: registerUserDto.email,
      motDePasse: registerUserDto.motDePasse,
      role: registerUserDto.role,
      num: 0,
      Validation: true,
      dateNaissance: date.toISOString(),
    };

    const hashedPassword = await this.authService.hashPassword(
      createUserDto.motDePasse,
    );

    return this.prisma.user.create({
      data: {
        Nom: createUserDto.nom,
        Prenom: createUserDto.prenom,
        Email: createUserDto.email,
        MotDePasse: hashedPassword,
        Role: createUserDto.role,
        Num: 0,
        DateNaissance: createUserDto.dateNaissance,
      },
    });
  }

  async getUserCount(): Promise<number> {
    return this.prisma.user.count();
  }

  async getServiceCount(): Promise<number> {
    return this.prisma.service.count();
  }

  async getReservationCount(): Promise<number> {
    return this.prisma.reservation.count();
  }

  async deleteProfileImage(userId: number): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { ID: userId },
        data: { Image: null }, // Supprimez l'image en la définissant sur null
      });
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async uploadProfileImage(userId: number, fileName: string): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { ID: userId },
        data: { Image: fileName }, // Mettez à jour le champ image avec le nom du fichier
      });
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
  async saveResetToken(userId: number, resetToken: string) {
    return this.prisma.user.update({
      where: { ID: userId },
      data: { resetToken },
    });
  }

  //  trouver un utilisateur par reset token
  async findByResetToken(token: string) {
    console.log('Token received:', token);
    const user = await this.prisma.user.findUnique({
      where: { resetToken: token },
    });
    console.log('User found:', user);
    return user;
  }

  // mettre à jour le mot de passe
  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { ID: userId },
      data: { MotDePasse: hashedPassword },
    });
  }
}
