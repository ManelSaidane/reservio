import { Role } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsDateString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  motDePasse: string;

  @IsString()
  role: Role;

  @IsNotEmpty()
  @IsDateString()
  DateDeN: string;
}
