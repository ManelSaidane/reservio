import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  motDePasse?: string;

  @IsOptional()
  // @Transform(({ value }) => parseInt(value.replace(',', '.')))
  Num?: number;

  @IsOptional()
  @IsString()
  role?: Role;

  @IsOptional()
  @IsString()
  DateNaissance?: string;

  @IsOptional()
  @IsString()
  Bio?: string;

  @IsOptional()
  @IsString()
  Image?: string;
}
