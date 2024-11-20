import { Role } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';

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

  @IsNotEmpty()
  @IsInt()
  num: number;

  @IsNotEmpty()
  @IsString()
  role: Role;

  montant?: number;
  IDServ?: number;
  NumCarte?: string;
}
