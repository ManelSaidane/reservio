import { IsNotEmpty, IsDateString, IsISO8601 } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;

  @IsNotEmpty()
  email: string;

  @Transform(({ value }) => parseInt(value.replace(',', '.')))
  num: number;

  @IsNotEmpty()
  motDePasse: string;

  @IsNotEmpty()
  role: Role = Role.SERVICE_PROVIDER;

  Validation: boolean = true;

  @IsDateString()
  @IsISO8601()
  dateNaissance: string;
}
