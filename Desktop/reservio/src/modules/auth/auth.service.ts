/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Dependencies,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from 'src/modules/users/user dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Role } from '@prisma/client';
import { MailerService } from '../../../common/interfaces/mail.service';
@Injectable()
@Dependencies(forwardRef(() => UsersService))
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly FRONTEND_URL = 'http://localhost:5173';
  constructor(
    private usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  async login(email: string, password: string) {
    this.logger.log(
      `Login request received: ${JSON.stringify({ email, password: '[REDACTED]' })}`,
    );

    const user = await this.validateUser(email, password);

    this.logger.log(`Stored hashed password: ${user.MotDePasse}`);

    // Comparer le mot de passe fourni avec le mot de passe stocké
    const isPasswordValid = await this.comparePasswords(
      password,
      user.MotDePasse,
    );

    // Logguer le résultat de la comparaison
    this.logger.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.error(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Invalid password');
    }

    // Générer le token
    const payload = {
      id: user.ID,
      email: user.Email,
      role: user.Role,
      nom: user.Nom,
      validation: user.Validation,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    return {
      access_token: token,
      message: 'Connexion réussie',
    };
  }

  // async login(email: string, password: string) {
  //   const user = await this.validateUser(email, password);
  //   const payload = {
  //     id: user.ID,
  //     email: user.Email,
  //     role: user.Role,
  //   };

  //   const token = jwt.sign(payload, process.env.SECRET_KEY, {
  //     expiresIn: '1d', // token d'accès expire en 1 jour
  //   });

  //   return {
  //     access_token: token,
  //     message: 'Connexion réussie',
  //   };
  // }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword); // Vérifiez que ce log affiche un mot de passe haché correct
    return hashedPassword;
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const match = await bcrypt.compare(plainTextPassword, hashedPassword);
      return match;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error(
        'An unexpected error occurred during password comparison.',
      );
    }
  }
  async validateUserById(userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    console.log(
      'Plain text password before hashing (signup):',
      createUserDto.motDePasse,
    );
    const hashedPassword = await this.hashPassword(createUserDto.motDePasse);
    console.log('Hashed password (signup):', hashedPassword);
    createUserDto.motDePasse = hashedPassword;
    createUserDto.role = Role.CLIENT;
    createUserDto.Validation = true;

    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  async signUpAdmin(createUserDto: CreateUserDto): Promise<any> {
    console.log(
      'Plain text password before hashing (signup):',
      createUserDto.motDePasse,
    );
    const hashedPassword = await this.hashPassword(createUserDto.motDePasse);
    console.log('Hashed password (signup):', hashedPassword);
    createUserDto.motDePasse = hashedPassword;
    createUserDto.role = Role.ADMIN;

    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  // async signUpServiceProvider(createUserDto: CreateUserDto): Promise<any> {
  //   const hashedPassword = await this.hashPassword(createUserDto.motDePasse);
  //   createUserDto.motDePasse = hashedPassword;
  //   createUserDto.role = Role.SERVICE_PROVIDER;

  //   const user = await this.usersService.createUser(createUserDto);
  //   return user;
  // }

  async signUpServiceProvider(
    registerProviderDto: CreateUserDto,
  ): Promise<any> {
    console.log(
      'Plain text password before hashing (signup):',
      registerProviderDto.motDePasse,
    );
    const hashedPassword = await this.hashPassword(
      registerProviderDto.motDePasse,
    );
    console.log('Hashed password (signup):', hashedPassword);

    registerProviderDto.motDePasse = hashedPassword;
    registerProviderDto.role = Role.SERVICE_PROVIDER;

    const user = await this.usersService.createUser(registerProviderDto);
    return user.ID;
  }

  async validateUser(email: string, password: string) {
    this.logger.log(`Validating user: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.error(`User not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // if (!user.Validation) {
    //   this.logger.error(`Account is blocked for user: ${email}`);
    //   throw new UnauthorizedException(
    //     'Account is blocked , you didnt pay this month',
    //   );
    // }

    // Logguer les données pour la vérification
    this.logger.log(`User found: ${JSON.stringify(user)}`);
    this.logger.log(`Password from user record: ${user.MotDePasse}`);

    const isPasswordValid = await this.comparePasswords(
      password,
      user.MotDePasse,
    );
    this.logger.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.error(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async testPasswordHashing() {
    const plainPassword = 'Manel123';
    const hashedPassword = await this.hashPassword(plainPassword);
    this.logger.log(`Hashed Password: ${hashedPassword}`);

    const isMatch = await this.comparePasswords(plainPassword, hashedPassword);
    this.logger.log('Passwords match:', isMatch);

    return isMatch;
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { Email: email },
      });

      if (!user) {
        this.logger.error(`User not found for email: ${email}`);
        throw new NotFoundException('User not found');
        // return null;
      }

      this.logger.log(`User found: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user by email ${email}: ${error.message}`,
      );
      throw error;
    }
  }

  async forgotPassword(email: string) {
    this.logger.log(`Forgot password requested for email: ${email}`);

    try {
      const resetToken = this.generateResetToken();
      const resetLink = `${this.FRONTEND_URL}/reset-password/${resetToken}`;
      await this.mailerService.sendPasswordResetEmail(email, resetLink);

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error.stack || error.message,
      );
      throw new Error('Failed to send password reset email');
    }
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // async saveResetToken(userId: number, resetToken: string) {
  //   this.logger.log(`Saving reset token for user ID: ${userId}`);
  //   await this.prisma.user.update({
  //     where: { ID: userId },
  //     data: { resetToken: resetToken },
  //   });
  //   this.logger.log(`Reset token saved for user ID: ${userId}`);
  // }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.usersService.updatePassword(user.ID, hashedPassword);

    // Delete the reset token after use
    await this.usersService.saveResetToken(user.ID, null);

    return { message: 'Password successfully reset' };
  }
}
