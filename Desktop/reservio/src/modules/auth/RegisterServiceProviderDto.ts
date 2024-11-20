import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class RegisterServiceProviderDto {
  @IsNotEmpty()
  Nom: string;

  @IsNotEmpty()
  Prenom: string;

  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @MinLength(6)
  MotDePasse: string;

  @IsNotEmpty()
  Num: number;

  @IsBoolean()
  @IsOptional()
  Validation: boolean = true;

  role: Role;
}
