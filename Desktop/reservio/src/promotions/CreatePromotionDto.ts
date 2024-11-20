import { IsNumber, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @IsNumber({}, { each: true })
  discount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  isGlobal: boolean;

  @IsNumber({}, { each: true })
  serviceId: number;
}
