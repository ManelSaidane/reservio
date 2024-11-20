import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateServiceDto {
  Titre?: string;
  Description?: string;
  @Transform(({ value }) => parseFloat(value.replace(',', '.')))
  Prix?: number;
  @IsNotEmpty()
  @IsDateString()
  DateDebut: string;

  @IsNotEmpty()
  @IsDateString()
  DateFin: string;
  Image?: Express.Multer.File;
  Place?: string;
  @Transform(({ value }) => parseFloat(value.replace(',', '.')))
  userId?: number;
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value.replace(',', '.')))
  // @IsNumber()
  categorieId?: number;
}
