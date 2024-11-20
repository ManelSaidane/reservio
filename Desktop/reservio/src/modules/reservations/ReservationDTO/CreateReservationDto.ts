import { IsNotEmpty, IsDateString, IsISO8601 } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsISO8601()
  @IsDateString()
  DateDebut: string;

  @IsNotEmpty()
  @IsISO8601()
  @IsDateString()
  DateFin: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  serviceId: number;
}
